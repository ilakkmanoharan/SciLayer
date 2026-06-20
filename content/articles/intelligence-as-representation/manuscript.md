# Intelligence as Representation Discovery: Ontologies, Semantics, and the Foundations of Adaptive Scientific Reasoning

## Abstract

Much of modern machine learning focuses on optimization: fitting increasingly powerful models to increasingly large datasets. Yet optimization alone does not create intelligence. Before a system can learn effectively, it must first discover an appropriate representation of the problem itself. The choice of state space, action space, evaluation criteria, and ontology fundamentally constrains what can be learned.

This paper argues that intelligence can be viewed as the search for increasingly useful representations of reality. Learning emerges not merely from parameter updates, but from discovering abstractions that compress observations, explain transitions, and generalize across environments. From this perspective, prompts, ontologies, world models, and benchmarks become central components of intelligence rather than auxiliary engineering artifacts.

The Adaptive Scientific Reasoning Architecture (ASRA) is introduced as a framework that emphasizes semantic discovery before optimization. Rather than assuming predefined action meanings or fixed ontologies, ASRA attempts to infer semantic operators from observed state transitions and subsequently construct causal world models capable of supporting prediction, intervention, and scientific reasoning.

---

## 1. Introduction

A common assumption in machine learning is that intelligence primarily emerges from optimization. Given sufficient data, compute, and model capacity, systems are expected to learn increasingly sophisticated behaviors.

However, optimization presupposes a representation.

Before learning begins, numerous decisions have already been made:

* What constitutes a state?
* Which observations are relevant?
* What actions exist?
* What outcomes matter?
* How should success be measured?

These decisions define the ontology of the learning problem.

The history of science repeatedly demonstrates that progress often results not from better optimization, but from better representations. Newton's laws, Maxwell's equations, relativity, and quantum mechanics each introduced new conceptual frameworks that reorganized observations into more coherent explanatory structures.

Intelligence may therefore be understood as the process of discovering increasingly useful representations that make prediction, reasoning, and action possible.

---

## 2. Representation as the Core of Intelligence

Every intelligent system operates through representations.

Prompts define priors.

Ontologies define state spaces.

Concepts define abstractions.

World models define causal structure.

Benchmarks define objectives.

The effectiveness of learning is bounded by the quality of these representations.

An agent that lacks a useful ontology cannot learn efficiently regardless of computational power. Conversely, a sufficiently informative representation can dramatically reduce the complexity of learning.

From this perspective, intelligence is not merely optimization over parameters. It is the search for representations that compress reality while preserving predictive power.

The objective is not simply accuracy but explanatory compression.

---

## 3. Ontologies as Learning Substrates

Every learning system implicitly commits to an ontology.

An ontology determines:

* Which entities exist.
* Which variables matter.
* Which relationships are observable.
* Which transformations are possible.

Traditional machine learning often assumes these structures are already known.

For example:

* Classification assumes predefined labels.
* Reinforcement learning assumes predefined actions.
* Supervised learning assumes predefined targets.
* Benchmarks assume predefined notions of correctness.

These assumptions are often hidden but fundamentally shape learning outcomes.

Scientific discovery, however, frequently requires questioning the ontology itself.

Many important breakthroughs occur when previously unseen variables are introduced or existing concepts are redefined.

In this sense, ontology construction becomes a first-class component of intelligence.

---

## 4. Action Semantics as Representation Discovery

One of the central ideas in ASRA is that action semantics should not necessarily be predefined.

Traditional systems assume actions possess fixed meanings.

For example:

* Move left.
* Pick up object.
* Rotate image.
* Execute tool.

These labels are treated as ground truth.

However, an agent interacting with an unfamiliar environment may not initially know what any action does.

Instead, meaning must be inferred through observation.

Given a state transition:

sₜ → aₜ → sₜ₊₁

the system attempts to discover a semantic operator that explains the observed transformation.

Formally:

