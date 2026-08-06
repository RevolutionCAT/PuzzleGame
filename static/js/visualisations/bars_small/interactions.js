import { dragThreshold, global } from "./globals.js";
import { FindClosestTarget, RearrangeBars } from "./logic.js";


// ========== event listeners ============


document.addEventListener("pointerdown", (event) => {
    const bar = event.target.closest(".bar");
    if (!bar) return;
    MouseDownOnBar(bar);
});


document.addEventListener("pointermove", (event) => {
    if (global.draggedBar === null) 
        return;
    
    global.mouseOffsetX += event.movementX;
    global.draggedBar.style.transform = `translate(${global.mouseOffsetX}px, -20px)`;
});



document.addEventListener("pointerup", (event) => {
    if (global.draggedBar === null) 
        return;

    global.draggedBar.classList.remove("moving");
    global.draggedBar.style.transform = "";
    let handledBar = global.draggedBar;
    global.draggedBar = null;

    if (Math.abs(global.mouseOffsetX) < dragThreshold) { // click
        handledBar.classList.toggle("selected");
    } 
    else { // drag
        const rect = handledBar.getBoundingClientRect();
        const draggedBarCenter = rect.left + (rect.width / 2);

        const currentTarget = FindClosestTarget(draggedBarCenter, handledBar);
        if (currentTarget !== null) {
            RearrangeBars(handledBar, currentTarget);
            }
    }
    handledBar = null;
    
})



export function MouseDownOnBar(bar) {
    global.draggedBar = bar;
    global.mouseOffsetX = 0;
    bar.classList.add("moving");
}
