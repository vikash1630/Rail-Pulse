from src.models.getTrainDetails import fetch_all_trains

def _get_trains():
    return fetch_all_trains()

def HighestRevenue_Train():
    trains = _get_trains()
    revenue = trains["Revenue_INR"].max()
    return {"highest_revenue": float(revenue)}, 200

def LowestRevenue_Train():
    trains = _get_trains()
    revenue = trains["Revenue_INR"].min()
    return {"lowest_revenue": float(revenue)}, 200

def AverageRevenue_Train():
    trains = _get_trains()
    return {"average_revenue": float(trains["Revenue_INR"].mean())}, 200

def TotalRevenue_Trains():
    trains = _get_trains()
    return {
        "total_revenue": float(trains["Revenue_INR"].sum()),
        "total_trains": int(len(trains))
    }, 200

def RevenueBy_cat(cat):
    if not cat:
        return {"error": "Category parameter required"}, 400
    trains = _get_trains()
    df = trains[trains["TrainCategory"] == cat]
    if df.empty:
        return {"error": "Invalid Category"}, 404
    return {
        "category": cat,
        "count": len(df),
        "average_revenue": float(df["Revenue_INR"].mean())
    }, 200

def RevenueBy_Zone(zone):
    if not zone:
        return {"error": "Zone parameter required"}, 400
    trains = _get_trains()
    df = trains[trains["RailwayZone"] == zone]
    if df.empty:
        return {"error": "Invalid Zone"}, 404
    return {
        "zone": zone,
        "count": len(df),
        "average_revenue": float(df["Revenue_INR"].mean())
    }, 200

def RevenueBy_num(train_no):
    if not train_no:
        return {"error": "Train number required"}, 400
    trains = _get_trains()
    df = trains[trains["TrainNo"] == int(train_no)]
    if df.empty:
        return {"error": "Invalid Train Number"}, 404
    row = df.iloc[0]
    return {
        "TrainNo": int(row["TrainNo"]),
        "TrainName": row["TrainName"],
        "Revenue": float(row["Revenue_INR"]),
        "stops": row["stops"],
        "distance": float(row["Distance_km"]),
        "count": 1,
        "net_revenue": float(row["Revenue_INR"])
    }, 200

def RevenueBy_name(name):
    if not name:
        return {"error": "Train name required"}, 400
    trains = _get_trains()
    df = trains[trains["TrainName"] == name]
    if df.empty:
        return {"error": "Invalid Train Name"}, 404
    trains_list = [
        {
            "TrainNo": int(row["TrainNo"]),
            "TrainName": row["TrainName"],
            "Revenue": float(row["Revenue_INR"]),
            "stops": row["stops"],
            "distance": float(row["Distance_km"])
        }
        for _, row in df.iterrows()
    ]
    return {
        "train_name": name,
        "count": len(df),
        "net_revenue": float(df["Revenue_INR"].sum()),
        "trains": trains_list
    }, 200