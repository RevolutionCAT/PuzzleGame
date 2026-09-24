export const compatibleWith = ["bars_small", "numbers"];
export const recognizability = 2.0;


export function Simulate(original_puzzle, target) {
    const puzzleLength = original_puzzle.length;
    const puzzle_copy = [...original_puzzle];

    let steps = {};
    let puzzleDifficulty = 0.0;
    let index = 0;
    let found = false;
    let upperBound = puzzleLength-1;

    while (index <= upperBound && !found) {
        if (puzzle_copy[index] === target)
            found = true;
        else 
            index++;
    }

    if (found)
        return {steps, puzzleDifficulty, index};
    else
        return {steps, puzzleDifficulty, index: -1};
}