const workspace = document.querySelector('#workspace');
const desktop = document.querySelector('#desktop');
const clock = document.querySelector('#clock');
const shutdownButton = document.querySelector('#shutdown-button');
const bootScreen = document.querySelector('#boot-screen');
const bootLog = document.querySelector('#boot-log');
let bootTimers = [];

const projects = [
  { id: 'krishi-sutra', name: 'krishi-sutra', type: 'offline agriculture intelligence', thumb: 'KS', tone: 'mint', stack: 'Flutter · Dart · TFLite · Drift · Appwrite', description: 'A farmer-first app that keeps weather, mandi prices, groundwater, crop roadmaps, and disease detection useful after the network drops.', details: '<strong>Architecture:</strong> Drift/SQLite is the first read path, while a Workmanager sync queue reconciles local changes with Appwrite when connectivity returns.<br><strong>Technical edge:</strong> TensorFlow Lite runs crop-disease inference locally across 38 classes; Vosk handles offline dictation, with Groq LLaMA 3.1 replies when online.<br><strong>Product detail:</strong> Cached weather, market prices, and localized flows keep the demo usable without API keys.', repo: 'https://github.com/SaswatBalyan/AgroSense-KrishiSutra' },
  { id: 'trading-agents', name: 'trading-agents', type: 'multi-agent research lab', thumb: 'TA', tone: 'lilac', stack: 'Python · LLMs · yFinance · backtesting', description: 'Autonomous analyst teams research, debate, size, and backtest trades with explicit risk controls and measurable baselines.', details: '<strong>Agent loop:</strong> Fundamental, sentiment, news, and technical analysts feed a bullish/bearish research debate before a trader agent synthesizes a position.<br><strong>Risk layer:</strong> Position limits, sector caps, stop-loss thresholds, slippage, and commission are configured separately from the model prompts.<br><strong>Evaluation:</strong> Cumulative return, annualized return, Sharpe ratio, maximum drawdown, and five rule-based baselines make each run comparable.', repo: 'https://github.com/SaswatBalyan/Trading-Agents' },
  { id: 'market-watch', name: 'market-watch', type: 'financial analysis dashboard', thumb: 'MW', tone: 'sky', stack: 'Python · Streamlit · Plotly · Pandas', description: 'A 90-plus-stock workbench for candlesticks, moving averages, volatility, Sharpe ratios, correlation, and risk-return comparisons.', details: '<strong>Data pipeline:</strong> CSV market histories are indexed by date, then enriched with daily returns, cumulative returns, 20/50/200-day moving averages, volatility, annual return, and Sharpe ratio.<br><strong>Visual analysis:</strong> Plotly charts combine candlesticks with volume, dual-axis price/return views, return distributions, rolling volatility, correlation heatmaps, and risk-return scatter plots.<br><strong>Interaction:</strong> Streamlit controls let a visitor switch tickers, date ranges, moving averages, and single-stock versus multi-stock analysis.', repo: 'https://github.com/SaswatBalyan/Market-Watch-App' },
  { id: 'paisa-profit', name: 'paisa-profit', type: 'gamified trading simulator', thumb: '₹', tone: 'coral', stack: 'JavaScript · HTML · CSS · Flask', description: 'A hackathon-winning trading simulator with market-data simulation, portfolios, performance tracking, and risk management.', details: '<strong>Simulation model:</strong> The app turns market data into a practice loop where users can take positions, inspect portfolio performance, and learn through feedback rather than static lessons.<br><strong>Full-stack shape:</strong> A browser-first JavaScript interface is paired with a small Flask server, keeping the interaction quick while leaving room for server-side state.<br><strong>Origin:</strong> Built with a team for the Innohack hackathon in January 2025, where it won the freshers team track.', repo: 'https://github.com/SaswatBalyan/PaisaProfit' },
];

