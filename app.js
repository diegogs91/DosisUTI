// ============================================================
//  DosisUCI — Lógica de aplicación
// ============================================================

'use strict';

// ── Estado global ─────────────────────────────────────────────
let state = {
  drugName: null,   // nombre del medicamento seleccionado
  drug: null,       // referencia al objeto DRUGS[name]
  prepIdx: 0,       // 0 = prep A, 1 = prep B, 2 = prep C
};

// ── Arranque ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildDrugSelect();
  initTheme();

  // Eventos
  document.getElementById('Med').addEventListener('change', onDrugSelect);
  document.getElementById('Peso').addEventListener('input', onPesoChange);
  document.getElementById('mlh').addEventListener('input', onMlhChange);
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('aboutBtn').addEventListener('click', () => openModal('aboutModal'));
  document.getElementById('infoBtn').addEventListener('click', showDrugInfo);
  document.getElementById('altura1').addEventListener('input', calcPesoIdeal);
  document.querySelectorAll('input[name="sexo1"]').forEach(r => r.addEventListener('change', calcPesoIdeal));

  // Cerrar modales con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal.open').forEach(m => closeModal(m.id));
  });
});

// ── Construcción del select ───────────────────────────────────
function buildDrugSelect() {
  const sel = document.getElementById('Med');
 console.log("hola"); 
  DRUG_CATEGORIES.forEach(cat => {
    const og = document.createElement('optgroup');
    og.label = cat.label;
    cat.drugs.forEach(name => {
      const op = document.createElement('option');
      op.value = name;
      op.textContent = name;
      og.appendChild(op);
    });
    sel.appendChild(og);
  });
}

// ── Selección de medicamento ──────────────────────────────────
function onDrugSelect() {
  const name = document.getElementById('Med').value;
  if (!name || !DRUGS[name]) return;

  state.drugName = name;
  state.drug     = DRUGS[name];
  state.prepIdx  = 0;

  setupForm();

  // Mostrar botón info
  document.getElementById('infoBtn').classList.remove('hidden');

  // Mostrar contenedor del formulario con animación
  const container = document.getElementById('drugFormContainer');
  container.classList.remove('hidden');
  requestAnimationFrame(() => container.classList.add('visible'));
}

// ── Configuración del formulario ──────────────────────────────
function setupForm() {
  const { drugName, drug } = state;

  // Peso: ocultar si droga independiente del peso
  document.getElementById('weightCard').style.display =
    NO_WEIGHT_DRUGS.has(drugName) ? 'none' : '';

  // Preparaciones disponibles
  buildPrepOptions(drug);

  // Resetear slider ml/h
  const mlhEl = document.getElementById('mlh');
  mlhEl.value = 0;
  mlhEl.step  = 1;
  document.getElementById('mlhValue').textContent = '0';

  // Rango de dosis
  document.getElementById('dosismm').textContent =
    `Dosis (${drug.min} – ${drug.max} ${drug.unit})`;

  // Calcular rango
  recalcPrep();
}

