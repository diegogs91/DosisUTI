// ============================================================
//  DosisUCI — Lógica de aplicación
// ============================================================

'use strict';

let currentLang = localStorage.getItem('lang') || 'es';

let state = {
  drugName: null,
  drug:     null,
  prepIdx:  0,
};

// ── i18n ─────────────────────────────────────────────────────
function t(key, vars = {}) {
  const dict = (I18N && I18N[currentLang]) || (I18N && I18N.es) || {};
  let str = dict[key] ?? (I18N?.es?.[key]) ?? key;
  return str.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? vars[k] : `{${k}}`
  );
}

function applyLang() {
  // html[lang]
  document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : currentLang;
  localStorage.setItem('lang', currentLang);

  // Botón lang
  document.getElementById('langToggle').textContent = t('lang_label');

  // Nodos de texto simples
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  // Nodos con HTML interno
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });

  // Reconstruir select con nuevas etiquetas
  rebuildDrugSelect();

  // Actualizar etiquetas dinámicas si hay droga activa
  if (state.drug) {
    document.getElementById('dosismm').textContent =
      t('dose_range_label', { min: state.drug.min, max: state.drug.max, unit: state.drug.unit });
    recalcPrep();
  } else {
    document.getElementById('dosismm').textContent = t('label_dose');
  }
}

function nextLang() {
  const idx = LANG_ORDER.indexOf(currentLang);
  currentLang = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
  applyLang();
}

// ── Arranque ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  applyLang(); // construye select + aplica todas las etiquetas

  document.getElementById('Med').addEventListener('change', onDrugSelect);
  document.getElementById('Peso').addEventListener('input', onPesoChange);
  document.getElementById('mlh').addEventListener('input', onMlhChange);
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('langToggle').addEventListener('click', nextLang);
  document.getElementById('aboutBtn').addEventListener('click', () => openModal('aboutModal'));
  document.getElementById('infoBtn').addEventListener('click', showDrugInfo);
  document.getElementById('altura1').addEventListener('input', calcPesoIdeal);
  document.querySelectorAll('input[name="sexo1"]').forEach(r =>
    r.addEventListener('change', calcPesoIdeal)
  );

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape')
      document.querySelectorAll('.modal.open').forEach(m => closeModal(m.id));
  });
});

// ── Select de medicamentos ────────────────────────────────────
function rebuildDrugSelect() {
  const sel = document.getElementById('Med');
  const currentVal = sel.value;
  sel.innerHTML = '';

  const ph = document.createElement('option');
  ph.value = '';
  ph.disabled = true;
  if (!currentVal) ph.selected = true;
  ph.textContent = t('select_placeholder');
  sel.appendChild(ph);

  DRUG_CATEGORIES.forEach(cat => {
    const og = document.createElement('optgroup');
    og.label = t(cat.labelKey);
    cat.drugs.forEach(name => {
      const op = document.createElement('option');
      op.value = name;
      op.textContent = PRO_DRUGS.has(name) ? `${name}${t('pro_suffix')}` : name;
      og.appendChild(op);
    });
    sel.appendChild(og);
  });

  if (currentVal) sel.value = currentVal;
}

// Alias por compatibilidad (no se usa ya que applyLang llama a rebuildDrugSelect)
function buildDrugSelect() { rebuildDrugSelect(); }

// ── Selección de medicamento ──────────────────────────────────
function onDrugSelect() {
  const name = document.getElementById('Med').value;
  if (!name) return;

  if (PRO_DRUGS.has(name)) {
    showProLock(name);
    return;
  }

  if (!DRUGS[name]) return;

  state.drugName = name;
  state.drug     = DRUGS[name];
  state.prepIdx  = 0;

  document.getElementById('proLockCard').classList.add('hidden');

  const hasClinical = window.CLINICAL && CLINICAL[name];
  document.getElementById('infoBtn').classList.toggle('hidden', !hasClinical);

  setupForm();

  const container = document.getElementById('drugFormContainer');
  container.classList.remove('hidden');
  requestAnimationFrame(() => container.classList.add('visible'));
}

