# Chapter 6: Planning

## Core Idea

Use Planning when the goal is known but the path must be discovered or revised. If the “how” is already stable and repeatable, prefer a fixed workflow or [Prompt Chaining](ch01-prompt-chaining.md).

## Problem / Intent

Reactive agents can choose the next immediate action, but complex goals require dependencies, constraints, checkpoints, and adaptation. Planning creates an inspectable bridge between human intent and bounded execution.

## When to Use

- The task requires interdependent operations and no reliable fixed sequence exists.
- Evidence gathered during execution can change the next action.
- The system must identify knowledge gaps, choose tools, or recover around obstacles.
- Long-running research or operational work needs checkpoints and resumable state.
- A high-level objective must be decomposed before work can be assigned.

## When Not to Use

- The workflow is already known, tested, and repeatable.
- Success cannot be evaluated from observable state.
- The planner lacks the tools or authority needed to execute its proposed steps.
- The cost or risk of exploratory actions is unacceptable.
- A single bounded decision or tool call solves the task.

## Fixed Workflow or Planner?

| Question | Fixed workflow | Planner |
| --- | --- | --- |
| Is the sequence known? | Yes | Not fully |
| Can observations change the path? | Rarely | Expected |
| Primary value | Predictability | Adaptability |
| Main control | Encoded transitions | Goal/state evaluation |
| Main risk | Rigidity | Nondeterminism and drift |

## Implementation Structure

A plan is executable state, not merely a prose checklist.

```ts
type PlanStep = {
  id: string;
  intent: string;
  dependencies: string[];
  expectedEvidence: string[];
  status: "pending" | "running" | "done" | "failed" | "blocked";
};

type PlanState = {
  goal: string;
  constraints: string[];
  budget: { steps: number; toolCalls: number; elapsedMs: number };
  steps: PlanStep[];
  observations: Record<string, unknown>;
};
```

Execution loop:

1. Normalize goal, initial state, constraints, authority, budget, and stopping condition.
2. Generate steps with dependencies and expected evidence.
3. Validate feasibility; obtain approval where required.
4. Select one ready step and execute it through bounded tools or workflows.
5. Record the observation and evaluate progress.
6. Continue, repair, re-plan, escalate, or stop.

## Re-plan Triggers

Re-planning should be caused by state, not by vague dissatisfaction:

- A required precondition is false.
- A tool returns a non-retryable failure.
- New evidence invalidates an assumption.
- A dependency changes or becomes unavailable.
- The remaining plan exceeds time, cost, or risk budgets.
- Progress metrics remain unchanged after a bounded attempt.
- Human feedback changes the goal or constraints.

Preserve completed evidence and side effects across revisions. Re-planning must not silently erase history.

## Worked Example: Research Investigation

A research agent receives a question whose subtopics are initially unclear:

1. Draft a research plan with questions, source types, and completion evidence.
2. Present the plan for optional review when scope or cost is material.
3. Search and extract evidence through tools.
4. Evaluate coverage, contradictions, and knowledge gaps.
5. Add or revise queries only for unresolved gaps.
6. Synthesize a report with claim-to-source links.
7. Stop when coverage criteria are met or the budget is exhausted.

The source’s deep-research examples illustrate iterative search, gap discovery, asynchronous execution, and citation-rich synthesis. The reusable pattern is the evidence-driven loop, not a particular vendor API or model name.

## Trade-offs

**Benefits**:

- Adapts to new evidence and obstacles.
- Makes high-level goals actionable and inspectable.
- Supports long-running and multi-tool work.
- Provides natural approval and progress checkpoints.

**Costs**:

- Additional calls, latency, and state management.
- Plans may sound plausible without being feasible.
- Harder reproducibility and evaluation.
- Requires budgets and recovery logic to avoid unbounded work.

## Failure Modes

- **Plan theater**: the agent writes a plan but execution does not consume or update it.
- **Plausibility over feasibility**: steps lack tools, permissions, inputs, or realistic dependencies.
- **Endless decomposition**: planning continues without taking a bounded action.
- **Thrashing**: minor observations trigger wholesale re-planning.
- **Stale plan**: execution continues after constraints or evidence change.
- **Lost invariants**: revisions forget budget, safety, or user requirements.
- **Unsupported completion**: steps are marked done without expected evidence.
- **No terminal state**: the agent cannot distinguish success, failure, blocked work, and budget exhaustion.

## Pattern Interactions

- [Prompt Chaining](ch01-prompt-chaining.md): execute stable subflows inside a dynamic plan.
- [Tool Use](ch05-tool-use.md): supply observations and actions; tool failures are common re-plan triggers.
- [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md): assign planned work to bounded roles and retain a named decision owner.
- Reflection: critique feasibility or results at explicit checkpoints.
- Goal Monitoring: compare observations with success criteria and budgets.
- HITL: approve high-impact plans or resolve ambiguous constraints.

## Verification Checklist

- Is every step tied to the goal and an observable result?
- Are dependencies and readiness represented explicitly?
- Are planning, execution, and evaluation distinct operations?
- Can the agent resume without reconstructing state from conversation?
- Are re-plan triggers and budgets explicit?
- Can it stop as successful, failed, blocked, or exhausted?

See [patterns.md](../patterns.md) for the compact catalog and [cheatsheet.md](../cheatsheet.md) for pattern selection.
