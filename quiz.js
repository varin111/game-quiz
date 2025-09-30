// quiz.js
// Quiz data, logic, and UI handling will go here.

// Enhanced questions with categories and some text-only questions
const questions = [
  {
    category: 'Computers',
    image: 'keyboard.png', // Keyboard
    text: 'What is this?',
    answers: ['Mouse', 'Monitor', 'Keyboard'],
    correct: 2,
    coins: 2
  },
  {
    category: 'Computers',
    image: 'mouse.png', // Mouse
    text: 'What part is this?',
    answers: ['Printer', 'Mouse', 'Speaker'],
    correct: 1,
    coins: 2
  },
  {
    category: 'Computers',
    image: 'word.png', // Word icon
    text: 'What program is this?',
    answers: ['Paint', 'Word', 'Calculator'],
    correct: 1,
    coins: 2
  },
  {
    category: 'Computers',
    image: 'monitor.png', // Monitor
    text: 'What part is this?',
    answers: ['Monitor', 'Keyboard', 'Mouse'],
    correct: 0,
    coins: 2
  },
  {
    category: 'Computers',
    image: 'printer.png', // Printer
    text: 'What does this do?',
    answers: ['Prints papers', 'Plays music', 'Shows movies'],
    correct: 0,
    coins: 2
  },
  {
    category: 'Computers',
    image: 'cpu.png', // CPU
    text: 'What is the brain of the computer?',
    answers: ['CPU', 'Mouse', 'Monitor'],
    correct: 0,
    coins: 2
  },
  {
    category: 'Computers',
    image: 'usb.png', // USB
    text: 'What is this port called?',
    answers: ['HDMI', 'USB', 'VGA'],
    correct: 1,
    coins: 2
  },
  {
    category: 'Computers',
    image: 'speaker.png', // Speaker
    text: 'What part makes sound?',
    answers: ['Speaker', 'Printer', 'Keyboard'],
    correct: 0,
    coins: 2
  },
  
  {
    category: 'Computers',
    image: 'tablet.png', // Tablet
    text: 'What is this device?',
    answers: ['Tablet', 'Printer', 'Speaker'],
    correct: 0,
    coins: 2
  }
];

let quizOrder = [];
let current = 0;
let score = 0;

const quizContainer = document.getElementById('quizContainer');
const endScreen = document.getElementById('endScreen');
const home = document.querySelector('.home');
const coinSound = document.getElementById('coinSound');
const cheerSound = document.getElementById('cheerSound');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startQuiz() {
  quizOrder = Array.from({length: questions.length}, (_, i) => i);
  shuffle(quizOrder);
  current = 0;
  score = 0;
  home.style.display = 'none';
  endScreen.style.display = 'none';
  quizContainer.style.display = 'block';
  showQuestion();
}

function showQuestion() {
  const q = questions[quizOrder[current]];
  quizContainer.innerHTML = `
    <div>
      <div style="font-size:1.1em;color:#ff4e50;margin-bottom:8px;">${q.category || ''}</div>
      <div style="font-size:1.2em;color:#174ea6;margin-bottom:8px;">Coins: <span id='currentCoins'>${score}</span> </div>
      ${q.image ? `<img src="${q.image}" class="quiz-img" alt="Question image">` : ''}
      <h2>${q.text}</h2>
      <div id="answers"></div>
      <div id="feedback"></div>
    </div>
  `;
  const answersDiv = document.getElementById('answers');
  q.answers.forEach((ans, idx) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = ans;
    btn.onclick = () => selectAnswer(idx);
    answersDiv.appendChild(btn);
  });
}

function selectAnswer(idx) {
  const q = questions[quizOrder[current]];
  const feedback = document.getElementById('feedback');
  if (idx === q.correct) {
    score += q.coins;
    feedback.innerHTML = '<div class="stars">✨🎉 +'+q.coins+' coins!</div>';
    playSound(coinSound);
    setTimeout(() => {
      nextQuestion();
    }, 1200);
  } else {
    feedback.innerHTML = '<div style="color:#ff4e50;font-size:1.3em;">❌ Try again next time!</div>';
    setTimeout(() => {
      nextQuestion();
    }, 1200);
  }
  // Disable all answer buttons
  Array.from(document.getElementsByClassName('answer-btn')).forEach(btn => btn.disabled = true);
}

