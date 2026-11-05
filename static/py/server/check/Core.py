from . import engine




def MarkAnswer(playerMoves, currentState, difficulty, attempt, correctMoves, correctState):
    print(f"Player moves: {playerMoves}")
    print(f"Correct moves: {correctMoves}")

    huntResults = engine.Hunt(playerMoves, correctMoves)

    markedMoves, iterationCompleteFlag = engine.MarkMoves(difficulty, huntResults, playerMoves, correctMoves)
    markedObjects = engine.MarkObjects(difficulty, huntResults, markedMoves, playerMoves, 
                                       correctMoves, currentState, correctState, iterationCompleteFlag)

    return markedMoves, markedObjects, iterationCompleteFlag




def CheckErrors(obj, data):
    check_list = {
        "post": engine.CheckPost,
        "difficulty": engine.CheckDifficulty,
        "puzzle": engine.CheckPuzzle,
    }

    if obj not in check_list:
        print("Error: mentioned object for error check is not in the list!")
        return

    result = check_list[obj](data)
    return result
