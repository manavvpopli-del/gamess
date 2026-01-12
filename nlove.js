const continueBtn = document.getElementById("continueBtn");
const overlay = document.getElementById("startOverlay");
const music = document.getElementById("bgMusic");

continueBtn.onclick = () => {
    overlay.style.display = "none";
    music.play().catch(()=>{});
    startGame();
};

const WORD = ["N","U","R","A","N","Ə"];
let index = 0;
let ended = false;
let interval = null;

const game = document.getElementById("game");
const heart = document.getElementById("heart");
const topWord = document.getElementById("topWord");
const endScreen = document.getElementById("endScreen");
const loseScreen = document.getElementById("loseScreen");

/* HEART DRAG */
window.addEventListener("pointermove", e => {
    if (ended) return;
    let x = e.clientX - heart.offsetWidth / 2;
    x = Math.max(0, Math.min(innerWidth - heart.offsetWidth, x));
    heart.style.left = x + "px";
});

/* START GAME */
function startGame(){
    index = 0;
    ended = false;
    topWord.textContent = "";
    endScreen.style.display = "none";
    loseScreen.style.display = "none";

    if(interval) clearInterval(interval);
    interval = setInterval(spawnLetter, 900);
}

/* LETTER SPAWN */
function spawnLetter(){
    if (ended) return;

    const el = document.createElement("div");
    el.className = "letter";

    const letter = WORD[Math.floor(Math.random() * WORD.length)];
    el.textContent = letter;

    el.style.left = Math.random() * (innerWidth - 60) + "px";
    el.style.top = "-80px";
    el.style.animationDuration = (3 + Math.random() * 2) + "s";

    game.appendChild(el);

    const check = setInterval(() => {
        const l = el.getBoundingClientRect();
        const h = heart.getBoundingClientRect();

        if (
            l.bottom > h.top &&
            l.left < h.right &&
            l.right > h.left
        ) {
            if (letter !== WORD[index]) {
                lose();
            } else {
                topWord.textContent += letter;
                index++;
                if (index === WORD.length) win();
            }
            el.remove();
            clearInterval(check);
        }

        if (l.top > innerHeight) {
            el.remove();
            clearInterval(check);
        }
    }, 16);
}

/* WIN / LOSE */
function win(){
    ended = true;
    clearInterval(interval);
    endScreen.style.display = "flex";
}

function lose(){
    ended = true;
    clearInterval(interval);
    loseScreen.style.display = "flex";
}

function restartGame(){
    location.reload();
}

function closeGame(){
    document.body.innerHTML = "";
}