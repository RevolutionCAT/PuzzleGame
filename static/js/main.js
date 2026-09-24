// main.js runs the game. It is choosing when it controls the whole game, assembling all the functions from core.js + engine.js
import {Prepare, ManageVisuals} from "./core.js"
// if need parent folder:     from "../filename.js"

let attempt = 0; // will be moved to the server logic

async function Game() {
    // run Prepare and define representation for later use
    const { originalPuzzle, targetPuzzleStates, puzzleStepsByIteration, mode, totalPuzzleDifficulty } = await Prepare();
    const representation = await ManageVisuals(originalPuzzle, mode, totalPuzzleDifficulty, OnMove); // it is logic.js file

    // puzzleStepsByIteration:  { i0: ["s1-2", "k3". . .], i1: ["s3-4", "i4-5"] }
    const puzzleSteps = []; // puzzleSteps: ["i0", "s1-2", "k3", "i1", "s3-4", "i4-5"]   - converted for easier use. idk when needed
    for (const [iteration, moves] of Object.entries(puzzleStepsByIteration)) {
        puzzleSteps.push(iteration);
        puzzleSteps.push(...moves);
    }

 
    let currentInitialPuzzleState = [...originalPuzzle];
    let currentPuzzleStates = [[...originalPuzzle]];
    let currentPlayerMoves = [];
    let currentPlayerIteration = 0;
    let playerMovesPointer = 0;

    // ============================================== User interaction =============================================
    function OnMove(action, currentState) {
        currentPlayerMoves.push(action);
        currentPuzzleStates.push([...currentState]);
   //     console.log("Puzzle states: ", currentPuzzleStates);
        playerMovesPointer++;
    }

    function OnSubmit() {
        if (currentPlayerMoves.length === 0) {
            console.log("Submit rejected: You have not done any changes!");
            return;
        }
        const correctIterationSteps = puzzleStepsByIteration[`i${currentPlayerIteration}`] ?? [];
        const correctPuzzleState = targetPuzzleStates[`i${currentPlayerIteration}`];

        const markedMoves = representation.CheckAnswer(currentPlayerMoves, correctIterationSteps, correctPuzzleState);
        const iterationComplete = currentPlayerMoves.length === correctIterationSteps.length;
    
        if (iterationComplete) {
            currentPlayerIteration++;
            currentInitialPuzzleState = [...currentPuzzleStates[playerMovesPointer]];
      //      console.log(currentInitialPuzzleState);
        }
        while (puzzleStepsByIteration[`i${currentPlayerIteration}`]?.length === 0)
            currentPlayerIteration++; // skip any empty iteration. WILL BE CHANGED LATER
        
        representation.SetPuzzleAfterAttempt(markedMoves, correctIterationSteps, correctPuzzleState, currentInitialPuzzleState);
        
        currentPlayerMoves = [];
        currentPuzzleStates = [[...currentInitialPuzzleState]];
        playerMovesPointer = 0;
        attempt++;

        if (currentPlayerIteration >= Object.keys(puzzleStepsByIteration).length)
           GameEnd("Won")
        else if (attempt === 8)
            GameEnd("Lost")

    }

    // Gameplay-related
    function OnUndo() {
        if (playerMovesPointer === 0) {
            console.log("Error: You have no actions to undo!")
            return;
        }

        const previousState = currentPuzzleStates[playerMovesPointer-1];
        representation.RestoreState(previousState);
        playerMovesPointer--;
    }


    function OnRedo() {
        if (playerMovesPointer === currentPlayerMoves.length) {
            console.log("Error: You have no actions to redo!")
            return;
        }

        const nextState = currentPuzzleStates[playerMovesPointer+1];
        representation.RestoreState(nextState);
        playerMovesPointer++;
    }
    


    // ======================================= Event listeners ================================================

    document.getElementById("submit-button").addEventListener("click", () => {
        OnSubmit();
    });

    document.getElementById("undo-button").addEventListener("click", () => {
        OnUndo();
    });

    document.getElementById("redo-button").addEventListener("click", () => {
        OnRedo();
    });
}


Game();



// ============================================ Game results ======================================================
function GameEnd(resultState) {
    const gameResults = { "Lost": Lost(), "Won": Won() };
    const result = gameResults[resultState];

    function Lost() {
        return {resultText: "You lost!"}     
    }
    
    function Won() {
        return {resultText: "You won!"}
    }

    document.getElementById("submit-button").disabled = true;
    document.getElementById("undo-button").disabled = true;
    document.getElementById("redo-button").disabled = true;
    document.getElementById("puzzle-container").style.pointerEvents = "none";

    if (document.getElementById("game-end-popup")) return;

    const popUp = document.createElement("div");
    popUp.id = "game-end-popup";
    popUp.className = "game-end-overlay";

    popUp.innerHTML = `
            <div class="game-end-popup" role="dialog" aria-modal="true">
                <p>${result.resultText}</p>
                <button type="button" id="close-game-end-popup">Close</button>
            </div>
        `;

    document.body.appendChild(popUp);

    document.getElementById("close-game-end-popup").addEventListener("click", () => {
        popUp.remove()
    });
    console.log(`Game ended and the player ${resultState.toLowerCase()}.`)
}
