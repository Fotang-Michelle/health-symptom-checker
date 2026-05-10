"""
auth_service.py
---------------
Handles user registration and login.
Writes to Firestore when available.
Falls back to in-memory store if Firebase is not connected.
"""

import jwt
import uuid
import hashlib
import os
import logging
from datetime import datetime, timedelta, timezone
from ..firebase import get_db, is_firebase_available

logger     = logging.getLogger(__name__)
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

# In-memory fallback store
_users = {}


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def generate_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email":   email,
        "exp":     datetime.now(timezone.utc) + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def register_user(email: str, password: str, name: str) -> dict:
    """Register a new user in Firestore or memory."""

    # Check duplicate in memory first
    if email in _users:
        raise ValueError("An account with this email already exists.")

    # Check duplicate in Firestore
    if is_firebase_available():
        db  = get_db()
        doc = db.collection("users").document(email).get()
        if doc.exists:
            raise ValueError("An account with this email already exists.")

    user_id  = str(uuid.uuid4())
    hashed   = hash_password(password)
    now      = datetime.now(timezone.utc).isoformat()

    user_data = {
        "id":         user_id,
        "email":      email,
        "name":       name,
        "password":   hashed,
        "role":       "admin" if email in {"admin@symptomcheck.com","admin@example.com"} else "user",
        "created_at": now,
        "status":     "active",
    }

    # Write to Firestore
    if is_firebase_available():
        try:
            db = get_db()
            db.collection("users").document(email).set(user_data)
            logger.info(f"User {email} written to Firestore.")
        except Exception as e:
            logger.error(f"Firestore write failed: {e}")

    # Always write to memory as backup
    _users[email] = user_data

    token = generate_token(user_id, email)
    logger.info(f"New user registered: {email}")

    return {
        "user":  {"id": user_id, "email": email, "name": name},
        "token": token
    }


def login_user(email: str, password: str) -> dict:
    """Log in a user. Checks Firestore first then memory."""
    hashed = hash_password(password)

    # Try Firestore first
    if is_firebase_available():
        try:
            db  = get_db()
            doc = db.collection("users").document(email).get()
            if doc.exists:
                user = doc.to_dict()
                if user["password"] != hashed:
                    raise ValueError("Invalid email or password.")
                # Sync back to memory
                _users[email] = user
                token = generate_token(user["id"], email)
                logger.info(f"User logged in via Firestore: {email}")
                return {
                    "user":  {"id": user["id"], "email": email, "name": user["name"]},
                    "token": token
                }
        except ValueError:
            raise
        except Exception as e:
            logger.warning(f"Firestore login failed, trying memory: {e}")

    # Fallback to memory
    user = _users.get(email)
    if not user or user["password"] != hashed:
        raise ValueError("Invalid email or password.")

    token = generate_token(user["id"], email)
    logger.info(f"User logged in via memory: {email}")

    return {
        "user":  {"id": user["id"], "email": email, "name": user["name"]},
        "token": token
    }