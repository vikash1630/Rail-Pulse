from flask import request, jsonify

from src.controllers.DemandAnalysis import (
    get_Train_occupancy_perentage_by_name,
    get_Train_occupancy_perentage_by_num,
    get_Highest_Occupancy_Train,
    get_Lowest_Occupancy_Train,
    get_CategoryVise_Trains,
    get_ZoneVise_Trains,
    get_CategoryVise_TrainsOccupancy,
    get_ZoneVise_TrainsOccupancy,
)


def Demand_Routes(app):

    # -----------------------------------
    # Occupancy by Train Number
    # GET /api/train/occupancyBynum?num=14331
    # -----------------------------------
    @app.route("/api/train/occupancyBynum", methods=["GET"])
    def get_Train_occupancy_by_num():
        num = request.args.get("num", "").strip()
        if not num:
            return jsonify({"error": "Please provide a train number via ?num="}), 400
        data, status = get_Train_occupancy_perentage_by_num(num)
        return jsonify(data), status

    # -----------------------------------
    # Occupancy by Train Name
    # GET /api/train/occupancyByname?name=Jaipur Rajdhani
    # -----------------------------------
    @app.route("/api/train/occupancyByname", methods=["GET"])
    def get_Train_occupancy_by_name():
        name = request.args.get("name", "").strip()
        if not name:
            return jsonify({"error": "Please provide a train name via ?name="}), 400
        data, status = get_Train_occupancy_perentage_by_name(name)
        return jsonify(data), status

    # -----------------------------------
    # Highest Occupancy Train
    # GET /api/train/HighestOccupancey
    # -----------------------------------
    @app.route("/api/train/HighestOccupancey", methods=["GET"])
    def get_Highest_Occupancy():
        data, status = get_Highest_Occupancy_Train()
        return jsonify(data), status

    # -----------------------------------
    # Lowest Occupancy Train
    # GET /api/train/LowestOccupancey
    # -----------------------------------
    @app.route("/api/train/LowestOccupancey", methods=["GET"])
    def get_Lowest_Occupancy():
        data, status = get_Lowest_Occupancy_Train()
        return jsonify(data), status

    # -----------------------------------
    # Zone-wise Train List
    # GET /api/train/ZoneWiseTrains?zone=Western Railway
    # -----------------------------------
    @app.route("/api/train/ZoneWiseTrains", methods=["GET"])
    def get_Zone_Wise_Trains():
        zone = request.args.get("zone", "").strip()
        if not zone:
            return jsonify({"error": "Please provide a zone via ?zone="}), 400
        data, status = get_ZoneVise_Trains(zone)
        return jsonify(data), status

    # -----------------------------------
    # Category-wise Train List
    # GET /api/train/CategoryWiseTrains?cat=Rajdhani
    # -----------------------------------
    @app.route("/api/train/CategoryWiseTrains", methods=["GET"])
    def get_Category_Wise_Trains():
        cat = request.args.get("cat", "").strip()
        if not cat:
            return jsonify({"error": "Please provide a category via ?cat="}), 400
        data, status = get_CategoryVise_Trains(cat)
        return jsonify(data), status

    # -----------------------------------
    # Category-wise Average Occupancy
    # GET /api/train/CategoryWiseTrainsOccupance
    # -----------------------------------
    @app.route("/api/train/CategoryWiseTrainsOccupance", methods=["GET"])
    def get_Category_Wise_Occupancy():
        data, status = get_CategoryVise_TrainsOccupancy()
        return jsonify(data), status

    # -----------------------------------
    # Zone-wise Average Occupancy
    # GET /api/train/ZoneyWiseTrainsOccupance
    # -----------------------------------
    @app.route("/api/train/ZoneyWiseTrainsOccupance", methods=["GET"])
    def get_Zone_Wise_Occupancy():
        data, status = get_ZoneVise_TrainsOccupancy()
        return jsonify(data), status