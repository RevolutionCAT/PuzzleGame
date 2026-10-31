


//===================================== Visuals =======================================
async function LoadRepresentation(mode) {
    const representation = await import(`./visualisations/${mode}/router.js`);
    return representation;
}


export async function ManageVisuals(puzzle, mode, totalPuzzleDifficulty, OnMove) {
    const container = document.getElementById("puzzle-container");
    const representation = await LoadRepresentation(mode);
    representation.RenderPuzzle(container, puzzle, OnMove);
    return representation;
}



// request goes to the server
async function RequestMarking(difficulty, currentIteration, currentPuzzleState, currentPlayerMoves, attempt) {
    const result = await fetch(`/api/${difficulty}/guess`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentIteration, currentPuzzleState, currentPlayerMoves, attempt }),
        });
    
    const json = await result.json();
    if (!result.ok) // error check
        return { markedMoves: null, markedBars: null, iterationComplete: false, gameEndData: json.result ? json : null };
    console.log("Server marking: ", json);
    const { markedMoves, markedBars, iterationComplete, newAttempt, ...gameEnd } = json;
    return { markedMoves, markedBars, iterationComplete, newAttempt, gameEndData: Object.hasOwn(json, "result") ? gameEnd : null }
}


// ================================ Actual game ================================================

async function Game() {
    const difficulty = "medium";
    let currentIteration = 0;
    let attempt = 0;
    const response = await fetch(`/api/today_puzzle/${difficulty}`);
    const response_json = await response.json();
    const data = response_json.response;
    console.log("Server response: ", data);

    const puzzle = data["puzzle"]
    const gameMode = data["mode"]
    const puzzleDifficulty = data["puzzleDifficulty"]
    
    const representation = await ManageVisuals(puzzle, gameMode, puzzleDifficulty, OnMove); // e.g. - bars_small

    let redoMovesList = [];
    let currentPlayerMoves = [];
    let currentPuzzleHistory = [puzzle];
    let playerMovesPointer = 0;
    representation.global.initialPuzzle = [...puzzle];
    let submitting = false;

    function ResetHistory(startState) {
        // reset all current data
        redoMovesList = [];
        currentPlayerMoves = [];
        currentPuzzleHistory = [[...startState]];
        playerMovesPointer = 0;
    }

    // ======================================== User Interaction ==========================================================
    function OnMove(action, currentState) {
        redoMovesList.length = 0;
        currentPuzzleHistory.length = playerMovesPointer + 1;
        currentPlayerMoves.push(action);
        currentPuzzleHistory.push(currentState);
        playerMovesPointer++;
    }

    async function OnSubmit() {
        if (currentPlayerMoves.length === 0) {
            console.log("Submit rejected: You have not done any changes!");
            return;
        } else if (submitting) {
            console.log("Submit rejected: Please, wait for the response from the server.");
            return;
        }
        submitting = true;
        try {
            const currentPuzzleState = currentPuzzleHistory[playerMovesPointer];
            const {markedMoves, markedBars, iterationComplete, newAttempt, gameEndData} = await 
                RequestMarking(difficulty, currentIteration, currentPuzzleState, currentPlayerMoves, attempt)
        
            if (iterationComplete) {
                representation.global.initialPuzzle = [...currentPuzzleState];
                currentIteration++;
            }
            ResetHistory(representation.global.initialPuzzle);

            if (gameEndData)
                EndGame(gameEndData);

            representation.RenderGuess(markedMoves, markedBars, iterationComplete, newAttempt);
        } finally {
            submitting = false;
        }
    }


    // =================================== Undo / Redo ======================================
    function OnUndo() {
        if (playerMovesPointer === 0) {
            console.log("Error: You have no actions to undo!")
            return;
        }
        const previousState = currentPuzzleHistory[playerMovesPointer-1];
        representation.RestoreState(previousState);
        redoMovesList.push(currentPlayerMoves.pop());
        playerMovesPointer--;
    }


    function OnRedo() {
        if (redoMovesList.length === 0) {
            console.log("Error: You have no actions to redo!")
            return;
        }

        const nextState = currentPuzzleHistory[playerMovesPointer+1];
        representation.RestoreState(nextState);
        currentPlayerMoves.push(redoMovesList.pop());
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


Game()






// ============================================ Game results ======================================================
function EndGame(data) {
    // user cant click any button
    document.getElementById("submit-button").disabled = true;
    document.getElementById("undo-button").disabled = true;
    document.getElementById("redo-button").disabled = true;
    document.getElementById("puzzle-container").style.pointerEvents = "none";

    // exit if already exist. error check
    if (document.getElementById("game-end-popup")) return;

    // creating pop-up
    const popUp = document.createElement("div");
    popUp.id = "game-end-popup";
    popUp.className = "game-end-overlay";

    // pop-up code
    popUp.innerHTML = `
            <div class="game-end-popup" role="dialog" aria-modal="true">
                <p>${data["text"]}</p>
                <button type="button" id="close-game-end-popup">Close</button>
            </div>
        `;

    document.body.appendChild(popUp);
    document.getElementById("close-game-end-popup").addEventListener("click", () => {
        popUp.remove()
    });

    console.log(`Game ended and the player ${data["result"]}.`)
}