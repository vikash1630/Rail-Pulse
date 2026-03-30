from flask import request, jsonify
from src.controllers.LiveTrain import get_live_train_status

print("LiveTrain route loaded")

def LiveTrain_Routes(app):

    @app.route("/api/train/live", methods=["GET"])
    def live_train_status():
        train_no = request.args.get("train_no")
        print("LiveTrain route loaded")
        data, status = get_live_train_status(train_no)
        return jsonify(data), status