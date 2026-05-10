import os
import joblib
import numpy as np
import logging

logger = logging.getLogger(__name__)

BASE_DIR      = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH    = os.path.join(BASE_DIR, "disease_model.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "feature_names.pkl")
ENCODER_PATH  = os.path.join(BASE_DIR, "label_encoder.pkl")

_model    = None
_features = None
_encoder  = None


def load_model():
    global _model, _features, _encoder
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            "Model not found. Run: python training/train.py"
        )
    logger.info("Loading ML model from disk...")
    _model    = joblib.load(MODEL_PATH)
    _features = joblib.load(FEATURES_PATH)
    _encoder  = joblib.load(ENCODER_PATH)
    logger.info(f"Model loaded. Classes: {list(_encoder.classes_)}")


def get_model():
    if _model is None:
        load_model()
    return _model, _features, _encoder


DISEASE_META = {
    "Influenza": {
        "severity": "medium",
        "recommendation": "Rest, drink fluids, consider antiviral medication. See a doctor within 48 hours."
    },
    "Common Cold": {
        "severity": "low",
        "recommendation": "Rest, stay hydrated, take over-the-counter cold medication."
    },
    "COVID-19": {
        "severity": "high",
        "recommendation": "Isolate immediately, get tested, and contact your healthcare provider."
    },
    "Malaria": {
        "severity": "high",
        "recommendation": "Seek immediate medical attention. Requires prescription antimalarial medication."
    },
    "Typhoid": {
        "severity": "high",
        "recommendation": "See a doctor immediately for antibiotic treatment."
    },
    "Gastroenteritis": {
        "severity": "medium",
        "recommendation": "Stay hydrated with oral rehydration salts. See a doctor if symptoms persist."
    },
    "Pneumonia": {
        "severity": "high",
        "recommendation": "Seek medical care immediately. May require antibiotics or hospitalisation."
    },
    "Anaemia": {
        "severity": "medium",
        "recommendation": "See a doctor for blood tests. May need iron supplements or dietary changes."
    },
    "Allergic Reaction": {
        "severity": "low",
        "recommendation": "Identify and avoid the allergen. Take antihistamines for mild reactions."
    },
    "Appendicitis": {
        "severity": "high",
        "recommendation": "Go to the emergency room immediately. This is a medical emergency."
    },
    "Migraine": {
        "severity": "medium",
        "recommendation": "Rest in a dark quiet room. Take pain relief medication."
    },
}


def get_severity(disease: str) -> str:
    return DISEASE_META.get(disease, {}).get("severity", "low")


def get_recommendation(disease: str) -> str:
    return DISEASE_META.get(disease, {}).get(
        "recommendation",
        "Please consult a qualified medical professional."
    )


def predict_from_vector(feature_vector: np.ndarray) -> list:
    model, features, encoder = get_model()
    probabilities = model.predict_proba([feature_vector])[0]

    results = []
    for i, confidence in enumerate(probabilities):
        if confidence > 0:
            disease = encoder.classes_[i]
            results.append({
                "condition":      disease,
                "confidence":     round(float(confidence), 2),
                "severity":       get_severity(disease),
                "recommendation": get_recommendation(disease)
            })

    results.sort(key=lambda x: x["confidence"], reverse=True)
    return results[:3]