// ── PRO lock ──────────────────────────────────────────────────
function showProLock(name) {
  const container = document.getElementById('drugFormContainer');
  container.classList.remove('visible');
  container.classList.add('hidden');
  document.getElementById('infoBtn').classList.add('hidden');

  document.getElementById('proLockTitle').textContent = name;
  const card = document.getElementById('proLockCard');
  card.classList.remove('hidden');
  requestAnimationFrame(() => card.classList.add('visible'));
}

// ── Formulario ────────────────────────────────────────────────
function setupForm() {
  const { drugName, drug } = state;

  document.getElementById('weightCard').style.display =
    NO_WEIGHT_DRUGS.has(drugName) ? 'none' : '';

  buildPrepOptions(drug);

  const mlhEl = document.getElementById('mlh');
  mlhEl.value = 0;
  mlhEl.step  = 1;
  document.getElementById('mlhValue').textContent = '0';
  document.getElementById('dosismm').textContent =
    t('dose_range_label', { min: drug.min, max: drug.max, unit: drug.unit });

  document.getElementById('doseValue').textContent = '0.00';
  document.getElementById('doseUnit').textContent  = drug.unit;
  document.getElementById('doseStatus').textContent = '';
  document.getElementById('doseBar').style.width = '0%';
  const card = document.getElementById('doseCard');
  card.classList.remove('dose-normal','dose-warning','dose-danger');

  recalcPrep();
}

// ── Preparaciones ─────────────────────────────────────────────
function buildPrepOptions(drug) {
  const grid = document.getElementById('prepGrid');
  grid.innerHTML = '';
  getPrepList(drug).forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = 'prep-btn' + (i === 0 ? ' active' : '');
    btn.dataset.idx = i;
    btn.innerHTML = `<span class="prep-letter">${String.fromCharCode(65 + i)}</span>
                     <span class="prep-text">${p.label}</span>`;
    btn.addEventListener('click', () => selectPrep(i));
    grid.appendChild(btn);
  });
}

function getPrepList(drug) {
  const fallbacks = [t('prep_a'), t('prep_b'), t('prep_c')];
  const list = [];
  if (drug.cant  != null && drug.ml  != null) list.push({ cant: drug.cant,  ml: drug.ml,  label: drug.a1 || fallbacks[0] });
  if (drug.cant1 != null && drug.ml1 != null) list.push({ cant: drug.cant1, ml: drug.ml1, label: drug.a2 || fallbacks[1] });
  if (drug.cant2 != null && drug.ml2 != null) list.push({ cant: drug.cant2, ml: drug.ml2, label: drug.a3 || fallbacks[2] });
  return list;
}

function selectPrep(idx) {
  state.prepIdx = idx;
  document.querySelectorAll('.prep-btn').forEach((b, i) =>
    b.classList.toggle('active', i === idx)
  );
  recalcPrep();
}

// ── Sliders ───────────────────────────────────────────────────
function onPesoChange() {
  document.getElementById('pesoValue').textContent = document.getElementById('Peso').value;
  recalcPrep();
}

function onMlhChange() {
  const mlhEl = document.getElementById('mlh');
  const v     = Number(mlhEl.value);
  const drug  = state.drug;

  if (drug) {
    if (drug.stepLimit && v > Number(drug.stepLimit)) {
      mlhEl.step = drug.stepMax || 1;
    } else if (drug.stepMin1 && state.prepIdx === 2 &&
               (state.drugName === 'Midazolam' || state.drugName === 'Fentanilo')) {
      mlhEl.step = drug.stepMin1;
    } else {
      mlhEl.step = 1;
    }
  }

  document.getElementById('mlhValue').textContent = Number.isInteger(v) ? v : v.toFixed(1);
  calcDosis();
}

// ── Cálculo rango ml/h ────────────────────────────────────────
function recalcPrep() {
  const { drugName, drug, prepIdx } = state;
  if (!drug) return;

  const preps = getPrepList(drug);
  const p     = preps[prepIdx] || preps[0];
  const peso  = Number(document.getElementById('Peso').value);

  let cmm = (p.cant / p.ml) * drug.cons / peso;
  if (NO_WEIGHT_DRUGS.has(drugName)) cmm *= peso;

  const maxMlh = Math.round(drug.max / cmm * 1.1);
  const mlhEl  = document.getElementById('mlh');
  mlhEl.max    = maxMlh;
  if (Number(mlhEl.value) > maxMlh) mlhEl.value = maxMlh;

  const minMlh = drug.min / cmm;
  const minStr = minMlh < 1.5 ? minMlh.toFixed(1) : Math.round(minMlh);
  const maxStr = Math.round(drug.max / cmm);
  document.getElementById('maxmin').textContent =
    t('speed_range', { min: minStr, max: maxStr });

  calcDosis();
}

