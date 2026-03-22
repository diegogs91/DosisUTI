// ============================================================
//  DosisUCI — Base de datos de medicamentos
//  Mantiene la misma lógica de cálculo del proyecto original
// ============================================================

const DRUG_CATEGORIES = [
  {
    label: 'Vasopresores e Inotrópicos',
    drugs: ['Noradrenalina','Dopamina','Vasopresina','Adrenalina','Dobutamina','Milrinona','Isoproterenol','Levosimendan']
  },
  {
    label: 'Vasodilatadores',
    drugs: ['Nitroglicerina','Nitroprusiato','Labetalol']
  },
  {
    label: 'Analgesia',
    drugs: ['Fentanilo','Morfina','Remifentanilo','Ketamina']
  },
  {
    label: 'Sedación',
    drugs: ['Propofol','Midazolam','Lorazepam','Diazepam','Dexmedetomidina','Clonidina','Tiopental']
  },
  {
    label: 'Bloqueantes Neuromusculares',
    drugs: ['Atracurio','Vecuronio','Rocuronio','Pancuronio']
  }
];

// Drogas que no usan peso en cálculo (dosis independiente del peso)
const NO_WEIGHT_DRUGS = new Set(['Vasopresina','Nitroglicerina','Morfina','Labetalol']);

// Drogas con paso especial en slider de alta velocidad
// stepMax: paso al superar stepLimit; stepMin1: paso fino en Form2

