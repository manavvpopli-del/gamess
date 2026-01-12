const canvas = document.getElementById("bunny-canvas");
const ctx = canvas.getContext("2d");

let buildings = [];
let current = 0;
let running = true;

let stick = {
  length: 0,
  growing: false
};

let bunny = {
  x: 60,
  y: 450,
  r: 18
};

/* INIT */
resetGame();
loop();

/* RESET */
function resetGame() {
  buildings = [];
  current = 0;
  bunny.x = 60;
  stick.length = 0;
  createBuildings();
}

/* BUILDINGS */
function createBuildings() {
  let x = 80;
  for (let i = 0; i < 10; i++) {
    x += Math.random() * 90 + 60;
    buildings.push({
      x,
      width: Math.random() * 40 + 40
    });
  }
}

/* DRAW */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // buildings
  ctx.fillStyle = "#333";
  buildings.forEach(b => {
    ctx.fillRect(b.x, 480, b.width, 120);
  });

  // bunny
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(bunny.x, bunny.y, bunny.r, 0, Math.PI * 2);
  ctx.fill();

  // stick
  if (stick.length > 0) {
    ctx.save();
    ctx.translate(bunny.x + bunny.r, bunny.y);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "#8b4513";
    ctx.fillRect(0, 0, 6, stick.length);
    ctx.restore();
  }
}

/* STICK LOGIC */
function growStick() {
  if (stick.growing) stick.length += 4;
}

function dropStick() {
  stick.growing = false;

  const target = buildings[current];
  const distance = target.x - (bunny.x + bunny.r);

  if (stick.length >= distance && stick.length <= distance + target.width) {
    bunny.x = target.x + target.width / 2;
    current++;

    if (current === buildings.length) {
      setTimeout(() => {
        alert("🎉 QAZANDIN!");
        resetGame();
      }, 100);
    }
  } else {
    setTimeout(() => {
      alert("💀 UDUZDUN!");
      resetGame();
    }, 100);
  }

  stick.length = 0;
}

/* INPUT */
canvas.addEventListener("mousedown", () => stick.growing = true);
canvas.addEventListener("mouseup", dropStick);

canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  stick.growing = true;
});

canvas.addEventListener("touchend", e => {
  e.preventDefault();
  dropStick();
});

/* LOOP */
function loop() {
  if (!running) return;
  growStick();
  draw();
  requestAnimationFrame(loop);
}