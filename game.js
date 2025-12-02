// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Background
let bg = new Image();
bg.src = "assets/background.png";
let bgX = 0;
let bgSpeed = 3;

// Player
let player = { x: 50, y: 320, vy: 0, jumping: false };
let gravity = 0.8;
window.running = false;
let score = parseInt(document.getElementById("score").innerText);

// Player animation
let playerFrames = [], currentFrame = 0, frameCounter = 0, frameDelay = 15;
for (let i = 1; i <= 3; i++) {
    let img = new Image();
    img.src = `assets/player_run${i}.png`;
    playerFrames.push(img);
}

function drawPlayer() {
    ctx.drawImage(playerFrames[currentFrame], player.x, player.y, 90, 90);

    if (running && !puzzleActive) {
        frameCounter++;
        if (frameCounter >= frameDelay) {
            currentFrame = (currentFrame + 1) % playerFrames.length;
            frameCounter = 0;
        }
    }
}

// Puzzle variables
let correctAnswer = "";
let puzzleActive = false;
let puzzleInterval = 10000; // puzzle every 10 seconds
let nextPuzzleTime = Date.now() + puzzleInterval;
let countdownTriggered = false;

// Generate options
function generateOptions(correct) {
    let opts = new Set([correct]);

    while (opts.size < 4) {
        let wrong = correct + Math.floor(Math.random() * 10 - 5);
        if (wrong > 0) opts.add(wrong);
    }
    return Array.from(opts).sort(() => Math.random() - 0.5);
}

// 3-second countdown before puzzle
function startPuzzleCountdown() {
    countdownTriggered = true;
    let count = 3;

    const countdownEl = document.getElementById("countdown");
    countdownEl.style.display = "block";
    countdownEl.innerText = count;

    let timer = setInterval(() => {
        count--;
        countdownEl.innerText = count;

        if (count <= 0) {
            clearInterval(timer);
            countdownEl.style.display = "none";
            fetchPuzzle();
        }
    }, 1000);
}

// Fetch puzzle
function fetchPuzzle() {
    running = false;
    puzzleActive = true;
    countdownTriggered = false;

    fetch("proxy.php")
        .then(res => res.json())
        .then(data => {
            document.getElementById("puzzleImage").src = data.question;
            correctAnswer = String(data.solution).trim();

            let opts = generateOptions(parseInt(correctAnswer));
            let container = document.getElementById("optionsContainer");
            container.innerHTML = "";

            opts.forEach(opt => {
                let btn = document.createElement("button");
                btn.className = "optionBtn";
                btn.innerText = opt;
                btn.onclick = () => selectOption(opt);
                container.appendChild(btn);
            });

            document.getElementById("puzzleModal").style.display = "block";
        })
        .catch(err => console.error("Puzzle fetch error:", err));
}

// Game update loop
function update() {
    if (!running) return;

    // Physics
    if (player.jumping) {
        player.vy += 0.5;
        player.y += player.vy;

        if (player.y >= 320) {
            player.y = 320;
            player.jumping = false;
        }
    }

    // Background
    bgX -= bgSpeed;
    if (bgX <= -canvas.width) bgX = 0;

    // Puzzle timing logic
    const now = Date.now();

    // When 3 secs remain → show countdown
    if (!puzzleActive && !countdownTriggered && now >= nextPuzzleTime - 3000) {
        startPuzzleCountdown();
    }

    // Countdown will call fetchPuzzle() when it reaches 0
}

// Render
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(bg, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, bgX + canvas.width, 0, canvas.width, canvas.height);

    drawPlayer();
    document.getElementById("score").innerText = score;
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}
gameLoop();

// Jump control
document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && !player.jumping && running && !puzzleActive) {
        player.vy = -13;
        player.jumping = true;
    }
});

// Option selection
function selectOption(option) {
    let userAnswer = String(option);
    let correct = (userAnswer === correctAnswer);

    score += correct ? 10 : -5;

    alert(correct ? "✅ Correct!" : "❌ Wrong! Correct answer was: " + correctAnswer);

    document.getElementById("puzzleModal").style.display = "none";

    puzzleActive = false;
    running = true;

    // Restart 10s timer ONLY after game resumes
    nextPuzzleTime = Date.now() + puzzleInterval;

    // Save score
    fetch("save_score.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "score=" + score
    })
    .then(res => res.text())
    .then(data => console.log("Score saved:", data))
    .catch(err => console.error("Score save error:", err));
}
