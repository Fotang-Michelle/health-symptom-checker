from flask import Flask
from flask_cors import CORS
from .routes.predict import predict_bp
import logging

def create_app():
    app = Flask(__name__)
    CORS(app)

    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    )

    app.register_blueprint(predict_bp)

    @app.errorhandler(404)
    def not_found(e):
        return {"error": "Route not found"}, 404

    @app.errorhandler(500)
    def server_error(e):
        return {"error": "Internal server error"}, 500

    return app