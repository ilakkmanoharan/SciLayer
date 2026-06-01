# Transition-Centric Adaptive Reasoning: ASRA Phase 1 for Interactive Environments

**Author:** Ilakkuvaselvi (Ilak) Manoharan  
**Affiliation:** Nature Foundation Models  
**Date:** May 2026

---

## Abstract

Interactive intelligence requires systems that discover what actions *mean* in unfamiliar environments rather than execute predefined policies. We describe **ASRA Phase 1** — a minimal agent architecture for fluid reasoning in sequential grid worlds where action labels are latent symbols and environment rules are hidden. The agent maintains transition evidence, infers state-conditioned action semantics from observed cell diffs, and explores under uncertainty while avoiding dead-end interventions. Phase 1 is intentionally a research baseline: it prioritizes auditable reasoning loops over leaderboard optimization. This article specifies the cognitive design, algorithms, and limitations without reference to any particular deployment platform.

---

## 1. Why transitions come first

Most engineered agents receive actions with fixed semantics. `MOVE_LEFT` means move left because a programmer defined the mapping. In adaptive scientific settings — unfamiliar games, novel instruments, biological perturbations — the system often receives **tokens without definitions**. Meaning must be inferred from consequences:

```text
observe state_t  →  apply action a  →  observe state_{t+1}
```

ASRA Phase 1 treats this loop as the primary unit of intelligence. Memory is not an action transcript; it is a growing body of **transition evidence** linking states, interventions, and measurable diffs. Reasoning is hypothesis formation over latent operators: what does action *a* tend to do *in this state*?

This framing aligns with ARC-style interactive benchmarks, where agents explore grid worlds up to 64×64, select among several action types, and must infer both mechanics and semantics under sparse feedback. It also parallels Decision Biology, where perturbations are interventions and cellular readouts are state observations.

---

## 2. The Phase 1 reasoning loop

ASRA Phase 1 implements a closed loop with four stages:

```text
observe  →  log transition  →  infer semantics  →  explore under uncertainty  →  retry
```

| Stage | Role |
|-------|------|
| **Observe** | Receive grid frame and available action set from environment |
| **Log transition** | Compare consecutive frames; record cell-level diff and reward proxy |
| **Infer semantics** | Update beliefs about action effects conditioned on state identity |
| **Explore** | Select next action balancing novelty, uncertainty, and weak reward signal |

The loop is deliberately simple. Phase 1 does not assume object segmentation, symbolic rules, or language models. It asks whether a transition-centric agent can make *directed* exploration progress when action meaning is unknown.

---

## 3. State representation

### 3.1 Canonical grids

Observations are integer grids. ASRA normalizes them to canonical 2D integer lists for stable comparison:

```python
def canonical_grid(grid):
    return np.array(grid, dtype=int).tolist()
```

### 3.2 State hashing

Full grids are not stored in inference tables. Each state receives a stable identifier via SHA-256 over JSON-serialized canonical grid content. Semantics are keyed by `(state_hash, action)` — the same action may behave differently in different contexts, so conditioning on state identity is essential.

This is a compression choice, not a claim that hash collisions are impossible. Phase 1 accepts hash identity as sufficient for exploratory policy; Phase 2 may add structural representations (objects, components, topology).

---

## 4. Action semantics inference

**ActionSemanticsInferencer** maintains an empirical model of action effects per `(state_hash, action)` pair.

For each observed transition it records:

- **num_changed_cells** — count of grid cells differing between consecutive frames  
- **reward** — progress proxy (e.g., levels completed metadata when available)

Given accumulated evidence, inference produces:

| Signal | Interpretation |
|--------|----------------|
| mean diff = 0 | likely no-op or blocked action |
| mean diff ≤ 1.5 | localized cell update |
| higher mean | multi-cell transform |
| consistency_score = 1/(1+std) | reproducibility of effect magnitude |

This is **not** a symbolic world model. It is a statistical approximation of latent operator φ̂(action | state). The hypothesis labels (`"no-op / blocked"`, `"localized cell update"`, etc.) are human-readable summaries of effect distributions, not ground-truth game rules.

The inferencer answers: *given what I have seen at this state, how predictable is each action's effect?*

---

## 5. Uncertainty-aware exploration

**ASRAExplorer** selects the next action using a scoring function over candidates:

```text
score(a) = 2.0 / (1 + n(s,a))           # novelty — prefer less-tried actions
         + 0.7 * uncertainty(s,a)       # prefer unknown or inconsistent semantics
         + 0.5 * mean_reward(a)         # weak exploitation signal
         + ε,  ε ~ Uniform(0, 0.05)     # tie-breaking jitter
```

where:

- `n(s,a)` = times action *a* was taken in state *s*  
- `uncertainty(s,a) = 1` if no observations, else `1 - min(1, consistency_score)`

