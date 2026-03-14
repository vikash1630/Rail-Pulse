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
from src.routes.InfrastructureAnalytics import register_infrastructure_routes
from src.model import seed_trains_to_database

# Load environment variables
load_dotenv()

# Seed train data
seed_trains_to_database()

app = Flask(__name__)

# JWT Configuration
app.config["JWT_COOKIE_SECURE"] = True
app.config["JWT_COOKIE_SAMESITE"] = "None"
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]

# Enable CORS for ALL origins
CORS(app, supports_credentials=True)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Register Routes
register_routes(app)
register_auth_routes(app)
register_dashboard_routes(app)
Train_Routes(app)
Demand_Routes(app)
RevenueAnalytics(app)
register_infrastructure_routes(app)

@app.route("/")
def home():
    return {"message": "RailPulse API is running"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)