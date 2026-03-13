

import pandas as pd
from src.models.getTrainDetails import fetch_all_trains

trains = fetch_all_trains()
status = 200



def get_Train_By_Star_End_points(start, end):

    res = trains[(trains["StartingPoint"] == start) & (trains["FinalDestination"] == end)]

    if not res.empty:
        data = res.to_dict(orient="records")

        return {
            "count": len(data),
            "trains": data
        }, 200

    return {"error": "Invalid Stops or Train Not found"}, 404

def get_Train_By_Stops(start,stop):
            
        data = trains[(trains["StartingPoint"]==start) & (trains["FinalDestination"]==stop)]
        def valid_route(stops):
            stations = [s.strip() for s in stops.split("|")]

            if start in stations and stop in stations:
                return stations.index(start) < stations.index(stop)

            return False

        res = pd.concat([data, trains[trains["stops"].apply(valid_route)]]).drop_duplicates()

        if not data.empty:
            data = res.to_dict(orient="records")
            return {
                 "count": len(data),
                 "trains": data
            }, 200

        return {"error": "Invalid Stops or Train Not Found"}, 400

def get_longest_Journey_train():
    
    train = trains[trains["Distance_km"]==trains["Distance_km"].max()]
    distance = int(train["Distance_km"].iloc[0])
    if train.empty:
         return {"error": "No Train Found"}, 400
    train = train.to_dict(orient="records")
    return {
         "distance": distance,
         "train": train
    }, 200

def get_Shortest_Journey_train():
    
    train = trains[trains["Distance_km"]==trains["Distance_km"].min()]
    distance = int(train["Distance_km"].iloc[0])
    if train.empty:
         return {"error": "No Train Found"}, 400
    train = train.to_dict(orient="records")
    return {
         "distance": distance,
         "train": train
    }, 200

def get_train_route_by_name(name):
     train = trains[trains["TrainName"]==name]
     if train.empty:
          return {"error":"No Trains Found"}, 400
     train = train[["TrainNo","TrainName","stops"]]
     train = train.to_dict(orient="records")
     return {
          "count": len(train),
          "train": train,
     }, 200

def get_train_route_by_num(num):
     train = trains[trains["TrainNo"]==num]
     if train.empty:
          return {"error":"No Trains Found"}, 400
     train = train[["TrainNo","TrainName","stops"]]
     train = train.to_dict(orient="records")
     return {
          "count": len(train),
          "train": train,
     }, 200






