// 1️⃣ Buttonlarni tanlash (active toggle)
document.querySelectorAll(".buttons").forEach(function (group) {
  group.onclick = function (event) {
    if (event.target.classList.contains("option-btn")) {
      const oldActive = group.querySelector(".active");
      if (oldActive) {
        oldActive.classList.remove("active");
      }

      event.target.classList.add("active");
    }
  };
});

const startBtn = document.querySelector(".start-btn");
const menuPage = document.querySelector(".main-page");
const gamePage = document.querySelector(".game-page");
const grid = document.querySelector(".grid");

startBtn.onclick = function () {
  const numico = document.querySelector(
    '[data-group="theme"] .active'
  ).textContent;

  const colRumText = document.querySelector(
    '[data-group="grid"] .active'
  ).textContent;

  const colRum = colRumText.split(" x ");
  const rows = Number(colRum[0]);
  const columns = Number(colRum[1]);

  menuPage.style.display = "none";
  gamePage.style.display = "flex";

  grid.className = "grid " + numico.toLowerCase();
  grid.style.gridTemplateColumns = "repeat(" + columns + ", 1fr)";

  createCards(rows * columns, numico);
};

function createCards(Cardlarsoni, TanlanganNumico) {
  grid.innerHTML = "";
  let cards = [];

  for (let i = 1; i <= Cardlarsoni / 2; i++) {
    if (TanlanganNumico === "Numbers") {
      cards.push(i);
      cards.push(i);
    } else {
      cards.push("icon-" + i);
      cards.push("icon-" + i);
    }
  }

  cards.sort(() => Math.random() - 0.5);

  console.log(cards);

  cards.forEach(function (value) {
    const card = document.createElement("div");
    card.className = "grid-cell";
    card.dataset.value = value;
    console.log(value);

    if (TanlanganNumico === "Icons") {
      card.style.setProperty("--icon", "url(../img/icons/" + value + ".svg)");
    }

    card.onclick = function () {
      if (card.classList.contains("open")) return;

      card.classList.add("open");
    };

    grid.appendChild(card);
  });
}
