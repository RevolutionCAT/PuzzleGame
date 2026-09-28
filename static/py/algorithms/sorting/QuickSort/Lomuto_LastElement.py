compatibleWith = ["bars_small", "numbers"]
recognizability = 0.0


def Split(puzzle, low, high, steps, puzzleDifficulty):
    iteration = []

    pivot = puzzle[high]
    i = low - 1

    for j in range(low, high):
        if puzzle[j] <= pivot:
            i += 1
            puzzle[i], puzzle[j] = puzzle[j], puzzle[i]
            iteration.append(f"s{i}-{j}")
    puzzle[i + 1], puzzle[high] = puzzle[high], puzzle[i + 1]

    steps[f"i{i}"] = iteration
    return i + 1


def Sort(puzzle, low=0, high=None, steps=None, puzzleDifficulty=None):
    pivot_index = 0

    if high is None:
        high = len(puzzle) - 1
    if low < high:
        pivot_index = Split(puzzle, low, high, steps, puzzleDifficulty)
        Sort(puzzle, low, pivot_index - 1, steps, puzzleDifficulty)
        Sort(puzzle, pivot_index + 1, high, steps, puzzleDifficulty)


def Simulate(original_puzzle):
    puzzle_copy = list(original_puzzle)
    steps = {}
    puzzleDifficulty = 0.0

    Sort(puzzle_copy, 0, None, steps, puzzleDifficulty)

    print("steps: ", steps)
    print(puzzle_copy)
    return {"steps": steps, "puzzleDifficulty": puzzleDifficulty}