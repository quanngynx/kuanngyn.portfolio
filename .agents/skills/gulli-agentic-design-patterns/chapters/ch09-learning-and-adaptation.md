# Chapter 9: Learning and Adaptation

## Core Idea

Learning changes a model, policy, prompt, tool strategy, or knowledge asset from evaluated experience. Adaptation is the observable behavior change that follows. Do not label ordinary context updates or one-off reflection as learning.

## Problem / Intent

Static systems degrade as users, environments, and tasks change. A governed learning loop can use outcomes and feedback to improve future decisions without manually rewriting every rule.

## When to Use

- The operating distribution changes measurably over time.
- Repeated tasks produce enough reliable outcome data.
- Personalization has consent, feedback, and rollback mechanisms.
- A benchmark or objective function can evaluate candidate improvements.
- The expected gain justifies data, experimentation, and governance cost.

## When Not to Use

- There is no trustworthy feedback signal.
- Online changes could affect safety, permissions, or irreversible actions.
- A configuration fix or deterministic rule solves the issue.
- Experience volume is too small or biased to support generalization.
- The system cannot reproduce, compare, and roll back updates.

## Implementation Structure

1. Capture trajectories: context, decisions, actions, observations, and outcomes.
2. Filter for data quality, consent, representativeness, and leakage.
3. Define an objective and protected constraints.
4. Produce a candidate update: prompt, policy, retriever, model, tool strategy, or procedure.
5. Evaluate offline against baselines and safety checks.
6. Deploy gradually with monitoring and rollback.
7. Promote only improvements supported by evidence.

```ts
type CandidateUpdate = {
  target: "prompt" | "policy" | "retriever" | "model" | "procedure";
  version: string;
  trainingDataRef: string;
  evaluation: Record<string, number>;
  constraintsPassed: string[];
  rollbackTo: string;
};
```

## Adjacent Concepts

- **Memory** stores experience; learning changes future behavior using evaluated experience.
- **Reflection** revises the current artifact or plan; learning promotes a change across future runs.
- **RAG updates** change the available knowledge; they do not necessarily change decision policy.
- **Online learning** updates during operation and therefore needs stronger safety and rollback controls than offline improvement.

## Worked Example: Improving a Coding Assistant

Collect anonymized task trajectories, test outcomes, and human review—not hidden reasoning. Identify repeated failure classes, propose a better editing or retrieval strategy, evaluate it on a held-out repository benchmark, then release it behind a feature flag. Roll back if correctness or safety regresses.

The source discusses self-improving coding and evolutionary systems as examples. Treat their named frameworks as historical illustrations; the reusable pattern is generate candidate -> evaluate -> select -> govern promotion.

## Trade-offs

Learning can improve performance and personalization, but introduces data quality, feedback-loop, privacy, reproducibility, and regression risk. Optimizing one metric can degrade safety, cost, fairness, or general capability.

## Failure Modes

- **Reward hacking**: behavior improves the metric rather than the real objective.
- **Self-modification without gates**: an agent changes production code or policy directly.
- **Feedback contamination**: low-quality or adversarial outcomes become training signal.
- **Catastrophic forgetting**: new performance replaces previously reliable behavior.
- **Selection bias**: only successful or highly visible interactions are learned from.
- **Unversioned adaptation**: changes cannot be reproduced or rolled back.
- **Claims without evaluation**: storing an experience is reported as improvement.

## Pattern Interactions

- [Memory](ch08-memory-management.md): supplies governed trajectories and prior outcomes.
- [Reflection](ch04-reflection.md): produces candidate repairs that may later be evaluated for promotion.
- Evaluation and Monitoring: defines baselines, held-out tests, deployment metrics, and regressions.
- Human-in-the-Loop: supplies expert feedback and promotion approval.
- Guardrails: protect invariant constraints during exploration and deployment.

## Verification Checklist

- Is the learning target explicit and versioned?
- Does feedback measure the real objective and protected constraints?
- Are evaluation data independent from training data?
- Can every update be rolled back?
- Are online changes bounded by authority and safety policy?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
