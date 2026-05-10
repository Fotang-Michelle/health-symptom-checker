import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.preprocessing.preprocessor import symptoms_to_vector, FEATURE_NAMES


def test_vector_length():
    vector = symptoms_to_vector(["Fever", "Cough"])
    assert len(vector) == len(FEATURE_NAMES)
    print("✓ test_vector_length passed")


def test_fever_is_encoded():
    vector = symptoms_to_vector(["Fever"])
    assert vector[FEATURE_NAMES.index("fever")] == 1
    print("✓ test_fever_is_encoded passed")


def test_multi_symptom_encoding():
    vector = symptoms_to_vector(["Fever", "Cough", "Fatigue"])
    assert vector[FEATURE_NAMES.index("fever")]   == 1
    assert vector[FEATURE_NAMES.index("cough")]   == 1
    assert vector[FEATURE_NAMES.index("fatigue")] == 1
    print("✓ test_multi_symptom_encoding passed")


def test_alias_mapping():
    vector = symptoms_to_vector(["Sore throat"])
    assert vector[FEATURE_NAMES.index("sore_throat")] == 1
    print("✓ test_alias_mapping passed")


def test_unknown_symptom_ignored():
    vector = symptoms_to_vector(["Feeling weird", "Unknown thing"])
    assert vector.sum() == 0
    print("✓ test_unknown_symptom_ignored passed")


def test_empty_symptoms():
    vector = symptoms_to_vector([])
    assert all(v == 0 for v in vector)
    print("✓ test_empty_symptoms passed")


if __name__ == "__main__":
    print("\n🧪 Running ML tests...\n")
    test_vector_length()
    test_fever_is_encoded()
    test_multi_symptom_encoding()
    test_alias_mapping()
    test_unknown_symptom_ignored()
    test_empty_symptoms()
    print("\n✅ All ML tests passed!\n")