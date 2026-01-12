/* ================= PAROL ================= */
const PASSWORD = "nuranə"; // BURDA PAROLU DƏYİŞ
const passwordScreen = document.getElementById("passwordScreen");
const passwordInput = document.getElementById("passwordInput");
const passwordBtn = document.getElementById("passwordBtn");
const passwordError = document.getElementById("passwordError");

const bg = document.getElementById("bg");
const startOverlay = document.getElementById("startOverlay");

passwordBtn.onclick = () => {
    if(passwordInput.value === PASSWORD){
        passwordScreen.style.display = "none";
        bg.classList.remove("hidden");
        startOverlay.classList.remove("hidden");
    }else{
        passwordError.style.display = "block";
    }
};

/* ================= DAVAM ET + MUSIQI ================= */
const continueBtn = document.getElementById("continueBtn");
const music = document.getElementById("bgMusic");

continueBtn.onclick = () => {
    startOverlay.style.display = "none";
    music.play().catch(()=>{});
    startGame();
};

/* ================= OYUN DATA ================= */
const WORD = ["N","U","R","A","N","Ə"];
let index = 0;
let ended = false;
let interval;

const game = document.getElementById("game");
const heart = document.getElementById("heart");
const topWord = document.getElementById("topWord");
const endScreen = document.getElementById("endScreen");
const loseScreen = document.getElementById("loseScreen");

/* HEART */
window.addEventListener("pointermove", e=>{
    if(ended) return;
    heart.style.left = (e.clientX - heart.offsetWidth/2) + "px";
});

/* START */
function startGame(){
    index = 0;
    ended = false;
    topWord.textContent = "";
    interval = setInterval(spawnLetter,900);
}

/* LETTER */
function spawnLetter(){
    if(ended) return;

    const el = document.createElement("div");
    el.className = "letter";
    const letter = WORD[Math.floor(Math.random()*WORD.length)];
    el.textContent = letter;
    el.style.left = Math.random()*(innerWidth-60)+"px";
    el.style.animationDuration = (3 + Math.random()*2) + "s";
    game.appendChild(el);

    const check = setInterval(()=>{
        const l = el.getBoundingClientRect();
        const h = heart.getBoundingClientRect();

        if(l.bottom>h.top && l.left<h.right && l.right>h.left){
            if(letter !== WORD[index]){
                lose();
            }else{
                topWord.textContent += letter;
                index++;
                if(index === WORD.length) win();
            }
            el.remove();
            clearInterval(check);
        }

        if(l.top>innerHeight){
            el.remove();
            clearInterval(check);
        }
    },16);
}

/* WIN / LOSE */
function win(){
    ended = true;
    clearInterval(interval);
    endScreen.style.display="flex";
}

function lose(){
    ended = true;
    clearInterval(interval);
    loseScreen.style.display="flex";
}

function restartGame(){
    location.reload();
}

function closeGame(){
    document.body.innerHTML="";
}