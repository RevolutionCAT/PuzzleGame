export const compatibleWith = ["bars_small", "numbers"];
export const recognizability = 2.0;

export function Simulate(original_puzzle) {
    const puzzleLength = original_puzzle.length;
    const puzzle_copy = [...original_puzzle]; // copies all the elements into array called puzzle
    let steps = {};
    let puzzleDifficulty = 0.0;
    let temporary = 0;
    
    for (let i = 0; i < puzzleLength-1; i++) {
        let iteration = [];
        for (let j = 0; j < puzzleLength-i-1; j++) {
          //  iteration.push(`c${j}-${j+1}`);
            if (puzzle_copy[j] > puzzle_copy[j + 1]) {
                
                temporary = puzzle_copy[j];
                puzzle_copy[j] = puzzle_copy[j+1];
                puzzle_copy[j+1] = temporary;

                puzzleDifficulty += 0.5;
                iteration.push(`s${j}-${j+1}`);
            }
        }
        steps[`i${i}`] = iteration;
    }
    console.log("steps: ", steps);
    console.log(puzzle_copy);
    return {steps, puzzleDifficulty};
}