φ̂(aₜ) = arg max P(sₜ₊₁ | sₜ, φ(aₜ), θ)

where φ represents an inferred semantic interpretation of the action.

The goal is not simply predicting the next state, but identifying reusable abstractions that explain how actions transform the environment.

Action semantics become latent structures that emerge from interaction.

---

## 5. From Semantics to World Models

Once action semantics become sufficiently predictable, the system can begin constructing world models.

A world model is a compressed representation of environmental dynamics.

Rather than memorizing individual transitions, the system seeks:

* Invariants
* Regularities
* Causal mechanisms
* Predictive abstractions

The resulting model allows:

* Future-state prediction
* Counterfactual reasoning
* Intervention planning
* Mechanism discovery
* Hypothesis generation

World models therefore emerge naturally from semantic understanding.

Without semantics, transitions remain disconnected observations.

With semantics, transitions become explainable.

---

## 6. Reframing and Latent Variable Discovery

Scientific progress often results from introducing new latent variables.

Examples include:

* Gravity
* Electromagnetic fields
* Genes
* Atoms
* Information

These concepts were not directly observable when first proposed.

Instead, they provided explanatory compression for previously disconnected observations.

An intelligent system should therefore not only learn within an existing representation but also search for alternative representations that yield superior explanatory power.

This process can be viewed as reframing.

Reframing modifies the ontology itself:

* New state variables are introduced.
* Existing concepts are reorganized.
* Hidden mechanisms become explicit.

Intelligence may therefore be understood as iterative ontology refinement.

---

## 7. Benchmarks as Ontological Commitments

Benchmarks are often treated as objective measurements of intelligence.

However, benchmarks themselves encode assumptions.

Every benchmark defines:

* What tasks matter.
* What outcomes count as success.
* Which errors are important.
* Which capabilities are measured.

In effect, benchmarks instantiate an ontology.

Optimization against a benchmark therefore produces competence relative to that ontology rather than intelligence in any universal sense.

If important variables are omitted, benchmark performance may become disconnected from genuine capability.

This creates the familiar phenomenon of benchmark saturation without corresponding real-world generalization.

A benchmark can only measure what its ontology allows it to represent.

---

## 8. Action-Semantic Benchmarks

Traditional benchmarks focus primarily on task completion.

An alternative perspective is to evaluate representation discovery itself.

Action-semantic benchmarks could measure:

* Semantic abstraction learning
* Action compression
* Reusable operator discovery
* Improvement across repeated interactions
* Transfer across environments
* World-model accuracy
* Hypothesis generation quality

Such benchmarks shift evaluation from outcome prediction toward mechanism understanding.

The objective becomes not merely solving tasks but constructing increasingly useful representations of reality.

---

## 9. ASRA: Semantics Before Optimization

ASRA adopts a representation-first view of intelligence.

Rather than beginning with optimization, ASRA begins with semantic discovery.

The architecture proceeds through stages:

1. Observation
2. State representation
3. Transition analysis
4. Action semantic inference
5. World-model construction
6. Mechanism discovery
7. Hypothesis generation
8. Adaptive scientific reasoning

Learning occurs at multiple levels simultaneously:

* Parameter learning
* Representation learning
* Semantic learning
* Ontology refinement

The system continuously updates not only its beliefs about the world but also its conceptual framework for describing the world.

---

## 10. Conclusion

Intelligence is often framed as optimization.

A deeper view is that intelligence is representation discovery.

Learning depends on ontology.

Prediction depends on semantics.

Reasoning depends on abstraction.

World models emerge from discovering causal compressions that explain how observations relate to one another.

From this perspective, prompts, ontologies, benchmarks, and world models are not peripheral engineering details. They are the substrate upon which learning occurs.

ASRA explores this representation-first approach by treating action semantics, ontology formation, and world-model construction as primary learning objectives. The resulting framework suggests a path toward adaptive systems that do more than optimize within a predefined worldview—they actively discover better ways of representing reality itself.
