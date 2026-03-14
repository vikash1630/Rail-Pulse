from src.models.getTrainDetails import fetch_all_trains

trains = fetch_all_trains()


def HighestRevenue_Train():
    revenue = trains["Revenue_INR"].max()

    return {
        "highest_revenue": float(revenue)
    }, 200


def LowestRevenue_Train():
    revenue = trains["Revenue_INR"].min()

    return {
        "lowest_revenue": float(revenue)
    }, 200


def AverageRevenue_Train():
    avg_revenue = trains["Revenue_INR"].mean()

    return {
        "average_revenue": float(avg_revenue)
    }, 200


def RevenueBy_cat(cat):

    if not cat:
        return {"error": "Category parameter required"}, 400

    df = trains[trains["TrainCategory"] == cat]

    if df.empty:
        return {"error": "Invalid Category"}, 404

    avg_revenue = df["Revenue_INR"].mean()

    return {
        "category": cat,
        "count": len(df),
        "average_revenue": float(avg_revenue)
    }, 200


def RevenueBy_Zone(zone):

    if not zone:
        return {"error": "Zone parameter required"}, 400

    df = trains[trains["RailwayZone"] == zone]

    if df.empty:
        return {"error": "Invalid Zone"}, 404

    avg_revenue = df["Revenue_INR"].mean()

    return {
        "zone": zone,
        "count": len(df),
        "average_revenue": float(avg_revenue)
    }, 200

def RevenueBy_num(train_no):

    if not train_no:
        return {"error": "Train number required"}, 400

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

    df = trains[trains["TrainName"] == name]

    if df.empty:
        return {"error": "Invalid Train Name"}, 404

    trains_list = []

    for _, row in df.iterrows():
        trains_list.append({
            "TrainNo": int(row["TrainNo"]),
            "TrainName": row["TrainName"],
            "Revenue": float(row["Revenue_INR"]),
            "stops": row["stops"],
            "distance": float(row["Distance_km"])
        })

    net_revenue = df["Revenue_INR"].sum()

    return {
        "train_name": name,
        "count": len(df),
        "net_revenue": float(net_revenue),
        "trains": trains_list
    }, 200

def TotalRevenue_Trains():

    total_revenue = trains["Revenue_INR"].sum()

    return {
        "total_revenue": float(total_revenue),
        "total_trains": int(len(trains))
    }, 200