const templates = {
  about: { title: 'About', className: 'about-window', body: `<div class="about-page"><section class="about-hero"><div class="about-hero-copy"><p class="mono">field notes / 2026</p><h1>Saswat<br /><span>Balyan</span></h1><p class="about-lede">Computer science student at VIT Vellore. I build AI-assisted software, offline-first products, and finance experiments that are meant to leave the notebook.</p><a class="text-button" href="mailto:saswatbalyan2711@gmail.com">Say hello ↗</a></div><figure class="about-portrait"><img src="pfp.jpeg" alt="Saswat Balyan smiling outdoors" /><figcaption>builder / student / occasional diplomat</figcaption></figure></section><section class="about-intro"><span class="about-index">01</span><div><h2>A few things I keep returning to.</h2><p>Multi-agent systems, practical machine learning, and the startup side of turning a working idea into something people actually use. I like the point where a technical decision becomes a product decision.</p></div></section><section class="about-projects"><div class="about-section-heading"><span class="about-index">02</span><h2>What I build</h2></div><div class="about-project-list"><article><span class="project-number">01</span><div><h3>TradingAgents</h3><p>Analyst agents debate fundamentals, sentiment, news, and technical signals before a trader agent sizes a position. Risk limits and backtests keep the argument measurable.</p><span class="mono">Python / LLMs / yFinance / backtesting</span></div></article><article><span class="project-number">02</span><div><h3>AgroSense</h3><p>An offline-first agricultural app for low-connectivity environments, with mandi prices, weather, crop roadmaps, 38-class on-device disease detection, and a voice interface.</p><span class="mono">Flutter / TFLite / Drift / Appwrite</span></div></article><article><span class="project-number">03</span><div><h3>PaisaProfit</h3><p>A gamified financial literacy platform with paper trading, market simulations, and AI-assisted learning, built with a React and Flask stack.</p><span class="mono">React / Flask / market data</span></div></article><article><span class="project-number">04</span><div><h3>Heart disease prediction</h3><p>A Kaggle Playground pipeline combining CatBoost, XGBoost, PyTorch embeddings, Optuna tuning, ensembling, and cross-validation.</p><span class="mono">CatBoost / XGBoost / PyTorch / Optuna</span></div></article></div></section><section class="about-split about-skills"><div><span class="about-index">03</span><h2>Tools in the drawer</h2><p>I work mostly in Python, JavaScript, Kotlin, C/C++, Java, and SQL. Around them: PyTorch, TensorFlow, scikit-learn, Transformers, OpenCV, React, Node, Django, FastAPI, Flask, Flutter, Docker, and AWS.</p></div><div class="skill-stamp"><strong>AI-native</strong><span>I treat an LLM like a boss agent: plan the structure, coordinate tools, then make the build earn its place.</span></div></section><section class="about-photo-story"><div class="about-section-heading"><span class="about-index">04</span><h2>Outside the terminal</h2></div><div class="about-photo-grid"><figure class="about-photo photo-tall"><img src="iicteam.jpeg" alt="Institute Innovation Council team outdoors" /><figcaption>Startup Domain Head · IIC, VIT Vellore</figcaption></figure><div class="about-photo-stack"><figure class="about-photo"><img src="mun.jpeg" alt="Saswat speaking at a Model UN podium" /><figcaption>International relations / Model UN</figcaption></figure><figure class="about-photo photo-award"><img src="trophy.jpeg" alt="Saswat holding a Best Delegation trophy" /><figcaption>HITSMUN · Best Delegation</figcaption></figure></div><figure class="about-photo photo-wide"><img src="hackathon.jpeg" alt="Hackathon team posing indoors" /><figcaption>hackathons, teams, and the occasional stairwell</figcaption></figure><figure class="about-photo"><img src="reversecoding.jpeg" alt="Reverse Coding certificate hand-off on stage" /><figcaption>Reverse Coding · ACM VIT</figcaption></figure></div></section><section class="about-closing"><div><span class="about-index">05</span><h2>Still curious.</h2><p>Startup work, Model UN, and hackathons keep the technical work honest: there is always another person, constraint, or point of view to account for.</p></div><div class="about-wins"><span class="mono">recent wins</span><p>1st place · IIC Hackwar</p><p>Top 10 · AGILE, IISc Bangalore</p><p>Finalist · ENIGMA, IIT BHU</p></div></section></div>` },
  resume: { title: 'Resume', className: 'resume-window', body: `<div class="resume-heading"><div><p class="mono">Saswat Balyan</p><h1>Computer science student and builder</h1><p>Frontend systems, applied machine learning, and products that make complex work easier to use.</p></div><div class="resume-contact"><a href="tel:+919041244194">+91 90412 44194</a><a href="mailto:saswatbalyan2711@gmail.com">saswatbalyan2711@gmail.com</a><a href="https://www.linkedin.com/in/saswat-balyan-349b23320" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/SaswatBalyan" target="_blank" rel="noreferrer">GitHub</a><a href="https://leetcode.com/u/5gkfwYkbrA/" target="_blank" rel="noreferrer">LeetCode</a></div></div><section class="resume-section"><h2>Education</h2><div class="resume-row"><span class="resume-date">2024 - present</span><div><p class="resume-role">B.Tech, Computer Science and Engineering</p><p>Vellore Institute of Technology, Vellore · CGPA 8.9/10</p><p class="mono">JEE Advanced 2024: 16484 · JEE Mains: 96 percentile · 12th: 80% · 10th: 94%</p></div></div></section><section class="resume-section"><h2>Experience</h2><div class="resume-row"><span class="resume-date">2026 - present</span><div><p class="resume-role">Startup Domain Head · Institute's Innovation Council, VIT Vellore</p><p>Guiding students on incubation opportunities, startup competitions, and government innovation schemes while collaborating with student teams and institute mentors.</p></div></div></section><section class="resume-section"><h2>Selected projects</h2><div class="resume-projects"><div><p class="resume-role">TradingAgents</p><p class="mono">Python · LLMs · multi-agent systems · yFinance</p><p>Built a multi-agent trading framework with fundamental, sentiment, news, and technical analysts, plus risk controls and backtesting.</p></div><div><p class="resume-role">AgroSense - KrishiSutra</p><p class="mono">Flutter · TensorFlow Lite · SQLite · Appwrite · LLaMA 3.1</p><p>Created an offline-first agricultural intelligence app with crop-disease detection, local persistence, sync queues, voice input, and an AI assistant.</p></div><div><p class="resume-role">PaisaProfit</p><p class="mono">React · Flask · Python · AI · finance</p><p>Built a gamified financial literacy platform with AI-assisted learning, paper trading, simulations, and live market visualizations.</p></div><div><p class="resume-role">Heart disease prediction</p><p class="mono">Python · CatBoost · XGBoost · PyTorch · Optuna</p><p>Developed reusable experimentation pipelines with feature engineering, ensemble learning, cross-validation, and Bayesian optimization.</p></div></div></section><section class="resume-section"><h2>Technical skills</h2><p><strong>Languages:</strong> Python, JavaScript, Kotlin, SQL, R, C, C++, Java, ASM</p><p><strong>ML:</strong> PyTorch, TensorFlow, Keras, scikit-learn, Hugging Face, OpenCV, Pandas, NumPy</p><p><strong>Web and platforms:</strong> React, Node.js, Django, FastAPI, Flask, Flutter, Android, Docker, Git, AWS</p></section><section class="resume-section"><h2>Awards and leadership</h2><p>Track winner, IIC Hackwar · Top 10, AGILE by Pravega IISc Bangalore · Rank 79, ENIGMA Codefest'26 IIT BHU · Finalist, Reverse Coding ACM VIT.</p><p>Member, International Relations Committee, VIT. Delegated at VITMUN, HITSMUN, and SRMMUN.</p></section><p class="resume-source mono">Source: <a href="https://flowcv.com/resume/i2g20clnk5p0" target="_blank" rel="noreferrer">shareable resume</a></p><a class="text-button" href="resume.pdf" download="resume.pdf" data-action="download">Save as PDF</a>` },
  work: { title: 'Work', className: 'work-window', body: `<div class="work-intro"><p class="mono">A small cabinet of things I built, tested, and kept.</p><h1>Projects with a pulse.</h1><p>Open a file to inspect the idea, the stack, and the trail back to its source.</p></div><div class="file-grid">${projects.map((project) => `<button class="project-file project-file-${project.tone}" type="button" data-project="${project.id}"><span class="project-thumb">${project.thumb}</span><span class="project-meta"><span class="project-name">${project.name}</span><span class="project-type">${project.type}</span><span class="project-stack">${project.stack}</span></span></button>`).join('')}</div>` },
  contact: { title: 'Contact', className: 'contact-window', body: `<div class="form-stack"><div><h2>Send a note</h2><p>Your message will open in your email app addressed to Saswat.</p></div><form class="contact-form"><div class="field"><label for="contact-email">Your email</label><input id="contact-email" type="email" required /></div><div class="field"><label for="contact-subject">What's this about?</label><input id="contact-subject" required /></div><div class="field"><label for="contact-message">Message</label><textarea id="contact-message" required></textarea></div><button class="send-button" type="submit">Open email</button><p class="form-status mono" aria-live="polite"></p></form></div>` },
  social: { title: 'Social', className: 'social-window', body: `<p class="mono">Find Saswat around the web.</p><div class="social-links"><a class="social-link" href="https://github.com/SaswatBalyan" target="_blank" rel="noreferrer"><span class="social-mark">GH</span><span><strong>GitHub</strong><small>Code, experiments, and repositories</small></span><span class="social-arrow">↗</span></a><a class="social-link" href="https://www.linkedin.com/in/saswat-balyan-349b23320/" target="_blank" rel="noreferrer"><span class="social-mark">in</span><span><strong>LinkedIn</strong><small>Work history and professional notes</small></span><span class="social-arrow">↗</span></a><a class="social-link" href="https://www.kaggle.com/saswatbalyan" target="_blank" rel="noreferrer"><span class="social-mark">K</span><span><strong>Kaggle</strong><small>Datasets, notebooks, and competitions</small></span><span class="social-arrow">↗</span></a><a class="social-link" href="https://leetcode.com/u/5gkfwYkbrA/" target="_blank" rel="noreferrer"><span class="social-mark">LC</span><span><strong>LeetCode</strong><small>Problems and algorithm practice</small></span><span class="social-arrow">↗</span></a><a class="social-link" href="mailto:saswatbalyan2711@gmail.com"><span class="social-mark">@</span><span><strong>Email</strong><small>saswatbalyan2711@gmail.com</small></span><span class="social-arrow">↗</span></a></div>` },
  notes: { title: 'snake.exe', className: 'notes-window', body: `<div class="snake-game" data-snake-game><div class="snake-heading"><div class="snake-brand"><span class="snake-logo" aria-hidden="true">S</span><div><p class="mono">a tiny thing worth remembering</p><h1>snake.exe</h1></div></div><div class="snake-score"><span class="mono">score</span><strong data-snake-score>0</strong></div></div><div class="snake-board" data-snake-board role="application" aria-label="Snake game board" tabindex="0"></div><div class="snake-footer"><p class="mono" data-snake-status>Press start, then steer with arrows or WASD.</p><button class="text-button" type="button" data-snake-start>Start game</button></div><div class="snake-controls" aria-label="Snake controls"><button type="button" data-snake-direction="up" aria-label="Move up">↑</button><button type="button" data-snake-direction="left" aria-label="Move left">←</button><button type="button" data-snake-direction="down" aria-label="Move down">↓</button><button type="button" data-snake-direction="right" aria-label="Move right">→</button></div></div>` },
};

