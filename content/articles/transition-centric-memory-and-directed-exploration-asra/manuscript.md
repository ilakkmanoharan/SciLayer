# Transition-Centric Memory and Directed Exploration: Beyond Compressive Observation Memory in ASRA

**Author:** Ilakkuvaselvi Manoharan  
**Affiliation:** Nature Foundation Models  
**Date:** July 2026  
**Version:** 1.0 — SciLayer concept paper

---

## Abstract

Most machine learning research on memory optimizes **compression of observations**: autoencoders compress pixels, predictive coding compresses predictions, representation learning compresses state descriptions. Adaptive scientific reasoning in unknown interactive environments requires a different contract. The agent must remember **what changed when it acted**, which experiments were informative, and which transitions led to progress—not merely reconstruct what was seen.

This paper presents two coupled ideas from the Adaptive Scientific Reasoning Architecture (ASRA). First, **transition-centric memory** replaces compressive observation memory with experiment memory: transition logs, exploration graphs, hypothesis histories, and causal traces grounded in `(state, action, next_state)` tuples. Second, **directed exploration memory** (ASRA Phase 3) decomposes action selection under a step budget into **novelty** and **usefulness**, turning episodic experience into reusable exploration graphs rather than latent compressions. We contrast these designs with representation-learning memory theory (Buchanan–Ma), cite Pearl’s intervention requirement for causal structure, and state evaluation implications for scientific agents.

---

## 1. Two memory pipelines

### 1.1 Compressive observation memory

The dominant pipeline in representation learning:

```text
(Observation) → (Compressed observation)
```

Examples:

| Mechanism | What is stored | Typical objective |
|-----------|----------------|-------------------|
| Autoencoder latent | `compressed(state)` | Reconstruction error |
| Predictive coding | compressed prediction residual | Next-frame prediction |
| RAG chunk embedding | compressed text span | Retrieval similarity |
| Foundation-model hidden state | high-dimensional summary | Language modeling loss |

These systems excel at **recognition**, **denoising**, and **correlation** across snapshots. They do not, by themselves, answer: *If I intervene with action a in state s, what tends to happen?*

Pearl’s intervention calculus makes the limit explicit: **causal structure cannot be identified from passive observations alone**. A latent that reconstructs pixels preserves appearance, not controllable dynamics.

### 1.2 Transition-centric experiment memory

ASRA’s alternative pipeline:

```text
(Action) → (State change) → (Observed effect)
```

Equivalently:

```text
(state, action, next_state, reward/metadata)
```

This is closer to an RL **replay buffer** than to an autoencoder—except ASRA treats the buffer as a **scientific record**, not only a training shard. Memory objects include:

- **Transition logs** — append-only `(s, a, s′)` with effect signatures  
- **Exploration graphs** — visit counts, frontiers, edge statistics  
- **Hypothesis histories** — ranked, refuted, and confirmed semantic guesses  
- **Intervention outcomes** — perturbation–response pairs (Decision Biology bridge)  
- **Causal traces** — which experiments supported which semantic claims  

The goal is not to reconstruct what was seen. The goal is to remember **what changed, why it changed, and what happened when the system acted**.

> Memory for science is not compression of observations.  
> It is compression of **experiments**.

Transition-centric memory still compresses— but it compresses **experiments and transitions**, discarding redundant revisits, merging duplicate trials, and promoting only episodes that updated the agent’s model of mechanism (taboo lists, dead-end clusters, Phase 7 failure analyzers are **curation**, not bigger buffers).

---

## 2. Relation to Buchanan–Ma and Pearl

Buchanan, Pai, Wang, and Ma (2026) ask how machines should learn **memory as compact structure** in high-dimensional data—PCA through transformers and diffusion—optimizing rate–distortion on observed samples. ASRA asks how machines should **reason scientifically** when action semantics, goals, and mechanisms are unknown.

The programs are **complementary**:

| Dimension | Buchanan–Ma (compressive) | ASRA (transition-centric) |
|-----------|---------------------------|---------------------------|
| Primary input | Passive / weakly labeled corpora | Action-conditioned transitions |
| Core object | Low-dimensional representation of data | Exploration graph, semantics, plans |
| Learning mode | Compression, denoising, priors | Exploration, intervention, hypothesis rank/refute |
| Memory artifact | Latent code, generative prior | Visitation keys, edge stats, transition JSONL |
| Intelligence target | Distributional memory (Levels 1–2) | Semantics, goals, experiments (Levels 3–4) |

Buchanan–Ma supplies representational substrate ASRA largely **defers** (how to compress grids or cell profiles). ASRA supplies the **interactive loop** their Chapter 9 flags as open: close perception–action, test hypotheses, discriminate goals.

Nature Foundation Models extends the same primitive: **State_t + Action_t → State_{t+1}**—Atlas-GS logs world bundles and transition logs; Decision Biology treats perturbation outcomes as pathway memory. Cells do not “remember” microscopy images; they remember **intervention outcomes**.

---

## 3. Phase 1 prerequisite: you cannot navigate without logging

Transition-centric memory is not an optional upgrade. ASRA Phase 1 (Experience Engine) establishes hash-stable state IDs, effect logging, and coarse exploration under cell-diff semantics. Without trustworthy transition logs, Phase 3 exploration graphs inherit **garbage structure**.

Phase 2 adds object-centric observation—connected components, transform events, rule candidates—so that “change” can be described structurally, not only as pixel counts. Phase 3 consumes both streams.

```text
Phase 1   Experience     — transitions, hashes, effect logging
Phase 2   Observation    — objects, scenes, transform events
Phase 3   Navigation     — exploration graph, novelty, usefulness, subgoals
```

---

## 4. Directed exploration memory: novelty ≠ usefulness

