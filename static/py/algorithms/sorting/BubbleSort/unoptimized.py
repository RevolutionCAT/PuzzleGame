compatible_with = ["bars_small", "numbers"]
recognizability = 2.0

def Simulate(original_puzzle):
    puzzle_length = len(original_puzzle)
    puzzle_copy = list(original_puzzle)
    steps = {}
    puzzle_difficulty = 0.0
    temporary = 0

    for i in range(puzzle_length - 1):
        iteration = []
        for j in range(puzzle_length - i - 1):
            # iteration.append(f"c{j}-{j+1}")
            if puzzle_copy[j] > puzzle_copy[j + 1]:

                temporary = puzzle_copy[j]
                puzzle_copy[j] = puzzle_copy[j + 1]
                puzzle_copy[j + 1] = temporary

                puzzle_difficulty += 0.5
                iteration.append(f"s{j}-{j+1}")
        steps[f"i{i}"] = iteration

    print("steps: ", steps)
    print(puzzle_copy)
    return {"steps": steps, "puzzleDifficulty": puzzle_difficulty}