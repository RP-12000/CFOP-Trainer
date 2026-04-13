import { ALGORITHMS, SECTIONS, F2L_SUBSECTIONS, OLL_SUBSECTIONS, PLL_SUBSECTIONS } from '../data/cfop.js';
import { getCompleted, getViewed, clearViewed, isFullyMastered, getMCBest, getFFPassed, clearAllProgress } from '../state.js';
import { renderFacePreview, FloatingCubesBackground, TitleCubeRenderer } from '../cube/renderer.js';
import { PLL_arrows } from '../data/configs.js';

const SUBSECTIONS = {
  F2L: F2L_SUBSECTIONS,
  OLL: OLL_SUBSECTIONS,
  PLL: PLL_SUBSECTIONS,
};

let studyBgCubes = null;

export function renderStudyPage(root) {
  root.innerHTML = '';
  root.className = 'page study-page';

  const SECTION_FULL = { F2L: 'First Two Layers', OLL: 'Orientation of the Last Layer', PLL: 'Permutation of the Last Layer' };

  // ── Background cubes ──────────────────────────────────────────────────────
  const animEnabled = localStorage.getItem('study_anim') !== 'off';
  if (animEnabled) studyBgCubes = new FloatingCubesBackground(document.body);

  // ── Layout: sidebar + main ────────────────────────────────────────────────
  const layout = document.createElement('div');
  layout.className = 'study-layout';
  root.appendChild(layout);

  // ── SIDEBAR ───────────────────────────────────────────────────────────────
  const sidebar = document.createElement('aside');
  sidebar.className = 'study-sidebar';
  layout.appendChild(sidebar);

  // Sidebar header with collapse toggle
  const sideHeader = document.createElement('div');
  sideHeader.className = 'sidebar-header';
  const sideTitle = document.createElement('span');
  sideTitle.className = 'sidebar-title';
  sideTitle.textContent = 'CFOP';
  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'sidebar-collapse-btn';
  collapseBtn.title = 'Collapse sidebar';
  collapseBtn.innerHTML = '&#8249;'; // ‹
  sideHeader.appendChild(sideTitle);
  sideHeader.appendChild(collapseBtn);
  sidebar.appendChild(sideHeader);

  // Collapsible body
  const sideBody = document.createElement('div');
  sideBody.className = 'sidebar-body';
  sidebar.appendChild(sideBody);

  let sidebarCollapsed = localStorage.getItem('sidebar_collapsed') === '1';
  function applySidebarCollapse() {
    sidebar.classList.toggle('sidebar-collapsed', sidebarCollapsed);
    main.style.marginLeft = sidebarCollapsed ? '36px' : '200px';
    collapseBtn.innerHTML = sidebarCollapsed ? '&#8250;' : '&#8249;';
    collapseBtn.title = sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar';
  }
  collapseBtn.addEventListener('click', () => {
    sidebarCollapsed = !sidebarCollapsed;
    localStorage.setItem('sidebar_collapsed', sidebarCollapsed ? '1' : '0');
    applySidebarCollapse();
  });
  // applySidebarCollapse() called after main is created below

  // Controls inside sidebar
  const ctrlGroup = document.createElement('div');
  ctrlGroup.className = 'sidebar-ctrl-group';
  // ... (appended to sideBody below)

  const themeBtn = document.createElement('button');
  themeBtn.className = 'btn-ghost sidebar-btn';
  themeBtn.textContent = document.documentElement.classList.contains('light-mode') ? '☾ Dark Mode' : '☀ Light Mode';
  themeBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
    themeBtn.textContent = document.documentElement.classList.contains('light-mode') ? '☾ Dark Mode' : '☀ Light Mode';
  });

  const animBtn = document.createElement('button');
  animBtn.className = 'btn-ghost sidebar-btn';
  animBtn.textContent = animEnabled ? '⏸ Hide Animation' : '▶ Show Animation';
  animBtn.addEventListener('click', () => {
    const nowEnabled = localStorage.getItem('study_anim') !== 'off';
    if (nowEnabled) {
      localStorage.setItem('study_anim', 'off');
      if (studyBgCubes) { studyBgCubes.destroy(); studyBgCubes = null; }
      // Pause title cubes instead of destroying them
      if (leftTitleCube)  leftTitleCube.setRunning(false);
      if (rightTitleCube) rightTitleCube.setRunning(false);
    } else {
      localStorage.setItem('study_anim', 'on');
      if (leftTitleCube)  leftTitleCube.setRunning(true);
      if (rightTitleCube) rightTitleCube.setRunning(true);
      if (!studyBgCubes) {
        studyBgCubes = new FloatingCubesBackground(document.body);
      }
    }
    animBtn.textContent = localStorage.getItem('study_anim') !== 'off' ? '⏸ Hide Animation' : '▶ Show Animation';
  });

  const clearBtn = document.createElement('button');
  clearBtn.className = 'btn-ghost sidebar-btn sidebar-btn-danger';
  clearBtn.textContent = '✕ Clear Progress';
  clearBtn.addEventListener('click', () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      clearAllProgress();
      clearViewed();
      renderStudyPage(root);
    }
  });

  ctrlGroup.appendChild(themeBtn);
  ctrlGroup.appendChild(animBtn);
  ctrlGroup.appendChild(clearBtn);
  sideBody.appendChild(ctrlGroup);

  // Progress summary
  const totalAlgs = ALGORITHMS.length;
  const mcDone  = ALGORITHMS.filter(a => getMCBest(a.id) === 5).length;
  const ffDone  = ALGORITHMS.filter(a => getFFPassed(a.id)).length;
  const fullDone = ALGORITHMS.filter(a => isFullyMastered(a.id)).length;

  const progressBox = document.createElement('div');
  progressBox.className = 'sidebar-progress';
  progressBox.innerHTML = `
    <div class="sidebar-progress-row"><span>Multiple Choice ✓</span><span class="sp-val">${mcDone} / ${totalAlgs}</span></div>
    <div class="sidebar-progress-row"><span>Full Formula ✓</span><span class="sp-val">${ffDone} / ${totalAlgs}</span></div>
    <div class="sidebar-progress-row sp-total"><span>Fully Mastered</span><span class="sp-val accent">${fullDone} / ${totalAlgs}</span></div>
    <div class="sidebar-progress-bar-wrap"><div class="sidebar-progress-bar" style="width:${Math.round(fullDone/totalAlgs*100)}%"></div></div>
  `;
  sideBody.appendChild(progressBox);

  // Quick-links nav
  const navLabel = document.createElement('div');
  navLabel.className = 'sidebar-nav-label';
  navLabel.textContent = 'Quick Links';
  sideBody.appendChild(navLabel);

  const navList = document.createElement('div');
  navList.className = 'sidebar-nav';
  sideBody.appendChild(navList);

  // Spacer to push help button to bottom
  const sidebarSpacer = document.createElement('div');
  sidebarSpacer.style.flex = '1';
  sideBody.appendChild(sidebarSpacer);

  const helpBtn = document.createElement('button');
  helpBtn.className = 'btn-ghost sidebar-btn sidebar-help-btn';
  helpBtn.textContent = '? Help';
  helpBtn.addEventListener('click', () => showHelp(root));
  sideBody.appendChild(helpBtn);

  // Build section anchor IDs and quick-link entries
  SECTIONS.forEach(section => {
    const sectionAlgs = ALGORITHMS.filter(a => a.section === section);
    const sectionMastered = sectionAlgs.filter(a => isFullyMastered(a.id)).length;

    const sectionLink = document.createElement('a');
    sectionLink.className = 'sidebar-nav-section';
    sectionLink.href = '#';
    sectionLink.title = SECTION_FULL[section] || section;
    sectionLink.innerHTML = `<span>${section}</span><span class="snl-count">${sectionMastered}/${sectionAlgs.length}</span>`;
    sectionLink.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('section-' + section)?.scrollIntoView({ behavior: 'smooth' });
    });
    navList.appendChild(sectionLink);

    const subs = SUBSECTIONS[section] || [];
    subs.forEach(sub => {
      const subAlgs = sectionAlgs.filter(a => a.subsection === sub);
      if (!subAlgs.length) return;
      const subLink = document.createElement('a');
      subLink.className = 'sidebar-nav-sub';
      subLink.href = '#';
      const subId = 'sub-' + section + '-' + sub.replace(/\s+/g, '-');
      subLink.textContent = sub;
      subLink.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById(subId)?.scrollIntoView({ behavior: 'smooth' });
      });
      navList.appendChild(subLink);
    });
  });

  // ── MAIN CONTENT ──────────────────────────────────────────────────────────
  const main = document.createElement('div');
  main.className = 'study-main';
  layout.appendChild(main);
  applySidebarCollapse(); // now main exists

  const titleRow = document.createElement('div');
  titleRow.className = 'study-title-row';

  const leftCubeWrap = document.createElement('div');
  leftCubeWrap.className = 'title-cube-wrap';
  const rightCubeWrap = document.createElement('div');
  rightCubeWrap.className = 'title-cube-wrap';

  const title = document.createElement('h1');
  title.className = 'study-title';
  title.textContent = 'CFOP Trainer';

  titleRow.appendChild(leftCubeWrap);
  titleRow.appendChild(title);
  titleRow.appendChild(rightCubeWrap);
  main.appendChild(titleRow);

  let leftTitleCube = null, rightTitleCube = null;
  if (animEnabled) {
    leftTitleCube  = new TitleCubeRenderer(leftCubeWrap, 90, -1);
    rightTitleCube = new TitleCubeRenderer(rightCubeWrap, 90, 1);
  }

  const viewed = getViewed();

  SECTIONS.forEach(section => {
    const sectionAlgs = ALGORITHMS.filter(a => a.section === section);
    const sectionMastered = sectionAlgs.filter(a => isFullyMastered(a.id)).length;

    const sectionEl = document.createElement('div');
    sectionEl.className = 'section-block';
    sectionEl.id = 'section-' + section;

    // Header — hover reveals full name, no collapse
    const header = document.createElement('div');
    header.className = 'section-header';

    const nameWrap = document.createElement('span');
    nameWrap.className = 'section-name-wrap';
    const nameShort = document.createElement('span');
    nameShort.className = 'section-name';
    nameShort.textContent = section;
    const nameFull = document.createElement('span');
    nameFull.className = 'section-name-full';
    nameFull.textContent = SECTION_FULL[section] || section;
    nameWrap.appendChild(nameShort);
    nameWrap.appendChild(nameFull);

    header.appendChild(nameWrap);
    const counterSpan = document.createElement('span');
    counterSpan.className = 'section-counter';
    counterSpan.textContent = `${sectionMastered} / ${sectionAlgs.length}`;
    header.appendChild(counterSpan);
    sectionEl.appendChild(header);

    const subsections = SUBSECTIONS[section] || [];
    subsections.forEach(sub => {
      const subAlgs = sectionAlgs.filter(a => a.subsection === sub);
      if (!subAlgs.length) return;
      const subMastered = subAlgs.filter(a => isFullyMastered(a.id)).length;
      const subId = 'sub-' + section + '-' + sub.replace(/\s+/g, '-');

      const subEl = document.createElement('div');
      subEl.className = 'subsection-block';
      subEl.id = subId;

      const subHeader = document.createElement('div');
      subHeader.className = 'subsection-header';
      subHeader.innerHTML = `<span class="subsection-name">${sub}</span><span class="subsection-counter">${subMastered} / ${subAlgs.length}</span>`;
      subEl.appendChild(subHeader);

      const grid = document.createElement('div');
      grid.className = 'alg-grid';

      subAlgs.forEach(alg => {
        const mastered = isFullyMastered(alg.id);
        const mcOk     = getMCBest(alg.id) === 5;
        const ffOk     = getFFPassed(alg.id);
        const isNew    = !viewed.has(alg.id) && !mcOk && !ffOk;

        const card = document.createElement('div');
        card.className = 'alg-card' + (mastered ? ' completed' : '');

        const previewFace = alg.section === 'F2L' ? 'F2L' : (alg.section === 'OLL' ? 'OLL' : 'PLL');
        const arrows = alg.section === 'PLL' ? (PLL_arrows[alg.name] || null) : null;
        const preview = renderFacePreview(alg.state, previewFace, 13, arrows);
        preview.setAttribute('class', 'card-preview');
        card.appendChild(preview);

        const nameSpan = document.createElement('span');
        nameSpan.className = 'alg-name';
        nameSpan.textContent = alg.name;
        card.appendChild(nameSpan);

        // Status badges top-right
        const badgeRow = document.createElement('div');
        badgeRow.className = 'card-badge-row';
        if (mcOk)  badgeRow.innerHTML += '<span class="card-badge badge-mc" title="Multiple Choice passed">MC</span>';
        if (ffOk)  badgeRow.innerHTML += '<span class="card-badge badge-ff" title="Full Formula passed">FF</span>';
        if (isNew) badgeRow.innerHTML += '<span class="alg-new-badge">NEW</span>';
        card.appendChild(badgeRow);

        card.addEventListener('click', () => {
          if (studyBgCubes) { studyBgCubes.destroy(); studyBgCubes = null; }
          import('./algorithm.js').then(m => m.renderAlgorithmPage(root, alg.id));
        });
        grid.appendChild(card);
      });

      subEl.appendChild(grid);
      sectionEl.appendChild(subEl);
    });

    sectionEl.className = 'section-block';
    main.appendChild(sectionEl);
  });

  // Trophy check — only if ALL algorithms fully mastered
  if (ALGORITHMS.every(a => isFullyMastered(a.id))) showTrophy(root);

  // Footer
  const footer = document.createElement('footer');
  footer.className = 'study-footer';
  footer.innerHTML = `
    <span>Algorithm explanation:</span>
    <a href="https://jperm.net/3x3/moves" target="_blank" rel="noopener">jperm.net/3x3/moves</a>
    <span class="study-footer-sep">·</span>
    <span>More CFOP reading:</span>
    <a href="https://solvethecube.com/algorithms" target="_blank" rel="noopener">solvethecube.com/algorithms</a>
  `;
  main.appendChild(footer);
}

