import { global } from "./globals.js";
import { RenderPuzzle } from "./visuals/Render.js";
export { RenderGuess } from "./visuals/Render.js";




export function FindClosestTarget(draggedBarCentre, draggedBar) {
    const otherBars = [...global.currentContainer.querySelectorAll(".bar")].filter(bar => bar !== draggedBar);
    const possibleTargets = []; 
    
    let closestTarget = null;
    let closestDistance = Infinity;

    // (swap targets) - bars
    for (const bar of otherBars) {
        const rect = bar.getBoundingClientRect();
        possibleTargets.push({ rect_x: rect.left + (rect.width / 2), action: "swap", index: Number(bar.dataset.index) });
    }

    // include before first bar (for insert)
    const firstRect = otherBars[0].getBoundingClientRect();
    possibleTargets.push({ rect_x: firstRect.left, action: "insert", index: Number(otherBars[0].dataset.index) });

    // (insert targets) - between bars
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
    let bars = [...global.currentPuzzle];

    if (target.action === "swap") {
        const targetIndex = target.index;
        playerAction = {"move": `s${draggedIndex}-${targetIndex}`,  // slots are written
                        "objects": {"main": `${global.currentPuzzle[draggedIndex]["index"]}`, // exact bars are written
                                 "additional": [`${global.currentPuzzle[targetIndex]["index"]}`]}}; 
        
        [bars[draggedIndex], bars[targetIndex]] = [bars[targetIndex], bars[draggedIndex]];
        global.currentPuzzle = bars;
    }
    else if (target.action === "insert") {
        // how splice work: array.splice(where to start,   how many elements to remove,  insert1, insert2, etc)
        // and it returns the removed elements
        let insertTo = target.index;
        if (draggedIndex === insertTo || draggedIndex + 1 === insertTo) 
            return;
        playerAction = {"move": `i${draggedIndex}-${insertTo}`,
                        "objects": {"main": `${global.currentPuzzle[draggedIndex]["index"]}`, 
                                 "additional": `${global.currentPuzzle[insertTo]["index"]}`}};
        
        const [movedBar] = global.currentPuzzle.splice(draggedIndex, 1);
        // the [] when assigning means "de-array" the variable, cus .splice returns array
        if (draggedIndex < insertTo) 
            insertTo -= 1;
        global.currentPuzzle.splice(insertTo, 0, movedBar)
        // start at insertTo, delete nothing, insert what bar you just moved
    }

    RenderPuzzle(global.currentContainer, global.currentPuzzle, global.FuncOnMove);
    global.FuncOnMove(playerAction, global.currentPuzzle);
    
}