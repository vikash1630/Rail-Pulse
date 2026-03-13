# phase 4 part 1 demand analysis


from flask import request, jsonify
from src.controllers.DemandAnalysis import (
    get_Train_occupancy_perentage_by_name,
    get_Train_occupancy_perentage_by_num,
    get_Highest_Occupancy_Train,
    get_Lowest_Occupancy_Train,
    get_CategoryVise_Trains,
    get_ZoneVise_Trains,
    get_CategoryVise_TrainsOccupancy,
    get_ZoneVise_TrainsOccupancy    
    
    
)



def Demand_Routes(app):

    @app.route("/api/train/occupancyBynum", methods=["GET"])
    def get_Train_occupancy_perentage_by_num_function():
        num = request.args.get("num")
        if num:
            data, status = get_Train_occupancy_perentage_by_num(num)
            return jsonify(data), status
        return {
            "error": "Please Enter a valid input"
        }, 400


    @app.route("/api/train/occupancyByname", methods=["GET"])
    def get_Train_occupancy_perentage_by_name_function():
        name = request.args.get("name")
        if name:
            data, status = get_Train_occupancy_perentage_by_name(name)
            return jsonify(data), status
        return {
            "error": "Please Enter a valid input"
        }, 400

    @app.route("/api/train/HighestOccupancey", methods=["GET"])
    def get_Highest_Occupancy_Train_Function():
        data, status = get_Highest_Occupancy_Train()
        return jsonify(data), status

    @app.route("/api/train/LowestOccupancey", methods=["GET"])
    def get_Lowest_Occupancy_Train_Function():
        data, status = get_Lowest_Occupancy_Train()
        return jsonify(data), status

    @app.route("/api/train/ZoneWiseTrains" , methods=["GET"])
    def get_ZoneVise_Train_Function():
        zone = request.args.get("zone")
        if zone:
            data, status = get_ZoneVise_Trains(zone)
            return jsonify(data), status
        return {
            "error": "Please Enter a valid input"
        }, 400

    @app.route("/api/train/CategoryWiseTrains" , methods=["GET"])
    def get_CategoryWise_Train_Function():
        cat = request.args.get("cat")
        if cat:
            data, status = get_CategoryVise_Trains(cat)
            return jsonify(data), status
        return {
            "error": "Please Enter a valid input"
        }, 400

    @app.route("/api/train/CategoryWiseTrainsOccupance" , methods=["GET"])
    def get_CategoryWise_TrainOccupancy_Function():
        
        data, status = get_CategoryVise_TrainsOccupancy()
        return jsonify(data), status

    @app.route("/api/train/ZoneyWiseTrainsOccupance" , methods=["GET"])
    def get_ZoneWise_TrainOccupancy_Function():
        
        data, status = get_ZoneVise_TrainsOccupancy()
        return jsonify(data), status


    

