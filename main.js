import { colors } from "./colors.js";
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
const gameBoard = document.getElementById("game-board");
const WIDTH = 720;
const HEIGHT = 540;
const PADDLE_WIDTH = 100;

let keys = {};

let lastTime = 0;
let deltaTime = 0;

let isPaused = false;
let animationId = null;

// Game state
let player = {
  x: 0,
  y: -30,
  speed: 600,
};

let score = 0;
let lives = 3;
let timeLeft = 60;

let bricks = [
  {
    x: 30,
    y: 30,
    color: colors.anger,
  },
  {
    x: 130,
    y: 30,
    color: colors.lightMustard
  },
  {
    x: 230,
    y: 30,
  },
  {
    x: 330,
    y: 30,
  },
  {
    x: 430,
    y: 30,
  },
];

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
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed * dt;
  if (keys["ArrowRight"] && player.x + PADDLE_WIDTH < WIDTH)
    player.x += player.speed * dt;
  // if (keys["ArrowUp"]) player.y -= player.speed * dt;
  // if (keys["ArrowDown"]) player.y += player.speed * dt;

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
  player.x = 0;
  player.y = 0;

  score = 0;
  lives = 3;
  timeLeft = 60;
}

function initBricks() {
  bricks.map((brick) => {
    const $brick = document.createElement("div");
    $brick.classList.add("brick");
    $brick.style.backgroundColor = brick.color
    $brick.style.transform = `translate(${brick.x}px, ${brick.y}px)`;
    gameBoard.append($brick);
  });
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
  initBricks();
  lastTime = performance.now();
  animationId = requestAnimationFrame(gameLoop);
}

startGame();
