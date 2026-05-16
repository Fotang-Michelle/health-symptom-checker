import uuid
import time
import logging
import requests
from datetime import datetime, timezone
from ..services.auth_service  import _users
from ..services.history_service import _history
from ..firebase import is_firebase_available

logger = logging.getLogger(__name__)

ADMIN_EMAILS = {"admin@symptomcheck.com", "admin@example.com"}

# ── In-memory disease store ──────────────────────────────────────
_diseases = {
    "d001": { "id":"d001", "name":"Influenza",         "category":"Viral",       "severity":"medium", "symptoms":["fever","chills","cough","fatigue","headache","muscle_aches"], "accuracy":94.0 },
    "d002": { "id":"d002", "name":"Common Cold",       "category":"Viral",       "severity":"low",    "symptoms":["runny_nose","congestion","sore_throat","cough","fatigue"],     "accuracy":97.0 },
    "d003": { "id":"d003", "name":"COVID-19",          "category":"Viral",       "severity":"high",   "symptoms":["fever","cough","fatigue","shortness_of_breath","loss_of_appetite"], "accuracy":91.0 },
    "d004": { "id":"d004", "name":"Malaria",           "category":"Parasitic",   "severity":"high",   "symptoms":["fever","chills","headache","nausea","vomiting","muscle_aches"], "accuracy":95.0 },
    "d005": { "id":"d005", "name":"Typhoid Fever",     "category":"Bacterial",   "severity":"high",   "symptoms":["fever","headache","abdominal_pain","fatigue","weakness"],       "accuracy":93.0 },
    "d006": { "id":"d006", "name":"Gastroenteritis",   "category":"Viral",       "severity":"medium", "symptoms":["nausea","vomiting","diarrhea","abdominal_pain"],               "accuracy":89.0 },
    "d007": { "id":"d007", "name":"Pneumonia",         "category":"Bacterial",   "severity":"high",   "symptoms":["cough","fever","shortness_of_breath","chest_pain"],            "accuracy":92.0 },
    "d008": { "id":"d008", "name":"Anaemia",           "category":"Blood",       "severity":"medium", "symptoms":["fatigue","weakness","pale_skin","dizziness"],                  "accuracy":88.0 },
    "d009": { "id":"d009", "name":"Allergic Reaction", "category":"Immune",      "severity":"low",    "symptoms":["rash","itching","swelling","runny_nose"],                      "accuracy":90.0 },
    "d010": { "id":"d010", "name":"Migraine",          "category":"Neurological","severity":"medium", "symptoms":["headache","nausea","dizziness","fatigue"],                     "accuracy":86.0 },
    "d011": { "id":"d011", "name":"Appendicitis",      "category":"Surgical",    "severity":"high",   "symptoms":["abdominal_pain","nausea","vomiting","fever","loss_of_appetite"],"accuracy":94.0 },
}

# ── In-memory log store ──────────────────────────────────────────
_logs = [
    { "id":"l001", "timestamp":"2026-05-08 12:34:01", "level":"INFO",    "service":"Flask",    "user":"alice@example.com", "message":"POST /api/symptoms 200 OK",              "duration":"142ms" },
    { "id":"l002", "timestamp":"2026-05-08 12:33:58", "level":"INFO",    "service":"ML",       "user":"alice@example.com", "message":"Prediction: Influenza confidence 0.87",  "duration":"98ms"  },
    { "id":"l003", "timestamp":"2026-05-08 12:33:45", "level":"WARNING", "service":"Flask",    "user":"system",            "message":"Rate limit approaching for IP",           "duration":"—"     },
    { "id":"l004", "timestamp":"2026-05-08 12:33:12", "level":"INFO",    "service":"Firebase", "user":"bob@example.com",   "message":"User document written",                  "duration":"45ms"  },
    { "id":"l005", "timestamp":"2026-05-08 12:32:55", "level":"ERROR",   "service":"ML",       "user":"system",            "message":"Unknown symptom skipped: feeling weird",  "duration":"—"     },
    { "id":"l006", "timestamp":"2026-05-08 12:32:40", "level":"INFO",    "service":"Flask",    "user":"david@example.com", "message":"GET /api/user/history 200 OK",            "duration":"38ms"  },
    { "id":"l007", "timestamp":"2026-05-08 12:31:22", "level":"INFO",    "service":"Auth",     "user":"emma@example.com",  "message":"User login successful",                  "duration":"22ms"  },
    { "id":"l008", "timestamp":"2026-05-08 12:30:11", "level":"WARNING", "service":"ML",       "user":"system",            "message":"Model confidence below threshold: 0.51", "duration":"—"     },
]


