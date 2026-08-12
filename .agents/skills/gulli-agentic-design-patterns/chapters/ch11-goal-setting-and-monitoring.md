# Chapter 11: Goal Setting and Monitoring

## Core Idea

Goal Setting defines the desired state and constraints; Monitoring compares observed state with that goal. Planning decides **how** to proceed, while goal monitoring decides whether progress is real, correction is needed, or work should stop.

## Problem / Intent

An agent can execute many plausible actions without getting closer to the intended outcome. Explicit goals, measures, and terminal states turn activity into accountable progress.

## When to Use

- Work spans multiple steps or a long-running process.
- Success, failure, blocked state, and budget exhaustion must be distinguished.
- Environmental change can put an objective at risk.
- Corrective action or escalation depends on measured deviation.
- Several agents or tools contribute to one outcome.

## When Not to Use

- A single deterministic operation has an immediate result.
- The “goal” is aspirational and cannot be observed or measured.
- Metrics encourage harmful proxy optimization.
- Monitoring data is unavailable, stale, or untrusted.

## Implementation Structure

```ts
type Goal = {
  outcome: string;
  successCriteria: Criterion[];
  constraints: Criterion[];
  deadline?: string;
};

type GoalStatus = {
  state: "active" | "achieved" | "failed" | "blocked" | "exhausted";
  progress: Record<string, number | boolean>;
  evidence: string[];
  deviations: string[];
};
```

1. Define outcome, initial state, constraints, evidence, and terminal states.
2. Select leading indicators of progress and lagging indicators of success.
3. Observe actions, environment, tool outputs, and resource use.
4. Compare with criteria at meaningful checkpoints.
5. Continue, correct, re-plan, escalate, or stop.
6. Record why the terminal state was assigned.

SMART goals can improve specificity, but measurability must not reduce the objective to a misleading proxy.

## Planning Versus Goal Monitoring

- [Planning](ch06-planning.md) proposes and revises steps.
- Goal Monitoring owns the progress and completion contract.
- A planner should not mark its own plan successful without monitored evidence.
- Monitoring can trigger re-planning when constraints or progress change.

## Worked Example: Support Resolution

Goal: resolve a billing issue without violating refund policy. Success requires a verified account adjustment and user-visible confirmation. Monitoring observes tool results, remaining unresolved questions, policy constraints, elapsed time, and escalation status. A friendly response alone is not completion evidence.

## Trade-offs

Goals focus behavior and support accountability, but metrics create instrumentation cost and can distort behavior. Continuous monitoring also adds latency, storage, alerting, and privacy concerns.

## Failure Modes

- **Activity as progress**: actions are counted without outcome evidence.
- **Proxy gaming**: the agent optimizes a metric that diverges from user value.
- **Binary completion**: blocked, failed, and exhausted states collapse into “not done.”
- **Moving goalposts**: criteria change silently during execution.
- **Stale observations**: decisions use outdated environment state.
- **No evidence binding**: success is declared from generated narrative.
- **Alert fatigue**: monitoring emits signals with no ownership or response policy.

## Pattern Interactions

- [Planning](ch06-planning.md): monitoring triggers continue, repair, re-plan, or stop.
- [Reflection](ch04-reflection.md): consume monitored deviations to revise an artifact or strategy.
- Evaluation and Monitoring: chapter-level evaluation compares runs and systems; goal monitoring governs one objective’s progress.
- Human-in-the-Loop: escalate ambiguous goals, exceptions, or high-impact terminal decisions.
- Resource-Aware Optimization: track budgets as constraints, not merely performance metrics.

## Verification Checklist

- Are success and non-success terminal states explicit?
- Does every completion claim have evidence?
- Are metrics resistant to obvious proxy gaming?
- Can monitoring trigger a bounded corrective action?
- Is one owner accountable for responding to deviations?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
