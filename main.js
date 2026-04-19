// ==========================
// STATE
// ==========================
const playerEl = document.getElementById("player");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const timerEl = document.getElementById("timer");

const pauseMenu = document.getElementById("pauseMenu");
const continueBtn = document.getElementById("continueBtn");
const restartBtn = document.getElementById("restartBtn");

let keys = {};

let lastTime = 0;
let deltaTime = 0;

let isPaused = false;
let animationId = null;

// Game state
let player = {
  x: 100,
  y: 800,
  speed: 300,
};

let score = 0;
let lives = 3;
let timeLeft = 60;

// ==========================
// INPUT
// ==========================
window.addEventListener("keydown", (e) => {
  keys[e.code] = true;

  if (e.code === "Escape") togglePause();
});

window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// ==========================
// GAME LOOP
// ==========================
function gameLoop(timestamp) {
  if (isPaused) return;

  deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(deltaTime);
  render();

  animationId = requestAnimationFrame(gameLoop);
}

// ==========================
// UPDATE
// ==========================
function update(dt) {
  // Movement (smooth)
  if (keys["ArrowLeft"]) player.x -= player.speed * dt;
  if (keys["ArrowRight"]) player.x += player.speed * dt;
  if (keys["ArrowUp"]) player.y -= player.speed * dt;
  if (keys["ArrowDown"]) player.y += player.speed * dt;

  // Timer
  timeLeft -= dt;
  if (timeLeft <= 0) {
    endGame();
  }
}

// ==========================
// RENDER (FAST!)
// ==========================
function render() {
  playerEl.style.transform = `translate(${player.x}px, ${player.y}px)`;

  scoreEl.textContent = "Score: " + score;
  livesEl.textContent = "Lives: " + lives;
  timerEl.textContent = "Time: " + Math.floor(timeLeft);
}

// ==========================
// PAUSE / RESUME
// ==========================
function togglePause() {
  isPaused = !isPaused;

  if (isPaused) {
    pauseMenu.classList.remove("hidden");
    cancelAnimationFrame(animationId);
  } else {
    pauseMenu.classList.add("hidden");
    lastTime = performance.now();
    animationId = requestAnimationFrame(gameLoop);
  }
}

continueBtn.addEventListener("click", togglePause);

// ==========================
// RESET / RESTART
// ==========================
function resetGame() {
  player.x = 100;
  player.y = 100;

  score = 0;
  lives = 3;
  timeLeft = 60;
}

restartBtn.addEventListener("click", () => {
  resetGame();
  togglePause();
});

// ==========================
// END GAME
// ==========================
function endGame() {
  isPaused = true;
  cancelAnimationFrame(animationId);
  alert("Game Over!");
}

// ==========================
// START
// ==========================
function startGame() {
  lastTime = performance.now();
  animationId = requestAnimationFrame(gameLoop);
}

startGame();
