const puzzleImage = document.getElementById("puzzleImage");
const answerInput = document.getElementById("answerInput");
const resultDiv = document.getElementById("result");
const submitBtn = document.getElementById("submitBtn");
const loadPuzzleBtn = document.getElementById("loadPuzzleBtn");

let correctAnswer = "";

// Load puzzle
loadPuzzleBtn.addEventListener("click", () => {
  fetch("proxy.php")
    .then(res => res.json())
    .then(data => {
      puzzleImage.src = data.question;
      correctAnswer = String(data.solution).trim();
      resultDiv.innerText = "";
    })
    .catch(err => console.error("Error:", err));
});

// Submit answer
submitBtn.addEventListener("click", () => {
  const userAnswer = answerInput.value.trim();
  if(userAnswer === correctAnswer) {
    resultDiv.innerText = "✅ Correct!";
  } else {
    resultDiv.innerText = `❌ Wrong! Answer: ${correctAnswer}`;
  }
  answerInput.value = "";
});
