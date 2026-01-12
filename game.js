const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");

const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

const overlay = document.getElementById("continueOverlay");
const continueBtn = document.getElementById("continueBtn");

let board, currentPlayer, gameOver;
let mode = "pvp";
let difficulty = "easy";

/* 🔊 MUSİQİ BAŞLAT */
continueBtn.onclick = () => {
  bgMusic.volume = 0.4;
  bgMusic.play().catch(()=>{});
  overlay.style.display = "none";
};

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(()=>{});
}

/* MODE */
function setMode(m) {
  mode = m;
  document.getElementById("difficulty").classList.toggle("hidden", m !== "bot");
  restart();
}

function setDifficulty(d) {
  difficulty = d;
  restart();
}

/* BOARD */
function createBoard() {
  boardEl.innerHTML = "";
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => move(i, cell);
    boardEl.appendChild(cell);
  }
}

/* MOVE */
function move(i, cell) {
  if (board[i] || gameOver) return;

  board[i] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("filled");
  playSound(clickSound);

  if (checkWin()) return;

  if (board.every(v => v)) {
    statusEl.textContent = "Heç-heçə 🤝";
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusEl.textContent = `Oyunçu ${currentPlayer}`;

  if (mode === "bot" && currentPlayer === "O") {
    statusEl.textContent = "🤖 Bot düşünür...";
    setTimeout(botMove, 700);
  }
}

/* BOT */
function botMove() {
  let index;

  if (difficulty === "easy") {
    index = randomMove();
  } else if (difficulty === "normal") {
    index = findMove("O") ?? randomMove();
  } else {
    index = findMove("O") ?? findMove("X") ?? randomMove();
  }

  const cell = boardEl.children[index];
  move(index, cell);
}

function randomMove() {
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function findMove(player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let w of wins) {
    const line = w.map(i => board[i]);
    if (line.filter(v=>v===player).length === 2 && line.includes("")) {
      return w[line.indexOf("")];
    }
  }
  return null;
}

/* WIN */
function checkWin() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let w of wins) {
    if (w.every(i => board[i] === currentPlayer)) {
      statusEl.textContent = `🎉 ${currentPlayer} qalib gəldi!`;
      playSound(winSound);
      w.forEach(i => boardEl.children[i].classList.add("win"));
      gameOver = true;
      return true;
    }
  }
  return false;
}

/* RESET */
function restart() {
  statusEl.textContent = "Oyunçu X başlayır";
  createBoard();
}

createBoard();