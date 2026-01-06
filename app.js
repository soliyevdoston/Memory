// O'yin holati (State)
let config = { theme: "Numbers", players: 1, size: [4, 4] };
let gameState = {
  currentPlayer: 0,
  scores: [],
  flipped: [],
  matchedCount: 0,
  moves: 0,
  seconds: 0,
  timerInterval: null,
  isProcessing: false,
};

//  Tugmalarni bosish
document.querySelectorAll(".buttons").forEach((group) => {
  group.addEventListener("click", (e) => {
    if (e.target.classList.contains("option-btn")) {
      group.querySelector(".active").classList.remove("active");
      e.target.classList.add("active");
    }
  });
});

//  O'yinni boshlash
const startBtn = document.querySelector(".start-btn");
startBtn.onclick = function () {
  config.theme = document.querySelector(
    '[data-group="theme"] .active'
  ).innerText;
  config.players = parseInt(
    document.querySelector('[data-group="players"] .active').innerText
  );
  const sizeText = document
    .querySelector('[data-group="grid"] .active')
    .innerText.split(" x ");
  config.size = [parseInt(sizeText[0]), parseInt(sizeText[1])];

  document.querySelector(".main-page").classList.add("hidden");
  document.querySelector(".game-list").classList.remove("hidden");

  initGame();
};

function initGame() {
  clearInterval(gameState.timerInterval);
  gameState = {
    currentPlayer: 0,
    scores: new Array(config.players).fill(0),
    flipped: [],
    matchedCount: 0,
    moves: 0,
    seconds: 0,
    isProcessing: false,
  };

  // Gridni tayyorlash
  const grid = document.querySelector(".grid");
  grid.style.gridTemplateColumns = `repeat(${config.size[1]}, 1fr)`;
  grid.innerHTML = "";

  // 1 o'yinchi yoki ko'p o'yinchi panelini ko'rsatish
  if (config.players === 1) {
    document.querySelector(".player-one-stats").classList.remove("hidden");
    document.querySelector(".multi-player-stats").classList.add("hidden");
    startTimer();
  } else {
    document.querySelector(".player-one-stats").classList.add("hidden");
    document.querySelector(".multi-player-stats").classList.remove("hidden");
    updatePlayerUI();
  }

  // Kartalarni yaratish
  const totalCards = config.size[0] * config.size[1];
  let items = [];
  for (let i = 1; i <= totalCards / 2; i++) {
    items.push(i, i);
  }
  items.sort(() => Math.random() - 0.5);

  items.forEach((val) => {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    if (config.theme === "Icons") {
      // Ikonkalar bo'lsa rasmni qo'shish )
      cell.innerHTML = `<img src="img/icons/icon-${val}.svg" alt="icon">`;
    } else {
      cell.innerText = val;
    }
    cell.dataset.id = val;
    cell.onclick = () => handleFlip(cell);
    grid.appendChild(cell);
  });
}

function handleFlip(cell) {
  if (
    gameState.isProcessing ||
    cell.classList.contains("open") ||
    cell.classList.contains("matched")
  )
    return;

  cell.classList.add("open");
  gameState.flipped.push(cell);

  if (gameState.flipped.length === 2) {
    gameState.isProcessing = true;
    gameState.moves++;
    document.getElementById("moves").innerText = gameState.moves;
    checkMatch();
  }
}

function checkMatch() {
  const [c1, c2] = gameState.flipped;
  const isMatch = c1.dataset.id === c2.dataset.id;

  if (isMatch) {
    // To'g'ri topildi - SARIQ bo'ladi
    setTimeout(() => {
      c1.classList.add("matched");
      c2.classList.add("matched");
      gameState.scores[gameState.currentPlayer]++;
      gameState.matchedCount += 2;
      gameState.flipped = [];
      gameState.isProcessing = false;

      if (config.players > 1) updatePlayerUI();

      // O'yin tugashini tekshirish
      if (gameState.matchedCount === config.size[0] * config.size[1]) endGame();
    }, 400);
    // To'g'ri topsa, navbat o'zgarmaydi (o'yinchi yana yuradi)
  } else {
    // Xato - yopiladi va navbat boshqaga o'tadi
    setTimeout(() => {
      c1.classList.remove("open");
      c2.classList.remove("open");
      gameState.flipped = [];
      gameState.isProcessing = false;

      if (config.players > 1) {
        gameState.currentPlayer =
          (gameState.currentPlayer + 1) % config.players;
        updatePlayerUI();
      }
    }, 1000);
  }
}

function updatePlayerUI() {
  const container = document.querySelector(".multi-player-stats");
  container.innerHTML = "";
  for (let i = 0; i < config.players; i++) {
    const div = document.createElement("div");
    div.className = `player-card ${
      i === gameState.currentPlayer ? "active" : ""
    }`;
    div.innerHTML = `
            <span class="label">Player ${i + 1}</span>
            <span class="value">${gameState.scores[i]}</span>
        `;
    container.appendChild(div);
  }
}

function startTimer() {
  gameState.timerInterval = setInterval(() => {
    gameState.seconds++;
    const m = Math.floor(gameState.seconds / 60);
    const s = gameState.seconds % 60;
    document.getElementById("timer").innerText = `${m}:${s < 10 ? "0" + s : s}`;
  }, 1000);
}

function endGame() {
  clearInterval(gameState.timerInterval);
  const modal = document.getElementById("modal");
  const list = document.getElementById("results-list");
  const winText = document.getElementById("winner-text");

  modal.classList.remove("hidden");
  list.innerHTML = "";

  if (config.players === 1) {
    winText.innerText = "You did it!";
    list.innerHTML = `
            <div class="res-item"><span>Time Elapsed</span><span>${
              document.getElementById("timer").innerText
            }</span></div>
            <div class="res-item"><span>Moves Taken</span><span>${
              gameState.moves
            } Moves</span></div>
        `;
  } else {
    // Natijalarni saralash
    let results = gameState.scores
      .map((s, i) => ({ name: `Player ${i + 1}`, score: s }))
      .sort((a, b) => b.score - a.score);

    winText.innerText =
      results[0].score === results[1]?.score
        ? "It's a Tie!"
        : `${results[0].name} Wins!`;

    results.forEach((res, index) => {
      const div = document.createElement("div");
      div.className = `res-item ${index === 0 ? "winner" : ""}`;
      div.innerHTML = `<span>${res.name} ${
        index === 0 ? "(Winner!)" : ""
      }</span><span>${res.score} Pairs</span>`;
      list.appendChild(div);
    });
  }
}

function restartGame() {
  document.getElementById("modal").classList.add("hidden");
  initGame();
}
