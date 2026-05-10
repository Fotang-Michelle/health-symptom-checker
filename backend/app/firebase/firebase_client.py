"""
firebase_client.py
------------------
Initialises the Firebase Admin SDK once and exposes
a get_db() helper that returns the Firestore client.
All other services import from here.
"""

import os
import logging
import firebase_admin
from firebase_admin import credentials, firestore

logger = logging.getLogger(__name__)

_db = None


def init_firebase():
    """
    Initialise Firebase Admin SDK.
    Called once from create_app().
    Reads the service account key from the path set in .env
    or falls back to the default location.
    """
    global _db

    # Skip Firebase initialization if running tests
    if os.getenv("DISABLE_FIREBASE_FOR_TESTS"):
        logger.info("Firebase disabled for tests.")
        return

    if firebase_admin._apps:
        _db = firestore.client()
        return

    key_path = os.getenv(
        "FIREBASE_KEY_PATH",
        os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
    )

    if not os.path.exists(key_path):
        logger.warning(
            f"Firebase key not found at {key_path}. "
            "Running without Firebase — using in-memory store."
        )
        return

    try:
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred)
        _db = firestore.client()
        logger.info("Firebase initialised successfully.")
    except Exception as e:
        logger.error(f"Firebase init failed: {e}")
        _db = None


def get_db():
    """Return the Firestore client. Returns None if unavailable."""
    return _db


def is_firebase_available() -> bool:
    """Check whether Firebase is connected."""
    return _db is not None