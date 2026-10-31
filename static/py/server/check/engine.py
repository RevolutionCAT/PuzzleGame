from flask import abort
import re



def FindMatches(listA, listB):
    candidates = []
    for elementA in range(len(listA)):
        for elementB in range(len(listB)):
            length = 0
            while (elementA + length < len(listA) and elementB + length < len(listB)
                   and listA[elementA + length] == listB[elementB + length]):
                length += 1
            if length:
                candidates.append([(elementA + x, elementB + x) for x in range(length)])

    candidates.sort(key=len, reverse=True)

    matches = []
    usedA, usedB = set(), set()

    for anyMatch in candidates:
        if not any(a in usedA or b in usedB for a, b in anyMatch):
            matches.append(anyMatch)
            usedA.update(a for a, b in anyMatch)
            usedB.update(b for a, b in anyMatch)

    print(matches)
    return matches





def Hunt(playerData, correctData):
    playerMoves = [move["move"] for move in playerData]
    correctMoves = [move["move"] for move in correctData]

    matches = FindMatches(playerMoves, correctMoves)
    relatedIndexes = {i: j for group in matches for i, j in group}
    indexPairs = sorted(relatedIndexes.items())

    # find matches that break the correct sequence order
    crossed = set()
    for x, (i, j) in enumerate(indexPairs):
        for k, l in indexPairs[x+1:]:
            if j > l:
                crossed.update((i, k))


    greenMovesIX = set()
    yellowMovesIX = set()
    grayMovesIX = set()

    for i, j in relatedIndexes.items():
        playerObjects = [playerData[i]["objects"]["main"], *playerData[i]["objects"]["additional"]]
        correctObjects = [correctData[j]["objects"]["main"], *correctData[j]["objects"]["additional"]]

        if playerObjects != correctObjects:
            grayMovesIX.add(i)
        elif i in crossed:
            yellowMovesIX.add(i)
        else:
            greenMovesIX.add(i)
            
        print(playerObjects)
        print(correctObjects)
    print(playerMoves)
    print(correctMoves)

    return {
        "relatedIndexes": relatedIndexes,
        "greenMoves": greenMovesIX,
        "yellowMoves": yellowMovesIX,
        "grayMoves": grayMovesIX,
    }




def MarkMoves(difficulty, huntResults, playerMoves, correctMoves):
    markedMoves = []

    iterationComplete = True if playerMoves == correctMoves else False
    if iterationComplete:
        for i, move in enumerate(playerMoves):
            markedMoves.append({"move": move, "mark": "green"})
        return markedMoves, iterationComplete


    for i, move in enumerate(playerMoves):
        if i in huntResults["greenMoves"]:
            mark = "green"
        elif i in huntResults["yellowMoves"]:
            mark = "yellow"
        else:
            mark = "gray"

       # print(mark)
        markedMoves.append({"move": move, "mark": mark})
    return markedMoves, iterationComplete




def OverrideMark(previous, current):
    if previous is None:
        return current
    if previous == "gray" or current == "gray":
        return "gray"
    if previous == "yellow" or current == "yellow":
        return "yellow"
    return "green"




def CheckExceptions(markedObjectsRaw, barsID, huntResults, correctMoves, requiredCounts, correctCounts, 
                    currentPuzzleState, correctPuzzleState, wrongObjects):
    usedCorrect = {j for i, j in huntResults["relatedIndexes"].items() if i not in huntResults["grayMoves"]}
    currentPositions = {bar["index"]: i for i, bar in enumerate(currentPuzzleState)}
    targetPositions = {bar["index"]: i for i, bar in enumerate(correctPuzzleState)}

    # Account for every correct interaction that the player missed
    for j, move in enumerate(correctMoves):
        if j not in usedCorrect:
            expectedObjects = [move["objects"]["main"], *move["objects"]["additional"]]

            for obj in expectedObjects:
                markedObjectsRaw[obj] = OverrideMark(markedObjectsRaw.get(obj), "gray")
    
    for obj in barsID:
        if (requiredCounts[obj] > 0 and correctCounts[obj] == requiredCounts[obj]
            and currentPositions.get(obj) == targetPositions.get(obj) and markedObjectsRaw[obj] == "gray"
            and obj not in wrongObjects):
            markedObjectsRaw[obj] = "yellow"
    
    # Bars that were never involved in any required or incorrect move
    for obj in barsID:
        if markedObjectsRaw[obj] is None:
            markedObjectsRaw[obj] = "green"

    return markedObjectsRaw





