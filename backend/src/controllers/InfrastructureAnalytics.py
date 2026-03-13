# Infrastructure Analytics Controller

from src.models.getTrainDetails import fetch_all_trains

df = fetch_all_trains()
status = 200


# -----------------------------------
# Average Platforms
# -----------------------------------
def average_platforms():

    if df is None:
        return {"error": "Data file not found"}, 500

    avg_platform = df["PlatformCountAtOrigin"].mean()

    return {
        "average_platforms": round(avg_platform, 2)
    }, status


# -----------------------------------
# High Capacity Stations
# -----------------------------------
def high_capacity_stations():

    if df is None:
        return {"error": "Data file not found"}, 500

    data = (
        df[["StartingPoint", "PlatformCountAtOrigin"]]
        .sort_values(by="PlatformCountAtOrigin", ascending=False)
        .drop_duplicates("StartingPoint")
    )

    stations = data.to_dict(orient="records")

    return {
        "count": len(stations),
        "stations": stations
    }, status


# -----------------------------------
# Coach Capacity Analysis
# -----------------------------------
def coach_capacity_analysis():

    if df is None:
        return {"error": "Data file not found"}, 500

    stats = df["CoachCount"].describe()

    return {
        "min_coaches": int(stats["min"]),
        "max_coaches": int(stats["max"]),
        "average_coaches": round(stats["mean"], 2)
    }, status


# -----------------------------------
# Platform Range Per Station
# -----------------------------------
def platform_range_per_station():

    if df is None:
        return {"error": "Data file not found"}, 500

    data = (
        df.groupby("StartingPoint")["PlatformCountAtOrigin"]
        .agg(MinPlatforms="min", MaxPlatforms="max")
        .reset_index()
    )

    data["PlatformRange"] = (
        data["MinPlatforms"].astype(str) +
        "-" +
        data["MaxPlatforms"].astype(str)
    )

    stations = data.to_dict(orient="records")

    return {
        "count": len(stations),
        "stations": stations
    }, status