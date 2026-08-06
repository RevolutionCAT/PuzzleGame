// here lie MOST of the rendering actions, however some of them are inside of other files, for example logic.js.
import { dragThreshold, global } from "./globals.js";

export function RenderPuzzle(container, puzzle, onMove) {
    container.innerHTML = "";
    global.currentContainer = container;
    global.currentPuzzle = puzzle;
    global.FuncOnMove = onMove;
    
    const containerWidth = container.clientWidth;
    const barCount = puzzle.length;

    const GAP_RATIO = 0.1;
    const barWidth = containerWidth / (barCount + (barCount - 1) * GAP_RATIO);
    const gap = barWidth * GAP_RATIO;
    const maxValue = Math.max(...puzzle);

    container.style.gap = `${gap}px`;

    for (let index = 0; index < puzzle.length; index++) {
        const value = puzzle[index];
        container.appendChild(CreateBar(value, barWidth, index, maxValue));
    } 
}



function CreateBar(value, width, index, maxValue) {
    const bar = document.createElement("div");
    
    bar.dataset.index = index;
    bar.classList.add("bar");
    bar.style.width = `${width}px`;
    bar.style.height = `${(value / maxValue) * 100}%`;
    
   // bar.addEventListener("pointerdown", MouseDownOnBar);
    return bar;
}