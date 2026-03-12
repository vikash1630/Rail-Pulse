# Phase - 1 part 2 getting train details end points in diffrent ways 



from flask import request, jsonify

from src.controllers.GetTrainDetails import (
    get_train_by_number,
    get_train_by_name,
    compare_trains_by_number,
    compare_trains_by_name,
    getTrainRoutes,
    get_train_by_zone,
    get_train_by_category
)

def register_routes(app):

    # --------------------------------------------------
    # GET Train By Number
    # Example:
    # /api/train/number?number=14331
    # --------------------------------------------------
    @app.route("/api/train/number", methods=["GET"])
    def get_train_by_number_function():

        train_no = request.args.get("number")

        if not train_no:
            return jsonify({"error": "Train number is required"}), 400

        try:
            train_no = int(train_no)
        except ValueError:
            return jsonify({"error": "Train number must be integer"}), 400

        data, status = get_train_by_number(train_no)
        return jsonify(data), status


    # --------------------------------------------------
    # GET Train By Name
    # Example:
    # /api/train/name?name=Jaipur Rajdhani
    # --------------------------------------------------
    @app.route("/api/train/name", methods=["GET"])
    def get_train_by_name_function():

        train_name = request.args.get("name")

        if not train_name:
            return jsonify({"error": "Train name is required"}), 400

        data, status = get_train_by_name(train_name)
        return jsonify(data), status





    @app.route("/api/trian/zone", methods=["GET"])
    def get_train_by_zone_function():
        train_zone = request.args.get("zone")
        print(train_zone)

        if not train_zone:
            return jsonify({"error": "Train name is required"}), 400
        
        
        data, status = get_train_by_zone(train_zone)
        print(data)

        return jsonify(data), status

    @app.route("/api/trian/category", methods=["GET"])
    def get_train_by_category_function():
        train_cat = request.args.get("cat")
        print(train_cat)

        if not train_cat:
            return jsonify({"error": "Train name is required"}), 400
        
        
        data, status = get_train_by_category(train_cat)
        print(data)

        return jsonify(data), status






    # --------------------------------------------------
    # Compare Two Trains By Number
    # Example:
    # /api/train/compare/bynumber?train1=14331&train2=53550
    # --------------------------------------------------
    @app.route("/api/train/compare/bynumber", methods=["GET"])
    def train_comparison_by_number():

        train1 = request.args.get("train1")
        train2 = request.args.get("train2")

        if not train1 or not train2:
            return jsonify({"error": "Provide both train1 and train2"}), 400

        data, status = compare_trains_by_number(train1, train2)
        return jsonify(data), status


    # --------------------------------------------------
    # Compare Two Trains By Name
    # Example:
    # /api/train/compare/byname?train1=Chennai Garib Rath&train2=Surat Garib Rath
    # --------------------------------------------------
    @app.route("/api/train/compare/byname", methods=["GET"])
    def train_comparison_by_name():

        train1 = request.args.get("train1")
        train2 = request.args.get("train2")

        if not train1 or not train2:
            return jsonify({"error": "Provide both train names"}), 400

        data, status = compare_trains_by_name(train1, train2)
        return jsonify(data), status


    # --------------------------------------------------
    # Get Train Route Map Data
    # Returns route coordinates for all trains
    # Optional filter by train name
    #
    # Examples:
    # /api/train/routeMap
    # /api/train/routeMap?trainName=Jaipur Rajdhani
    # --------------------------------------------------
    @app.route('/api/train/routeMap', methods=["GET"])
    def route_map():

        # Optional filter parameter
        train = request.args.get("trainName")

        data, status = getTrainRoutes(train)
        return jsonify(data), status
    
    