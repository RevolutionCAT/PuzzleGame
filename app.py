from flask import Flask, render_template, jsonify
from datetime import date
import os

app = Flask(__name__)

ALGORITHMS_DIR = os.path.join(app.static_folder, "js", "algorithms")

_cache = {
    "date": None,
    "algorithms": None,
}



KNOWN_SUFFIXES = ["_default", "_optimized", "_unoptimized", "_biDirectional"]

def ManageVariations(filename):
    for suffix in KNOWN_SUFFIXES:
        if filename.endswith(suffix):
            base = filename[: -len(suffix)]
            variant = suffix.lstrip("_")
            return base, variant

    return filename, "default"


def ListAlgorithms():
    result = {}

    for type_name in os.listdir(ALGORITHMS_DIR):
        type_path = os.path.join(ALGORITHMS_DIR, type_name)
        if not os.path.isdir(type_path):
            continue

        variations_of = {}
        for filename in os.listdir(type_path):
            if not filename.endswith(".js"):
                continue

            algorithm_name = filename[:-3]
            base, variation = ManageVariations(algorithm_name)

            if base not in variations_of:
                variations_of[base] = []
            variations_of[base].append(variation)

        result[type_name] = variations_of

    print(result)
    return result



def DailyData():
    today = date.today().isoformat()

    if _cache["date"] != today:
        _cache["date"] = today
        _cache["algorithms"] = ListAlgorithms()
    return _cache



@app.route("/")
def home():
    return render_template("game.html")

@app.route("/api/date")
def get_date():
    data = DailyData()
    return jsonify({"date": data["date"],
                    "algorithms": data["algorithms"]})

if __name__ == "__main__":
    #app.run()
    app.run(debug=True)