
#phase - 2 part 1 fetching trains based on routes

from flask import request, jsonify

from src.controllers.TrainRoute import (
    get_Train_By_Star_End_points,
    get_Train_By_Stops,
    get_longest_Journey_train,
    get_Shortest_Journey_train,
    get_train_route_by_name,
    get_train_route_by_num

)






def Train_Routes(app):
    
    @app.route("/api/train/trainRoute", methods=["GET"])
    def get_Train_By_Star_End_points_Route_function():
        start = request.args.get("Start")
        end = request.args.get("End")

        if start == end:
            return {"error": "Initial and Final Destinations Cant be Same"}, 404

        data, status = get_Train_By_Star_End_points(start,end)

        return jsonify(data), status
    
    @app.route("/api/train/anytrain", methods=["GET"])
    def get_train_in_this_Route_function():
        start = request.args.get("Start")
        end = request.args.get("End")

        if start == end:
            return {"error": "Initial and Final Destinations Cant be Same"}, 404

        data, status = get_Train_By_Stops(start,end)

        return jsonify(data), status
    
    @app.route("/api/train/Longest", methods=["GET"])
    def get_Longest_Journey_train_function():
        data, status = get_longest_Journey_train()
        return jsonify(data), status
    
    @app.route("/api/train/Shortest", methods=["GET"])
    def get_Shortest_Journey_train_function():
        data, status = get_Shortest_Journey_train()
        return jsonify(data), status
    
    @app.route("/api/train/RouteByname", methods=["GET"])
    def get_train_route_by_name_function():
        name = request.args.get("name")

        data, status = get_train_route_by_name(name)

        return jsonify(data), status
    
    @app.route("/api/train/RouteBynum", methods=["GET"])
    def get_train_route_by_num_function():
        num = request.args.get("num")

        data, status = get_train_route_by_name(num)

        return jsonify(data), status
    

