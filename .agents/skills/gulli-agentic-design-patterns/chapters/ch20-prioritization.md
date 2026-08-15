# Chapter 20: Prioritization

## Core Idea

Prioritization ranks competing goals, tasks, or ready actions using explicit criteria. It decides **what should happen next**; Resource-Aware Optimization decides **how to execute it within budget**.

## Problem / Intent

Agents often face more eligible work than they can execute. Without a policy, urgent low-value requests can crowd out strategic work, dependencies can be ignored, and resource use can diverge from user goals.

## When to Use

- Several goals or tasks compete for limited time or capacity.
- Urgency, impact, dependencies, risk, and user preference differ.
- New events require dynamic re-ranking.
- Queues need explainable scheduling and fairness.
- A planner has several ready steps and must select one.

## When Not to Use

- Only one action is eligible.
- Safety or policy determines the action categorically.
- Scores cannot be calibrated or compared meaningfully.
- A model is being asked to override deterministic deadlines or dependencies.

## Implementation Structure

1. Define eligible work and hard constraints.
2. Define criteria, units, weights, tie-breakers, and fairness rules.
3. Normalize evidence for each candidate.
4. Score or order candidates deterministically where possible.
5. Select one action and record the explanation.
6. Re-prioritize on defined events, not continuously without cause.

```ts
type PriorityCandidate = {
  id: string;
  urgency: number;
  impact: number;
  dependencyReady: boolean;
  risk: number;
  estimatedCost: number;
  waitingSince: string;
};
```

Use hard policy before soft scoring: unsafe or dependency-blocked work is ineligible regardless of its numeric score.

## Prioritization Versus Resource Optimization

- [Resource-Aware Optimization](ch16-resource-aware-optimization.md) selects model, context, concurrency, and quality strategy for chosen work.
- Prioritization ranks competing work based on value and constraints.
- A cheap task is not automatically important, and an important task may justify premium resources.

## Worked Example: Incident Queue

Reject alerts lacking required evidence, then rank eligible incidents by safety impact, affected users, service criticality, deadline, and waiting time. Dependency-blocked remediation waits while diagnosis proceeds. Resource allocation assigns senior human review and premium analysis only to the highest-impact cases.

## Trade-offs

Prioritization improves focus and responsiveness, but scoring policies can encode bias, become stale, or obscure hard choices behind numbers. Dynamic re-ranking can also starve low-priority work.

## Failure Modes

- **Score theater**: arbitrary weights create false precision.
- **Urgency dominance**: noisy immediate work starves important long-term goals.
- **Dependency blindness**: blocked work is repeatedly selected.
- **Priority inversion**: low-value work holds resources needed by critical work.
- **Starvation**: low-ranked tasks never age upward or expire explicitly.
- **Model override**: generated rationale bypasses hard scheduling policy.
- **Re-prioritization churn**: minor events repeatedly reorder work.

## Pattern Interactions

- [Resource-Aware Optimization](ch16-resource-aware-optimization.md): allocate resources after ranking value.
- [Planning](ch06-planning.md): rank ready plan steps while respecting dependencies.
- Goal Monitoring: derive importance from measurable objectives and risk.
- Routing: send work to the correct queue before ranking within it.
- Human-in-the-Loop: approve ambiguous or contested high-impact priorities.

## Verification Checklist

- Are hard constraints applied before scoring?
- Are weights, evidence, and tie-breakers explainable?
- Is starvation prevented or explicitly accepted?
- Are priority changes triggered by material state changes?
- Is resource cost considered without replacing value and impact?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