function updateClock() {
  clock.textContent = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
}

function focusWindow(windowElement) {
  document.querySelectorAll('.window').forEach((item) => item.classList.remove('is-focused'));
  windowElement.classList.add('is-focused');
  windowElement.style.zIndex = String(Date.now()).slice(-6);
}

function closeWindow(windowElement) {
  const appButton = document.querySelector(`.dock-item[data-open="${windowElement.dataset.window}"]`);
  appButton?.classList.remove('is-active');
  windowElement._snakeCleanup?.();
  windowElement.classList.add('is-closing');
  let removed = false;
  const removeWindow = () => {
    if (removed) return;
    removed = true;
    windowElement.remove();
  };
  windowElement.addEventListener('animationend', removeWindow, { once: true });
  setTimeout(removeWindow, 180);
}

function renderWindow(id) {
  const template = templates[id];
  if (!template) return;
  const existing = document.querySelector(`[data-window="${id}"]`);
  if (existing) {
    existing.classList.remove('is-minimized');
    focusWindow(existing);
    return;
  }
  const windowElement = document.createElement('article');
  windowElement.className = `window ${template.className}`;
  windowElement.dataset.window = id;
  windowElement.style.animation = 'none';
  windowElement.innerHTML = `<header class="window-header"><span class="window-state" aria-hidden="true"></span><span class="window-title">${template.title}</span><div class="window-controls"><button class="window-control" data-control="minimize" aria-label="Minimize ${template.title}" type="button">_</button><button class="window-control" data-control="maximize" aria-label="Maximize ${template.title}" type="button">□</button><button class="window-control" data-control="close" aria-label="Close ${template.title}" type="button">×</button></div></header><div class="window-body">${template.body}</div>`;
  workspace.append(windowElement);

  if (id === 'about') {
    const centeredLeft = Math.max(0, (workspace.clientWidth - windowElement.offsetWidth) / 2);
    windowElement.style.left = `${centeredLeft}px`;
    windowElement.style.top = '14%';
    windowElement.style.transform = 'translate(0px, 0px)';
  }

  if (id === 'resume' && window.innerWidth >= 768) {
    const aboutWindow = document.querySelector('[data-window="about"]');
    if (aboutWindow && !aboutWindow.classList.contains('is-minimized')) {
      const offsetLeft = aboutWindow.offsetLeft + Math.round(aboutWindow.offsetWidth * 0.55);
      const maxLeft = Math.max(0, workspace.clientWidth - windowElement.offsetWidth);
      windowElement.style.left = `${Math.min(maxLeft, offsetLeft)}px`;
      windowElement.style.top = `${aboutWindow.offsetTop + 128}px`;
    }
  }

  focusWindow(windowElement);
  bindWindow(windowElement);
  if (id === 'about') enhanceAboutPage(windowElement);
}