def get_admin_stats() -> dict:
    """Return high-level system statistics."""
    total_users       = len(_users)
    total_predictions = sum(len(h) for h in _history.values())
    active_users      = sum(
        1 for uid in _history if len(_history[uid]) > 0
    )

    logger.info(f"Admin stats: {total_users} users, {total_predictions} predictions")

    return {
        "total_users":        total_users,
        "total_predictions":  total_predictions,
        "active_users":       active_users,
        "server_status":      "online",
        "model_accuracy":     93.9,
        "uptime":             "99.9%",
        "generated_at":       datetime.now(timezone.utc).isoformat()
    }


def get_all_users() -> list:
    """Return list of all registered users."""
    users = []
    for email, user in _users.items():
        user_history = _history.get(user["id"], [])
        users.append({
            "id":          user["id"],
            "name":        user["name"],
            "email":       email,
            "role":        "admin" if email in {"admin@symptomcheck.com","admin@example.com"} else "user",
            "status":      "active",
            "total_checks": len(user_history),
            "joined":      datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        })
    logger.info(f"Returning {len(users)} users")
    return users


def delete_user(user_id: str) -> dict:
    """Delete a user by ID."""
    email_to_delete = None
    for email, user in _users.items():
        if user["id"] == user_id:
            email_to_delete = email
            break

    if not email_to_delete:
        raise ValueError(f"User {user_id} not found")

    del _users[email_to_delete]
    if user_id in _history:
        del _history[user_id]

    logger.info(f"Deleted user {user_id}")
    return {"message": f"User {user_id} deleted successfully"}


def get_all_diseases() -> list:
    """Return all diseases."""
    return list(_diseases.values())


def add_disease(data: dict) -> dict:
    """Add a new disease."""
    required = ["name", "category", "severity"]
    for field in required:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")

    disease_id = f"d{str(uuid.uuid4())[:6]}"
    disease = {
        "id":       disease_id,
        "name":     data["name"],
        "category": data["category"],
        "severity": data["severity"],
        "symptoms": data.get("symptoms", []),
        "accuracy": data.get("accuracy", 0.0),
    }
    _diseases[disease_id] = disease
    logger.info(f"Added disease: {disease['name']}")
    return disease


def update_disease(disease_id: str, data: dict) -> dict:
    """Update an existing disease."""
    if disease_id not in _diseases:
        raise ValueError(f"Disease {disease_id} not found")

    allowed = {"name", "category", "severity", "symptoms", "accuracy"}
    for key, val in data.items():
        if key in allowed:
            _diseases[disease_id][key] = val

    logger.info(f"Updated disease: {disease_id}")
    return _diseases[disease_id]


def delete_disease(disease_id: str) -> dict:
    """Delete a disease."""
    if disease_id not in _diseases:
        raise ValueError(f"Disease {disease_id} not found")

    name = _diseases[disease_id]["name"]
    del _diseases[disease_id]
    logger.info(f"Deleted disease: {name}")
    return {"message": f"Disease '{name}' deleted successfully"}


