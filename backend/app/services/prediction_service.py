import uuid
import logging
import requests
import os

logger         = logging.getLogger(__name__)
ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://localhost:5001")

DISEASE_RULES = [
    {
        "condition": "Common Cold",
        "symptoms": {"runny nose", "congestion", "sore throat", "cough", "fatigue", "headache"},
        "min_match": 3, "severity": "low",
        "description": "A viral infection of the upper respiratory tract.",
        "recommendation": "Rest, stay hydrated, take over-the-counter cold medication."
    },
    {
        "condition": "Influenza (Flu)",
        "symptoms": {"fever", "chills", "fatigue", "muscle aches", "headache", "cough", "sore throat"},
        "min_match": 4, "severity": "medium",
        "description": "A contagious respiratory illness caused by influenza viruses.",
        "recommendation": "Rest, drink fluids. See a doctor within 48 hours."
    },
    {
        "condition": "COVID-19",
        "symptoms": {"fever", "cough", "fatigue", "shortness of breath", "loss of appetite", "headache"},
        "min_match": 3, "severity": "high",
        "description": "A respiratory illness caused by the SARS-CoV-2 virus.",
        "recommendation": "Isolate immediately and contact your healthcare provider."
    },
    {
        "condition": "Malaria",
        "symptoms": {"fever", "chills", "headache", "muscle aches", "fatigue", "nausea", "vomiting"},
        "min_match": 4, "severity": "high",
        "description": "A mosquito-borne disease caused by Plasmodium parasites.",
        "recommendation": "Seek immediate medical attention."
    },
    {
        "condition": "Typhoid Fever",
        "symptoms": {"fever", "headache", "abdominal pain", "fatigue", "loss of appetite", "nausea", "weakness"},
        "min_match": 4, "severity": "high",
        "description": "A bacterial infection caused by Salmonella typhi.",
        "recommendation": "See a doctor immediately for antibiotic treatment."
    },
    {
        "condition": "Gastroenteritis",
        "symptoms": {"nausea", "vomiting", "diarrhea", "abdominal pain", "fever", "fatigue"},
        "min_match": 3, "severity": "medium",
        "description": "Inflammation of the stomach and intestines.",
        "recommendation": "Stay hydrated. See a doctor if symptoms last more than 3 days."
    },
    {
        "condition": "Pneumonia",
        "symptoms": {"cough", "fever", "shortness of breath", "chest pain", "fatigue", "chills"},
        "min_match": 4, "severity": "high",
        "description": "An infection that inflames the air sacs in one or both lungs.",
        "recommendation": "Seek medical care immediately."
    },
    {
        "condition": "Anaemia",
        "symptoms": {"fatigue", "weakness", "pale skin", "shortness of breath", "dizziness", "headache"},
        "min_match": 3, "severity": "medium",
        "description": "A condition where you lack enough healthy red blood cells.",
        "recommendation": "See a doctor for blood tests."
    },
    {
        "condition": "Migraine",
        "symptoms": {"headache", "nausea", "dizziness", "fatigue", "vomiting"},
        "min_match": 3, "severity": "medium",
        "description": "A neurological condition causing intense headaches.",
        "recommendation": "Rest in a dark quiet room. See a doctor for recurring migraines."
    },
]

def normalize(symptoms: list) -> list:
    """
    Normalize symptom names:
    - lowercase
    - remove extra spaces
    """
    return [s.strip().lower() for s in symptoms if s]

def _rule_based_predict(symptoms: list) -> list:
    
    normalized = normalized = set(normalize(symptoms))
    results    = []
    for rule in DISEASE_RULES:
        matched = normalized & rule["symptoms"]
        if len(matched) >= rule["min_match"]:
            confidence = round(len(matched) / len(rule["symptoms"]), 2)
            results.append({
                "condition":      rule["condition"],
                "confidence":     confidence,
                "severity":       rule["severity"],
                "description":    rule["description"],
                "recommendation": rule["recommendation"],
            })
    results.sort(key=lambda x: x["confidence"], reverse=True)
    return results[:3]


def predict(symptoms: list) -> dict:
    session_id = str(uuid.uuid4())
    source     = "ml"

    try:
        logger.info(f"Calling ML service at {ML_SERVICE_URL}/predict")
        response = requests.post(
            f"{ML_SERVICE_URL}/predict",
            json={"symptoms": symptoms},
            timeout=5
        )
        if response.status_code == 200:
            predictions = response.json().get("predictions", [])
            logger.info(f"ML service returned {len(predictions)} predictions")
        else:
            raise Exception(f"ML service returned {response.status_code}")

    except Exception as e:
        logger.warning(f"ML service unavailable: {e}. Using rule-based fallback.")
        predictions = _rule_based_predict(symptoms)
        source      = "rules"

    logger.info(f"Prediction complete [{source}]. Session: {session_id}")

    return {
        "session_id":        session_id,
        "symptoms_analyzed": symptoms,
        "predictions":       predictions,
        "source":            source,
        "disclaimer":        "This is for informational purposes only. Always consult a qualified medical professional."
    }