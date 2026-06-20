# Adaptive Scientific Discovery Benchmark (ASDB): A Two-Track Framework for Evaluating Interactive Agents

## Abstract

Most agent benchmarks assume that tool and action meanings are documented before interaction begins, and that success is measured against tasks with known ground-truth answers. Real scientific inquiry requires something different: agents must learn what interventions *do* from state transitions, then use that knowledge to infer hidden mechanisms, design discriminating experiments, and predict outcomes in regimes they have never observed. We propose **ASDB** (Adaptive Scientific Discovery Benchmark), a unified evaluation framework with two complementary tracks. **Track A** (Action Semantics Discovery) grades whether an agent can infer an action map \(\hat{\phi}(a)\) from unlabeled controls. **Track B** (Scientific Discovery Evaluation) grades whether an agent can recover a hidden theory class and predict held-out observables under an intervention budget. Both tracks share the same interaction loop — observe, act, update beliefs — but score different constructs. We argue that separating these constructs while evaluating them in linked **A→B** episodes yields a benchmark with stronger construct validity than either track alone, and we specify metrics, episode types, difficulty tiers, and anti-gaming protocols drawn from worked examples in grid worlds, statistical mechanics, and chemical kinetics.

## Keywords

- ASDB
- scientific discovery benchmark
- action semantics discovery
- construct validity
- interactive agents
- intervention design
- inverse problems
- adaptive scientific reasoning
- evaluation methodology
- phase diagrams

## 1. Introduction

The evaluation of AI agents in scientific settings has expanded rapidly. Static question-answering benchmarks test whether a model *knows* established science. Interactive environments test whether a model can *complete* multi-step tasks when tools are named and documented. Neither adequately measures a capability that sits between them: **adaptive discovery under uncertainty** — learning what actions mean, then using them to shrink a space of competing hypotheses about hidden structure.

Consider a theorist encountering an unfamiliar apparatus. The controls are unlabeled. A dial changes something about the system; a button returns a number. Before any law can be inferred, the scientist must build a mental model of the instrument: which knob sets temperature, which probe measures susceptibility, whether two readings commute. Only then can experiment design begin — bracketing a critical point, falsifying a mean-field decoy, choosing the one long-time measurement that separates parallel from consecutive reaction pathways.

Current benchmarks rarely isolate either step. Tool-use evaluations ship OpenAPI schemas. Physics benchmarks ask for the critical temperature of the 2D Ising model as a recall question. Discovery benchmarks may require interaction but often grade task completion without scoring whether the agent formed a reusable semantics model or a falsifiable theory.

ASDB addresses this gap by treating **semantics learning** and **mechanism discovery** as distinct but composable evaluation targets within one harness.

---

## 2. Two constructs, one loop

### 2.1 Track A: Action Semantics Discovery

**Core question:** *What do these actions do?*

The agent receives a menu of unlabeled actions \(\{A_1, \ldots, A_n\}\) — symbols with no documentation — and partial observations of environment state. From transitions \((s_t, a_t, s_{t+1})\), it must infer a semantic map:

\[
\hat{\phi}(a) : \mathcal{A} \to \text{EffectClass}
\]

where an effect class might be "translate +2 in \(x\)", "toggle hidden mode bit", or "conditional: if signal = 0 then +\(x\) else +\(y\)".

**Primary output:** A submitted \(\hat{\phi}\) plus (optionally) demonstration that \(\hat{\phi}\) supports goal-reaching and transfer to new initial conditions or action rebindings.

**Analogy:** Learning to use an unlabeled instrument panel before any sample is analyzed.

Track A is **domain-agnostic**. A grid world with latent mode variables is sufficient; no Hamiltonian is required. An agent can score well on Track A without knowing any science.

### 2.2 Track B: Scientific Discovery Evaluation

**Core question:** *What hidden law governs this world?*

The agent receives partial, noisy observations from a simulated scientific system — spin configurations, kinetic traces, spectroscopic readouts — and a set of interventions (which may themselves be unlabeled). It must:

* infer hidden mechanisms (symmetries, conservation laws, reaction pathways, phase structure),
* propose competing hypotheses,
* design experiments that discriminate among them,
* submit a theory class and predict held-out observables.

**Primary output:** Mechanism class + parameter estimates + predictions on query points never shown during the episode.

**Analogy:** Doing science once you know — or are simultaneously learning — what the instruments do.

Track B is **domain-specific**. Latent objects include order parameters, rate constants, inhibition modes, and universality classes. Scoring requires programmatic ground truth and held-out predictive tests.

### 2.3 Why both belong in one framework

The two tracks answer different questions but share an identical control loop:

```
observe → act → observe → update beliefs → act again
```

Neither is a single-shot QA task. Both require multi-step interaction under a fixed or cost-weighted budget.