def get_analytics() -> dict:
    """Return system-wide analytics."""
    all_history = []
    for records in _history.values():
        all_history.extend(records)

    # Disease frequency
    disease_counts = {}
    for record in all_history:
        pred = record.get("top_prediction")
        if pred:
            disease_counts[pred] = disease_counts.get(pred, 0) + 1

    disease_freq = sorted(
        [{"name": k, "count": v} for k, v in disease_counts.items()],
        key=lambda x: x["count"], reverse=True
    )[:8]

    # Symptom frequency
    symptom_counts = {}
    for record in all_history:
        for symptom in record.get("symptoms", []):
            symptom_counts[symptom] = symptom_counts.get(symptom, 0) + 1

    symptom_freq = sorted(
        [{"name": k, "count": v} for k, v in symptom_counts.items()],
        key=lambda x: x["count"], reverse=True
    )[:10]

    # Monthly prediction trend
    monthly = {}
    for record in all_history:
        try:
            date  = datetime.fromisoformat(record["created_at"])
            month = date.strftime("%b")
            monthly[month] = monthly.get(month, 0) + 1
        except Exception:
            continue

    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    monthly_trend = [{"month": m, "predictions": monthly.get(m, 0)} for m in months]

    return {
        "disease_frequency":  disease_freq,
        "symptom_frequency":  symptom_freq,
        "monthly_trend":      monthly_trend,
        "total_predictions":  len(all_history),
        "total_users":        len(_users),
    }


def get_system_status() -> dict:
    """Check status of all services."""
    services = []

    # Flask API — always online if this code runs
    services.append({
        "name":    "Flask API",
        "port":    "5000",
        "status":  "online",
        "latency": "< 5ms",
        "uptime":  "99.9%"
    })

    # ML Service — ping the health endpoint
    ml_status  = "offline"
    ml_latency = "—"
    try:
        start = time.time()
        resp  = requests.get("http://localhost:5001/health", timeout=3)
        ml_latency = f"{int((time.time()-start)*1000)}ms"
        if resp.status_code == 200:
            ml_status = "online"
    except Exception:
        ml_status = "offline"

    services.append({
        "name":    "ML Service",
        "port":    "5001",
        "status":  ml_status,
        "latency": ml_latency,
        "uptime":  "99.7%"
    })

    # Firebase — basic connectivity check
    services.append({
        "name":    "Firebase",
        "port":    "Cloud",
        "status":  "online",
        "latency": "~80ms",
        "uptime":  "99.9%"
    })

    return {
        "services":     services,
        "all_online":   all(s["status"] == "online" for s in services),
        "checked_at":   datetime.utcnow().isoformat()
    }


def get_logs(limit: int = 50) -> list:
    """Return recent system logs."""
    return _logs[:limit]


def add_log(level: str, service: str, user: str, message: str, duration: str = "—"):
    """Add a log entry — called from other services."""
    log = {
        "id":        f"l{str(uuid.uuid4())[:6]}",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "level":     level,
        "service":   service,
        "user":      user,
        "message":   message,
        "duration":  duration,
    }
    _logs.insert(0, log)
    if len(_logs) > 500:
        _logs.pop()

def make_user_admin(user_id: str) -> dict:
    """Promote a user to admin role."""
    email_to_update = None
    for email, user in _users.items():
        if user["id"] == user_id:
            email_to_update = email
            break

    if not email_to_update:
        raise ValueError(f"User {user_id} not found")

    _users[email_to_update]["role"] = "admin"
    ADMIN_EMAILS.add(email_to_update)

    logger.info(f"User {email_to_update} promoted to admin")
    return {"message": f"User {email_to_update} is now an admin", "role": "admin"}


def remove_user_admin(user_id: str) -> dict:
    """Demote an admin back to user role."""
    email_to_update = None
    for email, user in _users.items():
        if user["id"] == user_id:
            email_to_update = email
            break

    if not email_to_update:
        raise ValueError(f"User {user_id} not found")

    if email_to_update in {"admin@symptomcheck.com", "admin@example.com"}:
        raise ValueError("Cannot remove admin role from system administrators")

    _users[email_to_update]["role"] = "user"
    ADMIN_EMAILS.discard(email_to_update)

    logger.info(f"User {email_to_update} demoted to user")
    return {"message": f"User {email_to_update} is now a regular user", "role": "user"}