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

    <!-- Start Game Button -->
    <div id="startContainer">
      <button id="startGameBtn">Start Game</button>
    </div>

    <!-- === INSTRUCTIONS SECTION (Added) === -->
    <div id="instructions">
      <h3>How to Play</h3>
      <p>• Use <strong>SPACEBAR</strong> to jump over obstacles.</p>
      <p>• When you hit an obstacle, a <strong>banana puzzle</strong> will appear!</p>
      <p>• Solve it correctly to earn <strong>+10 points</strong>.</p>
      <p>• A wrong answer deducts <strong>5 points</strong>.</p>
      <p>• Run, jump, and solve to beat your high score!</p>
    </div>
  </main>

  <!-- Puzzle Modal (unchanged, still centered) -->
  <div id="puzzleModal" class="modal">
    <h3>Banana Puzzle!</h3>
    <img id="puzzleImage" src="" alt="Banana puzzle" width="300"><br>
    <input type="text" id="answerInput" placeholder="Your Answer">
    <button onclick="submitAnswer()">Submit</button>
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