Crucially, Track B naturally embeds Track A: in a realistic discovery episode, the agent may receive unlabeled actions \(A_1, \ldots, A_4\) and must spend early steps learning that \(A_1\) sets temperature, \(A_3\) returns magnetization, before any phase diagram can be inferred. Treating semantics as a prerequisite rather than a separate concern matches how discovery actually proceeds — and enables ablations (labeled vs. unlabeled actions) that quantify how much documented tools inflate scores.

---

## 3. What current benchmarks miss

| Capability | Typical agent eval | Static science QA | ASDB |
|---|---|---|---|
| Undocumented actions | Tools described in prompt | N/A | Track A; optional in Track B |
| Intervention design | Fixed task scripts | N/A | Budgeted experiment choice |
| Inverse problems | N/A | Forward problems only | Hidden laws; agent infers |
| Model discrimination | N/A | Single correct answer | Decoy theories until targeted probe |
| Held-out generalization | New task IDs | New questions | New \((T,h)\), unseen observables |
| Semantics as scored object | No | No | Track A; 25% weight in A→B |

Interactive discovery benchmarks (e.g. NewtonBench, PhysGym, DiscoveryWorld) move toward the right column but generally do not grade explicit \(\hat{\phi}(a)\) recovery or separate semantics failure from theory failure. Action semantics benchmarks in the RL literature (BabyAI, partially observable grids) typically document actions or treat navigation as the goal, not semantics inference as the scored construct.

ASDB's contribution at the benchmarking layer is **construct decomposition**: two scored capabilities, one harness, linked episodes.

---

## 4. Shared design principles

### 4.1 Intervention-centric evaluation

Experiment design is first-class. The agent chooses which probe to run, in which order, at what cost — not merely whether it can interpret a given dataset. Metrics include information gain per action and sample complexity to reach a posterior threshold on the correct mechanism or semantics class.

### 4.2 Overlapping metric families

| Shared concept | Track A instantiation | Track B instantiation |
|---|---|---|
| **Causal reasoning** | Correct attribution of effects to actions | Correct attribution to couplings, fields, pathways |
| **Efficiency** | Steps to 90% semantics accuracy | Interventions to falsify decoys / locate \(T_c\) |
| **Transfer** | Reuse \(\hat{\phi}\) after action rebind or new start state | Predict held-out regimes; new boundary conditions |
| **Abstraction** | Compact \(\hat{\phi}\), not \((s,a)\) lookup table | Compact law (rate equation, symmetry class), not curve fit |

### 4.3 Software-only, auditable ground truth

Episodes run in simulation. Hidden state and transition rules are programmatic. The evaluator — not the agent — holds ground truth. Observations are noisy; held-out query points are never exposed during the interaction phase. This supports reproducibility and third-party regrading from logged trajectories.

### 4.4 Tiered difficulty

**Track A progression:** independent actions → compositional/non-commutative actions → context-dependent actions (same symbol, different effect depending on latent mode).

**Track B progression:**

* **Tier 1:** Unique ground truth given initial data.
* **Tier 2:** Degenerate decoy theories until a specific intervention (e.g. mean-field vs. 2D Ising until susceptibility peak shape is measured; direct vs. consecutive kinetics until intermediate concentration is probed).
* **Tier 3:** Scale hierarchy — agent must distinguish fundamental from emergent descriptions.

---

## 5. Where the tracks diverge

Understanding the differences is essential for construct validity — conflating them produces benchmarks that reward the wrong behavior.

### 5.1 Success object and failure modes

| | Track A | Track B |
|---|---|---|
| **Success object** | Correct \(\hat{\phi}(a)\) for each action | Correct mechanism + accurate held-out predictions |
| **Primary failure** | Mislabels actions; cannot plan | Curve-fits training data; wrong theory |
| **Can pass without science?** | Yes | No |
| **Can fail despite knowing actions?** | Unlikely | Yes — wrong mechanism class |

An agent that learns all action labels but submits mean-field theory for a 2D Ising world should score highly on semantics and poorly on discovery. An agent that memorizes spin snapshots without learning what \(A_1\) does should fail both.

### 5.2 Role of action semantics

| | Track A | Track B |
|---|---|---|
| **Semantics** | The product | A prerequisite (scored separately in A→B mode) |
| **Labeled actions** | Never, by design | Optional ablation (labeled = upper bound) |
| **Episode end** | Submit \(\hat{\phi}\); transfer test | Submit theory + held-out predictions |

Empirically, worked A→B episodes spend roughly half the budget on semantic discovery and half on mechanism inference — matching the relative difficulty of the two constructs.

### 5.3 Evaluation protocol

| | Track A | Track B |
|---|---|---|
| **Phases** | Discovery → goal → transfer | Initial obs → interventions → submission |
| **Held-out test** | New initial state; same action semantics | New parameter points; predictive RMSE |
| **Decoys** | Peripheral | Central at Tier 2 |

