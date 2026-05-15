from flask import Blueprint, request, jsonify
from ..middleware.auth_middleware import require_admin
from ..services.admin_service import (
    get_admin_stats, get_all_users, delete_user,
    get_all_diseases, add_disease, update_disease,
    delete_disease, get_analytics, get_system_status,
    get_logs, make_user_admin, remove_user_admin
)
import logging

admin_bp = Blueprint("admin", __name__)
logger   = logging.getLogger(__name__)


@admin_bp.route("/stats", methods=["GET"])
@require_admin
def admin_stats():
    try:
        return jsonify(get_admin_stats()), 200
    except Exception as e:
        logger.error(f"Admin stats error: {e}")
        return jsonify({"error": "Failed to fetch admin stats"}), 500


@admin_bp.route("/users", methods=["GET"])
@require_admin
def list_users():
    try:
        return jsonify(get_all_users()), 200
    except Exception as e:
        logger.error(f"List users error: {e}")
        return jsonify({"error": "Failed to fetch users"}), 500


@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@require_admin
def remove_user(user_id):
    try:
        return jsonify(delete_user(user_id)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        logger.error(f"Delete user error: {e}")
        return jsonify({"error": "Failed to delete user"}), 500


@admin_bp.route("/users/<user_id>/make-admin", methods=["POST"])
@require_admin
def promote_user(user_id):
    try:
        return jsonify(make_user_admin(user_id)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        logger.error(f"Make admin error: {e}")
        return jsonify({"error": "Failed to promote user"}), 500


@admin_bp.route("/users/<user_id>/remove-admin", methods=["POST"])
@require_admin
def demote_user(user_id):
    try:
        return jsonify(remove_user_admin(user_id)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        logger.error(f"Remove admin error: {e}")
        return jsonify({"error": "Failed to demote user"}), 500


@admin_bp.route("/diseases", methods=["GET"])
@require_admin
def list_diseases():
    try:
        return jsonify(get_all_diseases()), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch diseases"}), 500


@admin_bp.route("/diseases", methods=["POST"])
@require_admin
def create_disease():
    try:
        return jsonify(add_disease(request.get_json() or {})), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to add disease"}), 500


@admin_bp.route("/diseases/<disease_id>", methods=["PUT"])
@require_admin
def edit_disease(disease_id):
    try:
        return jsonify(update_disease(disease_id, request.get_json() or {})), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "Failed to update disease"}), 500


@admin_bp.route("/diseases/<disease_id>", methods=["DELETE"])
@require_admin
def remove_disease(disease_id):
    try:
        return jsonify(delete_disease(disease_id)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "Failed to delete disease"}), 500


@admin_bp.route("/analytics", methods=["GET"])
@require_admin
def analytics():
    try:
        return jsonify(get_analytics()), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch analytics"}), 500


@admin_bp.route("/system-status", methods=["GET"])
@require_admin
def system_status():
    try:
        return jsonify(get_system_status()), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch system status"}), 500


@admin_bp.route("/logs", methods=["GET"])
@require_admin
def system_logs():
    try:
        return jsonify(get_logs(request.args.get("limit", 50, type=int))), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch logs"}), 500