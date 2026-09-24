// core.js is the selective core of the game. This is the decision-making part. Uses engine.js to process most decisions
import { GenerateSeed, GeneratePuzzle, SelectAlgorithm, SelectMode } from "./engine.js";


export async function Prepare() {
    const response = await fetch("/api/date"); // await works only in async functions
    const serverData = await response.json(); // turn into json

    console.log("date:", serverData.date);
    let baseSeed = GenerateSeed(serverData.date);

    let Difficulty = ChosenDifficulty();
    
    const { base, variation, type } = SelectAlgorithm(baseSeed, serverData.algorithms);

    //const name = variation === "default" ? base : `${base}_${variation}`;
    // structure:   condition ? valueIfTrue : valueIfFalse

    const algorithm = await LoadAlgorithm(base, variation, type);
    console.log("chosen algorithm: ", base, " of ", type, "    |    compatible with: ", algorithm.compatibleWith);
    const mode = SelectMode(baseSeed, algorithm.compatibleWith);
    console.log("selected mode: ", mode);

    const maxAttempts = 10;
    let attempt = 0;
    let originalPuzzle;
    let valid;

    do {
        originalPuzzle = GeneratePuzzle(baseSeed, type);
        attempt++;
        valid = IsValid(originalPuzzle, algorithm);

        if (!valid) {
            baseSeed = GenerateSeed(baseSeed + `-retry${attempt}`);
            console.log("The puzzle is invalid. Regenerating attempt:", attempt);
        }
        if (attempt === maxAttempts)
            throw new Error("Max attempts limit exceeded. Something is likely wrong.");

    } while (!valid);

    const simulationResults = algorithm.Simulate(originalPuzzle);
    const totalPuzzleDifficulty = simulationResults.puzzleDifficulty + algorithm.recognizability;
    const puzzleStepsByIteration = simulationResults.steps;
    const targetPuzzleStates = simulationResults.targetStates;

    return { originalPuzzle, targetPuzzleStates, puzzleStepsByIteration, mode, totalPuzzleDifficulty };
}



//================================================= Functions ===================================================================
async function LoadAlgorithm(base, variation, type) {
    console.log(base, variation, type);
    const module = await import(`./algorithms/${type}/${base}/${variation}.js`);
    return module;             // whatever the file exports
}


function IsValid(puzzle, algorithm, minDifficulty=4) {
    const { puzzleDifficulty } = algorithm.Simulate(puzzle);
    if (puzzleDifficulty < minDifficulty)
        return false;
    return true;
}


function ChosenDifficulty() {
    return "Normal";
}


//===========================================Visuals==========================================================

async function LoadRepresentation(mode) {
    const representation = await import(`./visualisations/${mode}/Manage.js`);
    return representation;
}


export async function ManageVisuals(puzzle, mode, totalPuzzleDifficulty, OnMove) {
    const container = document.getElementById("puzzle-container");
    const representation = await LoadRepresentation(mode);
    representation.RenderPuzzle(container, puzzle, OnMove);
    return representation;
}