function showHelp(root) {
  const overlay = document.createElement('div');
  overlay.className = 'help-overlay';
  overlay.innerHTML = `
    <div class="help-box">
      <h2 class="help-title">How to Use CFOP Trainer</h2>
      <div class="help-section">
        <div class="help-heading">Navigation</div>
        <p>Click any algorithm card to open its study page. Use <kbd>PageUp</kbd> / <kbd>PageDown</kbd> to move between algorithms.</p>
      </div>
      <div class="help-section">
        <div class="help-heading">Study Formula</div>
        <p>Read fun facts and explore the algorithm before testing yourself.</p>
      </div>
      <div class="help-section">
        <div class="help-heading">Multiple Choice</div>
        <p>Answer 5 questions about individual moves in the formula. Get 5/5 to mark MC as complete.</p>
      </div>
      <div class="help-section">
        <div class="help-heading">Full Formula</div>
        <p>Type the complete algorithm from memory. No pasting allowed! Submit to see your answer played on the cube.</p>
      </div>
      <div class="help-section">
        <div class="help-heading">Play Animation</div>
        <p>Watch the algorithm play out on the 3D cube. Drag the cube to rotate your view.</p>
      </div>
      <div class="help-section">
        <div class="help-heading">Step by Step</div>
        <p>Step through the algorithm one move at a time using the ← → arrows or keyboard arrow keys.</p>
      </div>
      <div class="help-section">
        <div class="help-heading">Progress</div>
        <p>An algorithm is <strong>fully mastered</strong> when you score 5/5 on MC <em>and</em> pass the Full Formula. The sidebar tracks your overall progress.</p>
      </div>
      <button class="btn-primary" id="help-close">Got it</button>
    </div>`;
  root.appendChild(overlay);
  overlay.querySelector('#help-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function showTrophy(root) {
  const overlay = document.createElement('div');
  overlay.className = 'trophy-overlay';
  overlay.innerHTML = `
    <div class="trophy-box">
      <div class="trophy-icon">🏆</div>
      <h2>You've mastered all CFOP algorithms!</h2>
      <p>Incredible work. You're a speed-cubing legend.<br><br>
      Ready for the next challenge? Look into <strong>ZBLL</strong>, <strong>COLL</strong>, or <strong>Roux</strong> — faster methods used by world-class solvers.</p>
      <button class="btn-primary" id="trophy-close">Continue</button>
    </div>`;
  root.appendChild(overlay);
  overlay.querySelector('#trophy-close').addEventListener('click', () => overlay.remove());
}
