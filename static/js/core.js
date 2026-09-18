// core.js is the selective core of the game. This is the decision-making part.
import { GenerateSeed, GeneratePuzzle } from "./engine.js";


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
    let puzzle;
    let valid;

    do {
        puzzle = GeneratePuzzle(baseSeed, type);
        attempt++;
        valid = IsValid(puzzle, algorithm);

        if (!valid) {
            baseSeed = GenerateSeed(baseSeed + `-retry${attempt}`);
            console.log("The puzzle is invalid. Regenerating attempt:", attempt);
        }

        if (attempt === maxAttempts) {
            throw new Error("Max attempts limit exceeded.");
        }
    } while (!valid);

    const simulationResults = algorithm.Simulate(puzzle);
    const totalPuzzleDifficulty = simulationResults.puzzleDifficulty + algorithm.recognizability
    const puzzleSteps = simulationResults.steps;

    return { puzzle, mode, puzzleSteps, totalPuzzleDifficulty };
}



//=================================================Processing===================================================================

function SelectAlgorithm(baseSeed, algorithms) {
    console.log(algorithms);
    let all_algorithms = [];
    const localSeed = GenerateSeed(baseSeed + "-SelectAlgorithm");

    for (const [type, bases] of Object.entries(algorithms)) {
        for (const [base, variations] of Object.entries(bases)) {
            for (const variation of variations) {
                all_algorithms.push({ base, variation, type });
            }
        }
    }

    if (all_algorithms.length === 0) {
        throw new Error("No algorithms are available. SelectAlgorithm failed.");
    }

    const index = (localSeed >>> 0) % all_algorithms.length;
    const selected = all_algorithms[index]; 
    // return selected;
    return { base: "BubbleSort", variation: "optimized", type: "sorting" };
}



async function LoadAlgorithm(base, variation, type) {
    console.log(base, variation, type);
    const module = await import(`./algorithms/${type}/${base}/${variation}.js`);
    return module;             // whatever the file exports
}



function SelectMode(baseSeed, modes) {
    const localSeed = GenerateSeed(baseSeed+"-SelectMode");
    const index = localSeed % modes.length;
    const selected = modes[index];
    const fakeSelected = "bars_small";
    //return selected;
    return fakeSelected;
}



function IsValid(puzzle, algorithm, minDifficulty=4) {
    const { puzzleDifficulty } = algorithm.Simulate(puzzle);
    if (puzzleDifficulty < minDifficulty) {
        return false;
    }
    return true;
}

function ChosenDifficulty() {
    return "Normal";
}


//===========================================Visuals==========================================================

export async function ManageVisuals(puzzle, mode, totalPuzzleDifficulty, OnMove) {
    const container = document.getElementById("puzzle-container");
    const representation = await LoadRepresentation(mode);
    representation.RenderPuzzle(container, puzzle, OnMove);
    return representation;
}


async function LoadRepresentation(mode) {
    const representation = await import(`./visualisations/${mode}/Manage.js`);
    return representation;
}