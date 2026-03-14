import pandas as pd
from src.models.getTrainDetails import fetch_all_trains

df = fetch_all_trains()


# -----------------------------------
# Helper — sanitize NaN → None
# -----------------------------------
def _clean(frame):
    return frame.where(pd.notna(frame), other=None)


# -----------------------------------
# Average Platforms
# -----------------------------------
def average_platforms():
    if df is None:
        return {"error": "Data file not found"}, 500

    avg_platform = df["PlatformCountAtOrigin"].mean()

    return {
        "average_platforms": round(float(avg_platform), 2)
    }, 200


# -----------------------------------
# High Capacity Stations
# (sorted descending, one row per origin)
# -----------------------------------
def high_capacity_stations():
    if df is None:
        return {"error": "Data file not found"}, 500

    data = (
        df[["StartingPoint", "PlatformCountAtOrigin"]]
        .dropna(subset=["PlatformCountAtOrigin"])
        .sort_values(by="PlatformCountAtOrigin", ascending=False)
        .drop_duplicates("StartingPoint")
    )

    # convert int64 → plain int so jsonify is happy
    data = data.copy()
    data["PlatformCountAtOrigin"] = data["PlatformCountAtOrigin"].astype(int)

    stations = data.to_dict(orient="records")

    return {
        "count": len(stations),
        "stations": stations
    }, 200


# -----------------------------------
# Coach Capacity Analysis
# -----------------------------------
def coach_capacity_analysis():
    if df is None:
        return {"error": "Data file not found"}, 500

    valid = df["CoachCount"].dropna()
    if valid.empty:
        return {"error": "No coach data available"}, 400

    return {
        "min_coaches": int(valid.min()),
        "max_coaches": int(valid.max()),
        "average_coaches": round(float(valid.mean()), 2)
    }, 200


# -----------------------------------
# Platform Range Per Station
# -----------------------------------
def platform_range_per_station():
    if df is None:
        return {"error": "Data file not found"}, 500

    data = (
        df
        .dropna(subset=["PlatformCountAtOrigin"])
        .groupby("StartingPoint")["PlatformCountAtOrigin"]
        .agg(MinPlatforms="min", MaxPlatforms="max")
        .reset_index()
    )

    data["MinPlatforms"] = data["MinPlatforms"].astype(int)
    data["MaxPlatforms"] = data["MaxPlatforms"].astype(int)

    data["PlatformRange"] = (
        data["MinPlatforms"].astype(str) +
        "-" +
        data["MaxPlatforms"].astype(str)
    )

    stations = data.to_dict(orient="records")

    return {
        "count": len(stations),
        "stations": stations
    }, 200