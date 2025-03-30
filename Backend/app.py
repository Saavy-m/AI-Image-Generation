from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes import api_bp
import os

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")
jwt = JWTManager(app)

app.register_blueprint(api_bp, url_prefix="/api")


if __name__ == "__main__":
    app.run(debug=True)
