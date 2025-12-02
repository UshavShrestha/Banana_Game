<?php
session_start();
if(!isset($_SESSION['username'])){
    header("Location: login.html");
    exit;
}
$score = $_SESSION['score'] ?? 0;
$username = $_SESSION['username'];
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
      <span>User: <?php echo $username; ?></span>
      <span>Score: <span id="score"><?php echo $score; ?></span></span>
      <button id="pauseBtn">Pause</button>
      <a href="services/logout.php" class="logoutBtn">Logout</a>
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

    <!-- ===== Two Column Section ===== -->
    <div id="game-info">
      <div id="instructions">
        <h3>How to Play</h3>
        <p>• Use <strong>SPACEBAR</strong> to jump.</p>
        <p>• A <strong>banana puzzle</strong> appears randomly (5–10 sec).</p>
        <p>• Correct answer = <strong>+10 points</strong>.</p>
        <p>• Wrong answer = <strong>-5 points</strong>.</p>
        <p>• Run, jump, solve!</p>
      </div>

      <div id="leaderboard">
        <h3>Leaderboard</h3>
        <ol id="leaderboardList">
          <!-- Top 5 players injected by game.js -->
        </ol>
      </div>
    </div>
  </main>

  <!-- PUZZLE MODAL -->
  <div id="puzzleModal" class="modal">
    <h3>Banana Puzzle!</h3>
    <img id="puzzleImage" src="" alt="Banana puzzle" width="300"><br><br>
    <div id="optionsContainer"></div>
  </div>

  <script>
    const currentUser = "<?php echo $username; ?>";
  </script>
  <script src="game.js"></script>
</body>
</html>
