// ============================================================
//  DosisUCI — Datos clínicos (ARCHIVO PRIVADO)
//  Añadir a .gitignore: js/clinical.js
// ============================================================

const CLINICAL = {
  Noradrenalina: {
    tooltip:'Dx 5% preferido. Para diluciones >0,064 mcg/ml usar jeringas.\nInicio de acción 1-2 min.\nEn obesidad (IMC >30): iniciar a 3 mcg/min, ↑ cada 5 min de a 5 mcg/min hasta máx. 30 mcg/min.',
    solAlt:'SF',
    incompat:'Bicarbonato de sodio, fenobarbital, fenitoína, insulina, tiopental.'
  },
  Dopamina: {
    tooltip:'Dilución máxima: 6,4 mg/ml.\nDosis inicial 2-10 mcg/kg/min. Mantenimiento 2-10 mcg/kg/min.',
    solAlt:'SF, RL',
    incompat:'Aciclovir, anfotericina, ampicilina, bicarbonato de sodio, cefalotina, furosemida, gentamicina, insulina, heparina, tiopental.'
  },
  Vasopresina: {
    tooltip:'Dilución máxima: 1 UI/ml.\nDosis inicial 0,01 UI/min.\nMáx: Shock séptico 0,07 UI/min / Post-cardiotomía 0,1 UI/min.\nTitular de a 0,005 UI/min cada 10-15 min.',
    incompat:'Anfotericina, fenitoína, furosemida.'
  },
  Adrenalina: {
    tooltip:'Para diluciones >100 mcg/ml usar jeringas.',
    solAlt:'No probado con SF.',
    incompat:'Bicarbonato de sodio, furosemida, tiopental, vancomicina.'
  },
  Dobutamina: {
    tooltip:'Dosis inicial 0,5-1 mcg/kg/min. Mantenimiento 2-20 mcg/kg/min.',
    solAlt:'Dx 5%',
    incompat:'Aciclovir, anfotericina, bicarbonato de sodio, gluconato de calcio, furosemida, fenitoína, tiopental.'
  },
  Milrinona: {
    tooltip:'Dilución máxima: 0,8 mg/ml.\nCarga: 50 mcg/kg en 10 min. Mantenimiento: 0,375-0,75 mcg/kg/min.\nAjustar según ClCr:\n· ClCr 50: 0,43 · ClCr 40: 0,38 · ClCr 30: 0,33 · ClCr 20: 0,28 · ClCr 10: 0,23 · ClCr 5: 0,20 mcg/kg/min.',
    solAlt:'SF, RL',
    incompat:'Fenitoína, furosemida, imipenem, lidocaína, procainamida.'
  },
  Isoproterenol: {
    tooltip:'Bolo: 0,2 mg en 10 ml SF, infundir lento.\nEn shock: 0,5-20 mcg/min, máx 30 mcg/min. Reducir si FC ≥110.',
    solAlt:'SF, RL',
    incompat:'Bicarbonato de sodio, furosemida, sulfato de magnesio, vecuronio.'
  },
  Levosimendan: {
    tooltip:'No recomendado en insuf. renal ni hepática grave.\nCarga opcional: 6-12 mcg/kg en 10 min.',
    solAlt:'SF, RL',
    incompat:'Anfotericina, bicarbonato de sodio, diazepam, fenobarbital, fenitoína, ganciclovir, insulina, TMS.'
  },
  Nitroglicerina: {
    tooltip:'Evitar envases PVC (↓ fracción entregada 20-60%).\nDilución máxima: 1 mg/ml.\nInicio 5 mcg/min, ↑ 5 mcg/min cada 3-5 min hasta 20 mcg/min, luego 10 mcg/min.',
    solAlt:'SF',
    incompat:'Amiodarona, daptomicina, dobutamina, dopamina, fenitoína, furosemida, levofloxacina, TMS, vecuronio.'
  },
  Nitroprusiato: {
    tooltip:'Proteger de la luz. Descartar si es azul, verde, rojo brillante o marrón oscuro (normal: tinte naranja-marrón).\nDilución máxima: 1 mg/ml.\nInicio: 0,3 mcg/kg/min, ↑ 0,5 mcg/kg/min cada 5 min.\n⚠ Intoxicación por cianuro: disfunción SNC, acidosis, taquicardia.\n⚠ Intoxicación por tiocianato (>6 días o >7 mcg/kg/min): dolor abdominal, tinnitus, agitación, convulsiones.',
    solAlt:'Solo Dx 5%',
    incompat:'Aciclovir, atracurio, amiodarona, caspofungina, ceftazidima, dobutamina, fenitoína, haloperidol, hidralazina, voriconazol.'
  },
  Labetalol: {
    tooltip:'Dilución máxima: 3,75 mg/ml.\nDosis inicial: 20 mg en 2 min.\nInsuficiencia hepática: reducir 50%.',
    solAlt:'Dx 5%, RL',
    incompat:'Albúmina, anfotericina, bicarbonato de sodio, cefalosporinas, dexametasona, dopamina, fenitoína, furosemida, heparina, insulina, micafungina, tiopental.'
  },
  Fentanilo: {
    tooltip:'Usar peso ideal (acumulación en grasas).\nDosis habituales <5 mcg/kg/h.\nMetabolismo CYP450 3A4.',
    solAlt:'Dx',
    incompat:'Atracurio, fenitoína, propofol, tiopental.'
  },
  Morfina: {
    tooltip:'Dilución máxima: 2,5 mg/ml.\nGFR 10-50 ml/min: 75% dosis.\nGFR <10 ml/min: 50% dosis.\nIniciar con dosis bajas y titular lentamente.',
    solAlt:'SF',
    incompat:'Aciclovir, anfotericina, diazepam, fenitoína, furosemida, ganciclovir, haloperidol, heparina, tiopental.'
  },
  Remifentanilo: {
    tooltip:'⚠ Hiperalgesia al discontinuar.\nDosis habituales 3-18 mcg/kg/h.\nEn obesidad (IMC >30): ajustar por peso ideal.\nDilución máxima: 400 mcg/ml.',
    solAlt:'Dx',
    incompat:'Anfotericina, daptomicina, propofol.'
  },
  Ketamina: {
    tooltip:'Inducción: 0,15 mg/kg. Mantenimiento: 0,15-0,5 mg/kg/h.',
    solAlt:'Dx',
    incompat:'Aciclovir, ampicilina, bicarbonato de sodio, fenitoína, furosemida, heparina, insulina, meropenem, TMS.'
  },
  Propofol: {
    tooltip:'Cambiar frasco y tubuladura a las 12 h de apertura.\nAmpollas en Dx 5%.\nDosis >3 mg/kg/h: mayor riesgo de Síndrome de Propofol.\nAncianos/debilitados: reducir 20%.\nObesidad: usar peso corporal magro.',
    incompat:'Incompatible con la mayoría de las drogas (usar lumen único). Anfotericina, atracurio, gluconato de calcio, dobutamina, dopamina, fenitoína, furosemida, labetalol, lorazepam, nitroglicerina, nitroprusiato, noradrenalina, remifentanilo, sulfato de magnesio, tiopental, vancomicina.'
  },
  Midazolam: {
    tooltip:'Sedoanalgesia: 0,02-0,2 mg/kg/h.\nStatus epiléptico: carga 0,2 mg/kg → infusión 0,05-2 mg/kg/h.\nClCr <10: reducir 50%.\nAncianos/depresores SNC: reducir 50%.',
    solAlt:'SF',
    incompat:'Albúmina, anfotericina, bicarbonato, clonidina, diclofenac, heparina, dobutamina, fenitoína, furosemida, insulina, morfina, omeprazol, propofol, tiopental, valproato.'
  },
  Lorazepam: {
    tooltip:'Usar envases libres de PVC.\n⚠ Riesgo de intoxicación por polietilenglicol: verificar precipitado.\nNo recomendado en disfunción renal o hepática severa.\nCarga: 0,02-0,04 mg/kg (<2 mg). Intermitente: 0,02-0,06 mg/kg c/2-6 h.\nInfusión continua: 0,01-0,1 mg/kg/h (<10 mg/h).',
    incompat:'Incompatible con la mayoría de las soluciones (lumen único).'
  },
  Diazepam: {
    tooltip:'Dosis inicial: 5-10 mg.\nProteger de la luz. ⚠ Riesgo de acumulación de propilenglicol. No usar envases PVC.',
    solAlt:'Dx 5%',
    incompat:'Ampicilina, aztreonam, fenitoína, hidralazina, imipenem, omeprazol, ondansetrón, rocuronio.'
  },
  Dexmedetomidina: {
    tooltip:'Dosis habitual: 0,2-1,4 mcg/kg/h.\nCarga opcional: 1 mcg/min en 10 min (riesgo de hipotensión y bradicardia).\nNo administrar hemoderivados por el mismo catéter.',
    solAlt:'RL, Dx 5%',
    incompat:'Aminofilina, diazepam, diclofenac, fenobarbital, nitroprusiato de sodio, propofol, tiopental.',
    otro:'Obesidad: usar peso ideal.'
  },
  Clonidina: {
    tooltip:'Proteger de la luz. Bolo: 0,5 mcg/kg.\n⚠ No discontinuar abruptamente (riesgo HTA por rebote).\nDescender dosis cada 24-48 h.'
  },
  Tiopental: {
    tooltip:'Dosis de prueba: 1,5-3,5 mg/kg.\nClCr <10 ml/min: 75% de la dosis usual.',
    solAlt:'Dx 5%',
    incompat:'Adrenalina, atracurio, bicarbonato de sodio, calcio, dobutamina, dopamina, fenitoína, insulina, labetalol, magnesio, midazolam, morfina, noradrenalina, propofol, vancomicina, vecuronio.'
  },
  Atracurio: {
    tooltip:'Dosis habitual: 11-13 mcg/kg/min.\nObesidad: usar peso ideal.\nBolo: 0,4-0,5 mg/kg. En asma/anafilaxia o cardiopatía: bolo 0,3-0,4 mg/kg en 1 min.',
    solAlt:'Dx 5%',
    incompat:'Aminofilina, diazepam, diclofenac, fenobarbital, nitroprusiato de sodio, propofol, tiopental.'
  },
  Cisatracurio: {
    tooltip:'Intubación: 0,15-0,2 mg/kg.\nMantenimiento: 1-3 mcg/kg/min. Sin liberación de histamina.\nObesidad: usar peso ideal.',
    solAlt:'Dx 5%, RL',
    incompat:'Ketorolac, propofol, bicarbonato de sodio.'
  },
  Vecuronio: {
    tooltip:'Intubación: 80-100 mcg/kg. Obesos: usar peso ideal.',
    solAlt:'Dx 5%, RL',
    incompat:'Aciclovir, anfotericina, cefepime, furosemida, ganciclovir, imipenem, ketorolac, fenitoína, piperacilina-tazobactam.'
  },
  Rocuronio: {
    tooltip:'Bolo inducción: 0,6-1,2 mg/kg.\nVentilación mecánica: 8-12 mcg/kg/min.\nAncianos: iniciar con dosis bajas. Obesos: usar peso ideal.',
    solAlt:'Dx 5%, RL',
    incompat:'Anfotericina B, azatioprina, fenitoína, furosemida, insulina, ketorolac, lorazepam, micafungina, piperacilina-tazobactam, tiopental, vancomicina.'
  },
  Pancuronio: {
    tooltip:'Evitar en ClCr <10 ml/min.\nEn obesidad: usar peso corporal magro.',
    solAlt:'Dx, RL',
    incompat:'Anfotericina B, caspofungina, fenitoína, furosemida, tiopental.'
  },
  Esmolol: {
    tooltip:'Carga: 500 mcg/kg en 1 min. Mantenimiento: 50-200 mcg/kg/min.\nTitular de a 50 mcg/kg/min cada 4 min.\nDuración de acción muy corta (~9 min).',
    solAlt:'SF, Dx 5%',
    incompat:'Bicarbonato de sodio, furosemida, diazepam.'
  }
};
