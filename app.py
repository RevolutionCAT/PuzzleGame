from flask import Flask, render_template, jsonify, abort
from datetime import date
import static.py.server.prepare.Core as prepCore
import os


app = Flask(__name__)
ALGO_DIR = os.path.join("static", "py", "algorithms")
available_difficulties = ["easy", "medium", "hard", "insane", "fun"]



_cache = {
    "date": None, #date iso format
    "response_easy": None,
    "response_medium": None,   #each response: {forGameStart: x, forSolutionCheck: y, forGameResults: z} - see SimplifyData()
    "response_hard": None,
    "response_insane": None,
    "response_fun": None,
}



    
def UpdateData():
    today = date.today().isoformat()

    if _cache["date"] != today:
        prepCore.RenewData(today, ALGO_DIR, _cache, available_difficulties)
        _cache["date"] = today
    return _cache




# get information - api interaction
@app.route("/api/today_puzzle/", defaults={"difficulty": "medium"})
@app.route("/api/today_puzzle/<difficulty>")
def GetTodayPuzzle(difficulty):
    if difficulty not in available_difficulties:
        abort(404)
    UpdateData()
    return jsonify({"reponse": _cache[f"response_{difficulty}"]["forGameStart"]})




@app.route("/")
def home():
    return render_template("game.html")


if __name__ == "__main__":
    #app.run()
    app.run(debug=True)