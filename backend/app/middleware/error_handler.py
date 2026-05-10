"""
error_handler.py
----------------
Registers global error handlers on the Flask app.
Catches unhandled exceptions and returns clean JSON responses.
"""

import logging
import traceback
from flask import jsonify

logger = logging.getLogger(__name__)


def register_error_handlers(app):
    """Register all global error handlers on the Flask app."""

    @app.errorhandler(400)
    def bad_request(e):
        logger.warning(f"400 Bad Request: {e}")
        return jsonify({
            "error":   "Bad request",
            "message": str(e),
            "status":  400
        }), 400

    @app.errorhandler(401)
    def unauthorized(e):
        logger.warning(f"401 Unauthorized: {e}")
        return jsonify({
            "error":   "Unauthorized",
            "message": "Authentication required",
            "status":  401
        }), 401

    @app.errorhandler(403)
    def forbidden(e):
        logger.warning(f"403 Forbidden: {e}")
        return jsonify({
            "error":   "Forbidden",
            "message": "You do not have permission to access this resource",
            "status":  403
        }), 403

    @app.errorhandler(404)
    def not_found(e):
        logger.warning(f"404 Not Found: {e}")
        return jsonify({
            "error":   "Not found",
            "message": "The requested resource does not exist",
            "status":  404
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        logger.warning(f"405 Method Not Allowed: {e}")
        return jsonify({
            "error":   "Method not allowed",
            "message": str(e),
            "status":  405
        }), 405

    @app.errorhandler(422)
    def unprocessable(e):
        logger.warning(f"422 Unprocessable Entity: {e}")
        return jsonify({
            "error":   "Unprocessable entity",
            "message": str(e),
            "status":  422
        }), 422

    @app.errorhandler(500)
    def internal_error(e):
        logger.error(f"500 Internal Server Error: {e}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error":   "Internal server error",
            "message": "An unexpected error occurred. Please try again.",
            "status":  500
        }), 500

    @app.errorhandler(Exception)
    def unhandled_exception(e):
        logger.critical(f"Unhandled exception: {e}")
        logger.critical(traceback.format_exc())
        return jsonify({
            "error":   "Server error",
            "message": "An unexpected error occurred.",
            "status":  500
        }), 500