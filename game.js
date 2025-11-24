// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Background setup
let bg = new Image();
bg.src = "assets/background.png";
let bgX = 0;
let bgSpeed = 3;

// Player setup
let player = { x: 50, y: 320, vy: 0, jumping: false };
let gravity = 0.8;
window.running = false;
let score = parseInt(document.getElementById("score").innerText);

// Player animation frames
let playerFrames = [], currentFrame = 0, frameCounter = 0, frameDelay = 15;

for (let i = 1; i <= 3; i++) {
    let img = new Image();
    img.src = `assets/player_run${i}.png`;
    playerFrames.push(img);
}

// Draw animated player
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

// Puzzle control variables
let correctAnswer = "";
let puzzleActive = false;

// Generate 5–10 sec random interval
function getRandomTime() {
    return 5000 + Math.random() * 5000;
}
let nextPuzzleTime = Date.now() + getRandomTime();

// Fetch a puzzle from backend
function fetchPuzzle() {
    running = false;
    puzzleActive = true;

    fetch("proxy.php")
        .then(res => res.json())
        .then(data => {
            document.getElementById("puzzleImage").src = data.question;
            correctAnswer = String(data.solution).trim();
            document.getElementById("puzzleModal").style.display = "block";
        })
        .catch(err => console.error("Puzzle fetch error:", err));
}

// Update game state
function update() {
    if (!running) return;

    // Jump physics
    if (player.jumping) {
        player.vy += 0.5;
        player.y += player.vy;

        if (player.y >= 320) {
            player.y = 320;
            player.jumping = false;
        }
    }

    // Background movement
    bgX -= bgSpeed;
    if (bgX <= -canvas.width) bgX = 0;

    // Trigger puzzle when timer reaches next interval
    if (!puzzleActive && Date.now() >= nextPuzzleTime) {
        fetchPuzzle();
        nextPuzzleTime = Date.now() + getRandomTime();
    }
}

// Render visuals
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.drawImage(bg, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, bgX + canvas.width, 0, canvas.width, canvas.height);

    // Player
    drawPlayer();

    // HUD
    document.getElementById("score").innerText = score;
}

// Main game loop
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

// Handle puzzle answer submission
function submitAnswer() {
    const userAnswer = document.getElementById("answerInput").value.trim();

    // Score update
    if (userAnswer === correctAnswer) score += 10;
    else score -= 5;

    alert(userAnswer === correctAnswer ? "✅ Correct!" : "❌ Wrong! Answer: " + correctAnswer);

    // Close puzzle
    document.getElementById("puzzleModal").style.display = "none";
    document.getElementById("answerInput").value = "";

    running = true;
    puzzleActive = false;

    // Save updated score
    fetch("save_score.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "score=" + score
    })
    .then(res => res.text())
    .then(data => console.log("Score saved:", data))
    .catch(err => console.error("Score save error:", err));
}
