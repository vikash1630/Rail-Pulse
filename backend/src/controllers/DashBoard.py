from src.models.getTrainDetails import fetch_all_trains

trains = fetch_all_trains()
status = 200

# Phase - 1  DashBoard
def DashBoard():
    Total_Trains = trains.shape[0]
    Unique_Railway_Zones = trains["RailwayZone"].nunique()
    Unique_Routes = trains["stops"].nunique()

    arrival = trains["StartingPoint"][1].strip()
    destination = trains["FinalDestination"][1].strip()

    all_Stops = trains["stops"].str.split("|")[1]

    # remove spaces
    all_Stops = [s.strip() for s in all_Stops]

    # combine + remove duplicates
    all_Stops = list(set(all_Stops + [arrival, destination]))

    # sort stations
    Sorted_Stops = sorted(all_Stops)

    Stops_Count = len(Sorted_Stops)

    Avg_Speed = trains["AverageSpeed_kmph"].mean()
    Avg_Dist = trains["Distance_km"].mean()
    Avg_Occupancy = trains["OccupancyPercentage"].mean()
    Avg_Punctuality = trains["PunctualityScore"].mean()

    return {
        "Total_Trains": Total_Trains,
        "Unique_Railway_Zones": Unique_Railway_Zones,
        "Unique_Routes": Unique_Routes,
        "Sorted_Stops_From_Row1": Sorted_Stops,
        "Stops_Count_Row1": Stops_Count,
        "Average_Speed": Avg_Speed,
        "Average_Distance": Avg_Dist,
        "Average_Occupancy": Avg_Occupancy,
        "Average_Punctuality": Avg_Punctuality
    }, status