function enhanceAboutPage(windowElement) {
  const skillStamp = windowElement.querySelector('.skill-stamp span');
  if (skillStamp) skillStamp.innerHTML = '<b>01</b> Brief the problem and constraints.<br /><b>02</b> Map the architecture with an LLM.<br /><b>03</b> Delegate small, testable tasks across tools.<br /><b>04</b> Review the output, run it, and keep the decisions human.';

  const photoGrid = windowElement.querySelector('.about-photo-grid');
  if (photoGrid) {
    const teamCaption = photoGrid.querySelector('.photo-tall figcaption');
    if (teamCaption) teamCaption.textContent = 'International Relations';
    const firstModelUnCaption = photoGrid.querySelector('.about-photo-stack .about-photo:first-child figcaption');
    if (firstModelUnCaption) firstModelUnCaption.textContent = 'Model UN';
    photoGrid.insertAdjacentHTML('beforeend', '<figure class="about-photo photo-model-un"><img src="international.jpeg" alt="Saswat speaking at a Model UN conference" /><figcaption>Model UN</figcaption></figure>');
    const internationalCaption = photoGrid.querySelector('.photo-model-un figcaption');
    if (internationalCaption) internationalCaption.textContent = 'International relations';
  }
}

function bindWindow(windowElement) {
  windowElement.addEventListener('pointerdown', () => focusWindow(windowElement));
  const closeControl = windowElement.querySelector('[data-control="close"]');
  const minimizeControl = windowElement.querySelector('[data-control="minimize"]');
  const maximizeControl = windowElement.querySelector('[data-control="maximize"]');
  closeControl?.addEventListener('click', () => closeWindow(windowElement));
  minimizeControl?.addEventListener('click', () => windowElement.classList.add('is-minimized'));
  maximizeControl?.addEventListener('click', () => windowElement.classList.toggle('is-maximized'));
  windowElement.querySelectorAll('[data-project]').forEach((button) => button.addEventListener('click', () => openProject(button.dataset.project)));
  const contactForm = windowElement.querySelector('.contact-form');
  if (contactForm) contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const senderEmail = contactForm.querySelector('#contact-email').value.trim();
    const subject = contactForm.querySelector('#contact-subject').value.trim();
    const message = contactForm.querySelector('#contact-message').value.trim();
    const mailto = new URLSearchParams({
      subject,
      body: `From: ${senderEmail}\n\n${message}`,
    });
    contactForm.querySelector('.form-status').textContent = 'Opening your email app...';
    window.location.href = `mailto:saswatbalyan2711@gmail.com?${mailto.toString()}`;
  });
  if (windowElement.querySelector('[data-snake-game]')) setupSnakeGame(windowElement);
  makeDraggable(windowElement);
}

