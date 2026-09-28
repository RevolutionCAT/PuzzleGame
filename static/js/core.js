// core.js is the selective core of the game. This is the decision-making part. Uses engine.js to process most decisions



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