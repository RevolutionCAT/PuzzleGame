// main.js runs the game. It is choosing when it controls the whole game, assembling all the functions from core.js + engine.js
import {Prepare, ManageVisuals} from "./core.js"
// if need parent folder:     from "../filename.js"


async function Game() {
    const { puzzle, mode, algorithm, puzzleSteps, totalPuzzleDifficulty } = await Prepare();

    let allPlayerMoves = [];
    let currentPlayerMoves = [];
    let playerMovesHistory = [];


    // =========================== User interaction =============================
    function OnMove(action, stateBefore) {
        currentPlayerMoves.push(action);
        playerMovesHistory.push({ action, stateBefore });
    }

    function OnSubmit() {
        if (currentPlayerMoves.length === 0) {
            console.log("Rejected: You have not done any changes!");
            return;
        }

        console.log(currentPlayerMoves);
        allPlayerMoves.push(...currentPlayerMoves);
        currentPlayerMoves = [];
        playerMovesHistory = [];
    }

    function OnUndo() {
        if (playerMovesHistory.length === 0) {
            console.log("Error: You have no actions to undo!")
            return;
        }

        const previousMove = playerMovesHistory.pop();
        currentPlayerMoves.pop();
        representation.RestoreState(previousMove.stateBefore);
    }

    function OnRedo() {
        if (redoPlayerMoves.length === 0) {
            console.log("Error: You haven't undone any actions!")
            return;
        }
        currentPlayerMoves.push(redoPlayerMoves.pop());
        redoPlayerMoves.pop();
    }
    

    // ==================== Event listeners ===============================
    document.getElementById("submit-button").addEventListener("click", () => {
        OnSubmit();
    });


    document.getElementById("undo-button").addEventListener("click", () => {
        OnUndo();
    })

    document.getElementById("redo-button").addEventListener("click", () => {
        OnRedo();
    })

    const representation = await ManageVisuals(puzzle, mode, totalPuzzleDifficulty, OnMove);
}


Game();