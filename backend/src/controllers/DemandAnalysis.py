import pandas as pd
from src.models.getTrainDetails import fetch_all_trains

trains = fetch_all_trains()


# -----------------------------------
# Helper — sanitize NaN → None
# so jsonify produces valid JSON
# -----------------------------------
def _clean(df):
    return df.where(pd.notna(df), other=None)


# -----------------------------------
# Occupancy by Train Number
# -----------------------------------
def get_Train_occupancy_perentage_by_num(num):
    try:
        num = int(num)          # query params are strings; TrainNo column is int64
    except (ValueError, TypeError):
        return {"error": "Train number must be a valid integer"}, 400

    train = trains[trains["TrainNo"] == num]
    if train.empty:
        return {"error": "No train found for given number"}, 400

    result = _clean(train[["TrainName", "OccupancyPercentage", "CoachCount"]])
    return {"train": result.to_dict(orient="records")}, 200


# -----------------------------------
# Occupancy by Train Name
# -----------------------------------
def get_Train_occupancy_perentage_by_name(name):
    train = trains[trains["TrainName"] == name]
    if train.empty:
        return {"error": "No train found for given name"}, 400

    result = _clean(train[["TrainNo", "TrainName", "OccupancyPercentage", "CoachCount"]])
    return {"train": result.to_dict(orient="records")}, 200


# -----------------------------------
# Highest Occupancy Train
# -----------------------------------
def get_Highest_Occupancy_Train():
    # dropna first so NaN rows don't become the max
    valid = trains.dropna(subset=["OccupancyPercentage"])
    if valid.empty:
        return {"error": "No occupancy data available"}, 400

    max_occ = valid["OccupancyPercentage"].max()
    train = valid[valid["OccupancyPercentage"] == max_occ]

    cols = ["TrainNo", "TrainName", "TrainCategory", "OccupancyPercentage", "CoachCount"]
    result = _clean(train[cols])
    return {"train": result.to_dict(orient="records")}, 200


# -----------------------------------
# Lowest Occupancy Train
# -----------------------------------
def get_Lowest_Occupancy_Train():
    valid = trains.dropna(subset=["OccupancyPercentage"])
    if valid.empty:
        return {"error": "No occupancy data available"}, 400

    min_occ = valid["OccupancyPercentage"].min()
    train = valid[valid["OccupancyPercentage"] == min_occ]

    cols = ["TrainNo", "TrainName", "TrainCategory", "OccupancyPercentage", "CoachCount"]
    result = _clean(train[cols])
    return {"train": result.to_dict(orient="records")}, 200


# -----------------------------------
# Zone-wise Train List
# -----------------------------------
def get_ZoneVise_Trains(zone):
    zones = trains["RailwayZone"].dropna().unique()

    if zone not in zones:
        return {"error": f"Zone '{zone}' not found. Available zones: {list(zones)}"}, 400

    res = trains[trains["RailwayZone"] == zone]
    if res.empty:
        return {"error": "No trains found for given zone"}, 400

    data = _clean(res).to_dict(orient="records")
    return {"count": len(data), "trains": data}, 200


# -----------------------------------
# Category-wise Train List
# -----------------------------------
def get_CategoryVise_Trains(cat):
    cats = trains["TrainCategory"].dropna().unique()

    if cat not in cats:
        return {"error": f"Category '{cat}' not found. Available categories: {list(cats)}"}, 400

    res = trains[trains["TrainCategory"] == cat]
    if res.empty:
        return {"error": "No trains found for given category"}, 400

    data = _clean(res).to_dict(orient="records")
    return {"count": len(data), "trains": data}, 200


# -----------------------------------
# Category-wise Average Occupancy
# -----------------------------------
def get_CategoryVise_TrainsOccupancy():

    res = (
        trains
        .dropna(subset=["OccupancyPercentage"])
        .groupby("TrainCategory")["OccupancyPercentage"]
        .mean()
        .round(2)
    )
    
    print(res)

    if res.empty:
        return {"error": "No data available"}, 400

    result = {k: float(v) for k, v in res.to_dict().items()}

    return {"trains": result}, 200


# -----------------------------------
# Zone-wise Average Occupancy
# -----------------------------------
def get_ZoneVise_TrainsOccupancy():

    res = (
        trains
        .dropna(subset=["OccupancyPercentage"])
        .groupby("RailwayZone")["OccupancyPercentage"]
        .mean()
        .round(2)
    )
    print(res)
    if res.empty:
        return {"error": "No data available"}, 400

    result = {k: float(v) for k, v in res.to_dict().items()}

    return {"trains": result}, 200