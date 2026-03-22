# ⊕ DosisUCI

**Calculadora de dosis de medicamentos para Unidades de Cuidados Intensivos**

Herramienta clínica para el cálculo rápido y preciso de velocidades de infusión de drogas vasoactivas, sedoanalgesia y bloqueantes neuromusculares.

[![Demo](https://img.shields.io/badge/Live-Demo-00c9a7?style=flat-square)](https://TU-USUARIO.github.io/dosisUCI)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-yellow?style=flat-square)
![Sin dependencias](https://img.shields.io/badge/dependencias-ninguna-brightgreen?style=flat-square)
![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue?style=flat-square)

---

## Características

- **26 medicamentos** — Vasopresores, vasodilatadores, sedoanalgesia, BNM
- **Múltiples preparaciones** por medicamento (concentración estándar y restringida)
- **Cálculo en tiempo real** con indicación visual de rango terapéutico
- **Peso ideal** integrado (fórmula de Devine)
- **Información clínica** — incompatibilidades, diluciones, tips de dosificación
- **Tema oscuro/claro** con persistencia en `localStorage`
- **100% offline** — sin dependencias externas, sin CDN, sin servidor
- **Cero frameworks** — HTML + CSS + JS puro

## Medicamentos incluidos

| Categoría | Drogas |
|-----------|--------|
| Vasopresores e Inotrópicos | Noradrenalina, Dopamina, Vasopresina, Adrenalina, Dobutamina, Milrinona, Isoproterenol, Levosimendan |
| Vasodilatadores | Nitroglicerina, Nitroprusiato, Labetalol |
| Analgesia | Fentanilo, Morfina, Remifentanilo, Ketamina |
| Sedación | Propofol, Midazolam, Lorazepam, Diazepam, Dexmedetomidina, Clonidina, Tiopental |
| BNM | Atracurio, Vecuronio, Rocuronio, Pancuronio |

## Uso

### GitHub Pages (recomendado)

1. Hacer fork del repositorio
2. Ir a **Settings → Pages → Source: main / root**
3. Acceder en `https://TU-USUARIO.github.io/dosisUCI`

### Local

```bash
git clone https://github.com/TU-USUARIO/dosisUCI.git
cd dosisUCI
# Abrir index.html directamente en el navegador
# O servir localmente:
npx serve .
```

## Estructura

```
dosisUCI/
├── index.html       # HTML semántico, sin frameworks
├── style.css        # Design system completo, temas claro/oscuro
└── js/
    ├── dosis.js     # Base de datos de medicamentos
    └── app.js       # Lógica de la aplicación
```

## Fórmula de cálculo

```
dosis = (cant / ml) × cons / peso × velocidad_mlh
```

Para drogas independientes del peso (Vasopresina, Nitroglicerina, Morfina, Labetalol):
```
dosis = (cant / ml) × cons × velocidad_mlh
```

Donde `cons` es el factor de conversión de unidades específico de cada droga.

## Aviso legal

Esta aplicación **no reemplaza el criterio clínico**. La interpretación de los resultados es responsabilidad del profesional tratante. La información está basada en guías clínicas y publicaciones revisadas por médicos y farmacéuticos.

Esta aplicación no almacena ni comparte datos ingresados.

---

Desarrollado por Diego G. Sánchez · Sugerencias: diegos91+app@gmail.com
