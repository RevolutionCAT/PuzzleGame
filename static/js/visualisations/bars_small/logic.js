import { dragThreshold, global } from "./globals.js";
import { RenderPuzzle } from "./render.js";


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

    if (target.action == "swap") {
        const targetIndex = target.index;
        [global.currentPuzzle[draggedIndex], global.currentPuzzle[targetIndex]] = [global.currentPuzzle[targetIndex], global.currentPuzzle[draggedIndex]];
    }
    else {
        // how splice work: array.splice(where to start,   how many elements to remove,  insert1, insert2, etc)
        // and it returns the removed elements
        
        const [moved] = global.currentPuzzle.splice(draggedIndex, 1);
        // the [] when assigning means "de-array" the variable, cus .splice returns the array
        let insertTo = target.index;
        if (draggedIndex < insertTo) insertTo -= 1;
        global.currentPuzzle.splice(insertTo, 0, moved)
        // start at where u need to insert, delete nothing, insert what bar/value you just moved
    }

    RenderPuzzle(global.currentContainer, global.currentPuzzle, global.FuncOnMove);
    if (global.FuncOnMove)
        global.FuncOnMove(global.currentPuzzle);
}