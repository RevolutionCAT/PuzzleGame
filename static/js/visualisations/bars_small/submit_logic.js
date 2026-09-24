import { global } from "./globals.js";
import { RestoreState } from "./in-game_logic.js";


export function MarkBars(condition, markedMoves, correctIterationSteps, correctPuzzleState, targetPuzzleState) {
    if (condition === "real" || condition === "main") {
        const bars = [...global.currentContainer.querySelectorAll(".bar")];
        execute(bars, 10); // t=3 for real(?)     t=0.3 for debug
    }
    else if (condition === "side") {
        const bars = [];
        execute(bars);
    }
    else
        throw new Error(`Wrong condition "${condition}" was passed for marking.`);
    

    function execute(bars, time=Infinity) {
        const appliedBars = [];
        
        for (const [i, { move, mark }] of markedMoves.entries()) {
            let colorClass;
            if (mark === "green") colorClass = "move-correct";
            else if (mark === "yellow") colorClass = "move-partial";
            else colorClass = "move-wrong";

      //      console.log("highlighting:", move, mark);
     //       console.log("move: ", move)

            const numbers = (move ?? correctIterationSteps[i])?.match(/\d+/g);
            if (!numbers) continue;

            for (const num of numbers) {
                const barIndex = Number(num);
                const bar = bars[`${barIndex}`];
                if (bar) {
                    bar.classList.remove("move-correct", "move-partial", "move-wrong");
                    appliedBars.push({ bar, className: colorClass });
                    bar.classList.add(colorClass);
                }
            }
        }

        const referencedBars = new Set();
        for (const step of correctIterationSteps) {
            const nums = step.match(/\d+/g);
            if (nums) nums.forEach(n => referencedBars.add(Number(n)));
        }

        for (let barIdx = 0; barIdx < correctPuzzleState.length; barIdx++) {
            if (referencedBars.has(barIdx)) continue; // skip bars this round's moves touch
            if (global.currentPuzzle[barIdx] === correctPuzzleState[barIdx]) {
                const bar = bars[`${barIdx}`];
                if (bar) {
                    bar.classList.remove("move-correct", "move-partial");
                    bar.classList.add("move-correct");
                    appliedBars.push({ bar, className: "move-correct" });
                }
            }
        }

        function revert() {
            for (const { bar, className } of appliedBars) {
                bar.classList.remove(className);
            }
            if (targetPuzzleState !== null)
                RestoreState(targetPuzzleState);
            puzzleBox.removeEventListener("pointerdown", onInteract);
        }

        function onInteract() {
            clearTimeout(timeoutId);
            revert();
        }

        const timeoutId = setTimeout(revert, time * 1000);
        const puzzleBox = document.getElementById("puzzle-container");
        puzzleBox.addEventListener("pointerdown", onInteract, { once: true });
    }
    console.log("Finished marking bars.")
}




function PrintPlayerMoves() {

}