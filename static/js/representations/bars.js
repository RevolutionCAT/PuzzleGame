const dragThreshold = 5;
let currentContainer = null;
let currentPuzzle = null;
let FuncOnMove = null;
let draggedBar = null;
let mouseOffsetX = 0;


export function RenderPuzzle(container, puzzle, onMove) {
    container.innerHTML = "";
    currentContainer = container;
    currentPuzzle = puzzle;
    FuncOnMove = onMove;
    
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
    
    bar.addEventListener("pointerdown", MouseDownOnBar);
    return bar;
}


function FindClosestBar(pointerX, draggedBar) {
    const bars = currentContainer.querySelectorAll(".bar");
    let closestBar = null;
    let closestDistance = Infinity;

    for (const bar of bars) {
        if (bar === draggedBar) continue;

        const rect = bar.getBoundingClientRect();
        const barCentreX = rect.left + (rect.width / 2);
        const distance = Math.abs(pointerX - barCentreX);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestBar = bar;
        }}
    return closestBar;
}


function SwapBars(draggedBar, targetBar) {
    const indexBar1 = Number(draggedBar.dataset.index);
    const indexBar2 = Number(targetBar.dataset.index);

    [currentPuzzle[indexBar1], currentPuzzle[indexBar2]] = [currentPuzzle[indexBar2], currentPuzzle[indexBar1]];

    RenderPuzzle(currentContainer, currentPuzzle, FuncOnMove);
    if (FuncOnMove) {
        FuncOnMove(currentPuzzle);
    }

}


// ========== event listeners ============

document.addEventListener("pointermove", (event) => {
    if (draggedBar === null) 
        return;
    
    mouseOffsetX += event.movementX;
    draggedBar.style.transform = `translate(${mouseOffsetX}px, -20px)`;
});


document.addEventListener("pointerup", (event) => {
    if (draggedBar === null) 
        return;

    draggedBar.classList.remove("moving");
    draggedBar.style.transform = "";

    if (Math.abs(mouseOffsetX) < dragThreshold) { // click
        draggedBar.classList.toggle("selected");
    } 
    else { // drag
        const targetBar = FindClosestBar(event.clientX, draggedBar);
        if (targetBar !== null) {
            SwapBars(draggedBar, targetBar);
            }
    }
    draggedBar = null;
    
})


function MouseDownOnBar(event) {
    draggedBar = event.currentTarget;
    mouseOffsetX = 0;
    event.currentTarget.classList.add("moving");
}

