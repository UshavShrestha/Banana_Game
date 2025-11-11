// ===== Canvas Setup =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== Background =====
let bg = new Image();
bg.src = "assets/background.png";
let bgX = 0;
let bgSpeed = 3;

// ===== Player Setup =====
let player = { x: 50, y: 320, vy: 0, jumping: false };
let gravity = 0.8;
window.running = false; // global for start/pause
let score = parseInt(document.getElementById("score").innerText);


// ===== Player Animation =====
let playerFrames = [], currentFrame = 0, frameCounter = 0, frameDelay = 15;
for (let i = 1; i <= 3; i++) {
    let img = new Image();
    img.src = `assets/player_run${i}.png`;
    playerFrames.push(img);
}

// ===== Obstacles =====
let obstacles = [];
const obstacleImages = [new Image(), new Image(), new Image(), new Image()];
obstacleImages[0].src = "assets/obs_1.png";
obstacleImages[1].src = "assets/obs_2.png";
obstacleImages[2].src = "assets/obs_3.png";
obstacleImages[3].src = "assets/obs_4.png";
let obstacleTimer = 0;
let obstacleInterval = 300;

// ===== Puzzle Variables =====
let correctAnswer = "";
let puzzleActive = false;

// ===== Draw Player =====
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

// ===== Fetch Puzzle =====
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
        .catch(err => console.error("Error fetching puzzle:", err));
}

// ===== Update Function =====
function update() {
    if (!running) return;

   // Jump physics (slower jump)
if (player.jumping) {
    player.vy += 0.5; // slower fall
    player.y += player.vy;
    if (player.y >= 320) {
        player.y = 320;
        player.jumping = false;
    }
}


    // Scroll background
    bgX -= bgSpeed;
    if (bgX <= -canvas.width) bgX = 0;

// ===== Spawn random obstacles (random height levels) =====
obstacleTimer++;
if (obstacleTimer > obstacleInterval) {
    const randomType = Math.floor(Math.random() * obstacleImages.length);
    const obstacleWidth = 70;
    const obstacleHeight = 70;
    const groundLevel = 320;

    // Generate random Y levels
    const possibleHeights = [
        groundLevel,
        groundLevel,
        groundLevel - obstacleHeight,
        groundLevel - obstacleHeight - 70,
        groundLevel - obstacleHeight - 130
    ];
    const obstacleY = possibleHeights[Math.floor(Math.random() * possibleHeights.length)];

    obstacles.push({
        x: canvas.width + 50,
        y: obstacleY,
        width: obstacleWidth,
        height: obstacleHeight,
        image: obstacleImages[randomType],
        triggered: false
    });

    obstacleTimer = 0;
    obstacleInterval = 200 + Math.random() * 300;
}



    // Move obstacles
    obstacles.forEach(ob => {
        ob.x -= bgSpeed;

        // Collision detection 
        const tolerance = 5;
        if (!ob.triggered &&
            player.x + 50 - tolerance > ob.x &&
            player.x + 40 + tolerance < ob.x + ob.width &&
            player.y + 90 > ob.y + tolerance &&
            player.y < ob.y + ob.height - tolerance
        ) {
            ob.triggered = true;

            // Show puzzle after small delay to render obstacle
            setTimeout(fetchPuzzle, 50);
        }
    });

    // Remove off-screen obstacles
    obstacles = obstacles.filter(ob => ob.x + ob.width > 0);
}


// ===== Render Function =====
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.drawImage(bg, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, bgX + canvas.width, 0, canvas.width, canvas.height);

    // Obstacles
    obstacles.forEach(ob => ctx.drawImage(ob.image, ob.x, ob.y, ob.width, ob.height));

    // Player
    drawPlayer();

    // Score
    document.getElementById("score").innerText = score;
}

// ===== Game Loop =====
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}
gameLoop();

// ===== Controls =====
document.addEventListener("keydown", function(e){
    if(e.code === "Space" && !player.jumping && running && !puzzleActive){
        player.vy = -13;
        player.jumping = true;
    }
});

// ===== Puzzle Answer =====
function submitAnswer() {
    const userAnswer = document.getElementById("answerInput").value.trim();
    if(userAnswer === correctAnswer) score += 10;
    if(userAnswer !== correctAnswer) score -= 5;

    alert(userAnswer === correctAnswer ? "✅ Correct!" : "❌ Wrong! Answer: " + correctAnswer);

    // Hide puzzle
    document.getElementById("puzzleModal").style.display = "none";
    document.getElementById("answerInput").value = "";

    // Update HUD
    document.getElementById("score").innerText = score;

    running = true;
    puzzleActive = false;

    // Send score to server
    fetch("save_score.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "score=" + score
    })
    .then(res => res.text())
    .then(data => {
        console.log("Score saved:", data);
    })
    .catch(err => console.error("Error saving score:", err));
}

