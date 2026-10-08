const state = {
  question: "",
  category: "",
  history: loadHistory(),
};

const profession = document.getElementById("profession");
const mode = document.getElementById("mode");
const generateButton = document.getElementById("generate-button");
const evaluateButton = document.getElementById("evaluate-button");
const questionPanel = document.getElementById("question-panel");
const emptyState = document.getElementById("empty-state");
const questionText = document.getElementById("question-text");
const questionCategory = document.getElementById("question-category");
const questionMode = document.getElementById("question-mode");
const answer = document.getElementById("answer");
const status = document.getElementById("status");
const feedbackPanel = document.getElementById("feedback-panel");
const feedbackSummary = document.getElementById("feedback-summary");
const scoreGrid = document.getElementById("score-grid");
const strengthsList = document.getElementById("strengths-list");
const improvementsList = document.getElementById("improvements-list");
const improvedAnswer = document.getElementById("improved-answer");
const historyList = document.getElementById("history-list");
const sessionCount = document.getElementById("session-count");
const averageScore = document.getElementById("average-score");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");

function loadHistory() {
  try {
    return JSON.parse(sessionStorage.getItem("interview-history") || "[]");
  } catch {
    return [];
  }
}

function saveHistory() {
  try {
    sessionStorage.setItem("interview-history", JSON.stringify(state.history));
  } catch {
    setStatus("History could not be saved in this browser session.", "error");
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
}

function loadTheme() {
  try {
    return localStorage.getItem("interview-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function setStatus(message, type = "") {
  status.textContent = message;
  status.className = type ? `status ${type}` : "status";
}

function setBusy(button, busy, busyLabel, readyLabel) {
  button.disabled = busy;
  button.textContent = busy ? busyLabel : readyLabel;
}

async function postJSON(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}.`);
  }
  return data;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((total, value) => total + Number(value), 0) / values.length;
}

function labelFor(key) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function renderTextList(element, items) {
  element.textContent = "";
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    element.appendChild(listItem);
  });
}

function renderScores(scores) {
  scoreGrid.textContent = "";
  Object.entries(scores).forEach(([key, value]) => {
    const card = document.createElement("div");
    card.className = "score-card";
    const heading = document.createElement("h3");
    heading.textContent = labelFor(key);
    const score = document.createElement("strong");
    score.textContent = `${value}/10`;
    const meter = document.createElement("div");
    meter.className = "meter";
    const fill = document.createElement("span");
    fill.style.width = `${Number(value) * 10}%`;
    meter.appendChild(fill);
    card.append(heading, score, meter);
    scoreGrid.appendChild(card);
  });
}

function renderFeedback(feedback) {
  feedbackSummary.textContent = feedback.summary;
  improvedAnswer.textContent = feedback.improved_answer;
  renderScores(feedback.scores);
  renderTextList(strengthsList, feedback.strengths);
  renderTextList(improvementsList, feedback.improvements);
  feedbackPanel.hidden = false;
  feedbackPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderHistory() {
  sessionCount.textContent = String(state.history.length);
  const allScores = state.history.flatMap((entry) => Object.values(entry.feedback.scores));
  averageScore.textContent = average(allScores).toFixed(1);
  historyList.textContent = "";
  if (!state.history.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No completed attempts yet.";
    historyList.appendChild(empty);
    return;
  }
  state.history.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "history-card";
    const header = document.createElement("header");
    const title = document.createElement("strong");
    title.textContent = `${entry.profession} | ${entry.mode}`;
    const result = document.createElement("strong");
    result.textContent = `${average(Object.values(entry.feedback.scores)).toFixed(1)}/10`;
    header.append(title, result);
    const meta = document.createElement("p");
    meta.className = "muted small";
    meta.textContent = entry.category;
    const question = document.createElement("p");
    question.textContent = entry.question;
    card.append(header, meta, question);
    historyList.appendChild(card);
  });
}

async function generateQuestion() {
  setStatus("Generating a tailored question...");
  setBusy(generateButton, true, "Generating...", "Generate Question");
  try {
    const data = await postJSON("/api/question", {
      profession: profession.value,
      mode: mode.value,
    });
    state.question = data.question;
    state.category = data.category;
    questionText.textContent = data.question;
    questionCategory.textContent = data.category;
    questionMode.textContent = mode.value;
    answer.value = "";
    emptyState.hidden = true;
    questionPanel.hidden = false;
    feedbackPanel.hidden = true;
    setStatus("Question ready.", "success");
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    setBusy(generateButton, false, "Generating...", "Generate Question");
  }
}

async function evaluateCurrentAnswer() {
  const trimmedAnswer = answer.value.trim();
  if (!state.question) {
    setStatus("Generate a question before submitting an answer.", "error");
    return;
  }
  if (!trimmedAnswer) {
    setStatus("Write an answer before requesting feedback.", "error");
    return;
  }

  setStatus("Evaluating answer...");
  setBusy(evaluateButton, true, "Evaluating...", "Evaluate Answer");

  try {
    const feedback = await postJSON("/api/evaluate", {
      profession: profession.value,
      mode: mode.value,
      question: state.question,
      answer: trimmedAnswer,
    });

    renderFeedback(feedback);

    state.history.unshift({
      profession: profession.value,
      mode: mode.value,
      category: state.category,
      question: state.question,
      answer: trimmedAnswer,
      feedback: feedback,
    });

    saveHistory();
    renderHistory();
    setStatus("Evaluation complete.", "success");
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    setBusy(evaluateButton, false, "Evaluating...", "Evaluate Answer");
  }
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    localStorage.setItem("interview-theme", nextTheme);
  } catch {
    setStatus("Theme changed, but the browser could not save the preference.", "error");
  }
});

generateButton.addEventListener("click", generateQuestion);
evaluateButton.addEventListener("click", evaluateCurrentAnswer);

applyTheme(loadTheme());
renderHistory();
