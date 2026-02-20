from flask import jsonify
from src.controller import get_trains_data

def register_routes(app):

    @app.route("/")
    def test():
        data = get_trains_data()
        return jsonify(data)