from flask import Blueprint, jsonify
from ..monitoring.datadog_monitor import send_metric
import logging

health_bp = Blueprint("health", __name__)
logger = logging.getLogger(__name__)


@health_bp.route("/health", methods=["GET"])
def health_check():
    send_metric("symptom_checker.health.ping")
    return jsonify({
        "status":  "ok",
        "service": "flask-backend",
        "version": "1.0.0"
    }), 200