from flask import Blueprint, jsonify
import logging

health_bp = logging.getLogger(__name__)
health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status":  "ok",
        "service": "flask-backend",
        "version": "1.0.0"
    }), 200