function nextQuestion() {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    showEndScreen();
  }
}

function showEndScreen() {
  quizContainer.style.display = 'none';
  endScreen.style.display = 'block';
  saveScoreHistory(score);
  let message = '';
  if (score >= questions.length * 2) {
    message = '⭐ Excellent! You’re a Computer Genius!';
    playSound(cheerSound);
  } else if (score >= questions.length) {
    message = '⭐⭐ Good Job! Keep Learning!';
  } else {
    message = '⭐⭐⭐ Try Again, You’ll Do Better!';
  }
  endScreen.innerHTML = `
    <h2>You earned <span class="coins">${score} </span></h2>
    <div style="font-size:1.3em;margin:16px 0;">${message}</div>
    <button class="main-btn" onclick="startQuiz()">Play Again</button>
    <button class="main-btn" onclick="goHome()">Home</button>
  `;
}

function goHome() {
  endScreen.style.display = 'none';
  quizContainer.style.display = 'none';
  home.style.display = 'block';
}

function saveScoreHistory(score) {
  let history = JSON.parse(localStorage.getItem('quizScoreHistory') || '[]');
  history.push({ date: new Date().toLocaleString(), score });
  localStorage.setItem('quizScoreHistory', JSON.stringify(history));
}

function showHistory() {
  home.style.display = 'none';
  endScreen.style.display = 'none';
  quizContainer.style.display = 'none';
  const historyScreen = document.getElementById('historyScreen');
  historyScreen.style.display = 'block';
  let history = JSON.parse(localStorage.getItem('quizScoreHistory') || '[]');
  if (history.length === 0) {
    historyScreen.innerHTML = `
      <h2>Score History</h2>
      <div>No games played yet.</div>
      <button class="main-btn" onclick="goHome()">Home</button>
    `;
    return;
  }
  let rows = history.map(h => `<tr><td>${h.date}</td><td>${h.score} </td></tr>`).reverse().join('');
  historyScreen.innerHTML = `
    <h2>Score History</h2>
    <table style="width:100%;margin-bottom:16px;">
      <tr><th>Date</th><th>Coins</th></tr>
      ${rows}
    </table>
    <button class="main-btn" onclick="goHome()">Home</button>
    <button class="main-btn" onclick="clearHistory()">Clear History</button>
  `;
}

function clearHistory() {
  localStorage.removeItem('quizScoreHistory');
  showHistory();
}

function showSettings() {
  home.style.display = 'none';
  endScreen.style.display = 'none';
  quizContainer.style.display = 'none';
  const settingsScreen = document.getElementById('settingsScreen');
  settingsScreen.style.display = 'block';
  // Get current sound setting from localStorage (default: on)
  let soundOn = localStorage.getItem('quizSoundOn');
  if (soundOn === null) soundOn = 'true';
  settingsScreen.innerHTML = `
    <h2>Settings</h2>
    <div style="margin:18px 0;">
      <label style="font-size:1.1em;">
        <input type="checkbox" id="soundToggle" ${soundOn === 'true' ? 'checked' : ''}>
        Sound Effects
      </label>
    </div>
    <button class="main-btn" onclick="goHome()">Home</button>
  `;
  document.getElementById('soundToggle').onchange = function() {
    localStorage.setItem('quizSoundOn', this.checked ? 'true' : 'false');
  };
}

// Override play for sound effects to respect setting
function playSound(sound) {
  let soundOn = localStorage.getItem('quizSoundOn');
  if (soundOn === null || soundOn === 'true') {
    sound.currentTime = 0;
    sound.play();
  }
}

document.getElementById('startQuiz').onclick = startQuiz;
document.getElementById('viewHistory').onclick = showHistory;
document.getElementById('settingsBtn').onclick = showSettings;
