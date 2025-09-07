// Simple blind structure (level, small, big)
const blindLevels = [
  { level: 1, small: 25, big: 50 },
  { level: 2, small: 50, big: 100 },
  { level: 3, small: 100, big: 200 },
  { level: 4, small: 200, big: 400 },
];

let currentLevel = 0;
let duration = 20 * 60; // 20 min per level
let timeLeft = duration;
let timerInterval = null;

const levelEl = document.getElementById("level");
const blindsEl = document.getElementById("blinds");
const timerEl = document.getElementById("timer");

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;

  const level = blindLevels[currentLevel];
  levelEl.textContent = `Level: ${level.level}`;
  blindsEl.textContent = `Blinds: ${level.small} / ${level.big}`;
}

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        nextLevel();
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();
  timeLeft = duration;
  updateDisplay();
}

function nextLevel() {
  pauseTimer();
  if (currentLevel < blindLevels.length - 1) {
    currentLevel++;
    timeLeft = duration;
    updateDisplay();
    startTimer();
  } else {
    timerEl.textContent = "Tournament Over";
  }
}

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("pause").addEventListener("click", pauseTimer);
document.getElementById("reset").addEventListener("click", resetTimer);
document.getElementById("next").addEventListener("click", nextLevel);

// Init
updateDisplay();
