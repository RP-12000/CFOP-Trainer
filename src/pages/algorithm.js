import { ALGORITHMS } from '../data/cfop.js';
import { getCompleted, setCompleted, markViewed,
         saveMCResult, getMCBest, getMCHistory,
         saveFFResult, getFFPassed, getFFHistory,
         isFullyMastered, clearAlgData } from '../state.js';
import { CubeRenderer } from '../cube/renderer.js';
import { renderStudyPage } from './study.js';

// ── helpers ───────────────────────────────────────────────────────────────────
function invertMove(m) {
  if (m.endsWith("2'")) return m.slice(0, -2) + '2';
  if (m.endsWith("'"))  return m.slice(0, -1);
  if (m.endsWith('2'))  return m + "'";
  return m + "'";
}

function animateMovesOnCube(moves, display, renderer, onDone) {
  if (!moves.length) { if (display) display.textContent = ''; onDone(); return; }
  let i = 0;
  function step() {
    if (i >= moves.length) { onDone(); return; }
    if (display) {
      display.innerHTML = moves.map((m, idx) =>
        idx === i   ? `<span class="move-highlight">${m}</span>` :
        idx < i     ? `<span class="move-done">${m}</span>` : m
      ).join(' ');
    }
    renderer.doMove(moves[i], () => { i++; setTimeout(step, 280); });
  }
  step();
}

