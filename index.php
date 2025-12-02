<?php
session_start();
if(!isset($_SESSION['username'])){
    header("Location: login.html");
    exit;
}
$score = $_SESSION['score'] ?? 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Banana Runner</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Banana Runner</h1>
    <div id="hud">
      <span>User: <?php echo $_SESSION['username']; ?></span>
      <span>Score: <span id="score"><?php echo $score; ?></span></span>
      <button id="pauseBtn">Pause</button>
      <a href="logout.php" class="logoutBtn">Logout</a>
    </div>
  </header>

  <main>
    <canvas id="gameCanvas" width="800" height="400"></canvas>

    <div id="startContainer">
      <button id="startGameBtn">Start Game</button>
    </div>

    <div id="countdown" style="
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 80px;
    font-weight: bold;
    color: red;
    display: none;
"></div>


    <div id="instructions">
      <h3>How to Play</h3>
      <p>• Use <strong>SPACEBAR</strong> to jump.</p>
      <p>• A <strong>banana puzzle</strong> appears randomly (5–10 sec).</p>
      <p>• Correct answer = <strong>+10 points</strong>.</p>
      <p>• Wrong answer = <strong>-5 points</strong>.</p>
      <p>• Run, jump, solve!</p>
    </div>
  </main>

  <!-- UPDATED PUZZLE MODAL -->
  <div id="puzzleModal" class="modal">
    <h3>Banana Puzzle!</h3>

    <!-- Puzzle Image -->
    <img id="puzzleImage" src="" alt="Banana puzzle" width="300"><br><br>

    <!-- Multiple-choice buttons injected here -->
    <div id="optionsContainer"></div>
  </div>

  <script src="game.js"></script>

  <script>
    let running = false;
    const startBtn = document.getElementById('startGameBtn');
    const startContainer = document.getElementById('startContainer');
    const pauseBtn = document.getElementById('pauseBtn');

    startBtn.addEventListener('click', () => {
      running = true;
      startContainer.style.display = 'none';
    });

    pauseBtn.addEventListener('click', () => {
      running = !running;
      pauseBtn.textContent = running ? "Pause" : "Resume";
    });
  </script>
</body>
</html>
