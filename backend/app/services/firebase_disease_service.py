"""
firebase_disease_service.py
----------------------------
Read/write disease mappings to Firestore.
Also seeds initial diseases if the collection is empty.
"""

import uuid
import logging
from datetime import datetime, timezone
from ..firebase import get_db, is_firebase_available

logger = logging.getLogger(__name__)

INITIAL_DISEASES = [
    {
        "id": "d001", "name": "Influenza",
        "category": "Viral", "severity": "medium",
        "symptoms": ["fever","chills","cough","fatigue","headache","muscle_aches"],
        "accuracy": 94.0, "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "d002", "name": "Common Cold",
        "category": "Viral", "severity": "low",
        "symptoms": ["runny_nose","congestion","sore_throat","cough","fatigue"],
        "accuracy": 97.0, "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "d003", "name": "COVID-19",
        "category": "Viral", "severity": "high",
        "symptoms": ["fever","cough","fatigue","shortness_of_breath","loss_of_appetite"],
        "accuracy": 91.0, "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "d004", "name": "Malaria",
        "category": "Parasitic", "severity": "high",
        "symptoms": ["fever","chills","headache","nausea","vomiting","muscle_aches"],
        "accuracy": 95.0, "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "d005", "name": "Typhoid Fever",
        "category": "Bacterial", "severity": "high",
        "symptoms": ["fever","headache","abdominal_pain","fatigue","weakness"],
        "accuracy": 93.0, "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "d006", "name": "Gastroenteritis",
        "category": "Viral", "severity": "medium",
        "symptoms": ["nausea","vomiting","diarrhea","abdominal_pain"],
        "accuracy": 89.0, "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "d007", "name": "Pneumonia",
        "category": "Bacterial", "severity": "high",
        "symptoms": ["cough","fever","shortness_of_breath","chest_pain"],
        "accuracy": 92.0, "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "d008", "name": "Anaemia",
        "category": "Blood", "severity": "medium",
        "symptoms": ["fatigue","weakness","pale_skin","dizziness"],
        "accuracy": 88.0, "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "d009", "name": "Allergic Reaction",
        "category": "Immune", "severity": "low",
        "symptoms": ["rash","itching","swelling","runny_nose"],
        "accuracy": 90.0, "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "d010", "name": "Migraine",
        "category": "Neurological", "severity": "medium",
        "symptoms": ["headache","nausea","dizziness","fatigue"],
        "accuracy": 86.0, "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "d011", "name": "Appendicitis",
        "category": "Surgical", "severity": "high",
        "symptoms": ["abdominal_pain","nausea","vomiting","fever","loss_of_appetite"],
        "accuracy": 94.0, "created_at": datetime.now(timezone.utc).isoformat()
    },
]


def seed_diseases():
    """Seed initial diseases to Firestore if collection is empty."""
    if not is_firebase_available():
        logger.warning("Firebase not available. Skipping disease seed.")
        return

    try:
        db   = get_db()
        docs = list(db.collection("diseases").limit(1).stream())

        if docs:
            logger.info("Diseases already seeded. Skipping.")
            return

        batch = db.batch()
        for disease in INITIAL_DISEASES:
            ref = db.collection("diseases").document(disease["id"])
            batch.set(ref, disease)
        batch.commit()

        logger.info(f"Seeded {len(INITIAL_DISEASES)} diseases to Firestore.")
    except Exception as e:
        logger.error(f"Disease seed failed: {e}")


def get_diseases_from_firestore() -> list:
    """Read all diseases from Firestore."""
    if not is_firebase_available():
        return INITIAL_DISEASES

    try:
        db   = get_db()
        docs = db.collection("diseases").stream()
        return [doc.to_dict() for doc in docs]
    except Exception as e:
        logger.error(f"Failed to read diseases: {e}")
        return INITIAL_DISEASES


def write_disease_to_firestore(disease: dict) -> dict:
    """Write a single disease to Firestore."""
    if not is_firebase_available():
        return disease

    try:
        db  = get_db()
        disease["id"] = disease.get("id") or str(uuid.uuid4())[:8]
        db.collection("diseases").document(disease["id"]).set(disease)
        logger.info(f"Disease {disease['name']} written to Firestore.")
        return disease
    except Exception as e:
        logger.error(f"Failed to write disease: {e}")
        return disease


def delete_disease_from_firestore(disease_id: str):
    """Delete a disease from Firestore."""
    if not is_firebase_available():
        return

    try:
        db = get_db()
        db.collection("diseases").document(disease_id).delete()
        logger.info(f"Disease {disease_id} deleted from Firestore.")
    except Exception as e:
        logger.error(f"Failed to delete disease: {e}")


def save_symptom_query(user_id: str, symptoms: list, prediction: dict):
    """
    Save a user symptom query to the symptom_queries collection.
    Useful for analytics and model retraining.
    """
    if not is_firebase_available():
        return

    try:
        db = get_db()
        query = {
            "user_id":    user_id,
            "symptoms":   symptoms,
            "prediction": prediction.get("top_prediction") or
                          (prediction.get("predictions", [{}])[0].get("condition") if prediction.get("predictions") else None),
            "confidence": prediction.get("predictions", [{}])[0].get("confidence", 0) if prediction.get("predictions") else 0,
            "created_at": datetime.utcnow().isoformat()
        }
        db.collection("symptom_queries").add(query)
        logger.info(f"Symptom query saved for user {user_id}")
    except Exception as e:
        logger.error(f"Failed to save symptom query: {e}")