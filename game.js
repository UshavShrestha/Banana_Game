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
let gravity = 0.5;
window.running = (typeof window.running !== 'undefined') ? window.running : true;
let score = parseInt(document.getElementById("score").innerText) || 0;

// ===== Player Animation =====
let playerFrames = [], currentFrame = 0, frameCounter = 0, frameDelay = 12;
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
let obstacleInterval = 240;

// ===== Puzzle Variables =====
let correctAnswer = "";
let puzzleActive = false;

// ===== Draw Player =====
function drawPlayer() {
    // Draw current frame (if loaded)
    const frame = playerFrames[currentFrame];
    if (frame.complete && frame.naturalWidth !== 0) {
        ctx.drawImage(frame, player.x, player.y, 90, 90);
    } else {
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, 40, 40);
    }

    if (window.running && !puzzleActive) {
        frameCounter++;
        if (frameCounter >= frameDelay) {
            currentFrame = (currentFrame + 1) % playerFrames.length;
            frameCounter = 0;
        }
    }
}

// ===== Fetch Puzzle =====
function fetchPuzzle() {
    window.running = false;
    puzzleActive = true;
    fetch("proxy.php")
        .then(res => res.json())
        .then(data => {
            document.getElementById("puzzleImage").src = data.question;
            correctAnswer = String(data.solution).trim();
            document.getElementById("puzzleModal").style.display = "block";
        })
        .catch(err => {
            console.error("Error fetching puzzle:", err);
            // Resume if API fails
            window.running = true;
            puzzleActive = false;
        });
}

// ===== Update Function =====
function update() {
    if (!window.running) return;

    // Jump physics
    if (player.jumping) {
        player.vy += gravity;
        player.y += player.vy;
        if (player.y >= 320) {
            player.y = 320;
            player.jumping = false;
        }
    }

    // Scroll background
    bgX -= bgSpeed;
    if (bgX <= -canvas.width) bgX = 0;

    // Spawn random obstacles (biased to ground)
    obstacleTimer++;
    if (obstacleTimer > obstacleInterval) {
        const randomType = Math.floor(Math.random() * obstacleImages.length);
        const obstacleWidth = 70;
        const obstacleHeight = 70;
        const groundLevel = 320;

        const possibleHeights = [
            groundLevel,                       // common ground
            groundLevel,                       // duplicate biases ground
            groundLevel - obstacleHeight,      // just above ground
            groundLevel - obstacleHeight - 70, // mid-air
            groundLevel - obstacleHeight - 130 // higher
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
        obstacleInterval = 180 + Math.random() * 260;
    }

    // Move obstacles and collision detection
    obstacles.forEach(ob => {
        ob.x -= bgSpeed;

        // collision detection (loose tolerance)
        const tol = 8;
        if (!ob.triggered &&
            player.x + 60 > ob.x + tol &&
            player.x + 20 < ob.x + ob.width - tol &&
            player.y + 80 > ob.y + tol &&
            player.y < ob.y + ob.height - tol
        ) {
            ob.triggered = true;
            setTimeout(fetchPuzzle, 100);
        }
    });

    // cleanup
    obstacles = obstacles.filter(ob => ob.x + ob.width > -10);
}

// ===== Render Function =====
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background (loop)
    if (bg.complete && bg.naturalWidth !== 0) {
        ctx.drawImage(bg, bgX, 0, canvas.width, canvas.height);
        ctx.drawImage(bg, bgX + canvas.width, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#a0d8ff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Obstacles
    obstacles.forEach(ob => {
        if (ob.image.complete && ob.image.naturalWidth !== 0) {
            ctx.drawImage(ob.image, ob.x, ob.y, ob.width, ob.height);
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
        }
    });

    // Player
    drawPlayer();

    // HUD (score)
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
    if (e.code === "Space" && !player.jumping && window.running && !puzzleActive) {
        player.vy = -13;
        player.jumping = true;
    }
});

// ===== Puzzle Submit Handler =====
document.getElementById("puzzleSubmitBtn").addEventListener("click", function() {
    const userAnswer = document.getElementById("answerInput").value.trim();
    if (userAnswer === correctAnswer) score += 10;
    else score -= 5;

    alert(userAnswer === correctAnswer ? "✅ Correct!" : "❌ Wrong! Answer: " + correctAnswer);

    document.getElementById("puzzleModal").style.display = "none";
    document.getElementById("answerInput").value = "";

    // Update HUD immediately
    document.getElementById("score").innerText = score;

    // Save to DB
    fetch("save_score.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "score=" + score
    })
    .then(res => res.text())
    .then(data => console.log("Score saved:", data))
    .catch(err => console.error("Error saving score:", err));

    // Resume game
    puzzleActive = false;
    window.running = true;
});
