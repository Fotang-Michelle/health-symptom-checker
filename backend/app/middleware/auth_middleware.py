import jwt
import os
from functools import wraps
from flask import request, jsonify
import logging

logger = logging.getLogger(__name__)
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

ADMIN_EMAILS = {
    "admin@symptomcheck.com",
    "admin@example.com",
}

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization token required"}), 401
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id    = payload.get("user_id")
            request.user_email = payload.get("email")
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated


def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization token required"}), 401
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id    = payload.get("user_id")
            request.user_email = payload.get("email")
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        # Check both the static set and the dynamic admin_service set
        from ..services.admin_service import ADMIN_EMAILS as DYNAMIC_ADMIN_EMAILS
        all_admins = ADMIN_EMAILS | DYNAMIC_ADMIN_EMAILS

        if request.user_email not in all_admins:
            logger.warning(f"Non-admin access attempt by {request.user_email}")
            return jsonify({"error": "Admin access required"}), 403

        return f(*args, **kwargs)
    return decorated