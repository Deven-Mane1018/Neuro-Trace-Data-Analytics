# NeuroTrace — Decoding Parkinson's Through Voice

> **Seamedu Awards 2026 · Data Analytics Excellence Award**
>
> *Deven Kishor Mane · 2023-B-10072004 · BCA-AIML Final Year · Seamedu, ADYPU Pune · March 2026*

---

## Overview

**NeuroTrace** is a research-grade, multi-biomarker Parkinson's Disease progression analytics engine built from the Oxford Parkinson's Telemonitoring Dataset (Little et al., 2009). It is not a tutorial project or a Kaggle notebook — it is a seven-layer research pipeline that produces clinically actionable outputs from acoustic voice recordings.

The pipeline covers the full arc of a data science research study:
- Rigorous data engineering (KNN imputation, winsorisation, RobustScaling)
- Individual longitudinal trajectory fitting for 42 patients
- A full statistical hypothesis testing battery (non-parametric, Bonferroni corrected, effect-sized)
- Three independent feature importance methods cross-validated in a rank convergence heatmap
- An **original composite metric** — the Early Detection Index (EDI) — achieving AUC = 0.78 ± 0.04

This repository contains the **interactive showcase website** for the project, designed for a 3–3.5 minute video walkthrough narration submitted to the Seamedu Awards 2026.

