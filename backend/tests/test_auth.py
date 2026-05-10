"""
test_auth.py
------------
Unit tests for the authentication service.
Run with: python -m pytest tests/ -v
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.auth_service import (
    register_user, login_user, hash_password, generate_token, _users
)


def setup_function():
    """Clear users before each test."""
    _users.clear()


def test_hash_password_is_consistent():
    """Same password should always produce same hash."""
    assert hash_password("secret") == hash_password("secret")


def test_hash_password_is_different():
    """Different passwords should produce different hashes."""
    assert hash_password("abc") != hash_password("xyz")


def test_register_new_user_succeeds():
    result = register_user("test@example.com", "password123", "Test User")
    assert "token" in result
    assert result["user"]["email"] == "test@example.com"
    assert result["user"]["name"]  == "Test User"
    print("✓ register_new_user_succeeds")


def test_register_duplicate_email_raises():
    register_user("dup@example.com", "password123", "User One")
    try:
        register_user("dup@example.com", "password456", "User Two")
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "already exists" in str(e)
    print("✓ register_duplicate_email_raises")


def test_login_with_correct_credentials():
    register_user("login@example.com", "mypassword", "Login User")
    result = login_user("login@example.com", "mypassword")
    assert "token" in result
    assert result["user"]["email"] == "login@example.com"
    print("✓ login_with_correct_credentials")


def test_login_with_wrong_password_raises():
    register_user("wrong@example.com", "correctpass", "User")
    try:
        login_user("wrong@example.com", "wrongpass")
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "Invalid" in str(e)
    print("✓ login_with_wrong_password_raises")


def test_login_with_unknown_email_raises():
    try:
        login_user("nobody@example.com", "anypass")
        assert False, "Should have raised ValueError"
    except ValueError:
        pass
    print("✓ login_with_unknown_email_raises")


def test_generate_token_returns_string():
    token = generate_token("user-123", "test@example.com")
    assert isinstance(token, str)
    assert len(token) > 10
    print("✓ generate_token_returns_string")


if __name__ == "__main__":
    setup_function(); test_hash_password_is_consistent()
    setup_function(); test_hash_password_is_different()
    setup_function(); test_register_new_user_succeeds()
    setup_function(); test_register_duplicate_email_raises()
    setup_function(); test_login_with_correct_credentials()
    setup_function(); test_login_with_wrong_password_raises()
    setup_function(); test_login_with_unknown_email_raises()
    setup_function(); test_generate_token_returns_string()
    print("\n✅ All auth tests passed!")