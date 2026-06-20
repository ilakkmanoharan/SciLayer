# SciLayer articles catalog

Published preprints live in `{slug}/` folders. Each folder contains `metadata.json` and a manuscript file (`manuscript.md` or versioned variants).

**Machine-readable groupings:** [`catalog.json`](./catalog.json) — used by the site browse page and for editorial navigation.

**Author:** Ilakkuvaselvi Manoharan · ORCID `0009-0008-8073-5416` · https://sci-layer.vercel.app/authors/0009-0008-8073-5416

---

## 1. ASRA — Foundations & Theory

Architecture-level concept papers and primers.

| Article | Slug |
|---------|------|
| Architectures for Adaptive Scientific Reasoning Under Uncertainty | `architectures-adaptive-scientific-reasoning-under-uncertainty` |
| Understanding Action Semantics Inference Through State Transitions in ASRA | `understanding-action-semantics-inference-through-state-transitions-in-asra` |
| ASRA for Decision Biology | `asra-for-decision-biology` |

---

## 2. ASRA — Phase Preprints (ARC Prize 2026)

Nine-layer cognitive stack, in roadmap order.

| Phase | Article | Slug |
|-------|---------|------|
| 1 | Transition-Centric Experience (Experience Engine) | `transition-centric-adaptive-reasoning-asra-phase-1` |
| 2 | Object-Centric Adaptive Reasoning (Observation Engine) | `object-centric-adaptive-reasoning-asra-phase-2` |
| 3 | Directed Exploration & Episodic Memory (Navigation & Memory) | `directed-exploration-episodic-memory-asra-phase-3` |
| 4 | Causal Action Semantics (Semantics & Causal Inference) | `causal-action-semantics-asra-phase-4` |
| 5 | Goal Inference & Hypothesis Ranking | `goal-inference-hypothesis-ranking-asra-phase-5` |
| 6 | Planning & Strategy Invention | `planning-strategy-invention-asra-phase-6` |
| 7 | Robustness & Generalization | `robustness-generalization-asra-phase-7` |
| 8 | Decision Biology Bridge | `decision-biology-bridge-asra-phase-8` |
| 9 | Final Submission & Research Story | `final-submission-research-story-asra-phase-9` |

**Related bundles:** [`content/asra/`](../asra/) — phase manuscripts, metadata, and Kaggle notebooks.

**Memory monograph (not yet a SciLayer article):** [`content/asra/asra-theory-of-memory.md`](../asra/asra-theory-of-memory.md)

---

## 3. ASRA — Technical Specifications

| Article | Slug |
|---------|------|
| ASRA Integrated Architecture — Nine-Layer Stack Reference | `asra-integrated-architecture` |
| ARC-AGI-3 Kaggle Gateway Deployment Specification | `arc-agi-3-kaggle-gateway-deployment-spec` |
| Repeated-Run Learning Evaluation for ARC-AGI-3 | `asra-repeated-run-eval-arc-agi-3` |
| Phase 3 — Exploration, Memory, and Navigation (Technical Specification) | `asra-phase-3-exploration-memory-navigation-spec` |

---

## 4. ASRA — Evaluation & Results

| Article | Slug |
|---------|------|
| ASRA Evaluation Report — ARC-AGI-3 & Phase Benchmarks (v0) | `asra-arc-agi-3-evaluation-report-v0` |
| Phase 2 — Original ARC Full-Dataset Evaluation Results | `asra-phase-2-original-arc-evaluation-results` |
| Adaptive Scientific Discovery Benchmark (ASDB): A Two-Track Framework | `adaptive-scientific-discovery-benchmark-asdb` |

---

## 5. Comparative & Position Papers

| Article | Slug |
|---------|------|
| ASRA vs Buchanan–Ma: A Mathematical Theory of Memory | `asra-vs-buchanan-mathematical-theory-of-memory` |

---

## 6. Nature Foundation Models

| Article | Slug |
|---------|------|
| Nature Foundation Models: A Hierarchical Framework | `nature-foundation-models-hierarchical-framework` |
| Atlas-GS: An End-to-End Implementation of Gaussian World Modeling | `atlas-gs-end-to-end-implementation` |
| Orbit Wars Phase 4: NFM × ASRA × Atlas-GS for Multi-Agent RTS | `orbit-wars-nfm-asra-atlas-phase-4` |

---

## 7. Platform & Industry Essays

| Article | Slug |
|---------|------|
| From "Databricks Meets PyTorch" to "Databricks Meets Keras" | `from-databricks-meets-pytorch-to-keras-ai-platform-evolution` |

---

## Adding a new article

1. Create `content/articles/{slug}/metadata.json` and `manuscript.md`.
2. Add the slug to the appropriate collection in `catalog.json`.
3. Update this README table.
4. Rebuild — articles appear on `/articles` under their collection.