function setupSnakeGame(windowElement) {
  const board = windowElement.querySelector('[data-snake-board]');
  const scoreElement = windowElement.querySelector('[data-snake-score]');
  const statusElement = windowElement.querySelector('[data-snake-status]');
  const startButton = windowElement.querySelector('[data-snake-start]');
  const size = { columns: 18, rows: 14 };
  let snake = [];
  let food = null;
  let direction = { x: 1, y: 0 };
  let nextDirection = { x: 1, y: 0 };
  let score = 0;
  let timer = null;
  let running = false;

  board.style.setProperty('--snake-columns', size.columns);
  board.innerHTML = Array.from({ length: size.columns * size.rows }, (_, index) => `<span class="snake-cell" data-cell="${index}" aria-hidden="true"></span>`).join('');
  const cells = [...board.querySelectorAll('[data-cell]')];

  function placeFood() {
    const openCells = [];
    for (let y = 0; y < size.rows; y += 1) {
      for (let x = 0; x < size.columns; x += 1) {
        if (!snake.some((segment) => segment.x === x && segment.y === y)) openCells.push({ x, y });
      }
    }
    food = openCells[Math.floor(Math.random() * openCells.length)];
  }

  function paint() {
    cells.forEach((cell) => cell.className = 'snake-cell');
    snake.forEach((segment, index) => {
      const cell = cells[segment.y * size.columns + segment.x];
      if (cell) cell.classList.add(index === 0 ? 'is-head' : 'is-body');
    });
    if (food) cells[food.y * size.columns + food.x]?.classList.add('is-food');
    scoreElement.textContent = String(score);
  }

  function endGame(message) {
    running = false;
    clearInterval(timer);
    timer = null;
    statusElement.textContent = message;
    startButton.textContent = 'Play again';
  }

  function step() {
    direction = nextDirection;
    const head = snake[0];
    const nextHead = { x: head.x + direction.x, y: head.y + direction.y };
    const hitWall = nextHead.x < 0 || nextHead.x >= size.columns || nextHead.y < 0 || nextHead.y >= size.rows;
    const hitSelf = snake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);
    if (hitWall || hitSelf) {
      endGame(`Game over at ${score}. Start again?`);
      return;
    }
    snake.unshift(nextHead);
    if (nextHead.x === food.x && nextHead.y === food.y) {
      score += 1;
      placeFood();
    } else {
      snake.pop();
    }
    paint();
  }

  function setDirection(next) {
    if (!running || (next.x === -direction.x && next.y === -direction.y)) return;
    nextDirection = next;
  }

  function startGame() {
    clearInterval(timer);
    snake = [{ x: 4, y: 7 }, { x: 3, y: 7 }, { x: 2, y: 7 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    running = true;
    placeFood();
    paint();
    statusElement.textContent = 'Keep the line alive.';
    startButton.textContent = 'Restart';
    board.focus();
    timer = setInterval(step, 145);
  }

  const keyHandler = (event) => {
    const directions = { ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 } };
    const next = directions[event.key];
    if (!next || !windowElement.matches(':focus-within')) return;
    event.preventDefault();
    setDirection(next);
  };
  document.addEventListener('keydown', keyHandler);
  startButton.addEventListener('click', startGame);
  windowElement.querySelectorAll('[data-snake-direction]').forEach((button) => button.addEventListener('click', () => {
    const directions = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    setDirection(directions[button.dataset.snakeDirection]);
  }));
  paint();
  windowElement._snakeCleanup = () => { clearInterval(timer); document.removeEventListener('keydown', keyHandler); };
}

function openProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;
  const existing = document.querySelector(`[data-window="project-${id}"]`);
  if (existing) { focusWindow(existing); return; }
  const windowElement = document.createElement('article');
  windowElement.className = 'window work-window';
  windowElement.dataset.window = `project-${id}`;
  windowElement.innerHTML = `<header class="window-header"><span class="window-state" aria-hidden="true"></span><span class="window-title">${project.name}</span><div class="window-controls"><button class="window-control" data-control="close" aria-label="Close ${project.name}" type="button">×</button></div></header><div class="window-body project-detail"><p class="mono">${project.type}</p><h1>${project.name}</h1><p>${project.description}</p><div class="project-spec"><span class="mono">stack</span><strong>${project.stack}</strong></div><div class="project-notes">${project.details}</div><a class="text-button" href="${project.repo}" target="_blank" rel="noreferrer">Open on GitHub ↗</a></div>`;
  workspace.append(windowElement);
  focusWindow(windowElement);
  bindWindow(windowElement);
}

function makeDraggable(windowElement) {
  const header = windowElement.querySelector('.window-header');
  let drag = null;

  header.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button') || window.innerWidth < 768 || windowElement.classList.contains('is-maximized')) return;

    const workspaceRect = workspace.getBoundingClientRect();
    const rect = windowElement.getBoundingClientRect();
    const left = rect.left - workspaceRect.left;
    const top = rect.top - workspaceRect.top;

    windowElement.style.left = `${left}px`;
    windowElement.style.top = `${top}px`;
    windowElement.style.transform = 'translate(0px, 0px)';
    windowElement.style.animation = 'none';

    drag = {
      offsetX: event.clientX - workspaceRect.left - left,
      offsetY: event.clientY - workspaceRect.top - top,
    };

    try {
      header.setPointerCapture(event.pointerId);
    } catch (error) {
      // Ignore synthetic or unsupported pointer capture cases.
    }
  });

  header.addEventListener('pointermove', (event) => {
    if (!drag) return;

    const workspaceRect = workspace.getBoundingClientRect();
    const nextLeft = event.clientX - workspaceRect.left - drag.offsetX;
    const nextTop = event.clientY - workspaceRect.top - drag.offsetY;

    windowElement.style.left = `${Math.max(0, Math.min(workspaceRect.width - windowElement.offsetWidth, nextLeft))}px`;
    windowElement.style.top = `${Math.max(0, Math.min(workspaceRect.height - windowElement.offsetHeight, nextTop))}px`;
  });

  header.addEventListener('pointerup', () => { drag = null; });
  header.addEventListener('pointerleave', () => { drag = null; });
  header.addEventListener('pointercancel', () => { drag = null; });
}

