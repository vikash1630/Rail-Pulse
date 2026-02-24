# controller.py
# This file handles logic like filtering and processing data

from src.model import fetch_all_trains


def get_train_by_number(train_no):
    """
    Returns train details for given train number.
    """

    # Get dataframe from model
    df = fetch_all_trains()

    # If file not found
    if df is None:
        return {"error": "Data file not found"}

    # Filter train by train number
    result = df[df["TrainNo"] == train_no]

    # If train not found
    if result.empty:
        return {"error": "Train not found"}

    # Convert single row to dictionary
    train_data = result.iloc[0].to_dict()

    return train_data

def get_train_by_name(train_name):

    df = fetch_all_trains()

    if df is None:
        return {"error": "Data file Not Found"}

    try:
        result = df[df["TrainName"] == train_name]

        if result.empty:
            return {"message": "No Train Found"}

        # Convert all rows safely to dictionary
        trains = result.to_dict(orient="records")

        return {
            "count": len(trains),
            "trains": trains
        }

    except Exception as e:
        return {"error": str(e)}