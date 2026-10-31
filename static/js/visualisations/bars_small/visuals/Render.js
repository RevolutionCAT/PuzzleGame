// here lie MOST of the rendering actions, however some of them are inside of other files, for example logic.js.
import { global } from "../globals.js";
import { CreateBar, CreateMoveLine, SetBars } from "./render_core.js";



export function RestoreState(state) {
    global.currentPuzzle = [...state];
    RenderPuzzle(global.currentContainer, global.currentPuzzle, global.FuncOnMove);
}


export function RenderPuzzle(container, puzzle, onMove) {
    container.innerHTML = "";
    global.currentContainer = container;
    global.currentPuzzle = puzzle;
    global.FuncOnMove = onMove;
    
    const containerWidth = container.clientWidth;
    const barCount = Object.keys(puzzle).length;

    const gapRatio = 0.1;
    const barWidth = containerWidth / (barCount + (barCount - 1) * gapRatio);
    const gap = barWidth * gapRatio;
    const maxValue = Math.max(...puzzle.map(bar => bar.value)); // used to find relative height of the bar

    container.style.gap = `${gap}px`;

    for (let index = 0; index < puzzle.length; index++) {
        const value = puzzle[index].value;
        container.appendChild(CreateBar(value, barWidth, index, maxValue));
    }
}

function RenderMoves(markedMoves, attempt) {
    const box = document.getElementById("moves-history-box");
    box.appendChild(CreateMoveLine(markedMoves, attempt));
}



function MarkMoves(markedMoves) {
    const lastLine = document.getElementById("moves-history-box").lastElementChild;
    const boxes = lastLine.querySelectorAll(".move-box");
    boxes.forEach((box, i) => {
        if (markedMoves[i].move)
            box.classList.add(markedMoves[i].mark)
    });
}


function MarkBars(markedBars) {
    const bars = [...global.currentContainer.querySelectorAll(".bar")];
    let counter = 0;
    for (const bar of bars) {
        let mark = markedBars[counter]["mark"]
        bar.classList.add(mark);
        counter++;
    }
}



// ======================================== Set puzzle after submit ==========================

export function RenderGuess(markedMoves, markedBars, iterationComplete, attempt) {
    // SetState - either back if wrong guess, or to initial if correct guess
    // MarkBars - mark what bars are green, what yellow
    // RenderGuessPictures - moves are shown visually on the side 
    // RenderGuessText - moves shown above
    RenderMoves(markedMoves, attempt);
    MarkMoves(markedMoves);
    MarkBars(markedBars);
    SetBars(iterationComplete);
}
