"""
conftest.py
-----------
Pytest configuration file for proper test setup and teardown.
Ensures Firebase is disabled and in-memory stores are cleared before each test.
"""

import pytest
import sys
import os
from unittest.mock import patch, MagicMock

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    """Setup test environment - run once per test session."""
    # Set an environment variable to disable Firebase in tests
    os.environ["DISABLE_FIREBASE_FOR_TESTS"] = "1"


@pytest.fixture(autouse=True)
def disable_firebase_per_test():
    """Prevent Firebase from initializing for each test."""
    import firebase_admin
    
    # Delete any existing Firebase apps
    while firebase_admin._apps:
        try:
            app = list(firebase_admin._apps.values())[0]
            firebase_admin.delete_app(app)
        except:
            break
    
    # Patch Firebase functions
    patches = [
        patch('app.firebase.firebase_client.init_firebase', return_value=None),
        patch('app.firebase.firebase_client.is_firebase_available', return_value=False),
        patch('app.firebase.firebase_client.get_db', return_value=None),
        patch('firebase_admin.initialize_app', return_value=None),
    ]
    
    with patches[0], patches[1], patches[2], patches[3]:
        yield


@pytest.fixture(autouse=True)
def clear_stores():
    """Clear in-memory stores before and after each test."""
    from app.services.auth_service import _users
    from app.services.history_service import _history
    
    _users.clear()
    _history.clear()
    
    yield
    
    # Cleanup after test
    _users.clear()
    _history.clear()
