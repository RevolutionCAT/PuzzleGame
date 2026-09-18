export const compatibleWith = ["bars_small", "numbers"];
export const recognizability = 0.0;



function Split(puzzle, low, high, steps, puzzleDifficulty) {
    let iteration = [];

    let pivot = puzzle[high];
    let i = low-1;

    for (let j = low; j < high; j++){
        if (puzzle[j] <= pivot){
            i++;
            [puzzle[i], puzzle[j]] = [puzzle[j], puzzle[i]];
            iteration.push(`s${i}-${j}`);
        }
    }
    [puzzle[i+1], puzzle[high]] = [puzzle[high], puzzle[i+1]];

    steps[`i${i}`] = iteration;
    return i+1;
}


function Sort(puzzle, low=0, high=null, steps, puzzleDifficulty) {
    let pivot_index = 0;

    if (high === null){
        high = puzzle.length - 1;
    }
    if (low < high){
        pivot_index = Split(puzzle, low, high, steps, puzzleDifficulty);
        Sort(puzzle, low, pivot_index-1, steps, puzzleDifficulty);
        Sort(puzzle, pivot_index+1, high, steps, puzzleDifficulty);
    }
}



export function Simulate(original_puzzle) {
    const puzzle_copy = [...original_puzzle];
    let steps = {};
    let puzzleDifficulty = 0.0;

    Sort(puzzle_copy, 0, null, steps, puzzleDifficulty);
    
    console.log("steps: ", steps);
    console.log(puzzle_copy);
    return {steps, puzzleDifficulty};
}