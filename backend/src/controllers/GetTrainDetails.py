# controller.py
# Handles filtering and processing logic

import math
from src.models.getTrainDetails import fetch_all_trains

df = fetch_all_trains()

status = 200


# -----------------------------------
# NaN / Infinity sanitizer
# JSON does not support NaN or Infinity.
# Pandas fills missing CSV cells with float('nan').
# This replaces every NaN/Inf with None → serializes as JSON null.
# -----------------------------------
def sanitize(record: dict) -> dict:
    """Replace NaN / Infinity float values with None for safe JSON serialization."""
    clean = {}
    for k, v in record.items():
        if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
            clean[k] = None
        else:
            clean[k] = v
    return clean


def sanitize_list(records: list) -> list:
    """Sanitize a list of record dicts."""
    return [sanitize(r) for r in records]


# -----------------------------------
# Get Train By Number
# -----------------------------------
def get_train_by_number(train_no):

    if df is None:
        return {"error": "Data file not found"}, 500

    result = df[df["TrainNo"] == train_no]

    if result.empty:
        return {"error": "Train not found"}, 404

    train_data = sanitize(result.iloc[0].to_dict())   # ✅ sanitized

    return train_data, status


# -----------------------------------
# Get Train By Name
# -----------------------------------
def get_train_by_name(train_name):

    if df is None:
        return {"error": "Data file not found"}, 500

    result = df[
        df["TrainName"].str.strip().str.lower()
        == train_name.strip().lower()
    ]

    if result.empty:
        return {"error": "Train not found"}, 404

    trains = sanitize_list(result.to_dict(orient="records"))   # ✅ sanitized

    return {
        "count": len(trains),
        "trains": trains
    }, status


# -----------------------------------
# Compare Trains By Number
# -----------------------------------
def compare_trains_by_number(train1, train2):

    if df is None:
        return {"error": "Data file not found"}, 500

    try:
        train1 = int(train1)
        train2 = int(train2)
    except ValueError:
        return {"error": "Train numbers must be integers"}, 400

    t1 = df[df["TrainNo"] == train1]
    t2 = df[df["TrainNo"] == train2]

    if t1.empty or t2.empty:
        return {"error": "One or both train numbers not found"}, 404

    return {
        "train1": sanitize(t1.iloc[0].to_dict()),   # ✅ sanitized
        "train2": sanitize(t2.iloc[0].to_dict())    # ✅ sanitized
    }, status


# -----------------------------------
# Compare Trains By Name
# -----------------------------------
def compare_trains_by_name(train1, train2):

    if df is None:
        return {"error": "Data file not found"}, 500

    t1 = df[
        df["TrainName"].str.strip().str.lower()
        == train1.strip().lower()
    ]

    t2 = df[
        df["TrainName"].str.strip().str.lower()
        == train2.strip().lower()
    ]

    if t1.empty or t2.empty:
        return {"error": "One or both train names not found"}, 404

    return {
        "train1": sanitize(t1.iloc[0].to_dict()),   # ✅ sanitized
        "train2": sanitize(t2.iloc[0].to_dict())    # ✅ sanitized
    }, status


# -----------------------------------
# Get Train Routes
# -----------------------------------
def getTrainRoutes(train):

    if df is None:
        return {"error": "Data file not found"}, 500

    try:
        train = str(train)
    except:
        return {"error": "Train Not Found"}, 400

    cols = ['TrainNo', 'TrainName', 'TrainCategory',
            'StartingPoint', 'FinalDestination',
            'from_lat', 'from_lng', 'to_lat', 'to_lng', 'stops']

    # Only keep cols that actually exist in the DataFrame
    existing_cols = [c for c in cols if c in df.columns]

    data = df[df["TrainName"] == train]
    ans  = sanitize_list(data[existing_cols].to_dict(orient="records"))   # ✅ sanitized

    return ans, status


# -----------------------------------
# Get Trains By Zone
# -----------------------------------
def get_train_by_zone(train_zone):

    if df is None:
        return {"error": "Data file not found"}, 500

    zones = list(df["RailwayZone"].dropna().unique())

    if train_zone not in zones:
        return {"error": "Incorrect Zone"}, 400

    res    = df[df["RailwayZone"] == train_zone]
    trains = sanitize_list(res.to_dict(orient="records"))   # ✅ sanitized

    return {
        "count": len(trains),
        "trains": trains
    }, status


# -----------------------------------
# Get Trains By Category
# -----------------------------------
def get_train_by_category(train_cat):

    if df is None:
        return {"error": "Data file not found"}, 500

    categories = list(df["TrainCategory"].dropna().unique())

    if train_cat not in categories:
        return {"error": "Incorrect Category"}, 400

    res    = df[df["TrainCategory"] == train_cat]
    trains = sanitize_list(res.to_dict(orient="records"))   # ✅ sanitized

    return {
        "count": len(trains),
        "trains": trains
    }, status


# -----------------------------------
# Get Trains By Route Type
# -----------------------------------
def get_train_by_Route_Type(RouteType):

    if df is None:
        return {"error": "Data file not found"}, 500

    trains = df[df["RouteType"] == RouteType]

    if trains.empty:
        return {"error": "Invalid route type or Trains Not Found"}, 400

    trains = sanitize_list(trains.to_dict(orient="records"))   # ✅ sanitized

    return {
        "count": len(trains),
        "trains": trains
    }, 200