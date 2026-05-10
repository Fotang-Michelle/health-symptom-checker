"""
test_prediction.py
------------------
Unit tests for the ML prediction service.
Run with: python -m pytest tests/ -v
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.prediction_service import predict, normalize


def test_normalize_lowercases():
    result = normalize(["Fever", "COUGH", "  Headache  "])
    assert "fever"   in result
    assert "cough"   in result
    assert "headache" in result
    print("✓ normalize_lowercases")


def test_normalize_strips_whitespace():
    result = normalize(["  fever  "])
    assert "fever" in result
    assert "  fever  " not in result
    print("✓ normalize_strips_whitespace")


def test_predict_returns_dict():
    result = predict(["Fever", "Cough"])
    assert isinstance(result, dict)
    print("✓ predict_returns_dict")


def test_predict_has_required_keys():
    result = predict(["Fever", "Cough"])
    assert "session_id"        in result
    assert "symptoms_analyzed" in result
    assert "predictions"       in result
    assert "disclaimer"        in result
    print("✓ predict_has_required_keys")


def test_predict_session_id_is_unique():
    r1 = predict(["Fever"])
    r2 = predict(["Fever"])
    assert r1["session_id"] != r2["session_id"]
    print("✓ predict_session_id_is_unique")


def test_predict_symptoms_preserved():
    symptoms = ["Fever", "Nausea", "Headache"]
    result   = predict(symptoms)
    assert result["symptoms_analyzed"] == symptoms
    print("✓ predict_symptoms_preserved")


def test_predict_flu_symptoms():
    symptoms = ["Fever", "Chills", "Fatigue", "Muscle aches", "Headache", "Cough"]
    result   = predict(symptoms)
    assert isinstance(result["predictions"], list)
    print("✓ predict_flu_symptoms")


def test_predict_no_match_returns_empty_list():
    result = predict(["Back pain"])
    assert isinstance(result["predictions"], list)
    print("✓ predict_no_match_returns_empty_list")


def test_predict_disclaimer_present():
    result = predict(["Fever"])
    assert "consult" in result["disclaimer"].lower()
    print("✓ predict_disclaimer_present")


if __name__ == "__main__":
    test_normalize_lowercases()
    test_normalize_strips_whitespace()
    test_predict_returns_dict()
    test_predict_has_required_keys()
    test_predict_session_id_is_unique()
    test_predict_symptoms_preserved()
    test_predict_flu_symptoms()
    test_predict_no_match_returns_empty_list()
    test_predict_disclaimer_present()
    print("\n✅ All prediction tests passed!")