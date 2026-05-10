from flask import Blueprint, request, jsonify
from ..middleware.auth_middleware import require_auth
from ..services.user_service import (
    get_dashboard_stats,
    get_user_history,
    get_recommendations,
    update_user_profile,
    get_chart_data
)
import logging

user_bp = Blueprint("user", __name__)
logger  = logging.getLogger(__name__)


@user_bp.route("/dashboard-stats", methods=["GET"])
@require_auth
def dashboard_stats():
    try:
        stats = get_dashboard_stats(request.user_id)
        return jsonify(stats), 200
    except Exception as e:
        logger.error(f"Dashboard stats error: {e}")
        return jsonify({"error": "Failed to fetch dashboard stats"}), 500


@user_bp.route("/history", methods=["GET"])
@require_auth
def history():
    try:
        records = get_user_history(request.user_id)
        return jsonify(records), 200
    except Exception as e:
        logger.error(f"History fetch error: {e}")
        return jsonify({"error": "Failed to fetch history"}), 500


@user_bp.route("/recommendations", methods=["GET"])
@require_auth
def recommendations():
    try:
        tips = get_recommendations()
        return jsonify(tips), 200
    except Exception as e:
        logger.error(f"Recommendations error: {e}")
        return jsonify({"error": "Failed to fetch recommendations"}), 500


@user_bp.route("/profile", methods=["PUT"])
@require_auth
def update_profile():
    try:
        data = request.get_json() or {}
        result = update_user_profile(request.user_id, data)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Profile update error: {e}")
        return jsonify({"error": "Failed to update profile"}), 500


@user_bp.route("/chart-data", methods=["GET"])
@require_auth
def chart_data():
    try:
        data = get_chart_data(request.user_id)
        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Chart data error: {e}")
        return jsonify({"error": "Failed to fetch chart data"}), 500