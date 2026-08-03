// main.js runs the game. It is choosing when it controls the whole game, assembling all the functions from core.js + engine.js
import {Prepare, ManageVisuals} from "./core.js"
// if need parent folder:     from "../filename.js"


async function Game() {
    const { puzzle, mode, algorithm, puzzleSteps, totalDifficulty } = await Prepare();

    let allPlayerMovesList = [];
    function OnMove(currentPlayerMoves) {
        allPlayerMovesList.push(currentPlayerMoves);
    }

    await ManageVisuals(puzzle, mode, totalDifficulty, OnMove);

    document.getElementById("submit-button").addEventListener("click", () => {
        OnSubmit(allPlayerMovesList, puzzleSteps);
        allPlayerMovesList = [];
    });

    document.getElementById("undo-button").addEventListener("click", () => {
        // go step back on the moves list
        // pop the move from that list
        // manage visuals for that ig
        // push the move into redo list
    })
}

Game();