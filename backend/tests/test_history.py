"""
test_history.py
---------------
Unit tests for the history service.
Run with: python -m pytest tests/ -v
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.history_service import save_check, get_history, _history


def setup_function():
    _history.clear()


def test_save_check_returns_record():
    result = save_check(
        user_id="user-001",
        symptoms=["Fever", "Cough"],
        prediction_result={
            "session_id":  "session-001",
            "predictions": [{"condition":"Influenza","confidence":0.87,"severity":"medium"}],
            "source":      "ml"
        }
    )
    assert result["id"]             == "session-001"
    assert result["user_id"]        == "user-001"
    assert result["symptoms"]       == ["Fever", "Cough"]
    assert result["top_prediction"] == "Influenza"
    print("✓ save_check_returns_record")


def test_get_history_returns_list():
    records = get_history("user-002")
    assert isinstance(records, list)
    print("✓ get_history_returns_list")


def test_get_history_empty_for_new_user():
    records = get_history("brand-new-user")
    assert records == []
    print("✓ get_history_empty_for_new_user")


def test_get_history_returns_saved_checks():
    save_check(
        user_id="user-003",
        symptoms=["Nausea"],
        prediction_result={
            "session_id":  "session-002",
            "predictions": [],
            "source":      "rules"
        }
    )
    records = get_history("user-003")
    assert len(records) == 1
    assert records[0]["id"] == "session-002"
    print("✓ get_history_returns_saved_checks")


def test_history_ordered_most_recent_first():
    save_check("user-004", ["Fever"],   {"session_id":"s1","predictions":[],"source":"ml"})
    save_check("user-004", ["Cough"],   {"session_id":"s2","predictions":[],"source":"ml"})
    save_check("user-004", ["Fatigue"], {"session_id":"s3","predictions":[],"source":"ml"})
    records = get_history("user-004")
    assert records[0]["id"] == "s3"
    print("✓ history_ordered_most_recent_first")


def test_multiple_users_isolated():
    save_check("user-A", ["Fever"], {"session_id":"sA","predictions":[],"source":"ml"})
    save_check("user-B", ["Cough"], {"session_id":"sB","predictions":[],"source":"ml"})
    assert len(get_history("user-A")) == 1
    assert len(get_history("user-B")) == 1
    assert get_history("user-A")[0]["id"] == "sA"
    print("✓ multiple_users_isolated")


if __name__ == "__main__":
    setup_function(); test_save_check_returns_record()
    setup_function(); test_get_history_returns_list()
    setup_function(); test_get_history_empty_for_new_user()
    setup_function(); test_get_history_returns_saved_checks()
    setup_function(); test_history_ordered_most_recent_first()
    setup_function(); test_multiple_users_isolated()
    print("\n✅ All history tests passed!")