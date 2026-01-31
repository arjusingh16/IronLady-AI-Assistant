const chat = document.getElementById("chat");
const input = document.getElementById("input");
const typing = document.getElementById("typing");
const cards = document.getElementById("cards");
const progress = document.getElementById("progress");

let history = JSON.parse(localStorage.getItem("chat")) || [];
let step = 1;
let userGoal = "";

restore();

function bot(text) {
  addMsg("bot", text);
}

function user(text) {
  addMsg("user", text);
}

function addMsg(type, text) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  history.push({ type, text });
  localStorage.setItem("chat", JSON.stringify(history));
}

function send() {
  const text = input.value.trim();
  if (!text) return;
  user(text);
  input.value = "";
  typing.style.display = "block";

  setTimeout(() => {
    reply(text.toLowerCase());
    typing.style.display = "none";
  }, 700);
}

input.addEventListener("keypress", e => {
  if (e.key === "Enter") send();
});

function reply(msg) {
  if (step === 1) {
    bot("What is your main goal?");
    showCards(["Job", "Beginner", "Skill Upgrade"]);
    step = 2;
    progress.innerText = "Step 2 / 4";
    return;
  }

  if (step === 2) {
    userGoal = msg;
    bot(`Nice choice! What level are you at?`);
    showCards(["No Experience", "Some Basics", "Experienced"]);
    step = 3;
    progress.innerText = "Step 3 / 4";
    return;
  }

  if (step === 3) {
    bot("🎯 Recommendation Ready!");
    bot(`Based on your answers, a structured practical program suits you best.`);
    clearCards();
    progress.innerText = "Completed ✔";
    step = 4;
  }
}

function showCards(options) {
  cards.innerHTML = "";
  options.forEach(opt => {
    const c = document.createElement("div");
    c.className = "card";
    c.innerText = opt;
    c.onclick = () => sendCard(opt);
    cards.appendChild(c);
  });
}

function sendCard(text) {
  user(text);
  reply(text.toLowerCase());
}

function clearCards() {
  cards.innerHTML = "";
}

function resetChat() {
  localStorage.clear();
  chat.innerHTML = "";
  history = [];
  step = 1;
  progress.innerText = "Step 1 / 4";
  bot("Hello 👋 Let’s start fresh!");
}

function undo() {
  history.pop();
  localStorage.setItem("chat", JSON.stringify(history));
  restore();
}

function restore() {
  chat.innerHTML = "";
  history.forEach(m => addMsg(m.type, m.text));
  if (history.length === 0) bot("Hello 👋 I’m your Lady AI Assistant.");
}
