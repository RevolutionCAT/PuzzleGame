// core.js is the selective core of the game. This is the decision-making part.
import { GenerateSeed, GeneratePuzzle } from "./engine.js";


export async function Prepare() {
    const response = await fetch("/api/date"); // await works only in async functions
    const serverData = await response.json(); // turn into json

    let baseSeed = GenerateSeed(serverData.date);
    console.log("date:", serverData.date);
    
    const { base, variation, type } = SelectAlgorithm(baseSeed, serverData.algorithms);
    const name = variation === "default" ? base : `${base}_${variation}`;
    // structure:   condition ? valueIfTrue : valueIfFalse

    const algorithm = await LoadAlgorithm(name, type);
    console.log("chosen algorithm: ", name, " of ", type, "    |    compatible with: ", algorithm.compatibleWith);
    const mode = SelectMode(baseSeed, algorithm.compatibleWith);
    console.log("selected mode: ", mode);

    const maxAttempts = 10;
    let attempt = 0;
    let puzzle;
    let valid;

    do {
        puzzle = GeneratePuzzle(baseSeed, type);
        attempt++;
        valid = await IsValid(puzzle, algorithm.compatibleWith, type);

        if (!valid) {
            baseSeed = GenerateSeed(baseSeed + `-retry${attempt}`);
        }

        if (attempt === maxAttempts) {
            console.log("Something went wrong.");
            break;
        }
    } while (!valid);

    const simulationResults = algorithm.Simulate(puzzle);
    const totalDifficulty = simulationResults.puzzleDifficulty + algorithm.recognizability


    // + функция которая примет выбранный в итоге пазл (нерешенный) и отправит запрос в html на рендер по методу.js
    await ManageVisuals(puzzle, mode, totalDifficulty);
}





function SelectAlgorithm(baseSeed, algorithms) {
    let all_algorithms = [];
    const localSeed = GenerateSeed(baseSeed + "-SelectAlgorithm");

    for (const [type, bases] of Object.entries(algorithms)) {
        for (const [base, variations] of Object.entries(bases)) {
            for (const variation of variations) {
                all_algorithms.push({ base, variation, type });
            }
        }
    }

    const index = (localSeed >>> 0) % all_algorithms.length;
    const selected = all_algorithms[index]; 
    return selected; // {base, variation, type}
}



async function LoadAlgorithm(name, type) {
    const module = await import(`./algorithms/${type}/${name}.js`);
    return module;             // whatever the file exports
}



function SelectMode(baseSeed, modes) {
    const localSeed = GenerateSeed(baseSeed+"-SelectMode");
    const index = localSeed % modes.length;
    const selected = modes[index];
    return selected;
}



async function IsValid(puzzle, compatibleWith, type, minDifficulty=4) {
    let algorithm = "";

    if (compatibleWith.some(item => ["bars", "numbers"].includes(item))) {
        algorithm = "BubbleSort_optimized";
    }
    else if (compatibleWith.some(item => ["labyrinth"].includes(item))) {
        algorithm = "";
    }

    const module = await import(`./algorithms/${type}/${algorithm}.js`)
    const {steps, puzzleDifficulty} = module.Simulate(puzzle)

    if (puzzleDifficulty < minDifficulty) {
        return false;
    }
    return true;
}


// =====================================================================================================

async function ManageVisuals(puzzle, mode, totalDifficulty) {
    const container = document.getElementById("puzzle-container");
    const representation = await LoadRepresentation(mode);
    representation.RenderPuzzle(container, puzzle);

}





async function LoadRepresentation(mode) {
    const representation = await import(`./representations/${mode}.js`);
    return representation;
}