def MarkObjects(difficulty, huntResults, markedMoves, playerMoves, correctMoves, 
                currentPuzzleState, correctPuzzleState, iterationComplete):
    barsID = [bar["index"] for bar in currentPuzzleState]
    if iterationComplete:
        return [{"object": obj, "mark": "green"} for obj in barsID] #return markedObjects


    markedObjectsRaw = {obj: None for obj in barsID}
    requiredCounts = {obj: 0 for obj in barsID}
    correctCounts = {obj: 0 for obj in barsID}

    for move in correctMoves:
        for obj in [move["objects"]["main"], *move["objects"]["additional"]]:
            requiredCounts[obj] += 1



    wrongObjects = set()
    for i in range(len(playerMoves)):
        consideredObjects = [playerMoves[i]["objects"]["main"], *playerMoves[i]["objects"]["additional"]]
        correctIndex = huntResults["relatedIndexes"].get(i)

        if correctIndex is not None:
            if i in huntResults["grayMoves"]:
                marks = ["gray"] * len(consideredObjects)
                wrongObjects.update(consideredObjects)
            else:
                marks = [
                    "green" if i in huntResults["greenMoves"] else "yellow"
                    for obj in consideredObjects
                ]
        else:
            marks = [markedMoves[i]["mark"]] * len(consideredObjects)

        for obj, mark in zip(consideredObjects, marks):
            previous = markedObjectsRaw.get(obj)
            markedObjectsRaw[obj] = OverrideMark(previous, mark)


    markedObjectsRaw = CheckExceptions(markedObjectsRaw, barsID, huntResults, correctMoves, 
                                       requiredCounts, correctCounts, currentPuzzleState, correctPuzzleState, wrongObjects)

    markedObjects = [{"object": obj, "mark": markedObjectsRaw[obj]} for obj in barsID]
    return markedObjects






# ==================================== Retrieve and check data =============================================
def CheckPost(data):
    try:
        current_iteration = int(data["currentIteration"])
        puzzle_state = data["currentPuzzleState"]
        player_guess = data["currentPlayerMoves"]
        attempt = data["attempt"]
    except (KeyError, TypeError, ValueError):
        print("Error 400: A user got an issue with input in POST. \nLikely causes: \n   A field is missing" \
        "\n   Wrong type inside JSON \n   Iteration is null \n   Wrong format of iteration - cannot be converted by int()")
        abort(400)
    return current_iteration, puzzle_state, player_guess, attempt


def CheckDifficulty(data):
    _cache = data["_cache"]
    difficulty = data["difficulty"]

    entry = _cache.get(f"response_{difficulty}")
    if entry is None:
        print(f"Error 404: Problems with difficulty. KeyError: 'response_{difficulty}' does not exist.")
        abort(404)
    return entry


def CheckPuzzle(data):
    entry = data["entry"]["forSolutionCheck"]
    current_iteration = data["current_iteration"]

    try:
        moves = [{"move": move, "objects": obj} for move, obj in 
                  zip(entry["stepsBI"][f"i{current_iteration}"], entry["movedObjectsBI"][f"i{current_iteration}"])]        
        target_state = entry["targetStatesBI"][f"i{current_iteration}"]
    except (KeyError, IndexError):
        print("Error 404: Error with iteration.")
        abort(404)
    return moves, target_state

