import { ALGORITHMS } from '../data/cfop.js';
import { renderStudyPage } from './study.js';
import { CubeRenderer } from '../cube/renderer.js';
import { PLL_arrows } from '../data/configs.js';
import { renderFacePreview } from '../cube/renderer.js';

const MC_COUNT = 20;
const FF_COUNT = 10;
const TOTAL = MC_COUNT + FF_COUNT;
const MC_POINTS = 3;
const FF_POINTS = 4;

function pickTestAlgorithms() {
  const shuffled = [...ALGORITHMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, TOTAL);
}

function buildMCQuestion(alg) {
  const others = ALGORITHMS.filter(a => a.id !== alg.id).sort(() => Math.random() - 0.5).slice(0, 5);
  const choices = [alg, ...others].sort(() => Math.random() - 0.5);
  return { type: 'mc', alg, choices };
}

function buildFFQuestion(alg) {
  return { type: 'ff', alg };
}

export function renderTestPage(root) {
  root.innerHTML = '';
  root.className = 'page test-page';

  const algs = pickTestAlgorithms();
  const questions = [
    ...algs.slice(0, MC_COUNT).map(a => buildMCQuestion(a)),
    ...algs.slice(MC_COUNT).map(a => buildFFQuestion(a)),
  ];

  // answers[i] = null | { correct: bool, value: string, chosenAlgId?: string }
  const answers = new Array(TOTAL).fill(null);
  let currentQ = 0;

  // ── Layout ────────────────────────────────────────────────────────────────
  const layout = document.createElement('div');
  layout.className = 'test-layout';
  root.appendChild(layout);

  // ── LEFT PANEL ────────────────────────────────────────────────────────────
  const leftPanel = document.createElement('div');
  leftPanel.className = 'test-left-panel';
  layout.appendChild(leftPanel);

  // Top bar — back button mirrors study page
  const testTopBar = document.createElement('div');
  testTopBar.className = 'test-topbar';
  leftPanel.appendChild(testTopBar);

  const backBtn = document.createElement('button');
  backBtn.className = 'btn-ghost test-back-btn';
  backBtn.textContent = '← Back';
  backBtn.addEventListener('click', () => {
    if (confirm('Leave the test? Your progress will be lost.')) {
      if (cubeRenderer) cubeRenderer.destroy();
      renderStudyPage(root);
    }
  });
  testTopBar.appendChild(backBtn);

  // Upper half: question area
  const questionArea = document.createElement('div');
  questionArea.className = 'test-question-area';
  leftPanel.appendChild(questionArea);

  // Lower half: question grid
  const gridArea = document.createElement('div');
  gridArea.className = 'test-grid-area';
  leftPanel.appendChild(gridArea);

  // ── RIGHT PANEL ───────────────────────────────────────────────────────────
  const rightPanel = document.createElement('div');
  rightPanel.className = 'test-right-panel';
  layout.appendChild(rightPanel);

  const cubeWrap = document.createElement('div');
  cubeWrap.className = 'test-cube-wrap';
  rightPanel.appendChild(cubeWrap);

  let cubeRenderer = null;

  function initCube(alg) {
    if (cubeRenderer) { cubeRenderer.destroy(); cubeRenderer = null; }
    const size = Math.floor(Math.min(window.innerWidth * 0.42, window.innerHeight * 0.7));
    cubeRenderer = new CubeRenderer(cubeWrap, size, alg.state || null);
  }

  // ── Question grid ─────────────────────────────────────────────────────────
  function buildGrid() {
    gridArea.innerHTML = '';

    const gridTitle = document.createElement('div');
    gridTitle.className = 'test-grid-title';
    gridTitle.textContent = 'Questions';
    gridArea.appendChild(gridTitle);

    // MC section box
    const mcBox = document.createElement('div');
    mcBox.className = 'test-q-section-box';
    const mcLabel = document.createElement('div');
    mcLabel.className = 'test-q-section-label';
    mcLabel.textContent = 'Multiple Choice (Q1–20)';
    mcBox.appendChild(mcLabel);
    const mcGrid = document.createElement('div');
    mcGrid.className = 'test-q-grid';
    for (let i = 0; i < MC_COUNT; i++) {
      mcGrid.appendChild(makeQBtn(i));
    }
    mcBox.appendChild(mcGrid);
    gridArea.appendChild(mcBox);

    // FF section box
    const ffBox = document.createElement('div');
    ffBox.className = 'test-q-section-box';
    const ffLabel = document.createElement('div');
    ffLabel.className = 'test-q-section-label';
    ffLabel.textContent = 'Full Formula (Q21–30)';
    ffBox.appendChild(ffLabel);
    const ffGrid = document.createElement('div');
    ffGrid.className = 'test-q-grid';
    for (let i = MC_COUNT; i < TOTAL; i++) {
      ffGrid.appendChild(makeQBtn(i));
    }
    ffBox.appendChild(ffGrid);
    gridArea.appendChild(ffBox);

    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn-primary test-submit-btn';
    submitBtn.textContent = 'Submit Test';
    submitBtn.addEventListener('click', () => handleSubmit());
    gridArea.appendChild(submitBtn);
  }

  function makeQBtn(i) {
    const btn = document.createElement('button');
    btn.className = 'test-q-btn';
    btn.textContent = i + 1;
    if (i < MC_COUNT) btn.classList.add('test-q-mc');
    else btn.classList.add('test-q-ff');
    if (answers[i] !== null) btn.classList.add('test-q-answered');
    if (i === currentQ) btn.classList.add('test-q-current');
    btn.addEventListener('click', () => { currentQ = i; renderQuestion(); });
    return btn;
  }

  // ── Render a question ─────────────────────────────────────────────────────
  function renderQuestion() {
    buildGrid();
    questionArea.innerHTML = '';

    const q = questions[currentQ];
    initCube(q.alg);

    const qHeader = document.createElement('div');
    qHeader.className = 'test-q-header';
    qHeader.innerHTML = `<span class="test-q-num">Q${currentQ + 1} / ${TOTAL}</span><span class="test-q-type">${q.type === 'mc' ? 'Multiple Choice' : 'Full Formula'}</span>`;
    questionArea.appendChild(qHeader);

    if (q.type === 'mc') renderMCQuestion(q);
    else renderFFQuestion(q);
  }

  function renderMCQuestion(q) {
    const prompt = document.createElement('div');
    prompt.className = 'test-mc-prompt';
    prompt.textContent = 'What is the formula for the configuration shown on the right?';
    questionArea.appendChild(prompt);

    const choiceGrid = document.createElement('div');
    choiceGrid.className = 'test-mc-choice-grid';

    const existing = answers[currentQ];

    q.choices.forEach(choiceAlg => {
      const btn = document.createElement('button');
      btn.className = 'test-mc-choice-btn';

      if (existing) {
        btn.disabled = true;
        if (choiceAlg.id === existing.chosenAlgId) btn.classList.add('test-mc-selected');
      }

      const label = document.createElement('span');
      label.className = 'test-mc-choice-label';
      label.textContent = choiceAlg.moves || '—';
      btn.appendChild(label);

      if (!existing) {
        btn.addEventListener('click', () => {
          answers[currentQ] = {
            correct: choiceAlg.id === q.alg.id,
            value: choiceAlg.moves || '',
            chosenAlgId: choiceAlg.id,
          };
          renderQuestion();
        });
      }
      choiceGrid.appendChild(btn);
    });
    questionArea.appendChild(choiceGrid);

    // Prev / Next below choices, spanning full width
    const navRow = document.createElement('div');
    navRow.className = 'test-nav-row';
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn-ghost test-nav-btn test-nav-prev';
    prevBtn.textContent = '← Prev';
    prevBtn.disabled = currentQ === 0;
    prevBtn.addEventListener('click', () => { currentQ--; renderQuestion(); });
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-ghost test-nav-btn test-nav-next';
    nextBtn.textContent = 'Next →';
    nextBtn.disabled = currentQ === TOTAL - 1;
    nextBtn.addEventListener('click', () => { currentQ++; renderQuestion(); });
    navRow.appendChild(prevBtn);
    navRow.appendChild(nextBtn);
    questionArea.appendChild(navRow);
  }

  function renderFFQuestion(q) {
    const prompt = document.createElement('div');
    prompt.className = 'test-ff-prompt';
    prompt.innerHTML = `Type the full formula for <strong>${q.alg.name}</strong>:`;
    questionArea.appendChild(prompt);

    const existing = answers[currentQ];

    const input = document.createElement('textarea');
    input.className = 'test-ff-input';
    input.placeholder = "e.g. R U R' U'";
    input.autocomplete = 'off';
    input.spellcheck = false;
    if (existing) {
      input.value = existing.value;
      input.disabled = true;
    }
    input.addEventListener('paste', e => {
      e.preventDefault();
      const msg = document.createElement('div');
      msg.className = 'ff-no-paste';
      msg.textContent = 'No pasting allowed!';
      questionArea.insertBefore(msg, input.nextSibling);
      setTimeout(() => msg.remove(), 2000);
    });
    questionArea.appendChild(input);

    if (!existing) {
      const submitBtn = document.createElement('button');
      submitBtn.className = 'btn-primary test-ff-submit';
      submitBtn.textContent = 'Save Answer';
      submitBtn.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) return;
        const correct = q.alg.moves ? q.alg.moves.split(' ').filter(Boolean).join(' ') : '';
        answers[currentQ] = { correct: val === correct, value: val };
        renderQuestion();
      });
      questionArea.appendChild(submitBtn);
    } else {
      const fb = document.createElement('div');
      fb.className = 'test-ff-saved';
      fb.textContent = '✓ Answer saved';
      questionArea.appendChild(fb);
    }

    // Prev / Next below FF content
    const navRow = document.createElement('div');
    navRow.className = 'test-nav-row';
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn-ghost test-nav-btn test-nav-prev';
    prevBtn.textContent = '← Prev';
    prevBtn.disabled = currentQ === 0;
    prevBtn.addEventListener('click', () => { currentQ--; renderQuestion(); });
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-ghost test-nav-btn test-nav-next';
    nextBtn.textContent = 'Next →';
    nextBtn.disabled = currentQ === TOTAL - 1;
    nextBtn.addEventListener('click', () => { currentQ++; renderQuestion(); });
    navRow.appendChild(prevBtn);
    navRow.appendChild(nextBtn);
    questionArea.appendChild(navRow);
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  function handleSubmit() {
    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0) {
      if (!confirm(`You have ${unanswered} unanswered question(s). They will count as 0. Proceed?`)) return;
    }
    showResults();
  }

  // ── Results ───────────────────────────────────────────────────────────────
  function showResults() {
    if (cubeRenderer) { cubeRenderer.destroy(); cubeRenderer = null; }
    renderResultsPage(root, questions, answers);
  }

  // Initial render
  renderQuestion();
}

