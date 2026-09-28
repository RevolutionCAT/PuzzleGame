compatibleWith = ["bars_small", "numbers"]
recognizability = 2.0


def Simulate(original_puzzle, target):
    puzzleLength = len(original_puzzle)
    puzzle_copy = list(original_puzzle)

    steps = {}
    puzzleDifficulty = 0.0
    index = 0
    found = False
    upperBound = puzzleLength - 1

    while index <= upperBound and not found:
        if puzzle_copy[index] == target:
            found = True
        else:
            index += 1

    if found:
        return {"steps": steps, "puzzleDifficulty": puzzleDifficulty, "index": index}
    else:
        return {"steps": steps, "puzzleDifficulty": puzzleDifficulty, "index": -1}