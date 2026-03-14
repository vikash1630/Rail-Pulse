from flask import Blueprint, jsonify
from src.controllers.DashBoard import DashBoard

dashboard_bp = Blueprint("dashboard", __name__)

def register_dashboard_routes(app):

    @app.route("/api/dashBoard", methods=["GET"])
    def getDashBoard():
        data, status = DashBoard()   # unpack the (dict, status_code) tuple
        return jsonify(data), status