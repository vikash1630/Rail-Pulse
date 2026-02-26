# controller.py
# Handles filtering and processing logic

from src.model import fetch_all_trains

df = fetch_all_trains()
status = 200

# -----------------------------------
# Get Train By Number
# -----------------------------------
def get_train_by_number(train_no):

    if df is None:
        return {"error": "Data file not found"}, 500

    result = df[df["TrainNo"] == train_no]

    if result.empty:
        return {"error": "Train not found"}, 404

    train_data = result.iloc[0].to_dict()

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

    trains = result.to_dict(orient="records")

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
        "train1": t1.iloc[0].to_dict(),
        "train2": t2.iloc[0].to_dict()
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
        "train1": t1.iloc[0].to_dict(),
        "train2": t2.iloc[0].to_dict()
    }, status

def getTrainRoutes(train):

    if df is None:
        return {"error": "Data file not found"}, 500

    try:
        train = str(train)
    except:
        return {"error": "Train Not Found"}

    cols = ['TrainNo','TrainName','TrainCategory',
            'StartingPoint','FinalDestination',
            'from_lat','from_lng','to_lat','to_lng','stops']

    data = df[df["TrainName"] == train]
    ans = data[cols].to_dict(orient="records")

    return ans, status

