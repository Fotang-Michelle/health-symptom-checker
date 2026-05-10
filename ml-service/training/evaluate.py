"""
evaluate.py
-----------
Manually test the trained model with sample symptoms.
Run with: python training/evaluate.py
"""

import os
import joblib
import numpy as np

BASE_DIR      = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR     = os.path.join(BASE_DIR, "..", "app", "model")
MODEL_PATH    = os.path.join(MODEL_DIR, "disease_model.pkl")
FEATURES_PATH = os.path.join(MODEL_DIR, "feature_names.pkl")
ENCODER_PATH  = os.path.join(MODEL_DIR, "label_encoder.pkl")

model         = joblib.load(MODEL_PATH)
feature_names = joblib.load(FEATURES_PATH)
encoder       = joblib.load(ENCODER_PATH)


def predict_disease(symptoms: list) -> list:
    vector = np.zeros(len(feature_names))
    for symptom in symptoms:
        key = symptom.lower().strip().replace(" ", "_")
        if key in feature_names:
            vector[feature_names.index(key)] = 1
        else:
            print(f"   ⚠ Unknown symptom: '{symptom}'")

    proba   = model.predict_proba([vector])[0]
    results = []
    for i, confidence in enumerate(proba):
        if confidence > 0:
            results.append({
                "disease":    encoder.classes_[i],
                "confidence": round(float(confidence), 2)
            })
    results.sort(key=lambda x: x["confidence"], reverse=True)
    return results[:3]


test_cases = [
    {"label": "Flu",     "symptoms": ["fever", "chills", "fatigue", "muscle aches", "headache", "cough"]},
    {"label": "Cold",    "symptoms": ["runny nose", "congestion", "sore throat", "cough"]},
    {"label": "Malaria", "symptoms": ["fever", "chills", "headache", "nausea", "vomiting", "muscle aches"]},
    {"label": "COVID",   "symptoms": ["fever", "cough", "fatigue", "shortness of breath", "loss of appetite"]},
]

print("\n🔍 Evaluation results:\n")
for case in test_cases:
    print(f"Test: {case['label']}")
    print(f"  Symptoms: {case['symptoms']}")
    for i, p in enumerate(predict_disease(case["symptoms"]), 1):
        bar = "█" * int(p["confidence"] * 20)
        print(f"  {i}. {p['disease']:<25} {p['confidence']*100:.0f}% {bar}")
    print()

print("✅ Evaluation complete.\n")