**→ [Live Site](#)** · **→ [Research Paper](https://drive.google.com/file/d/1XJY1zd30tap_SvVkTiiWPuyJYvAE9MuT/view?usp=sharing)** · **→ [GitHub Notebook](https://github.com/Deven-Mane1018/Neuro-Trace-Data-Analytics)**

---

## The Dataset

| Property | Value |
|----------|-------|
| Source | Oxford Parkinson's Telemonitoring Dataset |
| Citation | Little MA, McSharry PE, Hunter EJ et al. — *IEEE Trans. Biomed. Eng.*, 2009 |
| Repository | UCI Machine Learning Repository |
| Patients | 42 Parkinson's Disease patients |
| Recordings | 5,875 voice recordings |
| Duration | 6-month longitudinal study |
| Features | 22 acoustic features per recording |
| Targets | Total UPDRS, Motor UPDRS |

---

## The 7-Layer Research Pipeline

### Layer 1 — Advanced Data Engineering
KNN imputation to preserve inter-feature correlations. IQR winsorisation at [1%, 99%] keeps sample size intact. RobustScaler handles the heavy tails typical of bioacoustic data. Disease staging applied before any modelling.

### Layer 2 — Longitudinal Trajectory Analysis
Per-patient OLS regression lines fitted for all 42 patients. Slope-based phenotyping into **Fast** (β₁ ≥ 66th percentile), **Moderate**, and **Slow Progressors**. Fast progressors accumulated 24.3 UPDRS units over 6 months vs 4.1 for slow — a 5.9× difference invisible in aggregate statistics.

### Layer 3 — Multi-Dimensional Correlation
Pearson *r*, Spearman *ρ*, and Kendall *τ* computed simultaneously. Partial correlation controls for age and sex — because jitter correlates with age independently of PD. Bonferroni correction applied throughout.

### Layer 4 — Hypothesis Testing Battery
Shapiro-Wilk normality testing rejected normality for all 16 biomarkers (p < 0.001) — mandating non-parametric tests throughout. Mann-Whitney U, Kruskal-Wallis, Bonferroni correction, and Cohen's *d* effect sizes applied to 5 formal hypotheses. All 5 supported at α = 0.05.

### Layer 5 — Dimensionality Reduction Suite
PCA biplot and scree plot (PC1 = 41.2% variance). t-SNE at perplexity=30 produces three well-separated disease-stage clusters in 2D, confirming the biomarker space encodes clinically meaningful information.

### Layer 6 — Predictive Biomarker Ranking
Random Forest (n=200 trees), Permutation Importance, Mutual Information, and RFE cross-validated in a rank convergence heatmap. RF 5-fold CV R² = 0.81 ± 0.03. Top-5 consensus biomarkers selected for the EDI.

### Layer 7 — Clinical Insight Synthesis
Construction and cross-validation of the **Early Detection Index (EDI)** — an original composite metric not published in any prior paper. Logistic regression on top-5 permutation-importance biomarkers. Cross-validated AUC = 0.78 ± 0.04 across all 5 folds. Three peer-reviewed papers replicated.

---

## Key Findings

| Finding | Result | Replication |
|---------|--------|-------------|
| Jitter(%) → Total UPDRS | Spearman ρ = 0.83, p < 0.001 (Bonferroni) | Little et al. 2009 (ρ = 0.86) ✓ |
| HNR declines with severity | MWU p < 0.001, Cohen's d = 0.89 | Sakar et al. 2013 ✓ |
| PPE escalates across all 3 stages | KW H = 312.4, p < 0.001 | Tsanas et al. 2010 ✓ |
| Fast progressors: elevated Shimmer(%) | MWU p < 0.01, Cohen's d = 0.72 | **Original NeuroTrace finding** |
| EDI AUC = 0.78 ± 0.04 | 5-fold stratified CV, beats 0.75 on all folds | **Original NeuroTrace contribution** |
| RF Model | R² = 0.81 ± 0.03, 200 trees, 5-fold CV | Jitter(%) top across all 3 ranking methods |

---

## Biomarker Families

| Family | Features | Clinical Meaning |
|--------|----------|-----------------|
| **Jitter** | Jit%, JitA, JitR, JitP, JitD | Cycle-to-cycle frequency variation; laryngeal tremor |
| **Shimmer** | Shim%, ShimB, SAQ3, SAQ5, SA11, SDDA | Amplitude instability; neuromuscular control degradation |
| **Harmonic** | NHR, HNR | Breathiness and turbulent airflow ratio |
| **Nonlinear** | RPDE, DFA, PPE | Complex vocal dynamics; nonlinear signal entropy |

---

## The Early Detection Index (EDI)

The EDI is an **original composite metric** built in this project — not present in any published paper.

- **Method**: Logistic regression classifier on the top 5 permutation-importance biomarkers, normalised to [0,1]
- **Output**: Probability of belonging to early-stage PD (UPDRS < 20) — a continuous clinical screening score
- **Performance**: Cross-validated AUC = **0.78 ± 0.04** (5-fold stratified)
- **Threshold beat**: Exceeds 0.75 clinical utility threshold on all 5 folds

### Clinical Interpretation
| EDI Score | Interpretation |
|-----------|---------------|
| > 0.70 | Early stage profile — clinical follow-up recommended |
| 0.40 – 0.70 | Moderate dysphonia — reassessment in 3 months |
| < 0.40 | Significant degradation — advanced progression risk |

---

## Tech Stack

| Category | Tools |
|----------|-------|
| **Core** | Python 3.12, pandas 3.0, NumPy 2.4, SciPy 1.17, scikit-learn 1.8 |
| **Analysis** | Random Forest, PCA, t-SNE, KNNImputer, RobustScaler, NetworkX |
| **Statistics** | Shapiro-Wilk, Mann-Whitney U, Kruskal-Wallis, Bonferroni, Cohen's d |
| **Reproducibility** | `random_state=42` throughout all experiments |

**17** publication-quality inline figures · **5** saved ML model artefacts

---

## Website Structure

This repository contains the showcase website (`index.html`, `styles.css`, `main.js`) — a single-page application designed for a 3–3.5 minute video walkthrough:

| Section | Content |
|---------|---------|
| Hero | Animated stat counters, dot-grid background |
| The Problem | Clinical context, India neurologist statistics |
| Data Foundation | Dataset card, biomarker family pills with tooltips |
| 7-Layer Pipeline | Interactive expand/collapse stepper |
| Key Findings | 2×3 findings grid with border coding |
| EDI | Animated SVG gauge + clinical thresholds |
| Why Different | Full comparison table vs typical student project |
| Tech Stack | Staggered pill animation |
| Closer | Quote, attribution, CTA buttons |

### Running Locally
Simply open `index.html` in any modern browser. No build step or server required.

---

## Why This Is Different

| Feature | Typical Student Project | NeuroTrace |
|---------|------------------------|------------|
| Dataset source | Kaggle / synthetic | UCI MLR (cited 1,200+ times) |
| Analysis depth | 1–2 methods | 7-layer pipeline |
| Statistical rigour | Pearson only | MWU + KW + Bonferroni + Cohen's d |
| Normality testing | Skipped | Shapiro-Wilk → non-parametric |
| Feature importance | 1 method | 3 independent methods cross-validated |
| Patient-level analysis | Aggregate only | Per-patient OLS trajectory fitting |
| Original contribution | None | EDI — novel composite metric |
| Literature validation | None | 3 peer-reviewed papers replicated |
| Deliverable format | Notebook | Research paper + notebook + live site |

---

## Links

- **Research Paper**: [Google Drive](https://drive.google.com/file/d/1XJY1zd30tap_SvVkTiiWPuyJYvAE9MuT/view?usp=sharing)
- **GitHub Repository**: [Neuro-Trace-Data-Analytics](https://github.com/Deven-Mane1018/Neuro-Trace-Data-Analytics)
- **Live Site**: Deployed on Vercel

---

## Author

**Deven Kishor Mane**
BCA — Artificial Intelligence & Machine Learning
Roll No: 2023-B-10072004
Seamedu School of Pro-Expressionism, ADYPU Pune
March 2026

---

*Built on real clinical data. Validated against peer-reviewed literature. Designed to make neurological monitoring accessible to 10 million people.*
