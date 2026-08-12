# Chapter 19: Evaluation and Monitoring

## Core Idea

Evaluation measures whether an agent and its trajectory meet requirements across test cases and time. Monitoring observes live behavior, quality, latency, cost, safety, and drift. Reflection revises an artifact; evaluation determines whether that revision or system is actually better.

## Problem / Intent

Final-answer spot checks miss tool misuse, inefficient trajectories, hidden failures, and production drift. Probabilistic systems need layered evaluation across deterministic invariants, task outcomes, trajectories, and operational metrics.

## When to Use

- Always before and after deploying an agentic workflow.
- Multiple versions, prompts, models, tools, or topologies must be compared.
- Tool selection and action sequences affect correctness or cost.
- Production distributions and dependencies can drift.
- Compliance, safety, or service objectives require evidence.

## When Not to Use

- Do not use one aggregate score as a substitute for requirement-specific tests.
- Do not use LLM-as-judge where deterministic checks are available.
- Do not monitor data without an owner and response policy.
- Do not expose private reasoning traces as an observability requirement.

## Implementation Structure

1. Formalize tasks, constraints, allowed tools, expected evidence, and budgets.
2. Build unit cases for components and scenario sets for end-to-end behavior.
3. Capture external trajectories: decisions, calls, observations, state transitions, and artifacts.
4. Evaluate deterministic properties first.
5. Use human or model judges for bounded qualitative criteria with calibration.
6. Compare against baselines and confidence intervals.
7. Monitor live metrics, drift, anomalies, and guardrail events.
8. Connect alerts to rollback, investigation, or improvement workflows.

## Evaluation Layers

| Layer | Examples |
| --- | --- |
| Contract | Schema, permissions, required citations, terminal state |
| Outcome | Task success, correctness, user value, policy adherence |
| Trajectory | Tool choice, ordering, unnecessary steps, handoff quality |
| Resource | Latency, tokens, cost, retries, concurrency |
| Production | Drift, anomaly, failure rates, guardrail events |

Trajectory matching can be exact, ordered-subsequence, any-order, or required-action based. Choose the strictness the task requires rather than assuming one ideal path for every valid solution.

## Reflection Versus Evaluation

- [Reflection](ch04-reflection.md) consumes a rubric and evidence to repair one artifact or strategy.
- Evaluation compares outputs, trajectories, versions, and live systems against baselines.
- A reflection loop can overfit its rubric; independent evaluation must detect regressions.

## Worked Example: Tool-Using Support Agent

Unit-test intent routing and tool schemas. End-to-end scenarios verify account authorization, required tool calls, final evidence, and escalation. Trajectory evaluation permits harmless extra reads but rejects writes before authorization. Production monitoring tracks resolution, harmful misroutes, latency, retries, and human escalation quality.

## Trade-offs

Evaluation increases confidence and supports improvement, but high-quality scenarios, human labels, judge calibration, and production telemetry are costly. Monitoring without action creates noise rather than reliability.

## Failure Modes

- **Final-answer tunnel vision**: correct prose hides a bad or unsafe trajectory.
- **Judge monoculture**: one model evaluates systems with the same blind spots.
- **Benchmark leakage**: prompts or training contain evaluation cases.
- **Metric gaming**: optimization improves the score but harms users.
- **No baseline**: improvement claims lack comparison.
- **Monitoring without ownership**: alerts do not trigger decisions.
- **Sensitive trace capture**: logs retain secrets or unnecessary user data.

## Pattern Interactions

- [Reflection](ch04-reflection.md): evaluate independently before promoting revisions.
- Goal Monitoring: governs one objective; evaluation compares runs and system behavior.
- Learning and Adaptation: supplies promotion gates and regression detection.
- [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md): evaluate both role performance and cooperation/handoffs.
- Guardrails: test bypass resistance and monitor violations/false positives.
- Resource-Aware Optimization: compare quality–cost–latency frontiers.

## Verification Checklist

- Do tests cover outcomes, trajectories, resources, and safety?
- Are deterministic checks preferred where possible?
- Are qualitative judges calibrated against human examples?
- Are baselines, variance, and regression thresholds explicit?
- Does every production alert have an owner and response action?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
