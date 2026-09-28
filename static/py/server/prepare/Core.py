from . import engine, generators



def RenewData(today, ALGO_DIR, _cache, available_difficulties):
    algorithms = engine.ListAlgorithms(ALGO_DIR)
    seed = generators.GenerateSeed(today)

    for i in range(len(available_difficulties)): #one puzzle for each existing difficulty
        difficulty = available_difficulties[i]
        localSeed = generators.GenerateSeed(f"{seed}" + f"_{difficulty}")

        chosenAlgorithm = engine.SelectAlgorithm(algorithms, localSeed)
        
        puzzleData, simulationResult, localSeed = engine.GenerateValidPuzzle(chosenAlgorithm, difficulty, localSeed)

        chosenMode = engine.SelectMode(simulationResult["compatibleWith"], localSeed)

        forCache = SimplifyData(puzzleData, chosenMode, simulationResult)

        _cache[f"response_{difficulty}"] = {
            "forGameStart": forCache[0],
            "forSolutionCheck": forCache[1], 
            "forGameResults": forCache[2]
            }




def SimplifyData(puzzleData, chosenMode, simulationResult):
    notNeededKeys = {"puzzle"}
    additional = {key: var for key, var in puzzleData.items() if key not in notNeededKeys}
    
    forGameStart = {
        "puzzle": puzzleData["puzzle"],
        "additional": additional,
        "mode": chosenMode
        }
    forSolutionCheck = {
        "stepsBI": simulationResult["stepsBI"],
        "targetStatesBI": simulationResult["targetStatesBI"],
        }
    forGameResults = {
        "puzzleDifficulty": simulationResult["puzzleDifficulty"]
        }
    
    return [forGameStart, forSolutionCheck, forGameResults]