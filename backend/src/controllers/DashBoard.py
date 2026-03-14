from src.models.getTrainDetails import fetch_all_trains

trains = fetch_all_trains()
status = 200


def DashBoard():

    # ── Clean Base Data ───────────────────────────────────────────
    df = trains.copy()

    # Ensure numeric columns are valid
    numeric_cols = [
        "AverageSpeed_kmph","Distance_km","OccupancyPercentage",
        "PunctualityScore","DelayProbability","Rating","Revenue_INR"
    ]

    for col in numeric_cols:
        df[col] = df[col].apply(lambda x: float(x) if str(x).replace(".","",1).isdigit() else None)

    # ── Core Network Metrics ──────────────────────────────────────
    Total_Trains = int(df.shape[0])
    Unique_Railway_Zones = int(df["RailwayZone"].dropna().str.strip().nunique())
    Unique_Routes = int(df["stops"].dropna().nunique())

    # ── Total Unique Stations (high accuracy method) ──────────────
    stops_series = (
        df["stops"]
        .dropna()
        .astype(str)
        .str.split("|")
        .explode()
        .str.strip()
    )

    start_points = df["StartingPoint"].dropna().astype(str).str.strip()
    end_points = df["FinalDestination"].dropna().astype(str).str.strip()

    all_stations = set(stops_series) | set(start_points) | set(end_points)

    Total_Stations = len(all_stations)

    # ── Performance Averages ──────────────────────────────────────
    Avg_Speed       = round(df["AverageSpeed_kmph"].mean(), 2)
    Avg_Dist        = round(df["Distance_km"].mean(), 2)
    Avg_Occupancy   = round(df["OccupancyPercentage"].mean(), 2)
    Avg_Punctuality = round(df["PunctualityScore"].mean(), 2)
    Avg_Delay_Prob  = round(df["DelayProbability"].mean(), 2)
    Avg_Rating      = round(df["Rating"].mean(), 2)

    # Electrified route percentage (case insensitive)
    Electrified_Pct = round(
        (df["ElectrifiedRoute"]
        .astype(str)
        .str.strip()
        .str.upper()
        .eq("YES")
        .mean() * 100), 2
    )

    # Total revenue
    Total_Revenue_INR = int(df["Revenue_INR"].fillna(0).sum())

    # ── Breakdowns ───────────────────────────────────────────────
    Category_Breakdown = (
        df["TrainCategory"]
        .dropna()
        .str.strip()
        .value_counts()
        .to_dict()
    )

    Zone_Breakdown = (
        df["RailwayZone"]
        .dropna()
        .str.strip()
        .value_counts()
        .to_dict()
    )

    # ── Top Punctual Trains ──────────────────────────────────────
    top_cols = [
        "TrainNo","TrainName","TrainCategory","StartingPoint",
        "FinalDestination","PunctualityScore","AverageSpeed_kmph",
        "Distance_km","RailwayZone"
    ]

    Top_Punctual_Trains = (
        df.nlargest(10, "PunctualityScore")[top_cols]
        .fillna("")
        .assign(TrainNo=lambda d: d["TrainNo"].astype(str))
        .to_dict(orient="records")
    )

    # ── High Delay Risk Trains ───────────────────────────────────
    delay_cols = [
        "TrainNo","TrainName","TrainCategory","StartingPoint",
        "FinalDestination","DelayProbability","AverageSpeed_kmph",
        "Distance_km","RailwayZone"
    ]

    # works for both 0-1 and 0-100 formats
    delay_threshold = 0.7 if df["DelayProbability"].max() <= 1 else 70

    High_Delay_Risk_Trains = (
        df[df["DelayProbability"] > delay_threshold]
        .nlargest(10, "DelayProbability")[delay_cols]
        .fillna("")
        .assign(TrainNo=lambda d: d["TrainNo"].astype(str))
        .to_dict(orient="records")
    )

    return {
        "Total_Trains": Total_Trains,
        "Unique_Railway_Zones": Unique_Railway_Zones,
        "Unique_Routes": Unique_Routes,
        "Total_Stations": Total_Stations,

        "Average_Speed": Avg_Speed,
        "Average_Distance": Avg_Dist,
        "Average_Occupancy": Avg_Occupancy,
        "Average_Punctuality": Avg_Punctuality,
        "Average_Delay_Prob": Avg_Delay_Prob,
        "Average_Rating": Avg_Rating,
        "Electrified_Pct": Electrified_Pct,
        "Total_Revenue_INR": Total_Revenue_INR,

        "Category_Breakdown": Category_Breakdown,
        "Zone_Breakdown": Zone_Breakdown,

        "Top_Punctual_Trains": Top_Punctual_Trains,
        "High_Delay_Risk_Trains": High_Delay_Risk_Trains
    }, status