// ── main render ───────────────────────────────────────────────────────────────
export function renderAlgorithmPage(root, algId) {
  const alg = ALGORITHMS.find(a => a.id === algId);
  if (!alg) return;

  root.innerHTML = '';
  root.className = 'page alg-page';

  // ── Top bar ───────────────────────────────────────────────────────────────
  const topBar = document.createElement('div');
  topBar.className = 'alg-topbar';

  const backBtn = document.createElement('button');
  backBtn.className = 'btn-ghost alg-back-btn';
  backBtn.textContent = '← Back';
  backBtn.addEventListener('click', () => { cubeRenderer.destroy(); renderStudyPage(root); });

  const topRight = document.createElement('div');
  topRight.className = 'alg-topbar-right';

  const algIndex = document.createElement('div');
  algIndex.className = 'alg-index';
  algIndex.textContent = alg.section + '  |  ' + alg.name;

  const luckyBtn = document.createElement('button');
  luckyBtn.className = 'btn-ghost alg-lucky-top';
  luckyBtn.textContent = "I'm feeling lucky";
  luckyBtn.addEventListener('click', () => {
    const pick = ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)];
    cubeRenderer.destroy();
    renderAlgorithmPage(root, pick.id);
  });

  topRight.appendChild(algIndex);
  topRight.appendChild(luckyBtn);
  topBar.appendChild(backBtn);
  topBar.appendChild(topRight);
  root.appendChild(topBar);

  // ── Main row ──────────────────────────────────────────────────────────────
  const mainRow = document.createElement('div');
  mainRow.className = 'alg-main-row';
  root.appendChild(mainRow);

  // ══════════════════════════════════════════════════════════════════════════
  // LEFT COLUMN
  // ══════════════════════════════════════════════════════════════════════════
  const leftCol = document.createElement('div');
  leftCol.className = 'alg-left-col';
  mainRow.appendChild(leftCol);

  // ── Top half: mode selector + answer area ─────────────────────────────────
  const leftTop = document.createElement('div');
  leftTop.className = 'alg-left-top';
  leftCol.appendChild(leftTop);

  // Mode selector row (20% of top half)
  const modeRow = document.createElement('div');
  modeRow.className = 'alg-mode-row';

  const studyBtn = document.createElement('button');
  studyBtn.className = 'btn-mode';
  studyBtn.textContent = 'Study Formula';

  const mcBtn = document.createElement('button');
  mcBtn.className = 'btn-mode active';
  mcBtn.textContent = 'Multiple Choice';

  const ffBtn = document.createElement('button');
  ffBtn.className = 'btn-mode';
  ffBtn.textContent = 'Full Formula';

  modeRow.appendChild(studyBtn);
  modeRow.appendChild(mcBtn);
  modeRow.appendChild(ffBtn);
  leftTop.appendChild(modeRow);

  // Answer area (80% of top half)
  const answerArea = document.createElement('div');
  answerArea.className = 'alg-answer-area';
  leftTop.appendChild(answerArea);

  // ── Bottom half: history records ──────────────────────────────────────────
  const leftBot = document.createElement('div');
  leftBot.className = 'alg-left-bot';
  leftCol.appendChild(leftBot);

  const histLeft = document.createElement('div');
  histLeft.className = 'alg-hist-col';
  const histRight = document.createElement('div');
  histRight.className = 'alg-hist-col';
  leftBot.appendChild(histLeft);
  leftBot.appendChild(histRight);

  // Clear data button at bottom
  const clearDataBtn = document.createElement('button');
  clearDataBtn.className = 'btn-danger alg-clear-btn';
  clearDataBtn.textContent = '✕ Clear study data for this algorithm';
  clearDataBtn.addEventListener('click', () => {
    if (confirm('Clear all study data for ' + alg.name + '?')) {
      clearAlgData(algId);
      renderAlgorithmPage(root, algId);
    }
  });
  leftCol.appendChild(clearDataBtn);

  // ══════════════════════════════════════════════════════════════════════════
  // RIGHT COLUMN
  // ══════════════════════════════════════════════════════════════════════════
  const rightCol = document.createElement('div');
  rightCol.className = 'alg-right-col';
  mainRow.appendChild(rightCol);

  const cubeOuterBox = document.createElement('div');
  cubeOuterBox.className = 'cube-outer-box';
  rightCol.appendChild(cubeOuterBox);

  // Name + description
  const nameDescBox = document.createElement('div');
  nameDescBox.className = 'cube-name-box';
  const nameEl = document.createElement('div');
  nameEl.className = 'alg-cube-name';
  nameEl.textContent = alg.name;
  const descEl = document.createElement('p');
  descEl.className = 'alg-desc';
  descEl.textContent = alg.description;
  nameDescBox.appendChild(nameEl);
  nameDescBox.appendChild(descEl);
  cubeOuterBox.appendChild(nameDescBox);

  // Inner cube box with step arrows
  const cubeInnerBox = document.createElement('div');
  cubeInnerBox.className = 'cube-inner-box';
  cubeOuterBox.appendChild(cubeInnerBox);

  const algDisplay = document.createElement('div');
  algDisplay.className = 'alg-display';
  cubeInnerBox.appendChild(algDisplay);

  // Step-by-step arrow row — always reserves space, hidden via visibility
  const stepRow = document.createElement('div');
  stepRow.className = 'alg-step-row';
  stepRow.style.visibility = 'hidden';

  const stepPrevBtn = document.createElement('button');
  stepPrevBtn.className = 'btn-ghost alg-step-arrow';
  stepPrevBtn.innerHTML = '&#8592;';
  stepPrevBtn.title = 'Previous step';

  const stepNextBtn = document.createElement('button');
  stepNextBtn.className = 'btn-ghost alg-step-arrow';
  stepNextBtn.innerHTML = '&#8594;';
  stepNextBtn.title = 'Next step';

  const stepLabel = document.createElement('div');
  stepLabel.className = 'alg-step-label';

  stepRow.appendChild(stepPrevBtn);
  stepRow.appendChild(stepLabel);
  stepRow.appendChild(stepNextBtn);

  // Cube wrap
  const cubeWrap = document.createElement('div');
  cubeWrap.className = 'cube-wrap';

  cubeInnerBox.appendChild(cubeWrap);
  cubeInnerBox.appendChild(stepRow);

  const cubeSize = Math.floor(Math.min(window.innerWidth * 0.515, window.innerHeight * 0.515));
  const cubeRenderer = new CubeRenderer(cubeWrap, cubeSize, alg.state || null);

  // Nav row
  const algIdx = ALGORITHMS.findIndex(a => a.id === algId);
  const prevAlg = ALGORITHMS[algIdx - 1] || null;
  const nextAlgNav = ALGORITHMS[algIdx + 1] || null;

  const cubeNavRow = document.createElement('div');
  cubeNavRow.className = 'alg-cube-nav';

  const prevArrow = document.createElement('button');
  prevArrow.className = 'btn-ghost alg-cube-nav-btn';
  prevArrow.innerHTML = '&#8592; Prev';
  prevArrow.disabled = !prevAlg;
  prevArrow.addEventListener('click', () => {
    if (prevAlg) { cubeRenderer.destroy(); renderAlgorithmPage(root, prevAlg.id); }
  });

  const playBtn = document.createElement('button');
  playBtn.className = 'btn-primary alg-cube-nav-btn';
  playBtn.textContent = '▶ Play Animation';

  const stepGuideBtn = document.createElement('button');
  stepGuideBtn.className = 'btn-primary alg-cube-nav-btn';
  stepGuideBtn.textContent = '⊞ Step by Step';

  const nextArrow = document.createElement('button');
  nextArrow.className = 'btn-ghost alg-cube-nav-btn';
  nextArrow.innerHTML = 'Next &#8594;';
  nextArrow.disabled = !nextAlgNav;
  nextArrow.addEventListener('click', () => {
    if (nextAlgNav) { cubeRenderer.destroy(); renderAlgorithmPage(root, nextAlgNav.id); }
  });

  cubeNavRow.appendChild(prevArrow);
  cubeNavRow.appendChild(playBtn);
  cubeNavRow.appendChild(stepGuideBtn);
  cubeNavRow.appendChild(nextArrow);
  cubeOuterBox.appendChild(cubeNavRow);

  // Congrats overlay
  const congratsOverlay = document.createElement('div');
  congratsOverlay.className = 'congrats-overlay hidden';
  congratsOverlay.innerHTML = '<div class="congrats-box"><div class="congrats-emoji">🎉</div><h2>Correct!</h2></div>';
  root.appendChild(congratsOverlay);

  // ── Play Animation ────────────────────────────────────────────────────────
  let animating = false;

  function doPlay() {
    if (animating) return;
    animating = true;
    markViewed(algId);
    playBtn.disabled = true;
    stepGuideBtn.disabled = true;
    const moves = alg.moves ? alg.moves.split(' ').filter(Boolean) : [];
    animateMovesOnCube(moves, algDisplay, cubeRenderer, () => {
      animating = false;
      playBtn.disabled = false;
      stepGuideBtn.disabled = false;
      setTimeout(() => {
        cubeRenderer.resetCube(alg.state || null);
        algDisplay.textContent = '';
      }, 2000);
    });
  }

  playBtn.addEventListener('click', doPlay);

  // ── Step-by-Step Guide ────────────────────────────────────────────────────
  let stepActive = false;
  let stepMoves = [];
  let stepPos = 0;   // how many moves have been applied from initial state

  function updateStepDisplay() {
    const moves = stepMoves;
    algDisplay.innerHTML = moves.map((m, idx) =>
      idx === stepPos     ? `<span class="move-highlight">${m}</span>` :
      idx < stepPos       ? `<span class="move-done">${m}</span>` : m
    ).join(' ');
    stepLabel.textContent = `Step ${stepPos} / ${moves.length}`;
    stepPrevBtn.disabled = stepPos === 0;
    stepNextBtn.disabled = stepPos >= moves.length;
  }

  function enterStepMode() {
    stepActive = true;
    stepMoves = alg.moves ? alg.moves.split(' ').filter(Boolean) : [];
    stepPos = 0;
    cubeRenderer.resetCube(alg.state || null);
    stepRow.style.visibility = 'visible';
    stepGuideBtn.textContent = '✕ Exit Steps';
    updateStepDisplay();
  }

  function exitStepMode() {
    stepActive = false;
    stepRow.style.visibility = 'hidden';
    stepGuideBtn.textContent = '⊞ Step by Step';
    algDisplay.textContent = '';
    cubeRenderer.resetCube(alg.state || null);
  }

  stepGuideBtn.addEventListener('click', () => {
    if (stepActive) exitStepMode();
    else enterStepMode();
  });

  stepNextBtn.addEventListener('click', () => {
    if (!stepActive || stepPos >= stepMoves.length || animating) return;
    animating = true;
    stepNextBtn.disabled = true;
    stepPrevBtn.disabled = true;
    cubeRenderer.doMove(stepMoves[stepPos], () => {
      stepPos++;
      animating = false;
      updateStepDisplay();
    });
  });

  stepPrevBtn.addEventListener('click', () => {
    if (!stepActive || stepPos === 0 || animating) return;
    animating = true;
    stepNextBtn.disabled = true;
    stepPrevBtn.disabled = true;
    cubeRenderer.doMove(invertMove(stepMoves[stepPos - 1]), () => {
      stepPos--;
      animating = false;
      updateStepDisplay();
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // LEFT PANEL LOGIC
  // ══════════════════════════════════════════════════════════════════════════
  let currentMode = 'mc';

  function setMode(mode) {
    currentMode = mode;
    studyBtn.classList.toggle('active', mode === 'study');
    mcBtn.classList.toggle('active', mode === 'mc');
    ffBtn.classList.toggle('active', mode === 'ff');
    const testMode = (mode === 'mc' || mode === 'ff');
    playBtn.disabled = testMode;
    stepGuideBtn.disabled = testMode;
    if (mode === 'mc') renderMCMode();
    else if (mode === 'ff') renderFFMode();
    else if (mode === 'study') renderStudyMode();
    renderHistory();
  }

  studyBtn.addEventListener('click', () => setMode('study'));
  mcBtn.addEventListener('click', () => setMode('mc'));
  ffBtn.addEventListener('click', () => setMode('ff'));

  // ── Study Formula ─────────────────────────────────────────────────────────
  const FUN_FACTS = [
    "There are 43 quintillion (43,252,003,274,489,856,000) possible positions of a 3×3×3 Rubik's Cube.",
    "If you turned a Rubik's Cube once every second, it would take 1.4 trillion years to go through all positions.",
    "The Rubik's Cube was invented in 1974 by Hungarian professor Ernő Rubik, who originally called it the 'Magic Cube'.",
    "God's Number is 20 — every scrambled Rubik's Cube can be solved in 20 moves or fewer (using half-turn metric).",
    "The world record for solving a 3×3×3 Rubik's Cube is under 3.5 seconds, set by Max Park in 2023.",
    "CFOP (Fridrich Method) is used by most top speedcubers. It was popularized by Jessica Fridrich in the 1980s.",
    "The F2L step of CFOP can theoretically be solved in an average of ~8 moves with optimal pairing.",
    "There are 57 OLL cases and 21 PLL cases (including the skip) in the CFOP method.",
    "A robot solved the Rubik's Cube in 0.38 seconds in 2018, using custom hardware and computer vision.",
    "The Rubik's Cube has been used in studies of group theory, graph theory, and optimal search algorithms.",
  ];

  let factIndex = Math.floor(Math.random() * FUN_FACTS.length);

  function renderStudyMode() {
    answerArea.innerHTML = '';

    const factBox = document.createElement('div');
    factBox.className = 'sf-fact-box';
    factBox.textContent = FUN_FACTS[factIndex];
    answerArea.appendChild(factBox);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-ghost sf-next-btn';
    nextBtn.textContent = 'Another Fun Fact';
    nextBtn.addEventListener('click', () => {
      factIndex = (factIndex + 1) % FUN_FACTS.length;
      factBox.textContent = FUN_FACTS[factIndex];
    });
    answerArea.appendChild(nextBtn);
  }

  // ── Multiple Choice ───────────────────────────────────────────────────────
  const MC_QUESTIONS = 5;

  function renderMCMode() {
    answerArea.innerHTML = '';
    const moves = alg.moves ? alg.moves.split(' ').filter(Boolean) : [];
    if (!moves.length) {
      answerArea.innerHTML = '<p class="mc-empty">No moves for this algorithm.</p>';
      return;
    }

    let qIndex = 0;
    let score = 0;

    function nextQuestion() {
      if (qIndex >= MC_QUESTIONS) {
        showMCResult(score);
        return;
      }
      answerArea.innerHTML = '';

      // Pick a random step to ask about
      const stepIdx = Math.floor(Math.random() * moves.length);
      const correct = moves[stepIdx];

      // Generate 3 wrong choices from all possible moves
      const allMoves = [...new Set(ALGORITHMS.flatMap(a => (a.moves || '').split(' ').filter(Boolean)))];
      const wrongs = allMoves.filter(m => m !== correct);
      const choices = [correct];
      while (choices.length < 4 && wrongs.length) {
        const pick = wrongs.splice(Math.floor(Math.random() * wrongs.length), 1)[0];
        choices.push(pick);
      }
      choices.sort(() => Math.random() - 0.5);

      const qNum = document.createElement('div');
      qNum.className = 'mc-qnum';
      qNum.textContent = `Question ${qIndex + 1} of ${MC_QUESTIONS}`;
      answerArea.appendChild(qNum);

      const qText = document.createElement('div');
      qText.className = 'mc-question';
      qText.innerHTML = `What is step <strong>${stepIdx + 1}</strong> of this formula?`;
      answerArea.appendChild(qText);

      const formula = document.createElement('div');
      formula.className = 'mc-formula';
      formula.innerHTML = moves.map((m, i) =>
        i === stepIdx ? `<span class="mc-blank">?</span>` : `<span>${m}</span>`
      ).join(' ');
      answerArea.appendChild(formula);

      const choiceGrid = document.createElement('div');
      choiceGrid.className = 'mc-choices';
      choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'mc-choice';
        btn.textContent = ch;
        btn.addEventListener('click', () => {
          choiceGrid.querySelectorAll('.mc-choice').forEach(b => b.disabled = true);
          if (ch === correct) {
            btn.classList.add('mc-correct');
            score++;
            showMiniCongrats(answerArea, () => { qIndex++; nextQuestion(); });
          } else {
            btn.classList.add('mc-wrong');
            btn.classList.add('wiggle');
            choiceGrid.querySelectorAll('.mc-choice').forEach(b => {
              if (b.textContent === correct) b.classList.add('mc-correct');
            });
            setTimeout(() => { qIndex++; nextQuestion(); }, 2000);
          }
        });
        choiceGrid.appendChild(btn);
      });
      answerArea.appendChild(choiceGrid);
    }

    nextQuestion();
  }

  function showMCResult(score) {
    saveMCResult(algId, score);
    answerArea.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'mc-result';
    box.innerHTML = `
      <div class="mc-result-score">${score} / ${MC_QUESTIONS}</div>
      <div class="mc-result-label">${score === MC_QUESTIONS ? '🎉 Perfect!' : score >= 3 ? '👍 Good job!' : '📚 Keep practicing!'}</div>
    `;
    if (score === MC_QUESTIONS) {
      // Mark MC as done
      const comp = getCompleted();
      if (getFFPassed(algId)) { comp.add(algId); setCompleted(comp); }
    }
    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn-primary';
    retryBtn.textContent = 'Try Again';
    retryBtn.addEventListener('click', () => renderMCMode());
    box.appendChild(retryBtn);
    answerArea.appendChild(box);
    renderHistory();
  }

  function showMiniCongrats(container, onDone) {
    const el = document.createElement('div');
    el.className = 'mini-congrats pop-in';
    el.textContent = '✓ Correct!';
    container.appendChild(el);
    setTimeout(() => { el.remove(); onDone(); }, 700);
  }

  // ── Full Formula ──────────────────────────────────────────────────────────
  function renderFFMode() {
    answerArea.innerHTML = '';

    const prompt = document.createElement('div');
    prompt.className = 'ff-prompt';
    prompt.textContent = 'Type the full formula (moves separated by spaces):';
    answerArea.appendChild(prompt);

    const input = document.createElement('input');
    input.className = 'ff-input';
    input.type = 'text';
    input.placeholder = "e.g. R U R' U'";
    input.autocomplete = 'off';
    input.spellcheck = false;

    // Block paste
    input.addEventListener('paste', e => {
      e.preventDefault();
      const msg = document.createElement('div');
      msg.className = 'ff-no-paste';
      msg.textContent = "No cheating! Type it out 😄";
      answerArea.appendChild(msg);
      setTimeout(() => msg.remove(), 2000);
    });

    answerArea.appendChild(input);

    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn-primary ff-submit';
    submitBtn.textContent = 'Submit';
    answerArea.appendChild(submitBtn);

    const ffFeedback = document.createElement('div');
    ffFeedback.className = 'ff-feedback';
    answerArea.appendChild(ffFeedback);

    submitBtn.addEventListener('click', () => {
      const userMoves = input.value.trim().split(/\s+/).filter(Boolean);
      const correctMoves = alg.moves ? alg.moves.split(' ').filter(Boolean) : [];

      if (!userMoves.length) return;

      const passed = userMoves.join(' ') === correctMoves.join(' ');
      saveFFResult(algId, passed, userMoves.join(' '));
      submitBtn.disabled = true;
      input.disabled = true;

      if (passed) {
        ffFeedback.innerHTML = '<span style="color:var(--accent)">✓ Correct! Playing your solution...</span>';
        const comp = getCompleted();
        if (getMCBest(algId) === 5) { comp.add(algId); setCompleted(comp); }
        cubeRenderer.resetCube(alg.state || null);
        animateMovesOnCube(userMoves, algDisplay, cubeRenderer, () => {
          setTimeout(() => { cubeRenderer.resetCube(alg.state || null); algDisplay.textContent = ''; }, 2000);
        });
      } else {
        ffFeedback.innerHTML = '<span style="color:#ff4444">✗ Not quite. Playing your answer first...</span>';
        cubeRenderer.resetCube(alg.state || null);
        animateMovesOnCube(userMoves, algDisplay, cubeRenderer, () => {
          setTimeout(() => {
            cubeRenderer.resetCube(alg.state || null);
            algDisplay.textContent = '';
            ffFeedback.innerHTML = '<span style="color:var(--accent2)">Now playing the correct solution...</span>';
            setTimeout(() => {
              animateMovesOnCube(correctMoves, algDisplay, cubeRenderer, () => {
                setTimeout(() => {
                  cubeRenderer.resetCube(alg.state || null);
                  algDisplay.textContent = '';
                  renderFFMode();
                }, 2000);
              });
            }, 400);
          }, 2000);
        });
      }
      renderHistory();
    });
  }

  // ── History ───────────────────────────────────────────────────────────────
  function renderHistory() {
    histLeft.innerHTML = '';
    histRight.innerHTML = '';

    // MC history
    const mcTitle = document.createElement('div');
    mcTitle.className = 'hist-title';
    mcTitle.textContent = 'MC History';
    histLeft.appendChild(mcTitle);

    const mcHist = getMCHistory(algId);
    if (!mcHist.length) {
      const empty = document.createElement('div');
      empty.className = 'hist-empty';
      empty.textContent = 'No attempts yet';
      histLeft.appendChild(empty);
    } else {
      mcHist.slice(-10).reverse().forEach(({ score, date }) => {
        const row = document.createElement('div');
        row.className = 'hist-row';
        row.innerHTML = `<span class="${score === MC_QUESTIONS ? 'hist-pass' : 'hist-fail'}">${score}/${MC_QUESTIONS}</span><span class="hist-date">${new Date(date).toLocaleDateString()}</span>`;
        histLeft.appendChild(row);
      });
    }

    // FF history
    const ffTitle = document.createElement('div');
    ffTitle.className = 'hist-title';
    ffTitle.textContent = 'FF History';
    histRight.appendChild(ffTitle);

    const ffHist = getFFHistory(algId);
    if (!ffHist || !ffHist.attempts.length) {
      const empty = document.createElement('div');
      empty.className = 'hist-empty';
      empty.textContent = 'No attempts yet';
      histRight.appendChild(empty);
    } else {
      ffHist.attempts.slice(-10).reverse().forEach(({ passed, answer, date }) => {
        const row = document.createElement('div');
        row.className = 'hist-row hist-row-ff';
        const status = document.createElement('span');
        status.className = passed ? 'hist-pass' : 'hist-fail';
        status.textContent = passed ? '✓' : '✗';
        const answerEl = document.createElement('span');
        answerEl.className = 'hist-ff-answer';
        answerEl.textContent = answer || '—';
        answerEl.title = answer;
        const dateEl = document.createElement('span');
        dateEl.className = 'hist-date';
        dateEl.textContent = new Date(date).toLocaleDateString();
        row.appendChild(status);
        row.appendChild(answerEl);
        row.appendChild(dateEl);
        histRight.appendChild(row);
      });
    }
  }

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  const kbHandler = (e) => {
    // Don't fire when typing in the FF input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Arrow keys: step forward/backward in step mode
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (stepActive && !animating && stepPos < stepMoves.length) stepNextBtn.click();
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (stepActive && !animating && stepPos > 0) stepPrevBtn.click();
      return;
    }

    // PageDown / PageUp: next / previous algorithm
    if (e.key === 'PageDown') {
      e.preventDefault();
      if (nextAlgNav) { cubeRenderer.destroy(); renderAlgorithmPage(root, nextAlgNav.id); }
      return;
    }
    if (e.key === 'PageUp') {
      e.preventDefault();
      if (prevAlg) { cubeRenderer.destroy(); renderAlgorithmPage(root, prevAlg.id); }
      return;
    }
  };

  window.addEventListener('keydown', kbHandler);

  // Clean up on page navigation
  const origDestroy = cubeRenderer.destroy.bind(cubeRenderer);
  cubeRenderer.destroy = () => {
    window.removeEventListener('keydown', kbHandler);
    origDestroy();
  };

  // Initial render
  setMode('study');
}
