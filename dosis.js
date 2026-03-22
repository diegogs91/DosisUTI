// ============================================================
//  DosisUCI — Parámetros de cálculo
//  Los datos clínicos (tooltip, incompatibilidades, etc.)
//  están en clinical.js (archivo privado, no incluido).
// ============================================================

// Drogas bloqueadas en versión gratuita
const PRO_DRUGS = new Set([
  'Isoproterenol','Levosimendan','Esmolol',
  'Diazepam','Clonidina',
  'Cisatracurio','Pancuronio'
]);

const DRUG_CATEGORIES = [
  {
    label: 'Vasopresores e Inotrópicos',
    labelKey: 'cat_vasopressors',
    drugs: ['Noradrenalina','Dopamina','Vasopresina','Adrenalina','Dobutamina','Milrinona','Isoproterenol','Levosimendan']
  },
  {
    label: 'Vasodilatadores',
    labelKey: 'cat_vasodilators',
    drugs: ['Nitroglicerina','Nitroprusiato','Labetalol','Esmolol']
  },
  {
    label: 'Analgesia',
    labelKey: 'cat_analgesia',
    drugs: ['Fentanilo','Morfina','Remifentanilo','Ketamina']
  },
  {
    label: 'Sedación',
    labelKey: 'cat_sedation',
    drugs: ['Propofol','Midazolam','Lorazepam','Diazepam','Dexmedetomidina','Clonidina','Tiopental']
  },
  {
    label: 'Bloqueantes Neuromusculares',
    labelKey: 'cat_nmb',
    drugs: ['Atracurio','Cisatracurio','Vecuronio','Rocuronio','Pancuronio']
  }
];

const NO_WEIGHT_DRUGS = new Set(['Vasopresina','Nitroglicerina','Morfina','Labetalol']);