Under a fixed step budget, the objective is not maximum coverage or uniform random wandering. It is discovering **which transitions are worth revisiting** and which frontiers actually lead somewhere.

### 4.1 The mistake most teams make

Many agent systems optimize **coverage** or **hash novelty alone**:

- Visit every unseen cell  
- Maximize entropy of state visitation  
- Treat “unvisited” as synonymous with “valuable”  

That fails in interactive scientific settings because:

| Case | Problem |
|------|---------|
| **Novel but useless** | Dead-end corridor, zero reward, zero structural progress |
| **Useful but familiar** | Repeated step in a successful DoorKey or BabyAI chain |
| **Cosmetic novelty** | Hash changes while object multiset is unchanged (Phase 2 fingerprints help) |

ASRA Phase 3 **decomposes exploration into two axes**:

```text
Novelty(s)     — expected information gain from visiting s
Usefulness(a|s) — expected progress toward reward, frontiers, subgoals
```

Baseline state novelty (Phase 3 v1):

```text
novelty(s) = 1 / sqrt(1 + visit_count(s))
           + α · 1[object_fingerprint unseen]
           + β · frontier_bonus(s)
```

Usefulness aggregates progress signals:

```text
usefulness(a|s) = w_r·Δreward + w_f·frontier_gain + w_g·subgoal_progress
                + w_o·object_delta − w_d·dead_end
```

**ExplorationPolicyV2** ranks actions by blending edge statistics (average novelty + usefulness − repeat penalty) with priors on unexplored edges and optional strategy bias—not by unseen-cell count alone.

### 4.2 State memory vs exploration memory

Phase 3 separates **visitation keys** from **structural exploration records**:

**State memory (revisit detection)**

- Exact hash keys  
- Object-scene fingerprints (soft revisit when grids differ cosmetically)  
- Recent episodic window for loop penalty  

**Exploration memory (directed search)**

- Exploration graph with frontier scores and dead-end flags  
- Transition histories with subgoal metadata  
- Strategy library extracted from progress-making episodes  
- Replay buffer of high-value transitions for analysis  

Memory here is **episodic and structural**, not a compressive autoencoder latent. The agent builds a graph:

```text
(state) → action → next_state → outcome
```

Subgoals emerge from frequently reused progress-making transitions (BabyAI mission parsing, DoorKey milestone chains)—similar in spirit to compositional task decomposition, but **extracted from logs**, not hand-authored for every environment.

### 4.3 Cross-episode reuse

**ExplorationSessionState** persists graph, visitation memory, strategy library, and replay across batch episodes. A successful sequence in episode *n* biases episode *n+1* when preconditions match—without oracle maps. This is **strategy reuse**, not memorization of pixels.

---

## 5. Evaluation: measure memory under action

Benchmarks that score reconstruction—pixel MSE, latent similarity, token perplexity—reward the wrong architecture for scientific agents.

Better tests ask:

1. After *N* exploratory steps, can the agent predict the effect of an **untried intervention**?  
2. Can it cite **which past experiments** support that prediction?  
3. Under a fixed budget, does directed exploration outperform coverage-only baselines on **frontier discovery** and **subgoal completion**?  
4. Does memory **curate** failures (dead ends, wrong goals) rather than grow unbounded?  

Memory quality is measured by **generalization under action**, not fidelity of observation compression.

---

## 6. Synthesis

| Question | Compressive observation memory | Transition-centric + exploration memory |
|----------|--------------------------------|----------------------------------------|
| What is remembered? | What was present | What changed when we acted |
| Primary operation | Encode / decode | Log / rank / replay transitions |
| Causal content | Correlational | Intervention-conditional |
| Phase 3 mistake | Maximize unseen states | Balance novelty **and** usefulness |
| Good for | Recognition, generation | Discovery, navigation, scientific reasoning |

ASRA’s memory stack is deliberately **inspectable**: sparse graphs, explicit visit counts, hypothesis counters—compatible with competition latency budgets and human audit. It trades the elegance of a single latent space for **experiment records** that survive intervention.

The right design question is not *how much can we remember?* but *which experiments are worth remembering—and which should be forgotten so the next one teaches something new?*

---

## References

1. Ilakkuvaselvi Manoharan. Transition-Centric Adaptive Reasoning: ASRA Phase 1. https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1  
2. Ilakkuvaselvi Manoharan. Directed Exploration and Episodic Memory: ASRA Phase 3. https://sci-layer.vercel.app/articles/directed-exploration-episodic-memory-asra-phase-3  
3. Ilakkuvaselvi Manoharan. ASRA vs Buchanan–Ma: A Mathematical Theory of Memory. https://sci-layer.vercel.app/articles/asra-vs-buchanan-mathematical-theory-of-memory  
4. Ilakkuvaselvi Manoharan. Architectures for Adaptive Scientific Reasoning Under Uncertainty. https://sci-layer.vercel.app/articles/architectures-adaptive-scientific-reasoning-under-uncertainty  
5. Judea Pearl. *Causality* — intervention vs observation (cited in Buchanan–Ma Ch. 9 and ASRA Phase 4+).  
6. Buchanan, Pai, Wang, Ma (2026). *Principles and Practice of Deep Representation Learning: or A Mathematical Theory of Memory*. arXiv:2606.06624.

---

*Related: [ASRA Phase 3 technical specification](https://sci-layer.vercel.app/articles/asra-phase-3-exploration-memory-navigation-spec) · [Object-Centric Adaptive Reasoning: ASRA Phase 2](https://sci-layer.vercel.app/articles/object-centric-adaptive-reasoning-asra-phase-2) · [Decision Biology bridge: ASRA Phase 8](https://sci-layer.vercel.app/articles/decision-biology-bridge-asra-phase-8) · Nature Foundation Models*
