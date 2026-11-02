compatibleWith = ["bars_small", "numbers"]
recognizability = 2.0



def Simulate(original_puzzle):
    puzzle_length = len(original_puzzle)
    puzzle_copy = [{"index": f"bar{i}", "value": val} for i, val in enumerate(original_puzzle)]
    simulationDifficulty = 0.0

    steps = {}
    targetStates = {}
    moved = {}

    swapped = False
    for i in range(puzzle_length - 1):
        swapped = False
        iteration = []
        movedObj = []
        for j in range(puzzle_length - i - 1):
            # iteration.append(f"c{j}-{j+1}")
            if puzzle_copy[j]["value"] > puzzle_copy[j + 1]["value"]:
                simulationDifficulty += 0.5

                iteration.append(f"s{j}-{j+1}")
                movedObj.append({
                    "main": puzzle_copy[j]["index"],
                    "additional": [puzzle_copy[j + 1]["index"]]
                    })
                
                puzzle_copy[j], puzzle_copy[j + 1] = puzzle_copy[j + 1], puzzle_copy[j]
                swapped = True

        steps[f"i{i}"] = iteration
        moved[f"i{i}"] = movedObj
        targetStates[f"i{i}"] = list(puzzle_copy)
        if not swapped:
            break

    return {
        "stepsBI": steps, 
        "movedObjectsBI": moved,
        "targetStatesBI": targetStates, 
        "puzzleDifficulty": simulationDifficulty + recognizability, 
        "compatibleWith": compatibleWith,
        }