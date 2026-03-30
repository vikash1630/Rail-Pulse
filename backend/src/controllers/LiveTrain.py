import requests   # ✅ REQUIRED

BASE_URL = "https://rappid.in/apis/train.php"


def get_live_train_status(train_no):
    if not train_no:
        return {"error": "Train number required"}, 400

    try:
        url = f"{BASE_URL}?train_no={train_no}"
        response = requests.get(url)

        if response.status_code != 200:
            return {"error": "Failed to fetch data"}, 500

        data = response.json()

        if not data.get("success"):
            return {"error": "Invalid Train Number"}, 404

        # ✅ FULL RAW DATA + EXTRA ANALYTICS
        stations = data.get("data", [])

        total_stations = len(stations)
        delayed_stations = sum(
            1 for s in stations if "min" in str(s.get("delay"))
        )
        on_time_stations = sum(
            1 for s in stations if "On Time" in str(s.get("delay"))
        )

        return {
            "meta": {
                "api": "rappid_live_train",
                "status": "success"
            },

            # 🔴 FULL ORIGINAL DATA (IMPORTANT)
            "raw": data,

            # 🟢 CLEAN STRUCTURED DATA
            "summary": {
                "train_name": data.get("train_name"),
                "current_status": data.get("message"),
                "updated_time": data.get("updated_time"),
                "total_stations": total_stations,
                "delayed_stations": delayed_stations,
                "on_time_stations": on_time_stations
            },

            # 🔵 STATIONS LIST (UNCHANGED)
            "stations": stations

        }, 200

    except Exception as e:
        return {"error": str(e)}, 500