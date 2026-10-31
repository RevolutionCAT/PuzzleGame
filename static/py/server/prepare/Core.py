from . import engine, generators
from datetime import date
import threading




_lock = threading.Lock()
def UpdateData(ALGO_DIR, _cache, available_difficulties):
    today = date.today().isoformat()

    if _cache["date"] != today:
        with _lock:
            temp_cache = {}
            RenewData(today, ALGO_DIR, temp_cache, available_difficulties)
            temp_cache["date"] = today
            _cache.update(temp_cache)
    return _cache



 
def RenewData(today, ALGO_DIR, _cache, available_difficulties):
    algorithms = engine.ListAlgorithms(ALGO_DIR)
    seed = generators.GenerateSeed(today)

    for difficulty in available_difficulties: #one puzzle for each existing difficulty
        localSeed = generators.GenerateSeed(f"{seed}" + f"_{difficulty}")

        chosenAlgorithm = engine.SelectAlgorithm(algorithms, localSeed)
        
        puzzleData, simulationResult, localSeed, attempts = engine.GenerateValidPuzzle(chosenAlgorithm, difficulty, localSeed)

        chosenMode = engine.SelectMode(simulationResult["compatibleWith"], localSeed)

        forCache = SimplifyData(puzzleData, chosenMode, simulationResult, attempts)

        _cache[f"response_{difficulty}"] = {
            "forGameStart": forCache[0],
            "forSolutionCheck": forCache[1], 
            }



def SimplifyData(puzzleData, chosenMode, simulationResult, attempts):
    notNeededKeys = {"puzzle"}
    additional = {key: var for key, var in puzzleData.items() if key not in notNeededKeys}
    
    forGameStart = {
        "puzzle": puzzleData["puzzle"],
        "additional": additional,
        "mode": chosenMode,
        "attempts": attempts,
        "puzzleDifficulty": simulationResult["puzzleDifficulty"],
        }
    forSolutionCheck = {
        "stepsBI": simulationResult["stepsBI"],
        "movedObjectsBI": simulationResult["movedObjectsBI"],
        "targetStatesBI": simulationResult["targetStatesBI"],
        }
    return [forGameStart, forSolutionCheck]