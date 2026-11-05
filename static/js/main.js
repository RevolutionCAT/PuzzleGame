import { EndGame } from "./general/GameEnd.js";


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


async function RequestPuzzle(difficulty) {
    const response = await fetch(`/api/today_puzzle/${difficulty}`);
    const response_json = await response.json();
    const data = response_json.response;
    console.log("Server response: ", data);

    return { puzzle: data["puzzle"], gameMode: data["mode"], puzzleDifficulty: data["puzzleDifficulty"] };
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
    let difficulty = "medium";
    let currentIteration = 0;
    let attempt = 0;


    let {puzzle, gameMode, puzzleDifficulty} = await RequestPuzzle(difficulty);
    let representation = await ManageVisuals(puzzle, gameMode, puzzleDifficulty, OnMove); // e.g. - bars_small


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

    document.getElementById("theme-toggle").addEventListener("click", () => {
        ToggleTheme();
    })

    // =================== ПЕРЕНЕСТИ ОТСЮДА В ДРУГОЙ ФАЙЛ КОГДА ДОБАВЛЮ МЕНЮ =============================
    // ТАКЖЕ ИЗМЕНИТЬ ЛОГИКУ И ОСТАВИТЬ ЗАПРОС ПАЗЛА КАК БЫЛО. БЕЗ МЕНЮ ЭТО ЧИСТО ДЛЯ ТЕСТА.

    document.getElementById("difficulty-button").addEventListener("click", async () => {
        ({ difficulty, puzzle, gameMode, puzzleDifficulty } = await ChangeDifficulty(difficulty));
        representation = await ManageVisuals(puzzle, gameMode, puzzleDifficulty, OnMove);
        representation.global.initialPuzzle = [...puzzle];

        attempt = 0;
        currentIteration = 0;
        ResetHistory(puzzle);
        document.getElementById("moves-history-box").innerHTML = "";
    });
}

Game();



async function ChangeDifficulty(difficulty) {
    const newDifficulty = difficulty === "medium" ? "insane" : "medium";
    document.cookie = `difficulty=${newDifficulty}; path=/; SameSite=Lax`;
    difficulty = document.cookie.split("; ").find(cookie => cookie.startsWith("difficulty="))?.split("=")[1];
    console.log(difficulty);    

    const {puzzle, gameMode, puzzleDifficulty} = await RequestPuzzle(difficulty);

    return { difficulty: difficulty, puzzle: puzzle, gameMode: gameMode, puzzleDifficulty: puzzleDifficulty };
}



function ToggleTheme() {
    const root = document.documentElement;

    const isDark = root.dataset.theme === "dark";
    if (isDark) {
        delete root.dataset.theme;
        root.setItem("theme", "light");
        
    }
    else {
        root.dataset.theme = "dark";
        localStorage.setItem("theme", 'dark');
    }

}