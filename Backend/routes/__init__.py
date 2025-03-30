from flask import Blueprint

# Create a Blueprint for routes
api_bp = Blueprint("api", __name__)

# Import route files to register them
from routes.auth_routes import auth_bp
from routes.image_routes import image_bp

# Register blueprints
api_bp.register_blueprint(auth_bp, url_prefix="/auth")
api_bp.register_blueprint(image_bp, url_prefix="/image") 