const DRUGS = {

  // ── Vasopresores ──────────────────────────────────────────
  Noradrenalina: {
    cant:16, ml:266, cons:16.666, max:4, min:0.01, unit:'mcg/kg/min',
    cant1:32, ml1:282, cant2:32, ml2:132,
    a1:'16 mg (4 amp.) en 250 ml Dx 5%',
    a2:'32 mg (8 amp.) en 250 ml Dx 5%',
    a3:'32 mg (8 amp.) en 100 ml Dx 5%',
    tooltip:'Dx 5% preferido. Para diluciones mayores 0,064 mcg/ml usar jeringas.\nInicio de acción 1-2 min.\nEn obesidad (IMC >30): iniciar a 3 mcg/min, ↑ cada 5 min de a 5 mcg/min hasta máx. 30 mcg/min.',
    solAlt:'SF',
    incompat:'Bicarbonato de sodio, fenobarbital, fenitoína, insulina, tiopental.',
    stepMax:5, stepLimit:25
  },
  Dopamina: {
    cant:400, ml:250, cons:16.666, max:50, min:2, unit:'mcg/kg/min',
    cant1:800, ml1:250,
    a1:'400 mg (2 amp.) en 250 ml Dx 5%',
    a2:'800 mg (4 amp.) en 250 ml Dx 5%',
    tooltip:'Dilución máxima: 6,4 mg/ml.\nDosis inicial 2-10 mcg/kg/min.',
    solAlt:'SF, RL',
    incompat:'Aciclovir, anfotericina, ampicilina, bicarbonato de sodio, cefalotina, furosemida, gentamicina, insulina, heparina, tiopental.'
  },
  Vasopresina: {
    cant:20, ml:250, cons:0.0166, max:0.1, min:0.01, unit:'UI/min',
    cant1:20, ml1:50, cant2:40, ml2:50,
    a1:'20 UI (1 amp.) en 250 ml Dx 5%',
    a2:'20 UI (1 amp.) en 50 ml Dx 5%',
    a3:'40 UI (2 amp.) en 50 ml Dx 5% o SF',
    tooltip:'Dilución máxima: 1 UI/ml.\nDosis inicial 0,01 UI/min.\nMáx: Shock séptico 0,07 UI/min / Post-cardiotomía 0,1 UI/min.\nTitular de a 0,005 UI/min cada 10-15 min.',
    incompat:'Anfotericina, fenitoína, furosemida.'
  },
  Adrenalina: {
    cant:10, ml:250, cons:16.66, max:2, min:0.05, unit:'mcg/kg/min',
    cant1:20, ml1:250, cant2:10, ml2:110,
    a1:'10 mg (10 amp.) en 250 ml Dx 5%',
    a2:'20 mg (20 amp.) en 250 ml Dx 5%',
    a3:'10 mg (10 amp.) en 100 ml Dx 5% (vol. final 110 ml)',
    tooltip:'Para diluciones >100 mcg/ml usar jeringas.',
    solAlt:'No probado con SF.',
    incompat:'Bicarbonato de sodio, furosemida, tiopental, vancomicina.',
    stepMax:5, stepLimit:50
  },
  Dobutamina: {
    cant:250, ml:270, cons:16.666, max:40, min:2.5, unit:'mcg/kg/min',
    cant1:250, ml1:140,
    a1:'250 mg (1 frasco) en 250 ml Dx 5% (vol. final 270 ml)',
    a2:'500 mg (2 frascos) en 100 ml Dx 5% (vol. final 140 ml)',
    tooltip:'Dosis inicial 0,5-1 mcg/kg/min. Mantenimiento 2-20 mcg/kg/min.',
    solAlt:'Dx 5%',
    incompat:'Aciclovir, anfotericina, bicarbonato de sodio, gluconato de calcio, furosemida, fenitoína, tiopental.',
    stepMax:5, stepLimit:30
  },
  Milrinona: {
    cant:30, ml:280, cons:16.666, max:1.13, min:0.25, unit:'mcg/kg/min',
    cant1:20, ml1:120,
    a1:'30 mg (3 amp.) en 250 ml Dx 5% (vol. final 280 ml)',
    a2:'20 mg (2 amp.) en 100 ml Dx 5% (vol. final 120 ml)',
    tooltip:'Dilución máxima: 0,8 mg/ml.\nCarga: 50 mcg/kg en 10 min. Mantenimiento: 0,375-0,75 mcg/kg/min.\nAjustar según ClCr:\n· ClCr 50: 0,43 · ClCr 40: 0,38 · ClCr 30: 0,33 · ClCr 20: 0,28 · ClCr 10: 0,23 · ClCr 5: 0,20 mcg/kg/min.',
    solAlt:'SF, RL',
    incompat:'Fenitoína, furosemida, imipenem, lidocaína, procainamida.'
  },
  Isoproterenol: {
    cant:1, ml:255, cons:16.666, max:30, min:0.5, unit:'mcg/min',
    cant1:1, ml1:505,
    a1:'1 mg (1 amp.) en 250 ml Dx 5% (vol. final 255 ml)',
    a2:'1 mg (1 amp.) en 500 ml Dx 5% (vol. final 505 ml)',
    tooltip:'Bolo: 0,2 mg en 10 ml SF, infundir lento.\nEn shock: 0,5-20 mcg/min, máx 30 mcg/min. Reducir si FC ≥110.',
    solAlt:'SF, RL',
    incompat:'Bicarbonato de sodio, furosemida, sulfato de magnesio, vecuronio.'
  },
  Levosimendan: {
    cant:12.5, ml:505, cons:16.666, max:0.2, min:0.05, unit:'mcg/kg/min',
    cant1:12.5, ml1:255,
    a1:'12,5 mg (1 frasco-amp.) en 500 ml Dx 5% (vol. final 505 ml)',
    a2:'12,5 mg (1 frasco-amp.) en 250 ml Dx 5% (vol. final 255 ml)',
    tooltip:'No recomendado en insuf. renal ni hepática grave.\nCarga opcional: 6-12 mcg/kg en 10 min.',
    solAlt:'SF, RL',
    incompat:'Anfotericina, bicarbonato de sodio, diazepam, fenobarbital, fenitoína, ganciclovir, insulina, TMS.'
  },

  // ── Vasodilatadores ───────────────────────────────────────
  Nitroglicerina: {
    cant:50, ml:250, cons:16.666, max:200, min:5, unit:'mcg/min',
    cant1:50, ml1:100,
    a1:'50 mg (1 amp.) en 250 ml Dx 5%',
    a2:'50 mg (1 amp.) en 100 ml Dx 5%',
    tooltip:'Evitar envases PVC (↓ fracción entregada 20-60%).\nDilución máxima: 1 mg/ml.\nInicio 5 mcg/min, ↑ 5 mcg/min cada 3-5 min hasta 20 mcg/min, luego 10 mcg/min.',
    solAlt:'SF',
    incompat:'Amiodarona, daptomicina, dobutamina, dopamina, fenitoína, furosemida, levofloxacina, TMS, vecuronio.',
    stepMax:5, stepLimit:40
  },
  Nitroprusiato: {
    cant:50, ml:250, cons:16.666, max:10, min:0.25, unit:'mcg/kg/min',
    cant1:50, ml1:100,
    a1:'50 mg (1 amp.) en 250 ml Dx 5%',
    a2:'50 mg (1 amp.) en 100 ml Dx 5%',
    tooltip:'Proteger de la luz. Descartar si es azul, verde, rojo brillante o marrón oscuro (normal: tinte naranja-marrón).\nDilución máxima: 1 mg/ml.\nInicio: 0,3 mcg/kg/min, ↑ 0,5 mcg/kg/min cada 5 min.\n⚠ Intoxicación por cianuro: disfunción SNC, acidosis, taquicardia.\n⚠ Intoxicación por tiocianato (tratamientos >6 días o >7 mcg/kg/min): dolor abdominal, tinnitus, agitación, convulsiones.',
    solAlt:'Solo Dx 5%',
    incompat:'Aciclovir, atracurio, amiodarona, caspofungina, ceftazidima, dobutamina, fenitoína, haloperidol, hidralazina, voriconazol.',
    stepMax:5, stepLimit:40
  },
  Labetalol: {
    cant:200, ml:200, cons:0.0166, max:2, min:0.5, unit:'mg/min',
    cant1:500, ml1:250,
    a1:'200 mg (10 amp.) en 160 ml SF (vol. final 200 ml)',
    a2:'500 mg (25 amp.) en 150 ml SF (vol. final 250 ml)',
    tooltip:'Dilución máxima: 3,75 mg/ml.\nDosis inicial: 20 mg en 2 min.\nInsuficiencia hepática: reducir 50%.',
    solAlt:'Dx 5%, RL',
    incompat:'Albúmina, anfotericina, bicarbonato de sodio, cefalosporinas, dexametasona, dopamina, fenitoína, furosemida, heparina, insulina, micafungina, tiopental.',
    stepMax:5, stepLimit:40
  },

  // ── Analgesia ─────────────────────────────────────────────
  Fentanilo: {
    cant:750, ml:115, cons:1, max:10, min:0.05, unit:'mcg/kg/h',
    cant1:2500, ml1:150, cant2:3500, ml2:100,
    a1:'750 mcg (3 amp.) + 100 ml SF (vol. final 115 ml)',
    a2:'2500 mcg (10 amp.) + 100 ml SF (vol. final 150 ml)',
    a3:'3500 mcg (14 amp.) + 30 ml SF (vol. final 100 ml)',
    tooltip:'Usar peso ideal (acumulación en grasas).\nDosis habituales <5 mcg/kg/h.\nMetabolismo CYP450 3A4.',
    solAlt:'Dx',
    incompat:'Atracurio, fenitoína, propofol, tiopental.',
    stepMax:5, stepLimit:30, stepMin1:0.1
  },
  Morfina: {
    cant:40, ml:104, cons:1, max:40, min:0.5, unit:'mg/h',
    cant1:100, ml1:110,
    a1:'40 mg (4 amp.) en 100 ml Dx 5% (vol. final 104 ml)',
    a2:'100 mg (10 amp.) en 100 ml Dx 5% (vol. final 110 ml)',
    tooltip:'Dilución máxima: 2,5 mg/ml.\nGFR 10-50 ml/min: 75% dosis.\nGFR <10 ml/min: 50% dosis.\nIniciar con dosis bajas y titular lentamente.',
    solAlt:'SF',
    incompat:'Aciclovir, anfotericina, diazepam, fenitoína, furosemida, ganciclovir, haloperidol, heparina, tiopental.'
  },
  Remifentanilo: {
    cant:10, ml:110, cons:1000, max:24, min:3, unit:'mcg/kg/h',
    cant1:5, ml1:105,
    a1:'10 mg (2 amp.) en 100 ml SF (vol. final 110 ml)',
    a2:'5 mg (1 amp.) en 100 ml SF (vol. final 105 ml)',
    tooltip:'⚠ Hiperalgesia al discontinuar.\nDosis habituales 3-18 mcg/kg/h.\nEn obesidad (IMC >30): ajustar por peso ideal.\nDilución máxima: 400 mcg/ml.',
    solAlt:'Dx',
    incompat:'Anfotericina, daptomicina, propofol.'
  },
  Ketamina: {
    cant:500, ml:250, cons:1, max:2.5, min:0.15, unit:'mg/kg/h',
    cant1:500, ml1:100,
    a1:'500 mg en 250 ml SF',
    a2:'500 mg en 100 ml SF',
    tooltip:'Inducción: 0,15 mg/kg. Mantenimiento: 0,15-0,5 mg/kg/h.',
    solAlt:'Dx',
    incompat:'Aciclovir, ampicilina, bicarbonato de sodio, fenitoína, furosemida, heparina, insulina, meropenem, TMS.'
  },

  // ── Sedación ──────────────────────────────────────────────
  Propofol: {
    cant:500, ml:50, cons:1, max:5, min:0.03, unit:'mg/kg/h',
    cant1:1000, ml1:100,
    a1:'Frasco/ampolla 1% (10 mg/ml)',
    a2:'Frasco/ampolla 2% (20 mg/ml)',
    tooltip:'Cambiar frasco y tubuladura a las 12 h de apertura.\nAmpollas en Dx 5%.\nDosis >3 mg/kg/h: mayor riesgo de Síndrome de Propofol.\nAncianos/debilitados: reducir 20%.\nObesidad: usar peso corporal magro.',
    incompat:'Incompatible con la mayoría de las drogas (usar lumen único). Anfotericina, atracurio, gluconato de calcio, dobutamina, dopamina, fenitoína, furosemida, labetalol, lorazepam, nitroglicerina, nitroprusiato, noradrenalina, remifentanilo, sulfato de magnesio, tiopental, vancomicina.'
  },
  Midazolam: {
    cant:60, ml:112, cons:1, max:2, min:0.02, unit:'mg/kg/h',
    cant1:150, ml1:130, cant2:150, ml2:30,
    a1:'60 mg (4 amp. de 15 mg) + 100 ml Dx 5% (vol. final 112 ml)',
    a2:'150 mg (10 amp. de 15 mg) + 100 ml Dx 5% (vol. final 130 ml)',
    a3:'Concentración máxima: 150 mg en baxter vacío (vol. final 30 ml)',
    tooltip:'Sedoanalgesia: 0,02-0,2 mg/kg/h.\nStatus epiléptico: carga 0,2 mg/kg → infusión 0,05-2 mg/kg/h.\nClCr <10: reducir 50%.\nAncianos/depresores SNC: reducir 50%.',
    solAlt:'SF',
    incompat:'Albúmina, anfotericina, bicarbonato, clonidina, diclofenac, heparina, dobutamina, fenitoína, furosemida, insulina, morfina, omeprazol, propofol, tiopental, valproato.',
    stepMax:5, stepLimit:30, stepMin1:0.1
  },
  Lorazepam: {
    cant:40, ml:40, cons:1, max:0.1, min:0.01, unit:'mg/kg/h',
    cant1:8, ml1:102,
    a1:'40 mg (10 amp.) en 30 ml Dx 5% (vol. final 40 ml)',
    a2:'8 mg (2 amp.) en 100 ml Dx 5% (vol. final 102 ml)',
    tooltip:'Usar envases libres de PVC.\n⚠ Riesgo de intoxicación por polietilenglicol: verificar precipitado.\nNo recomendado en disfunción renal o hepática severa.\nCarga: 0,02-0,04 mg/kg (<2 mg).\nIntermitente: 0,02-0,06 mg/kg c/2-6 h.\nInfusión continua: 0,01-0,1 mg/kg/h (<10 mg/h).',
    incompat:'Incompatible con la mayoría de las soluciones (lumen único).'
  },
  Diazepam: {
    cant:20, ml:104, cons:1, max:0.2, min:0.05, unit:'mg/kg/h',
    cant1:20, ml1:254,
    a1:'20 mg (2 amp.) en 100 ml SF (vol. final 104 ml)',
    a2:'20 mg (2 amp.) en 250 ml SF (vol. final 254 ml)',
    tooltip:'Dosis inicial: 5-10 mg.\nProteger de la luz. ⚠ Riesgo de acumulación de propilenglicol. No usar envases PVC.',
    solAlt:'Dx 5%',
    incompat:'Ampicilina, aztreonam, fenitoína, hidralazina, imipenem, omeprazol, ondansetrón, rocuronio.'
  },
  Dexmedetomidina: {
    cant:400, ml:104, cons:1, max:1.9, min:0.2, unit:'mcg/kg/h',
    cant1:200, ml1:102,
    a1:'400 mcg (2 amp.) en 100 ml SF (vol. final 104 ml)',
    a2:'200 mcg (1 amp.) en 100 ml SF (vol. final 102 ml)',
    tooltip:'Dosis habitual: 0,2-1,4 mcg/kg/h.\nCarga opcional: 1 mcg/min en 10 min (riesgo de hipotensión y bradicardia).\nNo administrar hemoderivados por el mismo catéter.',
    solAlt:'RL, Dx 5%',
    incompat:'Aminofilina, diazepam, diclofenac, fenobarbital, nitroprusiato de sodio, propofol, tiopental.',
    Otro:'Obesidad: usar peso ideal.'
  },
  Clonidina: {
    cant:900, ml:106, cons:1, max:2, min:0.5, unit:'mcg/kg/h',
    cant1:300, ml1:102,
    a1:'900 mcg (6 amp.) en 100 ml SF (vol. final 106 ml)',
    a2:'300 mcg (2 amp.) en 100 ml SF (vol. final 102 ml)',
    tooltip:'Proteger de la luz. Bolo: 0,5 mcg/kg.\n⚠ No discontinuar abruptamente (riesgo HTA por rebote).\nDescender dosis cada 24-48 h.'
  },
  Tiopental: {
    cant:5000, ml:500, cons:1, max:5, min:0.5, unit:'mg/kg/h',
    cant1:5000, ml1:250,
    a1:'5000 mg (5 amp.) en 500 ml SF',
    a2:'5000 mg (5 amp.) en 250 ml SF',
    tooltip:'Dosis de prueba: 1,5-3,5 mg/kg.\nClCr <10 ml/min: 75% de la dosis usual.',
    solAlt:'Dx 5%',
    incompat:'Adrenalina, atracurio, bicarbonato de sodio, calcio, dobutamina, dopamina, fenitoína, insulina, labetalol, magnesio, midazolam, morfina, noradrenalina, propofol, vancomicina, vecuronio.'
  },

  // ── Bloqueantes Neuromusculares ───────────────────────────
  Atracurio: {
    cant:250, ml:275, cons:16.666, max:20, min:5, unit:'mcg/kg/min',
    cant1:500, ml1:150,
    a1:'250 mg (5 amp.) + 200 ml SF (vol. final 275 ml)',
    a2:'500 mg (10 amp.) + 50 ml SF (vol. final 150 ml)',
    tooltip:'Dosis habitual: 11-13 mcg/kg/min.\nObesidad: usar peso ideal.\nBolo: 0,4-0,5 mg/kg. En asma/reacciones anafilactoides o cardiopatía: bolo 0,3-0,4 mg/kg en 1 min.',
    solAlt:'Dx 5%',
    incompat:'Aminofilina, diazepam, diclofenac, fenobarbital, nitroprusiato de sodio, propofol, tiopental.',
    stepMax:5, stepLimit:25
  },
  Vecuronio: {
    cant:50, ml:150, cons:1000, max:72, min:48, unit:'mcg/kg/h',
    cant1:50, ml1:300,
    a1:'50 mg (5 frascos) + 100 ml SF (vol. final 150 ml)',
    a2:'50 mg (5 frascos) + 250 ml SF (vol. final 300 ml)',
    tooltip:'Intubación: 80-100 mcg/kg. Obesos: usar peso ideal.',
    solAlt:'Dx 5%, RL',
    incompat:'Aciclovir, anfotericina, cefepime, furosemida, ganciclovir, imipenem, ketorolac, fenitoína, piperacilina-tazobactam.'
  },
  Rocuronio: {
    cant:200, ml:120, cons:16.6666, max:16, min:4, unit:'mcg/kg/min',
    cant1:100, ml1:110,
    a1:'4 frascos (200 mg) en 100 ml SF (vol. final 120 ml)',
    a2:'2 frascos (100 mg) en 100 ml SF (vol. final 110 ml)',
    tooltip:'Bolo inducción: 0,6-1,2 mg/kg.\nVentilación mecánica: 8-12 mcg/kg/min.\nAncianos: iniciar con dosis bajas. Obesos: usar peso ideal.',
    solAlt:'Dx 5%, RL',
    incompat:'Anfotericina B, azatioprina, fenitoína, furosemida, insulina, ketorolac, lorazepam, micafungina, piperacilina-tazobactam, tiopental, vancomicina.'
  },
  Pancuronio: {
    cant:40, ml:120, cons:1, max:0.12, min:0.06, unit:'mg/kg/min',
    a1:'40 mg (10 amp.) + 100 ml SF (vol. final 120 ml)',
    tooltip:'Evitar en ClCr <10 ml/min.\nEn obesidad: usar peso corporal magro.',
    solAlt:'Dx, RL',
    incompat:'Anfotericina B, caspofungina, fenitoína, furosemida, tiopental.'
  }
};