const DRUGS = {
  Noradrenalina: { cant:16, ml:266, cons:16.666, max:4, min:0.01, unit:'mcg/kg/min', cant1:32, ml1:282, cant2:32, ml2:132, a1:'16 mg · 250 ml Dx 5%', a2:'32 mg · 250 ml Dx 5%', a3:'32 mg · 100 ml Dx 5%', stepMax:5, stepLimit:25 },
  Dopamina:      { cant:400, ml:250, cons:16.666, max:50, min:2, unit:'mcg/kg/min', cant1:800, ml1:250, a1:'400 mg · 250 ml Dx 5%', a2:'800 mg · 250 ml Dx 5%' },
  Vasopresina:   { cant:20, ml:250, cons:0.0166, max:0.1, min:0.01, unit:'UI/min', cant1:20, ml1:50, cant2:40, ml2:50, a1:'20 UI · 250 ml Dx 5%', a2:'20 UI · 50 ml Dx 5%', a3:'40 UI · 50 ml Dx 5%' },
  Adrenalina:    { cant:10, ml:250, cons:16.66, max:2, min:0.05, unit:'mcg/kg/min', cant1:20, ml1:250, cant2:10, ml2:110, a1:'10 mg · 250 ml Dx 5%', a2:'20 mg · 250 ml Dx 5%', a3:'10 mg · 100 ml Dx 5%', stepMax:5, stepLimit:50 },
  Dobutamina:    { cant:250, ml:270, cons:16.666, max:40, min:2.5, unit:'mcg/kg/min', cant1:250, ml1:140, a1:'250 mg · 250 ml Dx 5%', a2:'500 mg · 100 ml Dx 5%', stepMax:5, stepLimit:30 },
  Milrinona:     { cant:30, ml:280, cons:16.666, max:1.13, min:0.25, unit:'mcg/kg/min', cant1:20, ml1:120, a1:'30 mg · 250 ml Dx 5%', a2:'20 mg · 100 ml Dx 5%' },
  Nitroglicerina:{ cant:50, ml:250, cons:16.666, max:200, min:5, unit:'mcg/min', cant1:50, ml1:100, a1:'50 mg · 250 ml Dx 5%', a2:'50 mg · 100 ml Dx 5%', stepMax:5, stepLimit:40 },
  Nitroprusiato: { cant:50, ml:250, cons:16.666, max:10, min:0.25, unit:'mcg/kg/min', cant1:50, ml1:100, a1:'50 mg · 250 ml Dx 5%', a2:'50 mg · 100 ml Dx 5%', stepMax:5, stepLimit:40 },
  Labetalol:     { cant:200, ml:200, cons:0.0166, max:2, min:0.5, unit:'mg/min', cant1:500, ml1:250, a1:'200 mg · 160 ml SF', a2:'500 mg · 150 ml SF', stepMax:5, stepLimit:40 },
  Fentanilo:     { cant:750, ml:115, cons:1, max:10, min:0.05, unit:'mcg/kg/h', cant1:2500, ml1:150, cant2:3500, ml2:100, a1:'750 mcg · 100 ml SF', a2:'2500 mcg · 100 ml SF', a3:'3500 mcg · 30 ml SF', stepMax:5, stepLimit:30, stepMin1:0.1 },
  Morfina:       { cant:40, ml:104, cons:1, max:40, min:0.5, unit:'mg/h', cant1:100, ml1:110, a1:'40 mg · 100 ml Dx 5%', a2:'100 mg · 100 ml Dx 5%' },
  Remifentanilo: { cant:10, ml:110, cons:1000, max:24, min:3, unit:'mcg/kg/h', cant1:5, ml1:105, a1:'10 mg · 100 ml SF', a2:'5 mg · 100 ml SF' },
  Ketamina:      { cant:500, ml:250, cons:1, max:2.5, min:0.15, unit:'mg/kg/h', cant1:500, ml1:100, a1:'500 mg · 250 ml SF', a2:'500 mg · 100 ml SF' },
  Propofol:      { cant:500, ml:50, cons:1, max:5, min:0.03, unit:'mg/kg/h', cant1:1000, ml1:100, a1:'Frasco 1% (10 mg/ml)', a2:'Frasco 2% (20 mg/ml)' },
  Midazolam:     { cant:60, ml:112, cons:1, max:2, min:0.02, unit:'mg/kg/h', cant1:150, ml1:130, cant2:150, ml2:30, a1:'60 mg · 100 ml Dx 5%', a2:'150 mg · 100 ml Dx 5%', a3:'150 mg concentrado', stepMax:5, stepLimit:30, stepMin1:0.1 },
  Lorazepam:     { cant:40, ml:40, cons:1, max:0.1, min:0.01, unit:'mg/kg/h', cant1:8, ml1:102, a1:'40 mg · 30 ml Dx 5%', a2:'8 mg · 100 ml Dx 5%' },
  Dexmedetomidina:{ cant:400, ml:104, cons:1, max:1.9, min:0.2, unit:'mcg/kg/h', cant1:200, ml1:102, a1:'400 mcg · 100 ml SF', a2:'200 mcg · 100 ml SF' },
  Tiopental:     { cant:5000, ml:500, cons:1, max:5, min:0.5, unit:'mg/kg/h', cant1:5000, ml1:250, a1:'5000 mg · 500 ml SF', a2:'5000 mg · 250 ml SF' },
  Atracurio:     { cant:250, ml:275, cons:16.666, max:20, min:5, unit:'mcg/kg/min', cant1:500, ml1:150, a1:'250 mg · 200 ml SF', a2:'500 mg · 50 ml SF', stepMax:5, stepLimit:25 },
  Vecuronio:     { cant:50, ml:150, cons:1000, max:72, min:48, unit:'mcg/kg/h', cant1:50, ml1:300, a1:'50 mg · 100 ml SF', a2:'50 mg · 250 ml SF' },
  Rocuronio:     { cant:200, ml:120, cons:16.6666, max:16, min:4, unit:'mcg/kg/min', cant1:100, ml1:110, a1:'200 mg · 100 ml SF', a2:'100 mg · 100 ml SF' }
};
