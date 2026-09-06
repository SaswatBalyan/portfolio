const workspace = document.querySelector('#workspace');
const desktop = document.querySelector('#desktop');
const clock = document.querySelector('#clock');
const shutdownButton = document.querySelector('#shutdown-button');
const bootScreen = document.querySelector('#boot-screen');
const bootLog = document.querySelector('#boot-log');

const projects = [
  { id: 'exhibit', name: 'tiny-model', type: 'from-scratch exhibit', thumb: 'ML', alt: true },
  { id: 'interface', name: 'interface-lab', type: 'frontend systems', thumb: 'UI', alt: false },
];

const templates = {
  about: { title: 'About', className: 'about-window', body: `<div class="about-grid"><div><p class="mono">A developer who likes the point where a useful system becomes a good experience.</p><h1>I build clear tools for curious people.</h1><p>I work across frontend interfaces and small machine learning systems. The interesting part is usually the handoff between the two: making complex work feel understandable without sanding off its character.</p><p class="mono">Currently exploring: retrieval, model training, and interfaces that explain themselves.</p></div><figure class="photo-frame"><img src="https://picsum.photos/seed/workbench-light/620/780" alt="A bright workbench with paper, a keyboard, and notes" /><figcaption>one quiet corner of the workbench</figcaption></figure></div>` },
  resume: { title: 'Resume', className: 'resume-window', body: `<p class="mono">A short working history. Full document export comes next.</p><div class="resume-list"><div class="resume-row"><span class="resume-date">2024 - now</span><div><p class="resume-role">Independent builder</p><p>Frontend systems, product prototypes, and small ML experiments with a focus on readable interfaces.</p></div></div><div class="resume-row"><span class="resume-date">2022 - 24</span><div><p class="resume-role">Product engineer</p><p>Shipped web experiences from early structure through the details that make them usable every day.</p></div></div><div class="resume-row"><span class="resume-date">Earlier</span><div><p class="resume-role">Learning in public</p><p>Writing, experimenting, and making the underlying decisions visible.</p></div></div></div><button class="text-button" type="button" data-action="download">Save as PDF</button>` },
  work: { title: 'Work', className: 'work-window', body: `<p class="mono">Open a project to see the work behind it.</p><div class="file-grid">${projects.map((project) => `<button class="project-file" type="button" data-project="${project.id}"><span class="project-thumb ${project.alt ? 'alt' : ''}">${project.thumb}</span><span class="project-meta"><span class="project-name">${project.name}</span><span class="project-type">${project.type}</span></span></button>`).join('')}</div>` },
  contact: { title: 'Contact', className: 'contact-window', body: `<div class="form-stack"><div><h2>Send a note</h2><p>For a role, a collaboration, or a thoughtful question.</p></div><form class="contact-form"><div class="field"><label for="contact-email">Your email</label><input id="contact-email" type="email" required /></div><div class="field"><label for="contact-subject">What's this about?</label><input id="contact-subject" required /></div><div class="field"><label for="contact-message">Message</label><textarea id="contact-message" required></textarea></div><button class="send-button" type="submit">Send</button><p class="form-status mono" aria-live="polite"></p></form></div>` },
  social: { title: 'Social', className: 'social-window', body: `<p class="mono">Find me around the web.</p><div class="social-links"><a class="social-link" href="https://github.com/saswatbalyan" target="_blank" rel="noreferrer"><span class="social-mark">GH</span><span><strong>GitHub</strong><small>Code, experiments, and repositories</small></span><span class="social-arrow">↗</span></a><a class="social-link" href="https://www.linkedin.com/in/saswatbalyan/" target="_blank" rel="noreferrer"><span class="social-mark">in</span><span><strong>LinkedIn</strong><small>Work history and professional notes</small></span><span class="social-arrow">↗</span></a><a class="social-link" href="mailto:hello@saswatbalyan.com"><span class="social-mark">@</span><span><strong>Email</strong><small>Start a direct conversation</small></span><span class="social-arrow">↗</span></a></div>` },
  notes: { title: 'notes.txt', className: 'notes-window', body: `<p class="mono">A small reminder:</p><p>Make the thing easy to understand, then give it one detail worth remembering.</p>` },
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
    contactForm.querySelector('.form-status').textContent = 'Sent. I will reply within a couple of days.';
    contactForm.reset();
  });
  makeDraggable(windowElement);
}

function openProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;
  const existing = document.querySelector(`[data-window="project-${id}"]`);
  if (existing) { focusWindow(existing); return; }
  const windowElement = document.createElement('article');
  windowElement.className = 'window work-window';
  windowElement.dataset.window = `project-${id}`;
  windowElement.innerHTML = `<header class="window-header"><span class="window-state" aria-hidden="true"></span><span class="window-title">${project.name}</span><div class="window-controls"><button class="window-control" data-control="close" aria-label="Close ${project.name}" type="button">×</button></div></header><div class="window-body"><p class="mono">${project.type}</p><h2>${project.name}</h2><p>This case study will document the decisions, experiments, and shipped result. The window manager is already ready for it.</p></div>`;
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
  bootScreen.classList.add('is-done');
  renderWindow('about');
  renderWindow('resume');
  const aboutWindow = document.querySelector('[data-window="about"]');
  const resumeWindow = document.querySelector('[data-window="resume"]');
  selectApp(document.querySelector('.dock-item[data-open="about"]'));
  selectApp(document.querySelector('.dock-item[data-open="resume"]'));
  focusWindow(aboutWindow);
  aboutWindow.style.zIndex = String(Number(resumeWindow.style.zIndex || 0) + 1);
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
  lines.forEach(([label, status], index) => setTimeout(() => {
    bootLog.insertAdjacentHTML('beforeend', `<div class="boot-line"><span class="boot-label">${label}</span><span class="boot-status">${status}</span></div>`);
  }, index * 220));
  setTimeout(finishBoot, 1900);
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
updateClock();
setInterval(updateClock, 30000);
shutdownButton?.addEventListener('click', () => window.location.reload());
runBoot();