// ── Opciones de preparación ───────────────────────────────────
function buildPrepOptions(drug) {
  const grid = document.getElementById('prepGrid');
  grid.innerHTML = '';

  const preps = getPrepList(drug);
  preps.forEach((p, i) => {
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
  const list = [];
  if (drug.cant  !== undefined && drug.ml  !== undefined) list.push({ cant: drug.cant,  ml: drug.ml,  label: drug.a1 || 'Preparación A' });
  if (drug.cant1 !== undefined && drug.ml1 !== undefined) list.push({ cant: drug.cant1, ml: drug.ml1, label: drug.a2 || 'Preparación B' });
  if (drug.cant2 !== undefined && drug.ml2 !== undefined) list.push({ cant: drug.cant2, ml: drug.ml2, label: drug.a3 || 'Preparación C' });
  return list;
}

function selectPrep(idx) {
  state.prepIdx = idx;
  document.querySelectorAll('.prep-btn').forEach((b, i) => {
    b.classList.toggle('active', i === idx);
  });
  recalcPrep();
}

// ── Eventos de sliders ────────────────────────────────────────
function onPesoChange() {
  const v = document.getElementById('Peso').value;
  document.getElementById('pesoValue').textContent = v;
  recalcPrep();
}

function onMlhChange() {
  const mlhEl = document.getElementById('mlh');
  const v = Number(mlhEl.value);

  // Paso dinámico (igual que el original stepRange)
  const drug = state.drug;
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

  document.getElementById('mlhValue').textContent =
    Number.isInteger(v) ? v : v.toFixed(1);
  calcDosis();
}

// ── Cálculo: máx/min ml/h ─────────────────────────────────────
function recalcPrep() {
  const { drugName, drug, prepIdx } = state;
  if (!drug) return;

  const preps = getPrepList(drug);
  const p     = preps[prepIdx] || preps[0];
  const peso  = Number(document.getElementById('Peso').value);

  let cmm = (p.cant / p.ml) * drug.cons / peso;
  if (NO_WEIGHT_DRUGS.has(drugName)) cmm *= peso;

  // Max del slider = max_dosis / cmm * 1.1 (margen)
  const maxMlh = Math.round(drug.max / cmm * 1.1);
  const mlhEl  = document.getElementById('mlh');
  mlhEl.max    = maxMlh;

  // Clamp valor actual
  if (Number(mlhEl.value) > maxMlh) mlhEl.value = maxMlh;

  // Mostrar rango min-max
  const minMlh = drug.min / cmm;
  const maxMlhExact = drug.max / cmm;
  const minStr = minMlh < 1.5 ? minMlh.toFixed(1) : Math.round(minMlh);
  const maxStr = Math.round(maxMlhExact);
  document.getElementById('maxmin').textContent = `Mín ${minStr} ml/h — Máx ${maxStr} ml/h`;

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

  // Mostrar valor
  const dosisEl = document.getElementById('doseValue');
  const unitEl  = document.getElementById('doseUnit');
  dosisEl.textContent = dosis.toFixed(2);
  unitEl.textContent  = drug.unit;

  // Color según rango
  const card   = document.getElementById('doseCard');
  const status = document.getElementById('doseStatus');
  card.classList.remove('dose-normal','dose-warning','dose-danger');

  if (dosis === 0) {
    status.textContent = '';
  } else if (dosis > drug.max) {
    card.classList.add('dose-danger');
    status.textContent = '⚠ Supera la dosis máxima';
  } else if (dosis >= drug.max * 0.8) {
    card.classList.add('dose-warning');
    status.textContent = `Aprox. al máximo (${drug.max} ${drug.unit})`;
  } else {
    card.classList.add('dose-normal');
    const pct = ((dosis - drug.min) / (drug.max - drug.min) * 100).toFixed(0);
    status.textContent = dosis >= drug.min ? `Dentro del rango terapéutico` : 'Por debajo del mínimo';
  }

  // Barra de progreso
  const pct = Math.min(dosis / drug.max * 100, 100);
  document.getElementById('doseBar').style.width = pct + '%';
}

// ── Info del medicamento ──────────────────────────────────────
function showDrugInfo() {
  const { drugName, drug } = state;
  if (!drug) return;

  document.getElementById('infoModalTitle').textContent = drugName;

  let html = '';
  if (drug.tooltip) {
    html += `<div class="info-section">
      <h4>Información clínica</h4>
      <p>${drug.tooltip.replace(/\n/g, '<br>')}</p>
    </div>`;
  }
  if (drug.incompat) {
    html += `<div class="info-section info-danger">
      <h4>⚡ Incompatibilidades en Y</h4>
      <p>${drug.incompat}</p>
    </div>`;
  }
  if (drug.solAlt) {
    html += `<div class="info-section">
      <h4>Soluciones alternativas</h4>
      <p>${drug.solAlt}</p>
    </div>`;
  }
  if (drug.Otro) {
    html += `<div class="info-section">
      <h4>Notas adicionales</h4>
      <p>${drug.Otro}</p>
    </div>`;
  }

  document.getElementById('infoModalBody').innerHTML = html;
  openModal('infoModal');
}

// ── Peso ideal (fórmula de Devine) ───────────────────────────
function calcPesoIdeal() {
  const altura = Number(document.getElementById('altura1').value);
  const isMale = document.getElementById('male1').checked;
  if (!altura || altura < 100) return;

  const base  = isMale ? 50 : 45.5;
  const peso  = (altura - 152.4) * 0.91 + base;
  document.getElementById('resultPeso').textContent =
    peso > 0 ? peso.toFixed(1) + ' kg' : '—';
}

// ── Modales ───────────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  m.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeModal(id) {
  const m = document.getElementById(id);
  m.classList.remove('open');
  if (!document.querySelector('.modal.open')) {
    document.body.classList.remove('modal-open');
  }
}

// ── Tema ──────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  const btn = document.getElementById('themeToggle');
  btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  btn.querySelector('.icon-sun').style.display  = theme === 'dark'  ? 'block' : 'none';
  btn.querySelector('.icon-moon').style.display = theme === 'light' ? 'block' : 'none';
}
