import { global } from "../globals.js";
import { RestoreState } from "./Render.js";

// ============================================== Creating elements =================================================
export function CreateBar(value, width, index, maxValue) {
    const bar = document.createElement("div");
    
    bar.dataset.index = index;
    bar.classList.add("bar");
    bar.style.width = `${width}px`;
    bar.style.height = `${(value / maxValue) * 100}%`;
    
    return bar;
}



export function CreateMove(move, index) {
    const moveBox = document.createElement("div");
    console.log(move);
    const text = String(move.move.move ?? "").replace(/\d+/g, n => Number(n) + 1);

    moveBox.dataset.index = index;
    moveBox.classList.add("move-box");
    moveBox.style.width = `${move.length+2}px`;
    moveBox.style.height = "20px";
    moveBox.textContent = text;
    return moveBox;
}


export function CreateMoveLine(markedMoves, attempt) {
    const moveLine = document.createElement("div");

    moveLine.dataset.index = attempt;
    moveLine.classList.add("move-line");

    const label = document.createElement("attempt");
    label.classList.add("move-attempt");
    label.textContent = `${attempt+1}.`;
    moveLine.appendChild(label); 

    for (let index = 0; index < markedMoves.length; index++) {
        moveLine.appendChild(CreateMove(markedMoves[index], index))
    }
    return moveLine;
}



// =========================================== Marking ================================================
function ClearBarColors() {
    const bars = [...global.currentContainer.querySelectorAll(".bar")];
    for (const bar of bars) {
        bar.classList.remove("green", "yellow", "gray");
    }
}




export function SetBars(iterationComplete) {
    const timeout = 10; // default = 3
    const puzzleBox = document.getElementById("puzzle-container");

    function finish(restore) {
        clearTimeout(timeoutID);
        puzzleBox.removeEventListener("pointerdown", onInteract);
        if (restore) 
            RestoreState(global.initialPuzzle);
        ClearBarColors();
    }

    function onInteract() {
        finish(!iterationComplete); 
    }

    const timeoutID = setTimeout(() => finish(!iterationComplete), timeout * 1000);
    puzzleBox.addEventListener("pointerdown", onInteract, { once: true });
}