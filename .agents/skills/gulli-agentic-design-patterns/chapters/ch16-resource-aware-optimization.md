# Chapter 16: Resource-Aware Optimization

## Core Idea

Resource-Aware Optimization adapts model, tool, context, concurrency, and quality strategy to explicit cost, latency, compute, energy, and capacity budgets. It chooses **how much resource to spend**, while Prioritization chooses **which work deserves attention first**.

## Problem / Intent

Always using the most capable model, richest context, and maximum parallelism is expensive and often slow. Always using the cheapest path can fail quality requirements. Resource-aware systems make the trade-off observable and policy-driven.

## When to Use

- Requests vary meaningfully in complexity or risk.
- Financial, token, latency, energy, or quota budgets are material.
- Graceful degradation is preferable to total failure.
- Several models or tools offer measurable quality/cost trade-offs.
- Long-running agents need remaining-budget decisions.

## When Not to Use

- One bounded configuration already meets quality and budget requirements.
- Quality cannot be evaluated, making cheap/expensive routing arbitrary.
- Model switching would violate consistency, privacy, or compliance requirements.
- Optimization complexity costs more than the resources saved.

## Implementation Structure

1. Define service objectives and hard budgets.
2. Classify request complexity, impact, and required quality.
3. Estimate resource use for candidate strategies.
4. Select model, tool, context, concurrency, and reasoning budget through policy.
5. Observe quality, cost, and latency.
6. Escalate, degrade, or stop when remaining budget cannot satisfy constraints.

```ts
type ExecutionBudget = {
  maxCost: number;
  maxLatencyMs: number;
  maxTokens: number;
  minQuality: number;
};

type Strategy = {
  modelClass: "small" | "large";
  contextPolicy: "minimal" | "expanded";
  concurrency: number;
  estimated: { cost: number; latencyMs: number; quality: number };
};
```

## Optimization Levers

- Dynamic model or tool selection.
- Context pruning, retrieval limits, and summarization.
- Bounded parallelism and cancellation.
- Cached deterministic results with freshness policy.
- Proactive capacity prediction.
- Smaller fallback paths and graceful degradation.
- Learned allocation policies promoted only after evaluation.

## Resource Optimization Versus Prioritization

[Prioritization](ch20-prioritization.md) ranks competing goals or tasks by urgency, impact, dependency, and value. Resource optimization selects an execution strategy for the chosen work. They interact when budgets force lower-ranked tasks to wait, degrade, or stop.

## Worked Example: Tiered Analysis

Use a fast low-cost model to classify a request and produce a preliminary analysis. If impact or uncertainty crosses policy thresholds, route to a stronger model with broader retrieval and independent evaluation. If latency budget is nearly exhausted, return a clearly labeled partial result rather than silently lowering quality.

## Trade-offs

Adaptive allocation can lower cost and latency, but creates routing, calibration, consistency, and fairness risks. A cheaper path may systematically underserve certain users or task classes.

## Failure Modes

- **Cheap-path lock-in**: early classification prevents needed escalation.
- **Unmeasured quality loss**: savings are reported without outcome comparison.
- **Budget fiction**: the agent receives a budget but orchestration does not enforce it.
- **Fallback concealment**: degraded results are presented as equivalent.
- **Cost-shifting**: model savings create more retries or human review.
- **Resource oscillation**: repeated upgrades/downgrades add latency and inconsistency.
- **Priority conflation**: low-value work consumes premium resources while critical work waits.

## Pattern Interactions

- [Prioritization](ch20-prioritization.md): ranks work before allocating resources.
- [Routing](ch02-routing.md): selects strategies through calibrated, policy-bounded dispatch.
- [Parallelization](ch03-parallelization.md): concurrency is a resource decision, not a free optimization.
- Evaluation and Monitoring: measure quality/cost/latency frontiers and regressions.
- Exception Handling: degrade or fall back explicitly when resources are unavailable.

## Verification Checklist

- Are budgets enforced by trusted orchestration?
- Is quality measured for every strategy tier?
- Are degraded results labeled?
- Can high-impact work escalate despite initial classification?
- Do savings remain after retries, synthesis, and human review?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
