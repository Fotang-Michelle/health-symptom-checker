"""
test_routes.py
--------------
Integration tests for Flask API routes.
Tests the actual HTTP endpoints using Flask test client.
Run with: python -m pytest tests/ -v
"""

import sys
import os
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from app.services.auth_service import _users
from app.services.history_service import _history


def get_app():
    app = create_app()
    app.config["TESTING"] = True
    return app


def get_token(client, email="route_test@example.com"):
    """Helper to register and return a token."""
    res = client.post("/api/auth/register",
        data=json.dumps({"email": email, "password": "password123", "name": "Test"}),
        content_type="application/json"
    )
    return json.loads(res.data)["token"]


def setup_function():
    _users.clear()
    _history.clear()


# ── Auth routes ──────────────────────────────────────────────────

def test_register_route_returns_201():
    app = get_app()
    with app.test_client() as client:
        res = client.post("/api/auth/register",
            data=json.dumps({"email":"r1@test.com","password":"pass1234","name":"User"}),
            content_type="application/json"
        )
        assert res.status_code == 201
        data = json.loads(res.data)
        assert "token" in data
    print("✓ register_route_returns_201")


def test_register_duplicate_returns_409():
    app = get_app()
    with app.test_client() as client:
        body = json.dumps({"email":"dup@test.com","password":"pass1234","name":"User"})
        client.post("/api/auth/register", data=body, content_type="application/json")
        res = client.post("/api/auth/register", data=body, content_type="application/json")
        assert res.status_code == 409
    print("✓ register_duplicate_returns_409")


def test_login_route_returns_200():
    app = get_app()
    with app.test_client() as client:
        client.post("/api/auth/register",
            data=json.dumps({"email":"lg@test.com","password":"pass1234","name":"User"}),
            content_type="application/json"
        )
        res = client.post("/api/auth/login",
            data=json.dumps({"email":"lg@test.com","password":"pass1234"}),
            content_type="application/json"
        )
        assert res.status_code == 200
        assert "token" in json.loads(res.data)
    print("✓ login_route_returns_200")


def test_login_wrong_password_returns_401():
    app = get_app()
    with app.test_client() as client:
        client.post("/api/auth/register",
            data=json.dumps({"email":"wp@test.com","password":"correct","name":"User"}),
            content_type="application/json"
        )
        res = client.post("/api/auth/login",
            data=json.dumps({"email":"wp@test.com","password":"wrong"}),
            content_type="application/json"
        )
        assert res.status_code == 401
    print("✓ login_wrong_password_returns_401")


# ── Symptom routes ───────────────────────────────────────────────

def test_symptoms_without_token_returns_401():
    app = get_app()
    with app.test_client() as client:
        res = client.post("/api/symptoms",
            data=json.dumps({"symptoms": ["Fever"]}),
            content_type="application/json"
        )
        assert res.status_code == 401
    print("✓ symptoms_without_token_returns_401")


def test_symptoms_with_token_returns_200():
    app = get_app()
    with app.test_client() as client:
        token = get_token(client, "sym@test.com")
        res   = client.post("/api/symptoms",
            data=json.dumps({"symptoms": ["Fever", "Cough", "Fatigue"]}),
            content_type="application/json",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert "predictions"       in data
        assert "session_id"        in data
        assert "symptoms_analyzed" in data
    print("✓ symptoms_with_token_returns_200")


def test_symptoms_empty_list_returns_400():
    app = get_app()
    with app.test_client() as client:
        token = get_token(client, "emp@test.com")
        res   = client.post("/api/symptoms",
            data=json.dumps({"symptoms": []}),
            content_type="application/json",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert res.status_code == 400
    print("✓ symptoms_empty_list_returns_400")


# ── History routes ───────────────────────────────────────────────

def test_history_without_token_returns_401():
    app = get_app()
    with app.test_client() as client:
        res = client.get("/api/history")
        assert res.status_code == 401
    print("✓ history_without_token_returns_401")


def test_history_returns_list():
    app = get_app()
    with app.test_client() as client:
        token = get_token(client, "hist@test.com")
        res   = client.get("/api/history",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert res.status_code == 200
        assert isinstance(json.loads(res.data), list)
    print("✓ history_returns_list")


# ── User dashboard routes ────────────────────────────────────────

def test_dashboard_stats_returns_200():
    app = get_app()
    with app.test_client() as client:
        token = get_token(client, "dash@test.com")
        res   = client.get("/api/user/dashboard-stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert "total_checks"       in data
        assert "health_score"       in data
        assert "prediction_accuracy" in data
    print("✓ dashboard_stats_returns_200")


def test_recommendations_returns_list():
    app = get_app()
    with app.test_client() as client:
        token = get_token(client, "rec@test.com")
        res   = client.get("/api/user/recommendations",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert isinstance(data, list)
        assert len(data) > 0
    print("✓ recommendations_returns_list")


if __name__ == "__main__":
    setup_function(); test_register_route_returns_201()
    setup_function(); test_register_duplicate_returns_409()
    setup_function(); test_login_route_returns_200()
    setup_function(); test_login_wrong_password_returns_401()
    setup_function(); test_symptoms_without_token_returns_401()
    setup_function(); test_symptoms_with_token_returns_200()
    setup_function(); test_symptoms_empty_list_returns_400()
    setup_function(); test_history_without_token_returns_401()
    setup_function(); test_history_returns_list()
    setup_function(); test_dashboard_stats_returns_200()
    setup_function(); test_recommendations_returns_list()
    print("\n✅ All route tests passed!")