---

## 6. Episode taxonomy

One harness supports four episode types:

| Type | Actions | Scored construct | Use case |
|---|---|---|---|
| **A-only** | Unlabeled | \(\hat{\phi}\) + transfer | Isolate semantics capability |
| **B-only (labeled)** | Documented | Mechanism + prediction | Upper bound; domain-only eval |
| **A→B (full)** | Unlabeled | Both | Default; full discovery loop |
| **Cross-domain transfer** | Unlabeled | \(\hat{\phi}\) transfer across world families | Research extension |

**A→B** is the recommended default for measuring adaptive scientific reasoning: it prevents agents from succeeding on discovery tasks only because tool documentation leaked the experimental design.

---

## 7. Unified scoring (A→B episodes)

Example weighting for a combined episode:

| Component | Weight | Measures |
|---|---|---|
| Semantic discovery | 25% | Speed and accuracy of \(\hat{\phi}\) |
| Mechanism / theory quality | 35% | Correct class; parameter estimates |
| Held-out predictive accuracy | 25% | RMSE on unseen observables |
| Experiment efficiency | 15% | Information gain per action |

Weights shift by episode type (A-only → 100% semantics). Subscores are reported separately so failures can be diagnosed: semantics collapse vs. theory collapse vs. inefficient probing.

### 7.1 Anti-gaming requirements

Benchmarks that only grade visible data invite specification gaming. ASDB protocols include:

* **Held-out predictive queries** — never shown during interaction.
* **Decoy theory injection** — competing mechanisms that fit early observations.
* **Mandatory trajectory logs** — \((s_t, a_t, s_{t+1})\) for audit.
* **Generalization gap reporting** — train vs. holdout semantics accuracy (Track A) or theory prediction error (Track B).
* **Zero-budget ablation** — semantics or discovery score should collapse without interaction.

---

## 8. Illustrative episodes

Three worked episodes demonstrate that one harness accommodates both tracks and multiple domains.

### 8.1 Track A: Grid Lab (semantics only)

**Hidden state:** \((x, y, m)\) on a 10×10 lattice; mode \(m \in \{0,1\}\) observed indirectly via signal \(\sigma\).

**Actions:** \(A_1\) translate \(x\); \(A_2\) translate \(y\); \(A_3\) toggle mode; \(A_4\) context-dependent move (+\(x\) if \(\sigma=0\), +\(y\) if \(\sigma=1\)).

**Key discriminator:** Without toggling \(A_3\), \(A_4\) appears stochastic. Tier 2 semantics requires discovering the latent mode.

**Strong agent:** Infers full \(\hat{\phi}\) in ~6 probes; transfers to goal state without re-discovery.

### 8.2 Track B: 2D Ising phase diagram (physics)

**Hidden state:** Ising Hamiltonian with \(T_c \approx 2.269\); ℤ₂ symmetry at \(h=0\).

**Actions (unlabeled in A→B mode):** set \(T\); set \(h\); measure \(m, \chi\); measure \(\xi\).

**Key discriminator:** Mean-field decoy fits early magnetization; susceptibility peak at \(T_c\) falsifies it.

**Strong agent:** Brackets \(T_c\) via \(\chi\) sweep in ~4 actions after semantics discovery; predicts held-out \((m, \chi)\) within tolerance.

### 8.3 Track B: Enzyme inhibition (chemistry)

**Hidden state:** Michaelis–Menten with competitive inhibitor; \(K_m\), \(K_i\) unknown.

**Actions:** set \([I]\); set \([S]\); single \(v_0\); full kinetic scan.

**Key discriminator:** Uncompetitive inhibition lowers \(V_\max\); competitive leaves \(V_\max\) fixed while increasing Lineweaver–Burk slope.

**Strong agent:** Two \([I]\) points separate competitive from uncompetitive; held-out \(v_0\) predictions score ~0.90 RMSE.

| Dimension | Grid Lab | 2D Ising | Enzyme inhibition |
|---|---|---|---|
| Hidden object | Latent mode | Phase transition / \(T_c\) | Inhibition mode / \(K_i\) |
| Tier 2 lever | Retry \(A_4\) after mode toggle | \(\chi\) peak / scaling | \(V_\max\) vs. slope under \([I]\) |
| Primary metric | Semantics + transfer | Theory + held-out preds | Theory + held-out preds |

The same API — `reset`, `step(action)`, `observe`, `submit`, `grade` — serves all three.

---

## 9. Construct validity argument

A benchmark has **construct validity** when high scores imply the capability it claims to measure, not a proxy.

**Track A** separates lucky exploration from structured semantics: an agent that stumbles to a goal once without a stable \(\hat{\phi}\) fails probe-state prediction and transfer tests. Grading uses structural equivalence to simulator ground truth (effect signatures on held-out states), not self-reported labels.

