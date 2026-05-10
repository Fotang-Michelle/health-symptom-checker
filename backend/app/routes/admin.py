from flask import Blueprint, request, jsonify
from ..middleware.auth_middleware import require_admin
from ..services.admin_service import (
    get_admin_stats,
    get_all_users,
    delete_user,
    get_all_diseases,
    add_disease,
    update_disease,
    delete_disease,
    get_analytics,
    get_system_status,
    get_logs,
)
import logging

admin_bp = Blueprint("admin", __name__)
logger   = logging.getLogger(__name__)


@admin_bp.route("/stats", methods=["GET"])
@require_admin
def admin_stats():
    try:
        stats = get_admin_stats()
        return jsonify(stats), 200
    except Exception as e:
        logger.error(f"Admin stats error: {e}")
        return jsonify({"error": "Failed to fetch admin stats"}), 500


@admin_bp.route("/users", methods=["GET"])
@require_admin
def list_users():
    try:
        users = get_all_users()
        return jsonify(users), 200
    except Exception as e:
        logger.error(f"List users error: {e}")
        return jsonify({"error": "Failed to fetch users"}), 500


@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@require_admin
def remove_user(user_id):
    try:
        result = delete_user(user_id)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        logger.error(f"Delete user error: {e}")
        return jsonify({"error": "Failed to delete user"}), 500


@admin_bp.route("/diseases", methods=["GET"])
@require_admin
def list_diseases():
    try:
        diseases = get_all_diseases()
        return jsonify(diseases), 200
    except Exception as e:
        logger.error(f"List diseases error: {e}")
        return jsonify({"error": "Failed to fetch diseases"}), 500


@admin_bp.route("/diseases", methods=["POST"])
@require_admin
def create_disease():
    try:
        data   = request.get_json() or {}
        result = add_disease(data)
        return jsonify(result), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Add disease error: {e}")
        return jsonify({"error": "Failed to add disease"}), 500


@admin_bp.route("/diseases/<disease_id>", methods=["PUT"])
@require_admin
def edit_disease(disease_id):
    try:
        data   = request.get_json() or {}
        result = update_disease(disease_id, data)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        logger.error(f"Update disease error: {e}")
        return jsonify({"error": "Failed to update disease"}), 500


@admin_bp.route("/diseases/<disease_id>", methods=["DELETE"])
@require_admin
def remove_disease(disease_id):
    try:
        result = delete_disease(disease_id)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        logger.error(f"Delete disease error: {e}")
        return jsonify({"error": "Failed to delete disease"}), 500


@admin_bp.route("/analytics", methods=["GET"])
@require_admin
def analytics():
    try:
        data = get_analytics()
        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        return jsonify({"error": "Failed to fetch analytics"}), 500


@admin_bp.route("/system-status", methods=["GET"])
@require_admin
def system_status():
    try:
        status = get_system_status()
        return jsonify(status), 200
    except Exception as e:
        logger.error(f"System status error: {e}")
        return jsonify({"error": "Failed to fetch system status"}), 500


@admin_bp.route("/logs", methods=["GET"])
@require_admin
def system_logs():
    try:
        limit = request.args.get("limit", 50, type=int)
        logs  = get_logs(limit)
        return jsonify(logs), 200
    except Exception as e:
        logger.error(f"Logs error: {e}")
        return jsonify({"error": "Failed to fetch logs"}), 500