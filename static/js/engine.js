// engine.js is the processing power of the game. It processes things such as generation or RNG.

export function GenerateSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash | 0; // keep it a 32bit integer
    }
    hash = Math.abs(hash);

     // MurmurHash (v3) part
    hash ^= hash >>> 16;
    hash = Math.imul(hash, 0x85ebca6b);
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 0xc2b2ae35);
    hash ^= hash >>> 16;
    return hash;
}


export function mulberry32(seed) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}


export function GeneratePuzzle(baseSeed, type) {
    const RNG = mulberry32(baseSeed); 
    let puzzle = [];
    
    if (type == "sorting") {
        const puzzleLength = 8;

        for (let i = 0; i < puzzleLength; i++) {
            puzzle[i] = Math.ceil((RNG()*10));
        }
        console.log("Generated puzzle: ", puzzle);
    }
    return puzzle;
}


// ============================================ Selection ===================================================
export function SelectAlgorithm(baseSeed, algorithms) {
    console.log("Algorithms: ", algorithms);
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
    return { base: "BubbleSort", variation: "optimized", type: "sorting" }; // debug
}



export function SelectMode(baseSeed, modes) {
    const localSeed = GenerateSeed(baseSeed+"-SelectMode");
    const index = localSeed % modes.length;
    const selected = modes[index];
    const fakeSelected = "bars_small";
    //return selected;
    return fakeSelected;
}
