import { global } from "./globals.js";
import { RenderPuzzle } from "./render.js";
import { MarkBars } from "./submit_logic.js";


export function FindClosestTarget(draggedBarCentre, draggedBar) {
    const otherBars = [...global.currentContainer.querySelectorAll(".bar")].filter(bar => bar !== draggedBar);
    const possibleTargets = []; 
    // const means the variable cannot be reassigned, not modified
    
    let closestTarget = null;
    let closestDistance = Infinity;

    // include the actual bars in targets (swap targets)
    for (const bar of otherBars) {
        const rect = bar.getBoundingClientRect();
        possibleTargets.push({ rect_x: rect.left + (rect.width / 2), action: "swap", index: Number(bar.dataset.index) });
    }

    // include before first bar (for insert)
    const firstRect = otherBars[0].getBoundingClientRect();
    possibleTargets.push({ rect_x: firstRect.left, action: "insert", index: Number(otherBars[0].dataset.index) });

    // include between-bars in targets (insert targets)
    for (let i=0; i < otherBars.length-1; i++) {
        const bar1 = otherBars[i].getBoundingClientRect();
        const bar2 = otherBars[i+1].getBoundingClientRect();
        possibleTargets.push({ rect_x: (bar1.right + bar2.left) / 2, action: "insert", index: Number(otherBars[i+1].dataset.index) });
    }

    // include after the last bar (for insert)
    const lastRect = otherBars[otherBars.length-1].getBoundingClientRect();
    possibleTargets.push({ rect_x: lastRect.right, action: "insert", index: otherBars.length })


    // select the closest
    for (const target of possibleTargets) {
        const distance = Math.abs(draggedBarCentre - target.rect_x)

        if (distance < closestDistance) {
            closestDistance = distance;
            closestTarget = target;
        }
    }
    return closestTarget;
}




export function RearrangeBars(draggedBar, target) {
    const draggedIndex = Number(draggedBar.dataset.index);
    let playerAction;

    if (target.action == "swap") {
        const targetIndex = target.index;
        playerAction = `s${draggedIndex}-${targetIndex}`;
        [global.currentPuzzle[draggedIndex], global.currentPuzzle[targetIndex]] = [global.currentPuzzle[targetIndex], global.currentPuzzle[draggedIndex]];
    }
    else {
        // how splice work: array.splice(where to start,   how many elements to remove,  insert1, insert2, etc)
        // and it returns the removed elements

        playerAction = `i${draggedIndex}-${target.index}`;
        
        const [moved] = global.currentPuzzle.splice(draggedIndex, 1);
        // the [] when assigning means "de-array" the variable, cus .splice returns the array
        let insertTo = target.index;
        if (draggedIndex < insertTo) insertTo -= 1;
        global.currentPuzzle.splice(insertTo, 0, moved)
        // start at insertTo, delete nothing, insert what bar/value you just moved
    }

    RenderPuzzle(global.currentContainer, global.currentPuzzle, global.FuncOnMove);
    global.FuncOnMove(playerAction, global.currentPuzzle);
    
}


export function RestoreState(state) { // when you click undo/redo buttons
    global.currentPuzzle = [...state];
    RenderPuzzle(global.currentContainer, global.currentPuzzle, global.FuncOnMove);
}


// =================================== Check Answer ==========================================

export function CheckAnswer(playerMoves, correctIterationSteps, correctPuzzleState) {
    console.log(`Player moves: ${playerMoves}`);
    console.log("Correct moves:", correctIterationSteps);
    
    const markedMoves = []; // [1: {"s1-2", "green"}, 2: {"s3-4", "yellow"}. . .] i think it works like that..?
    MarkPlayerMoves(playerMoves, correctIterationSteps, correctPuzzleState, markedMoves);
    
    return markedMoves;
}


// ======================================== Set puzzle after submit ==========================

export function SetPuzzleAfterAttempt(markedMoves, correctIterationSteps, correctPuzzleState, targetPuzzleState) { // going into "after-game logic.js"
    // SetState - either back if wrong guess, or to initial if correct guess
    // MarkBars - mark what bars are green, what yellow
    // RenderGuessPictures - moves are shown visually on the side 
    // RenderGuessText - moves shown above

    MarkBars("real", markedMoves, correctIterationSteps, correctPuzzleState, targetPuzzleState);
}




// ================================ Identify ========================================
export function MarkPlayerMoves(playerMoves, correctIterationSteps, correctPuzzleState, markedMoves) {
    console.log("playerMoves:", playerMoves); console.log("correctIterationSteps:", correctIterationSteps);
    for (let i = 0; i < correctIterationSteps.length; i++) {
        if (playerMoves[i] === undefined) { // skip if player made less moves than currentIterationSteps has
            console.log("untouched at i =", i);
            markedMoves[i] = { move: undefined, mark: "gray" };
            continue;
        }

        let currentMovesVariations = "";
        for (let j=0; j<correctIterationSteps.length; j++) { 
            if (!currentMovesVariations.includes(correctIterationSteps[j][0])) {
                currentMovesVariations += correctIterationSteps[j][0];
            }
        }

        const matchingMove = currentMovesVariations.includes(playerMoves[i][0]);
        const matchingBars = playerMoves[i].length === 3
            ? correctIterationSteps.some(step => 
                step[0] === playerMoves[i][0] &&
                step.slice(-3) === playerMoves[i].slice(-3)) // true/false if form e.g. "s1-2"
            : correctIterationSteps.some(step => 
                step[0] === playerMoves[i][0] &&
                step.slice(-1) === playerMoves[i].slice(-1)); // true/false if form e.g. "k1"

    //    console.log("Current: ", global.currentPuzzle, "Correct: ", correctPuzzleState);

        if ((playerMoves[i] === correctIterationSteps[i]))
            markedMoves[i] = { move: playerMoves[i], mark: "green" };
        else if (matchingMove || matchingBars)
            markedMoves[i] = { move: playerMoves[i], mark: "yellow" };
        else
            markedMoves[i] = { move: playerMoves[i], mark: "gray" };
    }
    console.log("Marked moves: ", markedMoves);
}