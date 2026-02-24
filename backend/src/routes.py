# routes.py
# This file connects URL endpoints to controller functions

from flask import request, jsonify
from src.controller import get_train_by_number
from src.controller import get_train_by_name


def register_routes(app):

    # API: Get train by number
    @app.route("/train/Number", methods=["GET"])
    def get_train_by_number_function():

        # Get train number from query parameter
        # Example: /train?number=12345
        train_no = request.args.get("Number")

        # Validate input
        if not train_no:
            return jsonify({"error": "Train number is required"}), 400

        try:
            train_no = int(train_no)
        except ValueError:
            return jsonify({"error": "Train number must be integer"}), 400

        # Call controller
        data = get_train_by_number(train_no)

        return jsonify(data)
    
    @app.route("/train/Name", methods=["GET"])
    def get_train_by_name_function():
        train_name = request.args.get("Name")

        if not train_name:
            return jsonify({"error": "Train Name is Required"}), 400
        
        try:
            train_name = str(train_name)
        except ValueError:
            return jsonify({"error": "Train Name must contain Characters"}), 400
        
        data = get_train_by_name(train_name)
        

        return jsonify(data)

