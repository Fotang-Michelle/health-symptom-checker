"""
test_admin.py
-------------
Unit tests for admin service functions.
Run with: python -m pytest tests/ -v
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.admin_service import (
    get_admin_stats, get_all_users, get_all_diseases,
    add_disease, update_disease, delete_disease, get_logs, _diseases, _logs
)
from app.services.auth_service  import register_user, _users
from app.services.history_service import _history


def setup_function():
    _users.clear()
    _history.clear()


def test_get_admin_stats_returns_dict():
    result = get_admin_stats()
    assert isinstance(result, dict)
    assert "total_users"       in result
    assert "total_predictions" in result
    assert "server_status"     in result
    print("✓ get_admin_stats_returns_dict")


def test_admin_stats_counts_users():
    register_user("a@test.com", "pass123", "User A")
    register_user("b@test.com", "pass123", "User B")
    stats = get_admin_stats()
    assert stats["total_users"] == 2
    print("✓ admin_stats_counts_users")


def test_get_all_users_returns_list():
    result = get_all_users()
    assert isinstance(result, list)
    print("✓ get_all_users_returns_list")


def test_get_all_users_after_register():
    register_user("c@test.com", "pass123", "User C")
    users = get_all_users()
    emails = [u["email"] for u in users]
    assert "c@test.com" in emails
    print("✓ get_all_users_after_register")


def test_get_all_diseases_returns_list():
    diseases = get_all_diseases()
    assert isinstance(diseases, list)
    assert len(diseases) > 0
    print("✓ get_all_diseases_returns_list")


def test_add_disease_succeeds():
    disease = add_disease({
        "name":     "Test Disease",
        "category": "Viral",
        "severity": "low",
        "symptoms": ["fever","cough"],
        "accuracy": 85.0
    })
    assert disease["name"]     == "Test Disease"
    assert disease["category"] == "Viral"
    assert "id" in disease
    print("✓ add_disease_succeeds")


def test_add_disease_missing_field_raises():
    try:
        add_disease({"name": "Incomplete"})
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert "Missing" in str(e)
    print("✓ add_disease_missing_field_raises")


def test_update_disease_succeeds():
    disease = add_disease({
        "name":"Update Me","category":"Viral",
        "severity":"low","symptoms":[],"accuracy":80.0
    })
    updated = update_disease(disease["id"], {"severity": "high"})
    assert updated["severity"] == "high"
    print("✓ update_disease_succeeds")


def test_update_nonexistent_disease_raises():
    try:
        update_disease("nonexistent-id", {"severity": "low"})
        assert False, "Should raise ValueError"
    except ValueError:
        pass
    print("✓ update_nonexistent_disease_raises")


def test_delete_disease_succeeds():
    disease = add_disease({
        "name":"Delete Me","category":"Viral",
        "severity":"low","symptoms":[],"accuracy":80.0
    })
    did    = disease["id"]
    result = delete_disease(did)
    assert "deleted" in result["message"].lower() or "Delete Me" in result["message"]
    assert did not in _diseases
    print("✓ delete_disease_succeeds")


def test_delete_nonexistent_disease_raises():
    try:
        delete_disease("ghost-id")
        assert False, "Should raise ValueError"
    except ValueError:
        pass
    print("✓ delete_nonexistent_disease_raises")


def test_get_logs_returns_list():
    logs = get_logs()
    assert isinstance(logs, list)
    print("✓ get_logs_returns_list")


def test_get_logs_respects_limit():
    logs = get_logs(limit=3)
    assert len(logs) <= 3
    print("✓ get_logs_respects_limit")


if __name__ == "__main__":
    setup_function(); test_get_admin_stats_returns_dict()
    setup_function(); test_admin_stats_counts_users()
    setup_function(); test_get_all_users_returns_list()
    setup_function(); test_get_all_users_after_register()
    test_get_all_diseases_returns_list()
    test_add_disease_succeeds()
    test_add_disease_missing_field_raises()
    test_update_disease_succeeds()
    test_update_nonexistent_disease_raises()
    test_delete_disease_succeeds()
    test_delete_nonexistent_disease_raises()
    test_get_logs_returns_list()
    test_get_logs_respects_limit()
    print("\n✅ All admin tests passed!")