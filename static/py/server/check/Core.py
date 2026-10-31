from . import engine



'''def FindRelatedIndexes(playerMoves, correctMoves):
    dp = [[0] * (len(correctMoves) + 1) for _ in range(len(playerMoves) + 1)]

    for i in range(len(playerMoves) - 1, -1, -1):
        for j in range(len(correctMoves) - 1, -1, -1):
            if playerMoves[i]["move"] == correctMoves[j]:
                dp[i][j] = 1 + dp[i + 1][j + 1]
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j + 1])

    matches = {}
    i = j = 0

    while i < len(playerMoves) and j < len(correctMoves):
        if playerMoves[i]["move"] == correctMoves[j]:
            matches[i] = j
            i += 1
            j += 1
        elif dp[i + 1][j] > dp[i][j + 1]:
            i += 1
        else:
            j += 1

    return matches'''



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
