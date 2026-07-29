

export function RenderPuzzle(container, puzzle) {
    container.innerHTML = "";

    const containerWidth = 0.6;
    const gapRatio = 0.1; //10% of bar's width
    const barsAmount = puzzle.length;
    const barWidth = containerWidth / (barsAmount + (barsAmount - 1) * gapRatio);
    const gapWidth = barWidth * gapRatio;
    console.log("containerWidth:", containerWidth);
    console.log("barWidth:", barWidth, "gapWidth:", gapWidth);

    for (let i = 0; i < puzzle.length; i++) {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.width = `${barWidth}px`;
        bar.style.height = `${puzzle[i] * 10}px`;
        console.log(`bar ${i} height:`, puzzle[i] * 10);
        container.appendChild(bar);
    }
}