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