const questionTextEl = document.getElementById("question");
const answerButtonsEl = document.getElementById("answer-buttons");
const startBtnEl = document.getElementById("start-btn");
const prevBtn = document.getElementById("prev-btn");
const nextQuestionEl = document.getElementById("next-btn");
const feedbackEl = document.getElementById("feedback");
const restartBtn = document.getElementById("restart-btn");
const startScreenEl = document.getElementById("start-screen");
const quizContainerEl = document.getElementById("quiz-container");
const resultScreenEl = document.getElementById("result-screen");
const resultEl = document.getElementById("result");

const state = {
  currentQuestionIndex: 0,
  score: 0,
  quizData: [],
};

async function getQuestions() {
  const TOKEN = "LaMCPmyqzidHhv6CQOunBMcBMQSqx4SOHE3Ze3jE";
  const url = `https://quizapi.io/api/v1/questions?apiKey=${TOKEN}&limit=10`;

  const response = await fetch(url);
  const data = await response.json();

  return data.map((q) => {
    const options = Object.values(q.answers).filter((o) => o !== null);
    const correct = Object.values(q.correct_answers).findIndex(
      (o) => o === "true"
    );

    return {
      question: q.question,
      options,
      correct,
    };
  });
}

function renderQuestion(question) {
  questionTextEl.innerHTML = question.question;

  answerButtonsEl.innerHTML = "";

  question.options.forEach((option, index) => {
    answerButtonsEl.insertAdjacentHTML(
      "beforeend",
      `<button class="btn" data-index="${index}">${option}</button>`
    );
  });
}

async function startQuiz() {
  try {
    startBtnEl.textContent = "Loading...";
    startBtnEl.setAttribute("disabled", true);

    const questions = await getQuestions();
    state.quizData = questions;

    startScreenEl.classList.add("hidden");
    resultScreenEl.classList.add("hidden");
    quizContainerEl.classList.remove("hidden");

    renderQuestion(state.quizData[state.currentQuestionIndex]);
  } catch (error) {
    console.log(errror);
  } finally {
    startBtnEl.textContent = "Start Quiz";
    startBtnEl.removeAttribute("disabled");
  }
}

function prevQuestion() {
  if (state.currentQuestionIndex > 0) {
    state.currentQuestionIndex--;
    renderQuestion(state.quizData[state.currentQuestionIndex]);
    feedbackEl.classList.add("hidden");
  }
}

function nextQuestion() {
  if (state.currentQuestionIndex < quizData.length - 1) {
    state.currentQuestionIndex++;
    renderQuestion(state.quizData[state.currentQuestionIndex]);
    feedbackEl.classList.add("hidden");
  }
}

function answerQuestion(answerIndex) {
  feedbackEl.classList.remove("hidden");

  const correctIndex = state.quizData[state.currentQuestionIndex].correct;

  document.querySelectorAll("#answer-buttons .btn").forEach((btnEl) => {
    const valid = +btnEl.dataset.index === correctIndex;
    valid ? btnEl.classList.add("correct") : btnEl.classList.add("wrong");
  });

  if (+answerIndex === correctIndex) {
    state.score++;
    feedbackEl.classList.add("correct");
    feedbackEl.classList.remove("wrong");
    feedbackEl.innerHTML = "You're correct!";
  } else {
    feedbackEl.classList.add("wrong");
    feedbackEl.classList.remove("correct");
    feedbackEl.innerHTML = "You're wrong!";
  }

  if (state.currentQuestionIndex === state.quizData.length - 1) {
    showResults();
  }
}

function showResults() {
  quizContainerEl.classList.add("hidden");
  resultScreenEl.classList.remove("hidden");

  const total = state.quizData.length;
  const percentage = (state.score / total) * 100;

  if (percentage >= 50) {
    resultEl.textContent = `You scored ${state.score} out of ${total}. 🎉 You Win!`;
  } else {
    resultEl.textContent = `You scored ${state.score} out of ${total}. ❌ You Lose!`;
  }
}

restartBtn.addEventListener("click", () => {
  state.currentQuestionIndex = 0;
  state.score = 0;
  resultScreenEl.classList.add("hidden");
  quizContainerEl.classList.remove("hidden");
  startQuiz();
  // renderQuestion(state.quizData[state.currentQuestionIndex]);
});

startBtnEl.addEventListener("click", startQuiz);
prevBtn.addEventListener("click", prevQuestion);
nextQuestionEl.addEventListener("click", nextQuestion);
answerButtonsEl.addEventListener("click", (event) => {
  if (event.target.matches(".btn")) {
    answerQuestion(event.target.dataset.index);
  }
});