// ── Standalone results renderer (also called from algorithm back-nav) ─────────
export function renderResultsPage(root, questions, answers) {
  root.innerHTML = '';
  root.className = 'page test-results-page';

  let mcScore = 0, ffScore = 0;
  for (let i = 0; i < MC_COUNT; i++) {
    if (answers[i] && answers[i].correct) mcScore += MC_POINTS;
  }
  for (let i = MC_COUNT; i < TOTAL; i++) {
    if (answers[i] && answers[i].correct) ffScore += FF_POINTS;
  }
  const total = mcScore + ffScore;

  // Top bar with "Back to Menu" at top-left
  const resultsTopBar = document.createElement('div');
  resultsTopBar.className = 'results-topbar';
  const backToMenuBtn = document.createElement('button');
  backToMenuBtn.className = 'btn-ghost test-back-btn';
  backToMenuBtn.textContent = '← Back to Menu';
  backToMenuBtn.addEventListener('click', () => renderStudyPage(root));
  resultsTopBar.appendChild(backToMenuBtn);
  root.appendChild(resultsTopBar);

  const box = document.createElement('div');
  box.className = 'test-results-box';

  const scoreEl = document.createElement('div');
  scoreEl.className = 'test-results-score';
  scoreEl.textContent = `${total} / 100`;
  box.appendChild(scoreEl);

  const breakdown = document.createElement('div');
  breakdown.className = 'test-results-breakdown';
  breakdown.innerHTML = `
    <span>Multiple Choice: ${mcScore} / ${MC_COUNT * MC_POINTS}</span>
    <span>Full Formula: ${ffScore} / ${FF_COUNT * FF_POINTS}</span>
  `;
  box.appendChild(breakdown);

  const grade = document.createElement('div');
  grade.className = 'test-results-grade';
  grade.textContent = total >= 90 ? '🏆 Outstanding!' : total >= 70 ? '🎉 Great job!' : total >= 50 ? '👍 Keep practicing!' : '📚 Study more!';
  box.appendChild(grade);

  // Review header + filter toggle
  const reviewHeader = document.createElement('div');
  reviewHeader.className = 'test-review-header';

  const reviewTitle = document.createElement('div');
  reviewTitle.className = 'test-review-title';
  reviewTitle.textContent = 'Review All Questions';
  reviewHeader.appendChild(reviewTitle);

  let showWrongOnly = false;
  const filterBtn = document.createElement('button');
  filterBtn.className = 'btn-ghost test-filter-btn';
  filterBtn.textContent = 'Show Wrong Only';
  filterBtn.addEventListener('click', () => {
    showWrongOnly = !showWrongOnly;
    filterBtn.textContent = showWrongOnly ? 'Show All' : 'Show Wrong Only';
    filterBtn.classList.toggle('test-filter-active', showWrongOnly);
    renderReviewList();
  });
  reviewHeader.appendChild(filterBtn);
  box.appendChild(reviewHeader);

  const reviewList = document.createElement('div');
  reviewList.className = 'test-review-list';
  box.appendChild(reviewList);

  function renderReviewList() {
    reviewList.innerHTML = '';
    questions.forEach((q, i) => {
      const ans = answers[i];
      const isCorrect = ans && ans.correct;
      if (showWrongOnly && isCorrect) return;

      const pts = i < MC_COUNT ? MC_POINTS : FF_POINTS;

      const row = document.createElement('div');
      row.className = 'test-review-row';

      // Q index
      const qIdx = document.createElement('span');
      qIdx.className = 'trr-qidx';
      qIdx.textContent = `Q${i + 1}`;
      row.appendChild(qIdx);

      // Algorithm card — same style as menu, clickable → algorithm page → back here
      const algCard = document.createElement('button');
      algCard.className = 'trr-alg-card';
      const previewFace = q.alg.section === 'F2L' ? 'F2L' : (q.alg.section === 'OLL' ? 'OLL' : 'PLL');
      const arrows = q.alg.section === 'PLL' ? (PLL_arrows[q.alg.name] || null) : null;
      const preview = renderFacePreview(q.alg.state, previewFace, 13, arrows);
      preview.style.display = 'block';
      preview.style.margin = '0 auto 4px';
      const algName = document.createElement('span');
      algName.className = 'trr-alg-name';
      algName.textContent = q.alg.name;
      algCard.appendChild(preview);
      algCard.appendChild(algName);
      algCard.addEventListener('click', () => {
        import('./algorithm.js').then(m =>
          m.renderAlgorithmPage(root, q.alg.id, () => renderResultsPage(root, questions, answers))
        );
      });
      row.appendChild(algCard);

      // Score badge (after alg card so it's visually grouped)
      const scoreBadge = document.createElement('span');
      scoreBadge.className = `trr-score ${isCorrect ? 'trr-pass' : 'trr-fail'}`;
      scoreBadge.textContent = isCorrect ? `+${pts}` : '0';
      row.appendChild(scoreBadge);

      // Your answer box
      const yourBox = document.createElement('div');
      yourBox.className = `trr-answer-box ${isCorrect ? 'trr-answer-pass' : 'trr-answer-fail'}`;
      const yourLabel = document.createElement('div');
      yourLabel.className = 'trr-box-label';
      yourLabel.textContent = 'Your answer';
      const yourVal = document.createElement('div');
      yourVal.className = 'trr-box-val';
      yourVal.textContent = ans ? ans.value : '—';
      yourBox.appendChild(yourLabel);
      yourBox.appendChild(yourVal);
      row.appendChild(yourBox);

      // Correct answer box
      const correctBox = document.createElement('div');
      correctBox.className = 'trr-answer-box trr-answer-correct';
      const correctLabel = document.createElement('div');
      correctLabel.className = 'trr-box-label';
      correctLabel.textContent = 'Correct answer';
      const correctVal = document.createElement('div');
      correctVal.className = 'trr-box-val';
      correctVal.textContent = q.alg.moves || '—';
      correctBox.appendChild(correctLabel);
      correctBox.appendChild(correctVal);
      row.appendChild(correctBox);

      reviewList.appendChild(row);
    });
  }

  renderReviewList();
  root.appendChild(box);
}
