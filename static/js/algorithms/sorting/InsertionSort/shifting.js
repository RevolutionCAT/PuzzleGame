export const compatibleWith = ["bars_small", "numbers"];
export const recognizability = 2.0;

export function Simulate(original_puzzle) {
    const puzzleLength = original_puzzle.length;
    const puzzle_copy = [...original_puzzle];
    let steps = {};
    let puzzleDifficulty = 0.0;

    let key = 0;
    for (let i = 1; i < puzzleLength; i++) {
        let iteration = [];
        
        key = puzzle_copy[i]; // key is the next unsorted element. key == xN. everything before it is sorted.
        iteration.push(`k${i}`); // assign a key

        j = i-1; // j is the pointer to the number that is going to be compared with xN
        
        while (j >= 0 && key < puzzle_copy[j]) { // while j != -1 (xN was compared with all previous numbers) - (this is before &&)
            // on first iteration of WHILE loop, j=i-1 overwrites the key, which was stored in another variable beforehand.
            // this loop is comparing xN with all sorted numbers before it to find where to fit the key
            puzzle_copy[j+1] = puzzle_copy[j]; // shift above - replace j+1 with j. CLEARANCE FOR INSERTION - overwriting j+1
            iteration.push(`r${j+1}-${j}`) // report: replace j+1 with j
            j = j-1; // j moves back to compare xN with the next, more-previous sorted number
            // this is so that new puzzle_copy[j+1] IS(===) old puzzle_copy[j]
        }
        puzzle_copy[j+1] = key; // insert the key(xN) after j cus j is < xN but j+1 was not less (cus while loop passed it)
        iteration.push(`r${j+1}-${i}`); // report: replace the old j (which is double) with xN (key). INSERTION

        puzzleDifficulty += 0.5;
        steps[`i${i}`] = iteration;
    }

    console.log("steps: ", steps);
    console.log(puzzle_copy);
    return {steps, puzzleDifficulty};
}