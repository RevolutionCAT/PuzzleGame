export const compatibleWith = ["bars_small", "numbers"];
export const recognizability = 2.0;

export function Simulate(original_puzzle) {
    const puzzleLength = original_puzzle.length;
    const puzzle_copy = [...original_puzzle]; // copies all the elements into array called puzzle
    let swapped;
    let steps = {};
    let puzzleDifficulty = 0.0;
    

    for (let i = 0; i < puzzleLength-1; i++) {
        swapped = false;
        let iteration = [];
        for (let j = 0; j < puzzleLength-i-1; j++) {
          //  iteration.push(`c${j}-${j+1}`);
            if (puzzle_copy[j] > puzzle_copy[j + 1]) {
                [puzzle_copy[j], puzzle_copy[j + 1]] = [puzzle_copy[j + 1], puzzle_copy[j]];
                swapped = true;
                puzzleDifficulty += 0.5;
                iteration.push(`s${j}-${j+1}`);
            }
        }
        steps[`i${i}`] = iteration;
        if (!swapped) {
            break;
        }
    }
    console.log("steps: ", steps);
    console.log(puzzle_copy);
    return {steps, puzzleDifficulty};
}