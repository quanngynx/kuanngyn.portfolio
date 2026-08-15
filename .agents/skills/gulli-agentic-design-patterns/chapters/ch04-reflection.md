# Chapter 4: Reflection

## Core Idea

Reflection is a bounded generate–evaluate–revise loop. It uses explicit critique criteria and observed evidence to improve an artifact or strategy; it is not a substitute for external evaluation.

## Problem / Intent

An initial output may be incomplete, inconsistent, or poorly aligned with requirements. Reflection inserts a feedback loop so a producer can revise its work after structured critique.

## When to Use

- Quality matters more than single-pass latency and cost.
- An artifact can be evaluated against explicit criteria.
- Code, plans, summaries, or long-form content benefit from revision.
- Deterministic tests or external evidence can inform the critique.
- A separate reviewer role provides genuinely different instructions or evidence.

## When Not to Use

- Correctness cannot be assessed from available criteria or evidence.
- The same model and context would merely restate the original answer.
- Latency or budget permits only one bounded pass.
- A deterministic validator can directly fix the issue.
- The operation has already produced an irreversible side effect.

## Implementation Structure

1. Produce an artifact and preserve its version.
2. Evaluate it against a structured rubric, tests, evidence, or constraints.
3. Return specific defects and repair instructions.
4. Revise only the artifact or plan elements implicated by the critique.
5. Re-evaluate until criteria pass or the iteration budget is exhausted.

```ts
type Critique = {
  passed: boolean;
  defects: Array<{ criterion: string; evidence: string; repair: string }>;
};

for (let revision = 0; revision < maxRevisions; revision++) {
  const critique = await evaluate(artifact, rubric, evidence);
  if (critique.passed) return artifact;
  artifact = await revise(artifact, critique.defects);
}
return escalate({ artifact, reason: "revision_budget_exhausted" });
```

## Producer–Critic Separation

A separate critic can reduce self-confirmation only when separation is substantive. Give the critic:

- explicit criteria,
- access to tests or source evidence,
- a structured defect schema,
- no incentive to approve by default,
- independence from the producer’s hidden assumptions.

Different personas without different criteria or evidence provide weak independence.

## Worked Example: Code Revision

The producer creates a patch. The evaluator runs tests, static analysis, and requirement checks. The critic maps failures to exact criteria and evidence. The producer revises only affected code. The loop stops when checks pass, the revision budget is exhausted, or a human decision is required.

This transformed example keeps the source’s producer–critic structure while replacing subjective “looks better” judgments with verifiable observations.

## Trade-offs

Reflection can improve adherence and surface defects, but adds model calls, context growth, latency, and the risk of polishing an incorrect premise. Revision may also degrade previously correct properties unless regression checks persist across iterations.

## Failure Modes

- **Self-approval**: critique repeats the producer’s assumptions.
- **Vague feedback**: “improve quality” provides no actionable defect or evidence.
- **Infinite refinement**: no acceptance threshold or revision budget exists.
- **Metric gaming**: revisions optimize the rubric while harming the real objective.
- **Regression**: a repair breaks criteria that previously passed.
- **Unsupported factual critique**: the reviewer invents corrections without source evidence.
- **Reflection/evaluation conflation**: local revision is mistaken for system-level quality measurement.

## Pattern Interactions

- Evaluation and Monitoring: evaluation defines metrics and collects evidence; Reflection consumes that feedback to revise a particular artifact or strategy.
- [Planning](ch06-planning.md): critique plan feasibility at checkpoints and re-plan only when state justifies it.
- [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md): use an independent critic role with explicit ownership and bounded handoffs.
- Memory: preserve prior critiques and regressions without treating every draft as long-term truth.
- Goal Setting and Monitoring: goals supply acceptance criteria and progress signals.
- Guardrails: reflection cannot override hard safety or authorization constraints.

## Verification Checklist

- Is the critique tied to criteria and evidence?
- Is revision bounded by iterations, cost, and elapsed time?
- Are previously satisfied criteria rechecked?
- Is the critic independent in evidence or method, not just persona?
- Can the loop escalate when quality remains uncertain?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
