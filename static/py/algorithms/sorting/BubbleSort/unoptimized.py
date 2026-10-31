compatibleWith = ["bars_small", "numbers"]
recognizability = 2.0



def Simulate(original_puzzle):
    puzzle_length = len(original_puzzle)
    puzzle_copy = [{"index": f"bar{i}", "value": val} for i, val in enumerate(original_puzzle)]
    simulationDifficulty = 0.0

    steps = {}
    targetStates = {}
    moved = {}

    temporary = None
    for i in range(puzzle_length - 1):
        iteration = []
        movedObj = {"moved": None, "additional": []}

        for j in range(puzzle_length - i - 1):
            # iteration.append(f"c{j}-{j+1}")
            if puzzle_copy[j] > puzzle_copy[j + 1]:
                simulationDifficulty += 0.5

                movedObj["additional"].append("tempBox")
                temporary = puzzle_copy[j]

                movedObj["main"] = f"{puzzle_copy[j+1]}"
                puzzle_copy[j] = puzzle_copy[j + 1]

                puzzle_copy[j + 1] = temporary
                movedObj["additional"].append(f"{puzzle_copy[j]}")
                
                iteration.append(f"s{j}-{j+1}")
        steps[f"i{i}"] = iteration

    return {
            "stepsBI": steps, 
            "movedObjectsBI": moved,
            "targetStatesBI": targetStates, 
            "puzzleDifficulty": simulationDifficulty + recognizability, 
            "compatibleWith": compatibleWith,
            }