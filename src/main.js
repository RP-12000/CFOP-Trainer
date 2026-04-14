import { FloatingCubesBackground } from './cube/renderer.js';
import { renderStudyPage } from './pages/study.js';
import { getCompleted } from './state.js';

const app = document.getElementById('app');
let bgCubes = null;

// Skip intro if user has already learned at least one algorithm
if (getCompleted().size > 0) {
  renderStudyPage(app);
} else {
  showIntro();
}

function showIntro() {
  app.innerHTML = '';
  app.className = 'page intro-page';
  bgCubes = new FloatingCubesBackground(document.body);

  const overlay = document.createElement('div');
  overlay.className = 'intro-overlay';

  const titleEl = document.createElement('h1');
  titleEl.className = 'intro-title';
  titleEl.textContent = 'CFOP Trainer';

  const tagline = document.createElement('p');
  tagline.className = 'intro-tagline';
  tagline.textContent = "built for a faster rubik's cube solver";

  const credits = document.createElement('p');
  credits.className = 'intro-credits';
  credits.textContent = 'by Kelvin Hu';

  overlay.appendChild(titleEl);
  overlay.appendChild(tagline);
  overlay.appendChild(credits);
  app.appendChild(overlay);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn-next';
  nextBtn.textContent = 'Next';
  nextBtn.style.visibility = 'hidden';
  nextBtn.style.opacity = '0';
  nextBtn.style.transition = 'opacity 0.6s ease';
  overlay.appendChild(nextBtn);

  setTimeout(() => {
    nextBtn.style.visibility = '';
    nextBtn.style.opacity = '1';
  }, 3000);

  nextBtn.addEventListener('click', () => showDescription());
}

const DESCRIPTION =
    'CFOP is a structured and widely taught method for learning how to solve the Rubik\'s Cube efficiently. ' +
    'The method is divided into four clear steps: Cross, F2L, OLL, and PLL. ' +
    'Originally developed by Jessica Fridrich, CFOP is now the standard approach used in most modern cubing tutorials. ' +
    'Students begin with the Cross to understand cube alignment and planning. ' +
    'F2L (First Two Layers) introduces intuitive pairing and movement. ' +
    'OLL and PLL then use algorithms to complete the last layer in a systematic way. ' +
    'CFOP is designed to be learned step by step, making it ideal for guided lessons and long-term skill development.' +
    'Master this algorithm and you can solve it in seconds!';

function showDescription() {
  const overlay = app.querySelector('.intro-overlay');
  overlay.innerHTML = '';

  const textEl = document.createElement('p');
  textEl.className = 'intro-desc';
  overlay.appendChild(textEl);

  const tryBtn = document.createElement('button');
  tryBtn.className = 'btn-primary hidden';
  tryBtn.textContent = 'Try It Out →';
  overlay.appendChild(tryBtn);

  let i = 0;
  const interval = setInterval(() => {
    textEl.textContent += DESCRIPTION[i];
    i++;
    if (i >= DESCRIPTION.length) {
      clearInterval(interval);
      tryBtn.classList.remove('hidden');
      tryBtn.classList.add('fade-in');
    }
  }, 28);

  const skipBtn = document.createElement('button');
  skipBtn.className = 'btn-skip hidden';
  skipBtn.textContent = 'Skip';
  app.appendChild(skipBtn);

  setTimeout(() => {
    skipBtn.classList.remove('hidden');
    skipBtn.classList.add('fade-in');
  }, 5000);

  const goToStudy = () => {
    clearInterval(interval);
    if (bgCubes) { bgCubes.destroy(); bgCubes = null; }
    renderStudyPage(app);
  };

  skipBtn.addEventListener('click', goToStudy);
  tryBtn.addEventListener('click', goToStudy);

  const nextBtn = app.querySelector('.btn-next');
  if (nextBtn) nextBtn.remove();
}
