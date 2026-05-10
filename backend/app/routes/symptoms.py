from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from ..services.prediction_service import predict
from ..services.history_service import save_check
from ..services.firebase_disease_service import save_symptom_query
from ..models.schemas import SymptomRequestSchema
from ..middleware.auth_middleware import require_auth
import logging

symptoms_bp = Blueprint("symptoms", __name__)
logger      = logging.getLogger(__name__)

symptom_schema = SymptomRequestSchema()


@symptoms_bp.route("/symptoms", methods=["POST"])
@require_auth
def check_symptoms():
    try:
        data = symptom_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400

    symptoms = data["symptoms"]

    try:
        result = predict(symptoms)
        save_check(request.user_id, symptoms, result)

        # Save raw query to Firestore for analytics
        save_symptom_query(request.user_id, symptoms, result)

        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({"error": "Prediction failed. Please try again."}), 500