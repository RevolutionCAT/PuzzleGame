compatibleWith = ["bars_small", "numbers"]
recognizability = 2.0

def Simulate(original_puzzle):
    puzzle_length = len(original_puzzle)
    puzzle_copy = list(original_puzzle)
    swapped = False
    steps = {}
    target_states = {}
    simulationDifficulty = 0.0

    for i in range(puzzle_length - 1):
        swapped = False
        iteration = []
        for j in range(puzzle_length - i - 1):
            # iteration.append(f"c{j}-{j+1}")
            if puzzle_copy[j] > puzzle_copy[j + 1]:
                puzzle_copy[j], puzzle_copy[j + 1] = puzzle_copy[j + 1], puzzle_copy[j]
                swapped = True
                simulationDifficulty += 0.5
                iteration.append(f"s{j}-{j+1}")
        steps[f"i{i}"] = iteration
        target_states[f"i{i}"] = list(puzzle_copy)
        if not swapped:
            break

    print("steps: ", steps)
    return {
        "stepsBI": steps, 
        "targetStatesBI": target_states, 
        "puzzleDifficulty": simulationDifficulty + recognizability, 
        "compatibleWith": compatibleWith,
        }