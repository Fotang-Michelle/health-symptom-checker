import numpy as np
import logging

logger = logging.getLogger(__name__)

FEATURE_NAMES = [
    "fever", "chills", "cough", "fatigue", "headache",
    "nausea", "vomiting", "diarrhea", "rash", "itching",
    "shortness_of_breath", "chest_pain", "muscle_aches",
    "sore_throat", "runny_nose", "congestion", "abdominal_pain",
    "dizziness", "weakness", "loss_of_appetite", "night_sweats",
    "weight_loss", "pale_skin", "swelling", "palpitations"
]

SYMPTOM_ALIASES = {
    "shortness of breath": "shortness_of_breath",
    "chest pain":          "chest_pain",
    "muscle aches":        "muscle_aches",
    "sore throat":         "sore_throat",
    "runny nose":          "runny_nose",
    "abdominal pain":      "abdominal_pain",
    "loss of appetite":    "loss_of_appetite",
    "night sweats":        "night_sweats",
    "weight loss":         "weight_loss",
    "pale skin":           "pale_skin",
}

def symptoms_to_vector(symptoms: list) -> np.ndarray:
    """
    Convert symptom strings to a binary feature vector.
    Example: ["Fever", "Cough"] → [1, 0, 1, 0, 0, ...]
    """
    vector       = np.zeros(len(FEATURE_NAMES))
    unrecognized = []

    for symptom in symptoms:
        normalized = symptom.lower().strip()
        key        = SYMPTOM_ALIASES.get(normalized, normalized.replace(" ", "_"))

        if key in FEATURE_NAMES:
            vector[FEATURE_NAMES.index(key)] = 1
        else:
            unrecognized.append(symptom)

    if unrecognized:
        logger.warning(f"Unrecognized symptoms skipped: {unrecognized}")

    return vector