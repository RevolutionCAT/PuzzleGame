// ============================================ Game results ======================================================


export function EndGame(data) {
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
