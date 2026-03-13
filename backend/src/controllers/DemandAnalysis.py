

import pandas as pd
from src.models.getTrainDetails import fetch_all_trains

trains = fetch_all_trains()
status = 200


def get_Train_occupancy_perentage_by_num(num):
    train = trains[trains["TrainNo"]==num]
    if train.empty:
        return {"error": "No train Found"}, 400
    train = train[["TrainName","OccupancyPercentage","CoachCount"]]
    train = train.to_dict(orient="records")
    return {
        "train": train
    }, 200


def get_Train_occupancy_perentage_by_name(name):
    train = trains[trains["TrainName"]==name]
    if train.empty:
        return {"error": "No train Found"}, 400
    train = train[["TrainNo","TrainName","OccupancyPercentage","CoachCount"]]
    train = train.to_dict(orient="records")
    return {
        "train": train
    }, 200



def get_Highest_Occupancy_Train():
    train = trains[(trains["OccupancyPercentage"]==trains["OccupancyPercentage"].max())]
    if train.empty:
        return {"error": "Train Not Found"}, 400
    train = train.to_dict(orient="records")
    return {
        "train": train
    }, 200

def get_Lowest_Occupancy_Train():
    train = trains[(trains["OccupancyPercentage"]==trains["OccupancyPercentage"].min())]
    if train.empty:
        return {"error": "Train Not Found"}, 400
    train = train.to_dict(orient="records")
    return {
        "train": train
    }, 200

def get_ZoneVise_Trains(zone):
    zones = trains["RailwayZone"].unique()

    train = {}

    if zone not in zones:
        return {"error": "Zone Not Found"}, 400

    for i in zones:
        train[i] = trains[trains["RailwayZone"] == i]

    res = train[zone]
    if res.empty:
        return {"error": "No Train Found For give Zone"}, 400
    data = res.to_dict(orient="records")

    return {
        "count": len(data),
        "trains": data
    }, 200

def get_CategoryVise_Trains(cat):
    cats = trains["TrainCategory"].unique()
    
    if cat not in cats:
        return {"error": "Category Not Found"}, 400

    train = {}

    for i in cats:
        train[i] = trains[trains["TrainCategory"] == i]

    res = train[cat]
    if res.empty:
        return {"error": "No Train Found For give Zone"}, 400
    data = res.to_dict(orient="records")

    return {
        "count": len(data),
        "trains": data
    }, 200


def get_CategoryVise_TrainsOccupancy():
    res = trains.groupby("TrainCategory")["OccupancyPercentage"].mean()
    if res.empty:
        return {"error": "Invalid Entry"}, 400
    res = res.to_dict()
    return {
        "trains": res
    }, 200

def get_ZoneVise_TrainsOccupancy():
    res = trains.groupby("RailwayZone")["OccupancyPercentage"].mean()
    if res.empty:
        return {"error": "Invalid Entry"}, 400
    res = res.to_dict()
    return {
        "trains": res
    }, 200