**Track B** separates curve fitting from theory formation: decoy mechanisms fit training observables; only targeted interventions and held-out prediction falsify them. An agent that outputs \(T_c = 4\) (mean-field) fails at unseen \((T,h)\) even if it memorized three initial snapshots.

**A→B linkage** prevents confounding: documented tools inflate discovery scores; semantics-only evals miss whether inferred actions support real experimental planning. The unified framework makes both failure modes visible in one episode log.

---

## 10. Architecture sketch

```
┌─────────────────────────────────────────────────────────┐
│                    ASDB harness                          │
│  episode runner · action API · budget · logging · grade  │
├──────────────────────┬──────────────────────────────────┤
│  Track A worlds      │  Track B worlds                   │
│  · Grid Lab          │  · Phase diagrams (Ising)         │
│  · Generic latents   │  · Reaction kinetics              │
│  · Action rebind     │  · Enzyme inhibition              │
├──────────────────────┴──────────────────────────────────┤
│  Shared: decoy injection · held-out queries · metrics    │
└─────────────────────────────────────────────────────────┘
```

World plugins implement a common interface: initial observations, transition function, action menu (labeled or unlabeled flag), held-out grid, grader. Track-specific metrics plug into a shared report schema.

---

## 11. Discussion

### 11.1 Semantics without science

Track A alone may appear toy-like. Its role is to isolate a capability that existing benchmarks assume away. Enterprise agents encounter undocumented APIs, legacy lab equipment, and evolving tool schemas — settings where \(\hat{\phi}(a)\) must be learned, not read.

### 11.2 Discovery without semantics

Track B with labeled actions measures inverse-problem skill under ideal conditions — useful as an ablation upper bound. It hides whether the agent could have planned experiments if tools were not documented. Default A→B mode closes this gap.

### 11.3 Relation to adaptive reasoning frameworks

The semantic map \(\hat{\phi}(a_t)\) aligns with experience-based action inference in adaptive reasoning architectures: log transitions, infer operator semantics, explore under uncertainty. ASDB does not prescribe an agent architecture; it provides neutral measurement of whether any architecture recovers semantics and mechanisms under standardized episodes.

### 11.4 Limitations

Simulated worlds simplify real apparatus noise, institutional knowledge, and social collaboration in science. ASDB targets **methodological** evaluation — can an agent learn controls and infer hidden structure — not full replacement of human research. Domains are initially physics and chemistry; extension to biology (pathway inference) follows the same plugin pattern.

---

## 12. Conclusion

Adaptive scientific discovery requires two competencies that current benchmarks conflate or omit: **learning what interventions mean** and **using them to discover hidden mechanisms**. ASDB unifies these as Track A and Track B within one interaction loop, scored separately but composable in A→B episodes. The framework specifies metrics, difficulty tiers, decoy falsification, and held-out prediction — design choices aimed at construct validity rather than leaderboard saturation.

Track A asks: *What do these actions do?* Track B asks: *What law governs this world?* Real discovery asks both. A benchmark that measures both — with auditable ground truth and decomposable scores — is a necessary step toward evaluating agents that do science, not agents that recall it.

---

## References

### SciLayer — related works (Ilakkuvaselvi Manoharan)

* [Understanding Action Semantics Inference Through State Transitions in ASRA](https://sci-layer.vercel.app/articles/understanding-action-semantics-inference-through-state-transitions-in-asra)
* [Transition-Centric Adaptive Reasoning: ASRA Phase 1](https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1)
* [Architectures for Adaptive Scientific Reasoning Under Uncertainty](https://sci-layer.vercel.app/articles/architectures-adaptive-scientific-reasoning-under-uncertainty)
* [Repeated-Run Learning Evaluation for ARC-AGI-3](https://sci-layer.vercel.app/articles/asra-repeated-run-eval-arc-agi-3)

### External benchmarks and methods

* Interactive discovery: NewtonBench, PhysGym, DiscoverPhysics, DiscoveryWorld, SDE harness ([arXiv:2512.15567](https://arxiv.org/abs/2512.15567))
* Static science QA: GPQA, SciBench, ScienceQA
* Interactive reasoning: ARC-AGI-3 ([arXiv:2603.24621](https://arxiv.org/abs/2603.24621))
* Phase diagram / Ising ML: autonomous critical-parameter discovery (RL), active learning for phase diagrams, pyfssa finite-size scaling

---

## Appendix: notation

| Symbol | Meaning |
|---|---|
| \(\hat{\phi}(a)\) | Agent-inferred semantic map from action to effect class |
| \(s_t\) | Environment state (full or observed) at step \(t\) |
| \(A_i\) | Unlabeled action symbol \(i\) |
| Tier 1/2/3 | Difficulty levels (unique / decoy / scale hierarchy) |
| A→B | Combined semantics + discovery episode |
