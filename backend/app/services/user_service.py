import logging
from datetime import datetime, timedelta
from .history_service import get_history

logger = logging.getLogger(__name__)

RECOMMENDATIONS = [
    {
        "id": 1,
        "category": "Hydration",
        "title": "Drink More Water",
        "desc": "Aim for 8-10 glasses of water per day. Proper hydration supports kidney function, skin health, and energy levels.",
        "tips": [
            "Start your day with a glass of water",
            "Carry a reusable water bottle",
            "Drink a glass before each meal"
        ],
        "icon": "Droplets",
        "color": "blue"
    },
    {
        "id": 2,
        "category": "Nutrition",
        "title": "Balanced Nutrition",
        "desc": "A diverse diet rich in fruits, vegetables, and whole grains provides essential vitamins and minerals.",
        "tips": [
            "Eat 5 servings of vegetables daily",
            "Limit processed foods and sugar",
            "Include healthy fats like avocado and nuts"
        ],
        "icon": "Apple",
        "color": "green"
    },
    {
        "id": 3,
        "category": "Exercise",
        "title": "Stay Active",
        "desc": "Regular physical activity strengthens the heart, boosts mood, and reduces the risk of chronic diseases.",
        "tips": [
            "30 minutes of walking 5x per week",
            "Take stairs instead of lifts",
            "Stretch for 10 minutes every morning"
        ],
        "icon": "Dumbbell",
        "color": "purple"
    },
    {
        "id": 4,
        "category": "Sleep",
        "title": "Quality Sleep",
        "desc": "Sleep is when your body repairs itself. Poor sleep is linked to weakened immunity and higher disease risk.",
        "tips": [
            "Maintain a consistent sleep schedule",
            "Avoid screens 1 hour before bed",
            "Keep your bedroom cool and dark"
        ],
        "icon": "Moon",
        "color": "amber"
    },
    {
        "id": 5,
        "category": "Mental Health",
        "title": "Mental Wellness",
        "desc": "Mental health is just as important as physical health. Stress management reduces inflammation and boosts immunity.",
        "tips": [
            "Practice 5 minutes of deep breathing daily",
            "Connect with friends and family",
            "Limit news and social media consumption"
        ],
        "icon": "Brain",
        "color": "red"
    },
    {
        "id": 6,
        "category": "Prevention",
        "title": "Preventive Care",
        "desc": "Regular health screenings catch problems early when they are easiest to treat.",
        "tips": [
            "Schedule annual health check-ups",
            "Stay up to date with vaccinations",
            "Know your family health history"
        ],
        "icon": "Shield",
        "color": "green"
    },
]

# In-memory profile store (replace with Firebase when ready)
_profiles = {}


def get_dashboard_stats(user_id: str) -> dict:
    """Return summary stats for the user dashboard."""
    history = get_history(user_id)

    total_checks  = len(history)
    last_check    = history[0] if history else None
    last_pred     = last_check.get("top_prediction", "None") if last_check else "None"
    last_date     = last_check.get("created_at", "") if last_check else ""

    high_count    = sum(
        1 for h in history
        if h.get("predictions") and
        h["predictions"][0].get("severity") == "high"
    )
    health_score  = max(60, 100 - (high_count * 10))

    logger.info(f"Dashboard stats for user {user_id}: {total_checks} checks")

    return {
        "total_checks":       total_checks,
        "last_prediction":    last_pred,
        "last_check_date":    last_date,
        "prediction_accuracy": 93.9,
        "health_score":       health_score,
        "high_severity_count": high_count
    }


def get_user_history(user_id: str) -> list:
    """Return full history for the user."""
    return get_history(user_id)


def get_recommendations() -> list:
    """Return static health recommendations."""
    return RECOMMENDATIONS


def update_user_profile(user_id: str, data: dict) -> dict:
    """Update user profile fields."""
    allowed = {
        "name", "phone", "location", "dob",
        "bloodType", "allergies", "conditions"
    }
    updates = {k: v for k, v in data.items() if k in allowed}

    if not _profiles.get(user_id):
        _profiles[user_id] = {}

    _profiles[user_id].update(updates)
    _profiles[user_id]["updated_at"] = datetime.utcnow().isoformat()

    logger.info(f"Profile updated for user {user_id}")
    return {"message": "Profile updated successfully", "profile": _profiles[user_id]}


def get_chart_data(user_id: str) -> dict:
    """Return monthly symptom check trend data."""
    history = get_history(user_id)

    monthly = {}
    for record in history:
        try:
            date  = datetime.fromisoformat(record["created_at"])
            month = date.strftime("%b")
            monthly[month] = monthly.get(month, 0) + 1
        except Exception:
            continue

    all_months = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"]
    trend = [{"month": m, "checks": monthly.get(m, 0)} for m in all_months]

    disease_counts = {}
    for record in history:
        if record.get("top_prediction"):
            d = record["top_prediction"]
            disease_counts[d] = disease_counts.get(d, 0) + 1

    disease_data = [
        {"name": k, "count": v}
        for k, v in sorted(disease_counts.items(),
                           key=lambda x: x[1], reverse=True)
    ][:6]

    return {
        "monthly_trend":  trend,
        "disease_counts": disease_data
    }