// ── Cálculo de dosis ──────────────────────────────────────────
function calcDosis() {
  const { drugName, drug, prepIdx } = state;
  if (!drug) return;

  const preps = getPrepList(drug);
  const p     = preps[prepIdx] || preps[0];
  const peso  = Number(document.getElementById('Peso').value);
  const mlh   = Number(document.getElementById('mlh').value);

  let dosis = (p.cant / p.ml) * drug.cons / peso * mlh;
  if (NO_WEIGHT_DRUGS.has(drugName)) dosis *= peso;

  document.getElementById('doseValue').textContent = dosis.toFixed(2);
  document.getElementById('doseUnit').textContent  = drug.unit;

  const card   = document.getElementById('doseCard');
  const status = document.getElementById('doseStatus');
  card.classList.remove('dose-normal','dose-warning','dose-danger');

  if (dosis === 0) {
    status.textContent = '';
  } else if (dosis > drug.max) {
    card.classList.add('dose-danger');
    status.textContent = t('dose_over_max', { max: drug.max, unit: drug.unit });
  } else if (dosis >= drug.max * 0.8) {
    card.classList.add('dose-warning');
    status.textContent = t('dose_near_max', { max: drug.max, unit: drug.unit });
  } else {
    card.classList.add('dose-normal');
    status.textContent = dosis >= drug.min
      ? t('dose_normal')
      : t('dose_below_min', { min: drug.min, unit: drug.unit });
  }

  const pct = Math.min(dosis / drug.max * 100, 100);
  document.getElementById('doseBar').style.width = pct + '%';
}

// ── Info clínica (requiere clinical.js) ───────────────────────
function showDrugInfo() {
  const { drugName } = state;
  if (!window.CLINICAL || !CLINICAL[drugName]) return;

  const c = CLINICAL[drugName];
  document.getElementById('infoModalTitle').textContent = drugName;

  let html = '';
  if (c.tooltip) {
    html += `<div class="info-section">
      <h4>${t('info_clinical')}</h4>
      <p>${c.tooltip.replace(/\n/g, '<br>')}</p>
    </div>`;
  }
  if (c.incompat) {
    html += `<div class="info-section info-danger">
      <h4>${t('info_incompat')}</h4>
      <p>${c.incompat}</p>
    </div>`;
  }
  if (c.solAlt) {
    html += `<div class="info-section">
      <h4>${t('info_solution')}</h4>
      <p>${c.solAlt}</p>
    </div>`;
  }
  if (c.otro) {
    html += `<div class="info-section">
      <h4>${t('info_notes')}</h4>
      <p>${c.otro}</p>
    </div>`;
  }

  document.getElementById('infoModalBody').innerHTML = html;
  openModal('infoModal');
}

// ── Peso ideal ────────────────────────────────────────────────
function calcPesoIdeal() {
  const altura = Number(document.getElementById('altura1').value);
  const isMale = document.getElementById('male1').checked;
  if (!altura || altura < 100) return;
  const peso = (altura - 152.4) * 0.91 + (isMale ? 50 : 45.5);
  document.getElementById('resultPeso').textContent =
    peso > 0 ? peso.toFixed(1) + ' kg' : '—';
}

// ── Modales ───────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.classList.add('modal-open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  if (!document.querySelector('.modal.open'))
    document.body.classList.remove('modal-open');
}

// ── Tema ──────────────────────────────────────────────────────
function initTheme() {
  applyTheme(localStorage.getItem('theme') || 'dark');
}

function toggleTheme() {
  applyTheme(
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  );
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const btn = document.getElementById('themeToggle');
  btn.querySelector('.icon-sun').style.display  = theme === 'dark'  ? 'block' : 'none';
  btn.querySelector('.icon-moon').style.display = theme === 'light' ? 'block' : 'none';
}
