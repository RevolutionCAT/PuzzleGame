
export function RenderPuzzle(container, puzzle) {
    container.innerHTML = "";
    
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



let draggedBar = null;
const dragThreshold = 5;
let offsetX = 0;

document.addEventListener("pointermove", (event) => {
    if (draggedBar === null) 
        return;
    
    offsetX += event.movementX;
    draggedBar.style.transform = `translateX(${offsetX}px)`;
});

document.addEventListener("pointerup", (event) => {
    if (draggedBar === null) 
        return;

    draggedBar.classList.remove("moving");
    draggedBar.style.transform = "";

    if (Math.abs(offsetX) < dragThreshold) { // click
        draggedBar.classList.toggle("selected");
    } 
    else { // drag
        // swap logic  here later
    }

    draggedBar = null;
})

function MouseDownOnBar(event) {
    draggedBar = event.currentTarget;
    offsetX = 0;
    event.currentTarget.classList.add("moving");
}
