from flask import Flask, render_template, jsonify, abort, request, session
from datetime import date
import static.py.server.prepare.Core as prepCore
import static.py.server.check.Core as gameCore
import os


app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "CHANGE LATER")
ALGO_DIR = os.path.join("static", "py", "algorithms")
available_difficulties = ["easy", "medium", "hard", "insane", "fun"]



_cache = {
    "date": None, # date in iso format
    "response_easy": None,
    "response_medium": None,   #each response: {forGameStart: x, forSolutionCheck: y} - see SimplifyData()
    "response_hard": None,
    "response_insane": None,
    "response_fun": None,
}




# get information - api interaction
@app.route("/api/today_puzzle/", defaults={"difficulty": "medium"})
@app.route("/api/today_puzzle/<difficulty>")
def GetTodayPuzzle(difficulty):
    if difficulty not in available_difficulties:
        print(f"Error 404: Difficulty is not in available difficulties ({difficulty})")
        abort(404)
    prepCore.UpdateData(ALGO_DIR, _cache, available_difficulties)
    return jsonify({"response": _cache[f"response_{difficulty}"]["forGameStart"]})




@app.route("/api/<difficulty>/guess/", methods=["POST"])
def CheckGuess(difficulty):
    post_data = request.get_json(silent=True) or {}

    current_iteration, puzzle_state, player_guess, attemptNumber = gameCore.CheckErrors("post", post_data)
    entry = gameCore.CheckErrors("difficulty", {"_cache": _cache, "difficulty": difficulty})
    correctSteps, target_state = gameCore.CheckErrors("puzzle", {"entry": entry, "current_iteration": current_iteration})

    lastIteration = len(_cache[f"response_{difficulty}"]["forSolutionCheck"]["stepsBI"]) #counts total iterations
    max_attempts = entry["forGameStart"]["attempts"]


    today = date.today().isoformat()
    if session.get("date") != today:
        session.clear()
        session["date"] = today # reset session when its a new day


    attempts = session.setdefault("attempts", {}) # returns the set amount of attempts
    attempt = f"{difficulty}:{current_iteration}"  #change the format to a string cus json works with strings, not tuple or smth
    attemptNumber = attempts.get(attempt, 0)

    markedMoves, markedObjects, iterationCompleteFlag = gameCore.MarkAnswer(player_guess, puzzle_state, difficulty,
                                                                         attemptNumber, correctSteps, target_state)

    attempts[attempt] = attemptNumber
    if not iterationCompleteFlag:
        attempts[attempt] = attemptNumber + 1


    def CheckGameEnd():
        print("Attempt: ", attempts[attempt])
        if attempts[attempt] >= max_attempts:
            return "lost"
        if attempts[attempt] <= max_attempts and iterationCompleteFlag and current_iteration == lastIteration:
            return "won"
        return "continue"
    

    gameState = CheckGameEnd()
    print(attempts[attempt])
    respond = {"markedMoves": markedMoves, "markedBars": markedObjects, 
               "iterationComplete": iterationCompleteFlag, "newAttempt": attempts[attempt]}

    if gameState in ("lost", "won"):
        print("A player has ended the game.")
        respond.update(EndGame(gameState))
        attempts.clear() # remove that later
    session.modified = True

    return jsonify(respond)
    



def EndGame(result):
    if result == "won":
        data = GameWonData
    elif result == "lost":
        data = GameLostData
    return {"result": result, "text": data["text"]}



GameWonData = {
    "text": "You won!"
}

GameLostData = {
    "text": "You lost!"
}


# web pages
@app.route("/")
def home():
    return render_template("game.html")


if __name__ == "__main__":
    #app.run()
    app.run(debug=True)