**Dead-end detection:** if `(s,a)` produced zero cell changes and non-positive reward, the pair is excluded from future consideration at *s*. This prevents infinite loops on blocked actions.

**Action space in Phase 1:** simple actions (`ACTION1`–`ACTION5`, `ACTION7`) are explored. Coordinate-specified complex actions (`ACTION6`) are deferred — they require spatial policy beyond random or center-grid defaults.

The explorer implements **information-directed probing**: prefer interventions that reduce uncertainty about latent semantics rather than random walk.

---

## 6. Agent integration

**ASRAAgent** extends a standard interactive agent interface with lifecycle hooks:

| Method | Behavior |
|--------|----------|
| `is_done` | Stop on win or action budget exhausted (`MAX_ACTIONS = 80` default) |
| `choose_action` | RESET when not playing; else delegate to ASRAExplorer |
| `take_action` | Record action name for transition attribution |
| `append_frame` | Compute diff; update semantics inferencer and explorer |

Each action carries reasoning metadata for traceability (e.g., `"ASRA v0.3: ACTION3"`). When complex actions are required, Phase 1 uses a default spatial policy (grid center) as a placeholder — not a learned coordinate model.

**Swarm orchestration:** in multi-game evaluation, one agent instance runs per game in parallel threads, sharing global semantics/explorer modules in Phase 1 (a known limitation — per-game isolation is Phase 2).

---

## 7. Hyperparameters

| Parameter | Default | Role |
|-----------|---------|------|
| `ASRA_SEED` | 42 | Reproducibility for exploration jitter |
| `ASRA_MAX_ACTIONS` | 80 | Per-episode budget |
| `SIMPLE_ACTIONS` | ACTION1–5, ACTION7 | Explored action subset |

Seeds apply to Python `random` and NumPy at module load.

---

## 8. Limitations

Phase 1 is a baseline, not a solver.

**Algorithmic gaps:**

1. Cell-level diffs only — no object-centric parsing or component tracking  
2. Statistical semantics — no explicit structural or causal world model  
3. No planning — no search over inferred state graphs for goal-directed paths  
4. ACTION6 excluded — coordinate actions not learned  
5. Global shared memory — semantics not isolated per game  
6. Weak reward signal — progress proxy may not align with fine-grained game structure  

**What Phase 1 establishes:**

- A reproducible transition-first memory discipline  
- State-conditioned latent action semantics  
- Uncertainty-biased exploration with dead-end avoidance  
- An auditable bridge from cognitive architecture research to interactive evaluation  

---

## 9. Phase 2 directions

| Direction | Goal |
|-----------|------|
| Object-centric diffs | Connected components, bounding boxes, transform classes |
| State graph planner | Shortest-path or MCTS over inferred transitions |
| Per-game memory | Isolated semantics keyed by environment identity |
| ACTION6 policy | Learned or heuristic coordinate selection |
| Symbolic abstraction | Compress transition patterns into reusable concepts |
| Decision Biology transfer | Perturbations as actions, cellular states as observations |

---

## 10. Position in the ASRA program

ASRA Phase 1 on interactive grid worlds is the **exploration front-end** of a larger architecture:

- **Nature Foundation Models** — multi-domain scientific intelligence  
- **Decision Biology** — perturbation–response reasoning under uncertainty  
- **Conceptual review** — world models, causality, active inference as unified frame  

The same abstraction — *latent action semantics inferred from transitions* — applies whether the environment is a puzzle game or a perturbed cell culture. Phase 1 makes that abstraction executable at minimal complexity.

---

## 11. Conclusion

ASRA Phase 1 demonstrates that interactive intelligence can be framed as **scientific reasoning from transitions**: observe, intervene, measure change, revise beliefs, probe uncertainty. The architecture is intentionally modest so that each component can be audited, extended, and compared against stronger baselines in later phases.

The real test is generalization in environments never seen during development. Phase 1 provides the reasoning scaffold; subsequent phases add structure, planning, and domain-specific perception.

---

## References

1. Chollet, F. On the Measure of Intelligence. *arXiv* (2019).  
2. ARC Prize Foundation. ARC-AGI-3 documentation. https://docs.arcprize.org  
3. Manoharan, I. ASRA: Adaptive Scientific Reasoning Architecture. https://github.com/ilakkmanoharan/asra  
4. Manoharan, I. Understanding Action Semantics Inference Through State Transitions in ASRA. https://sci-layer.vercel.app/articles/understanding-action-semantics-inference-through-state-transitions-in-asra  
5. Manoharan, I. Architectures for Adaptive Scientific Reasoning Under Uncertainty. https://sci-layer.vercel.app/articles/architectures-adaptive-scientific-reasoning-under-uncertainty

---

*Correspondence: ilakkmanoharan@gmail.com*
