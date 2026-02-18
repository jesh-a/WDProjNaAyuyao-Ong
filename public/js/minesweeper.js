const board = document.getElementById("board");
const resetBtn = document.getElementById("reset");

const startButton = document.getElementById("startButton");
const stopwatchDisplay = document.getElementById("stopwatch");

const SIZE = 10;
const BAD_PLANTS = 15;

let cells = [];
let gameOver = false;
let intervalId;
let seconds = 0;
let running = false;

function createBoard() {
    board.innerHTML = "";
    stopwatchDisplay.textContent = "00 : 00 : 00";
    cells = [];
    gameOver = false;

    board.style.gridTemplateColumns = `repeat(${SIZE}, 40px)`;

    for (let i = 0; i < SIZE * SIZE; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        cell.dataset.index = i;
        cell.dataset.bad = "false";
        cell.dataset.revealed = "false";

        cell.addEventListener("click", () => revealCell(i));

        board.appendChild(cell);
        cells.push(cell);
    }

    placeBadPlants();
}

function placeBadPlants() {
    let placed = 0;

    while (placed < BAD_PLANTS) {
        const index = Math.floor(Math.random() * cells.length);
        if (cells[index].dataset.bad === "false") {
            cells[index].dataset.bad = "true";
            placed++;
        }
    }
}

function countNeighbors(index) {
    const x = index % SIZE;
    const y = Math.floor(index / SIZE);

    let count = 0;

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;

            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
                const nIndex = ny * SIZE + nx;
                if (cells[nIndex].dataset.bad === "true") count++;
            }
        }
    }

    return count;
}

function checkWin() {
    let revealedCount = 0;

    cells.forEach((cell) => {
        if (cell.dataset.revealed === "true" && cell.dataset.bad === "false") {
            revealedCount++;
        }
    });

    const safeCells = SIZE * SIZE - BAD_PLANTS;

    if (revealedCount === safeCells) {
        gameOver = true;
        celebrateWin();
    }
}

function celebrateWin() {
    cells.forEach((cell) => {
        if (cell.dataset.bad === "false") {
            cell.textContent = "🌸";
            cell.classList.add("flower");
        }
    });

    stopTimer();
    setTimeout(() => {
        alert("Yayy! You win!");
    }, 100);
}

function revealCell(index) {
    if (gameOver) return;

    const cell = cells[index];
    if (cell.dataset.revealed === "true") return;

    cell.dataset.revealed = "true";
    cell.classList.add("revealed");

    if (cell.dataset.bad === "true") {
        cell.textContent = "☠️";
        cell.classList.add("bad");
        gameOver = true;
        stopTimer();
        alert("You touched a poisonous plant .. Game Over!");
        revealAll();
        return;
    }

    const neighbors = countNeighbors(index);
    if (neighbors > 0) {
        cell.textContent = neighbors;
    } else {
        revealNeighbors(index);
    }

    checkWin();
}

function revealNeighbors(index) {
    const x = index % SIZE;
    const y = Math.floor(index / SIZE);

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
                const nIndex = ny * SIZE + nx;
                if (cells[nIndex].dataset.revealed === "false") {
                    revealCell(nIndex);
                }
            }
        }
    }
}

function revealAll() {
    cells.forEach((cell) => {
        if (cell.dataset.bad === "true") {
            cell.textContent = "☠️";
            cell.classList.add("bad");
        }
    });
}

function resetGame() {
    seconds = 0;
    stopwatchDisplay.textContent = "00 : 00 : 00";
    startButton.style.display = "inline-block";
    stopwatchDisplay.style.display = "none";
    stopTimer();
}

resetBtn.addEventListener("click", () => {
    resetGame();
    createBoard();
});

function updateStopwatch() {
    seconds++;
    stopwatchDisplay.textContent = `${formatTime(seconds)}`;
}

function formatTime(sec) {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    const hours = Math.floor(mins / 60);

    const text = `
        ${hours > 0 ? "" : "0"}${hours} : 
        ${mins > 9 ? "" : "0"}${mins} :
        ${secs > 9 ? "" : "0"}${secs}
    `;
    return text.trim();
}

function startTimer() {
    startButton.style.display = "none";
    stopwatchDisplay.style.display = "block";
    intervalId = setInterval(updateStopwatch, 1000);
    running = true;
}

function stopTimer() {
    clearInterval(intervalId);
    running = false;
}

startButton.addEventListener("click", startTimer);
createBoard();
