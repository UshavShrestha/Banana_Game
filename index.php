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
  <title>Banana Puzzle</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Banana Puzzle</h1>
    <div id="hud">
      <span>User: <?php echo $_SESSION['username']; ?></span>
      <span>Score: <span id="score"><?php echo $score; ?></span></span>
      <a href="logout.php" class="logoutBtn">Logout</a>
    </div>
  </header>

  <main>
    <div id="puzzleContainer">
      <img id="puzzleImage" src="" alt="Banana puzzle" width="300"><br>
      <input type="text" id="answerInput" placeholder="Your Answer">
      <button id="submitBtn">Submit</button>
    </div>
    <button id="loadPuzzleBtn">Load Puzzle</button>
  </main>

  <script src="app.js"></script>
</body>
</html>
