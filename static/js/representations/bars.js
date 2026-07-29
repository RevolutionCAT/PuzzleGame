
export function RenderPuzzle(container, puzzle) {
    container.innerHTML = "";
    
    const containerWidth = container.clientWidth;
    const barCount = puzzle.length;

    const GAP_RATIO = 0.1;
    const barWidth = containerWidth / (barCount + (barCount - 1) * GAP_RATIO);
    const gap = barWidth * GAP_RATIO;
    const maxValue = Math.max(...puzzle);

    container.style.gap = `${gap}px`;

    for (const value of puzzle) {
        container.appendChild(CreateBar(value, barWidth, maxValue));
    }
}


function CreateBar(value, width, maxValue) {
    const bar = document.createElement("div");

    bar.classList.add("bar");
    bar.style.width = `${width}px`;
    bar.style.height = `${(value / maxValue) * 100}%`;

    return bar;
}