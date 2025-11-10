const puzzleImage = document.getElementById("puzzleImage");
const answerInput = document.getElementById("answerInput");
const resultDiv = document.getElementById("score");
const submitBtn = document.getElementById("submitBtn");
const loadPuzzleBtn = document.getElementById("loadPuzzleBtn");

let correctAnswer = "";
let score = parseInt(resultDiv.innerText);

// Load puzzle
loadPuzzleBtn.addEventListener("click", () => {
  fetch("proxy.php")
    .then(res => res.json())
    .then(data => {
      puzzleImage.src = data.question;
      correctAnswer = String(data.solution).trim();
    })
    .catch(err => console.error("Error:", err));
});

// Submit answer
submitBtn.addEventListener("click", () => {
  const userAnswer = answerInput.value.trim();
  if(userAnswer === correctAnswer){
    score += 10;
  } else {
    score -= 5;
  }
  resultDiv.innerText = score;

  // Save score to DB
  fetch("save_score.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "score=" + score
  });

  answerInput.value = "";
});
