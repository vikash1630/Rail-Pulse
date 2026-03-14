
from flask import request, jsonify

from src.controllers.RevenueAnalytics import (
    HighestRevenue_Train,
    LowestRevenue_Train,
    AverageRevenue_Train,
    RevenueBy_cat,
    RevenueBy_Zone,
    RevenueBy_num,
    RevenueBy_name,
    TotalRevenue_Trains

)

def RevenueAnalytics(app):

    @app.route("/api/train/HighestRevenue", methods=["GET"])
    def HighestRevenue_Train_Funtion():
        data, status = HighestRevenue_Train()
        return jsonify(data), status

    @app.route("/api/train/LowestRevenue", methods=["GET"])
    def LowestRevenue_Train_Funtion():
        data, status = LowestRevenue_Train()
        return jsonify(data), status

    @app.route("/api/train/AverageRevenue", methods=["GET"])
    def AverageRevenue_Train_Funtion():
        data, status = AverageRevenue_Train()
        return jsonify(data), status

    @app.route("/api/train/RevenueByZone", methods=["GET"])
    def RevenueByZone_Function():
        zone = request.args.get("zone")
        data, status = RevenueBy_Zone(zone)
        return jsonify(data), status
    
    @app.route("/api/train/RevenueByCategory", methods=["GET"])
    def RevenueByCat_Function():
        cat = request.args.get("cat")
        data, status = RevenueBy_cat(cat)
        return jsonify(data), status
    
    @app.route("/api/train/RevenueByNum", methods=["GET"])
    def RevenueBynum_Function():
        num = request.args.get("num")
        data, status = RevenueBy_num(num)
        return jsonify(data), status
    
    
    @app.route("/api/train/RevenueByName", methods=["GET"])
    def RevenueByname_Function():
        name = request.args.get("name")
        data, status = RevenueBy_name(name)
        return jsonify(data), status
    
    @app.route("/api/train/TotalRevenue", methods=["GET"])
    def TotalRevenue_Function():
        data, status = TotalRevenue_Trains()
        return jsonify(data), status
    