function escapeHtml(value) { return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character])); }

function finishBoot() {
  if (bootScreen.classList.contains('is-done')) return;
  bootTimers.forEach((timer) => clearTimeout(timer));
  bootTimers = [];
  bootScreen.classList.add('is-done');
  document.body.classList.remove('is-booting');
  document.body.classList.add('is-booted');
  renderWindow('about');
  const aboutWindow = document.querySelector('[data-window="about"]');
  selectApp(document.querySelector('.dock-item[data-open="about"]'));
  focusWindow(aboutWindow);
}

function runBoot() {
  const lines = [
    ['loading kernel', 'done'],
    ['mounting root filesystem', 'done'],
    ['checking filesystems', 'done'],
    ['starting systemd', 'done'],
    ['loading network services', 'done'],
    ['starting desktop session', 'done'],
    ['welcome, user', 'ready'],
  ];
  sessionStorage.removeItem('portfolio-booted');
  lines.forEach(([label, status], index) => bootTimers.push(setTimeout(() => {
    bootLog.insertAdjacentHTML('beforeend', `<div class="boot-line"><span class="boot-label">${label}</span><span class="boot-status">${status}</span></div>`);
  }, index * 220)));
  bootTimers.push(setTimeout(finishBoot, 1900));
}

function selectApp(button) {
  if (button.classList.contains('dock-item')) button.classList.add('is-active');
}

function launchApp(button) {
  selectApp(button);
  renderWindow(button.dataset.open);
}

function handleAppClick(button) {
  const windowElement = document.querySelector(`[data-window="${button.dataset.open}"]`);
  if (!windowElement) return;
  selectApp(button);
  if (windowElement.classList.contains('is-minimized')) renderWindow(button.dataset.open);
}

document.querySelectorAll('[data-open]').forEach((button) => {
  button.addEventListener('click', () => handleAppClick(button));
  button.addEventListener('dblclick', () => launchApp(button));
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      launchApp(button);
    }
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const focusedWindow = document.querySelector('.window.is-focused');
    if (focusedWindow) closeWindow(focusedWindow);
  }
  if (event.key === 'Enter' && bootScreen.classList.contains('is-done') === false) {
    finishBoot();
  }
});
bootScreen.addEventListener('click', finishBoot);
updateClock();
setInterval(updateClock, 30000);
shutdownButton?.addEventListener('click', () => window.location.reload());
runBoot();
