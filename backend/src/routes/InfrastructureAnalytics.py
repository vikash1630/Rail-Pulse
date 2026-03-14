from flask import jsonify

from src.controllers.InfrastructureAnalytics import (
    average_platforms,
    high_capacity_stations,
    coach_capacity_analysis,
    platform_range_per_station,
)


def register_infrastructure_routes(app):

    # -----------------------------------
    # Average Platforms
    # GET /api/infrastructure/platforms/average
    # -----------------------------------
    @app.route("/api/infrastructure/platforms/average", methods=["GET"])
    def average_platforms_route():
        data, status = average_platforms()
        return jsonify(data), status

    # -----------------------------------
    # High Capacity Stations
    # GET /api/infrastructure/platforms/highcapacity
    # -----------------------------------
    @app.route("/api/infrastructure/platforms/highcapacity", methods=["GET"])
    def high_capacity_stations_route():
        data, status = high_capacity_stations()
        return jsonify(data), status

    # -----------------------------------
    # Coach Capacity Analysis
    # GET /api/infrastructure/coach/capacity
    # -----------------------------------
    @app.route("/api/infrastructure/coach/capacity", methods=["GET"])
    def coach_capacity_route():
        data, status = coach_capacity_analysis()
        return jsonify(data), status

    # -----------------------------------
    # Platform Range Per Station
    # GET /api/infrastructure/platforms/range
    # -----------------------------------
    @app.route("/api/infrastructure/platforms/range", methods=["GET"])
    def platform_range_route():
        data, status = platform_range_per_station()
        return jsonify(data), status