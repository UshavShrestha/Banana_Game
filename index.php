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
      <span>User: <?php echo htmlspecialchars($_SESSION['username']); ?></span>
      <span>Score: <span id="score"><?php echo intval($score); ?></span></span>
      <a href="logout.php" class="logoutBtn">Logout</a>
    </div>
  </header>

  <main>
    <canvas id="gameCanvas" width="800" height="400"></canvas>
    <div id="instructions">
      <h3>How to Play</h3>
      <p>Press <strong>SPACEBAR</strong> to jump. Hitting an obstacle opens a banana puzzle. Solve to gain points.</p>
    </div>
  </main>

  <!-- Puzzle Modal -->
  <div id="puzzleModal" class="modal">
    <h3>Banana Puzzle!</h3>
    <img id="puzzleImage" src="" alt="Banana puzzle" width="300"><br>
    <input type="text" id="answerInput" placeholder="Your Answer">
    <button id="puzzleSubmitBtn">Submit</button>
  </div>

  <script src="game.js"></script>
  <script>
    // game.js reads score from DOM; ensure running starts automatically
    window.running = true;
  </script>
</body>
</html>
