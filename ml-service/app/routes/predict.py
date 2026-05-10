from flask import Blueprint, request, jsonify
from ..preprocessing.preprocessor import symptoms_to_vector
from ..model.predictor import predict_from_vector
import uuid
import logging

predict_bp = Blueprint("predict", __name__)
logger     = logging.getLogger(__name__)


@predict_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "ml-service"}), 200


@predict_bp.route("/predict", methods=["POST"])
def predict():
    body = request.get_json()

    if not body or "symptoms" not in body:
        return jsonify({"error": "Request body must include 'symptoms' list"}), 400

    symptoms = body["symptoms"]

    if not isinstance(symptoms, list) or len(symptoms) == 0:
        return jsonify({"error": "symptoms must be a non-empty list"}), 400

    logger.info(f"ML prediction requested for: {symptoms}")

    try:
        feature_vector = symptoms_to_vector(symptoms)
        predictions    = predict_from_vector(feature_vector)
        session_id     = str(uuid.uuid4())

        response = {
            "session_id":        session_id,
            "symptoms_analyzed": symptoms,
            "predictions":       predictions,
            "disclaimer":        "This is for informational purposes only. Always consult a qualified medical professional."
        }

        logger.info(f"Prediction complete. Session: {session_id}")
        return jsonify(response), 200

    except FileNotFoundError as e:
        logger.error(f"Model not found: {e}")
        return jsonify({"error": "ML model not trained yet. Run training/train.py first."}), 503

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({"error": "Prediction failed. Please try again."}), 500