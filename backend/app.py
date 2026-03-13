from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from src.routes.getTrainDetails import register_routes
from src.routes.user_routes import register_auth_routes
from src.routes.DashBoard import register_dashboard_routes
from src.routes.TrainRoute import Train_Routes
from src.routes.DemandAnalysis import Demand_Routes
from src.routes.RevenueAnalytics import RevenueAnalytics
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
CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Register Routes
register_routes(app)
register_auth_routes(app)
register_dashboard_routes(app)
Train_Routes(app)
Demand_Routes(app)
RevenueAnalytics(app)


if __name__ == "__main__":
    app.run(debug=True)