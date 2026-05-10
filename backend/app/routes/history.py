from flask import Blueprint, request, jsonify
from ..services.history_service import get_history
from ..middleware.auth_middleware import require_auth
import logging

history_bp = Blueprint("history", __name__)
logger     = logging.getLogger(__name__)


@history_bp.route("/history", methods=["GET"])
@require_auth
def history():
    try:
        records = get_history(request.user_id)
        return jsonify(records), 200
    except Exception as e:
        logger.error(f"History fetch error: {e}")
        return jsonify({"error": "Could not fetch history"}), 500