from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from ..services.auth_service import register_user, login_user
from ..models.schemas import RegisterSchema, LoginSchema
import logging

auth_bp = Blueprint("auth", __name__)
logger  = logging.getLogger(__name__)

register_schema = RegisterSchema()
login_schema    = LoginSchema()


@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = register_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400

    try:
        result = register_user(data["email"], data["password"], data["name"])
        return jsonify(result), 201
    except ValueError as e:
        logger.warning(f"Registration failed: {e}")
        return jsonify({"message": str(e)}), 409
    except Exception as e:
        logger.error(f"Unexpected registration error: {e}")
        return jsonify({"error": "Registration failed"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = login_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": e.messages}), 401

    try:
        result = login_user(data["email"], data["password"])
        return jsonify(result), 200
    except ValueError as e:
        logger.warning(f"Login failed: {e}")
        return jsonify({"message": str(e)}), 401
    except Exception as e:
        logger.error(f"Unexpected login error: {e}")
        return jsonify({"error": "Login failed"}), 500