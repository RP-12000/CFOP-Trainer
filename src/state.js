const KEY          = 'cfop_completed';
const VIEWED_KEY   = 'cfop_viewed';
const MC_KEY       = 'cfop_mc_records';    // { algId: { scores: [0-5, ...], best: n } }
const FF_KEY       = 'cfop_ff_records';    // { algId: { attempts: n, passed: bool } }

// ── Completed (legacy "fully done" flag) ─────────────────────────────────────
export function getCompleted() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); }
}
export function setCompleted(set) {
  localStorage.setItem(KEY, JSON.stringify([...set]));
}

// ── Viewed ────────────────────────────────────────────────────────────────────
export function getViewed() {
  try { return new Set(JSON.parse(localStorage.getItem(VIEWED_KEY) || '[]')); } catch { return new Set(); }
}
export function markViewed(id) {
  const v = getViewed(); v.add(id);
  localStorage.setItem(VIEWED_KEY, JSON.stringify([...v]));
}
export function clearViewed() { localStorage.removeItem(VIEWED_KEY); }

// ── Multiple-choice records ───────────────────────────────────────────────────
export function getMCRecords() {
  try { return JSON.parse(localStorage.getItem(MC_KEY) || '{}'); } catch { return {}; }
}
export function saveMCResult(algId, score) {
  const r = getMCRecords();
  if (!r[algId]) r[algId] = { scores: [], best: 0 };
  r[algId].scores.push({ score, date: Date.now() });
  if (score > r[algId].best) r[algId].best = score;
  localStorage.setItem(MC_KEY, JSON.stringify(r));
}
export function getMCBest(algId) {
  const r = getMCRecords();
  return r[algId] ? r[algId].best : -1;
}
export function getMCHistory(algId) {
  const r = getMCRecords();
  return r[algId] ? r[algId].scores : [];
}

// ── Full-formula records ──────────────────────────────────────────────────────
export function getFFRecords() {
  try { return JSON.parse(localStorage.getItem(FF_KEY) || '{}'); } catch { return {}; }
}
export function saveFFResult(algId, passed, userAnswer) {
  const r = getFFRecords();
  // Migrate old schema where attempts was a number
  if (!r[algId] || typeof r[algId].attempts === 'number') {
    r[algId] = { attempts: [], passed: r[algId]?.passed || false };
  }
  r[algId].attempts.push({ passed, answer: userAnswer || '', date: Date.now() });
  if (passed) r[algId].passed = true;
  localStorage.setItem(FF_KEY, JSON.stringify(r));
}
export function getFFPassed(algId) {
  const r = getFFRecords();
  return r[algId] ? r[algId].passed : false;
}
export function getFFHistory(algId) {
  const r = getFFRecords();
  if (!r[algId]) return null;
  // Migrate old schema
  if (typeof r[algId].attempts === 'number') {
    r[algId].attempts = [];
  }
  return r[algId];
}

// ── "Fully mastered" = MC perfect (5/5) AND FF passed ────────────────────────
export function isFullyMastered(algId) {
  return getMCBest(algId) === 5 && getFFPassed(algId);
}

// ── Clear all study data for one algorithm ────────────────────────────────────
export function clearAlgData(algId) {
  const mc = getMCRecords(); delete mc[algId]; localStorage.setItem(MC_KEY, JSON.stringify(mc));
  const ff = getFFRecords(); delete ff[algId]; localStorage.setItem(FF_KEY, JSON.stringify(ff));
  const comp = getCompleted(); comp.delete(algId); setCompleted(comp);
}

// ── Clear everything ──────────────────────────────────────────────────────────
export function clearAllProgress() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(VIEWED_KEY);
  localStorage.removeItem(MC_KEY);
  localStorage.removeItem(FF_KEY);
}
