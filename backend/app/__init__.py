from flask import Flask
from flask_cors import CORS
from .routes.auth     import auth_bp
from .routes.symptoms import symptoms_bp
from .routes.history  import history_bp
from .routes.user     import user_bp
from .routes.admin    import admin_bp
from .routes.health   import health_bp
from .firebase        import init_firebase
from .logger          import setup_logging
from .middleware.error_handler import register_error_handlers


def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/api/*": {"origins": [
        "http://localhost:5173",
    "http://localhost:3000",
    "https://health-symptom-checker-3fcb9.web.app",
    "https://health-symptom-checker-3fcb9.firebaseapp.com"
    ]}})

    # Logging must be first
    setup_logging()

    # Firebase
    init_firebase()

    # Blueprints
    app.register_blueprint(auth_bp,     url_prefix="/api/auth")
    app.register_blueprint(symptoms_bp, url_prefix="/api")
    app.register_blueprint(history_bp,  url_prefix="/api")
    app.register_blueprint(user_bp,     url_prefix="/api/user")
    app.register_blueprint(admin_bp,    url_prefix="/api/admin")
    app.register_blueprint(health_bp,   url_prefix="/api")

    # Global error handlers
    register_error_handlers(app)

    return app