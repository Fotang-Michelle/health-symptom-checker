"""
history_service.py
------------------
Saves and retrieves symptom check history.
Writes to Firestore when available.
Falls back to in-memory store if Firebase is not connected.
"""

import logging
from datetime import datetime, timezone
from ..firebase import get_db, is_firebase_available

logger = logging.getLogger(__name__)

# In-memory fallback store
_history = {}


def save_check(user_id: str, symptoms: list, prediction_result: dict) -> dict:
    """Save a symptom check to Firestore and memory."""
    top = prediction_result.get("predictions", [])

    record = {
        "id":             prediction_result.get("session_id"),
        "user_id":        user_id,
        "symptoms":       symptoms,
        "predictions":    top,
        "top_prediction": top[0]["condition"] if top else None,
        "source":         prediction_result.get("source", "ml"),
        "created_at":     datetime.now(timezone.utc).isoformat()
    }

    # Write to Firestore
    if is_firebase_available():
        try:
            db = get_db()
            db.collection("symptom_checks") \
              .document(record["id"]) \
              .set(record)
            logger.info(f"Check {record['id']} written to Firestore.")
        except Exception as e:
            logger.error(f"Firestore write failed: {e}")

    # Always write to memory
    if user_id not in _history:
        _history[user_id] = []
    _history[user_id].insert(0, record)

    logger.info(f"Saved check for user {user_id}: session {record['id']}")
    return record


def get_history(user_id: str) -> list:
    """Get symptom check history from Firestore or memory."""

    # Try Firestore first
    if is_firebase_available():
        try:
            db   = get_db()
            docs = db.collection("symptom_checks") \
                     .where("user_id", "==", user_id) \
                     .order_by("created_at", direction="DESCENDING") \
                     .limit(50) \
                     .stream()

            records = [doc.to_dict() for doc in docs]

            if records:
                # Sync back to memory
                _history[user_id] = records
                logger.info(f"Fetched {len(records)} records from Firestore for {user_id}")
                return records
        except Exception as e:
            logger.warning(f"Firestore read failed, using memory: {e}")

    # Fallback to memory
    records = _history.get(user_id, [])
    logger.info(f"Fetched {len(records)} records from memory for {user_id}")
    return records