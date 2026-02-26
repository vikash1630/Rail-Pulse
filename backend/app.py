from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from src.routes import register_routes
from src.user_routes import register_auth_routes
from src.model import seed_trains_to_database

# Load environment variables
load_dotenv()

# Seed train data
seed_trains_to_database()

app = Flask(__name__)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_COOKIE_SAMESITE"] = "Lax"
app.config["JWT_COOKIE_CSRF_PROTECT"] = False

# Extensions
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Register Routes
register_routes(app)
register_auth_routes(app)

if __name__ == "__main__":
    app.run(debug=True)