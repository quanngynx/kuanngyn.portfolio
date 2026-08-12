# Chapter 1: Prompt Chaining

## Core Idea

Use Prompt Chaining—also called the Pipeline pattern—when a complex request contains a known sequence of dependent transformations. Reliability comes from explicit intermediate contracts and validation, not merely from splitting one prompt into several prompts.

## Problem / Intent

A monolithic prompt may neglect instructions, drift from the original objective, overload the context window, or produce one good sub-result while silently failing another. Chaining narrows each model call to one operation and exposes intermediate state for deterministic control.

## When to Use

- The workflow has ordered stages and later stages depend on earlier results.
- Intermediate artifacts need validation, approval, enrichment, or tool calls.
- Different stages need distinct context, roles, models, or output schemas.
- A complex generation task naturally separates into outline, draft, review, and publication.
- Extraction requires normalization, deterministic calculation, and final rendering.

## When Not to Use

- Independent work should fan out in parallel.
- The sequence cannot be known until observations arrive; use [Planning](ch06-planning.md).
- One bounded call is already measurable and reliable.
- The chain exists only to imitate human reasoning without improving control or evidence.

## Implementation Structure

Each stage should declare:

1. Input schema and relevant context.
2. One transformation or decision.
3. Output schema.
4. Validation rules.
5. Failure policy: stop, repair, retry, branch, or escalate.
6. Idempotency and persistence requirements.

```ts
type Result<T> =
  | { ok: true; value: T; evidence?: string[] }
  | { ok: false; error: string; retryable: boolean };

type Stage<I, O> = {
  name: string;
  run(input: I): Promise<Result<O>>;
  validate(output: O): string[];
};

async function runStage<I, O>(stage: Stage<I, O>, input: I): Promise<O> {
  const result = await stage.run(input);
  if (!result.ok) throw new Error(`${stage.name}: ${result.error}`);
  const violations = stage.validate(result.value);
  if (violations.length) throw new Error(`${stage.name}: ${violations.join(", ")}`);
  return result.value;
}
```

This is deliberately framework-neutral. A chain library may compose the calls, but trusted application code should still own validation, persistence, retries, and side effects.

## Intermediate Data Rules

- Prefer typed JSON or domain objects over prose between stages.
- Pass the smallest sufficient context; do not append the entire history by default.
- Preserve provenance when later stages will make factual claims.
- Version schemas if stages may be deployed independently.
- Validate semantics as well as syntax: valid JSON can still contain unsupported claims.
- Persist completed stages before a retry can repeat costly or consequential work.

## Worked Example: Evidence-Based Market Brief

Transform a broad request into a controlled pipeline:

1. **Extract** claims, measurements, dates, and source references from the supplied research.
2. **Validate** required fields and reject claims without evidence.
3. **Classify** supported observations into trend categories.
4. **Synthesize** a brief using only validated observations.
5. **Render** the brief for the intended audience.

Independent source extraction can run in parallel, but collation, synthesis, and review remain sequential. This illustrates an important composition rule: use parallelism for independent work and chaining for dependency.

## Trade-offs

**Benefits**:

- Focused prompts and smaller contexts.
- Inspectable intermediate artifacts.
- Easier testing, debugging, and targeted retries.
- Natural insertion points for tools, policy checks, and humans.

**Costs**:

- More model calls and orchestration code.
- Additional latency, persistence, and schema management.
- More opportunities for downstream coupling.

## Failure Modes

- **Garbage pipeline**: an invalid early result is accepted and amplified downstream.
- **Prose coupling**: later stages parse ambiguous natural language.
- **Context snowball**: each step receives all previous prompts and outputs.
- **Retry duplication**: a failed later step causes earlier external actions to repeat.
- **False linearity**: independent work is serialized or an uncertain route is hard-coded.
- **Role decoration**: changing personas between stages without changing contracts or evidence.
- **Missing final reconciliation**: separately valid stage outputs contradict one another.

## Pattern Interactions

- [Tool Use](ch05-tool-use.md): place tool calls between stages and validate observations before forwarding them.
- [Planning](ch06-planning.md): let the planner create or revise the sequence; execute stable subflows as chains.
- [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md): a handoff between agents is still a chain and needs the same contracts.
- Parallelization: fan out independent stages, then fan in through a validated aggregation stage.
- Reflection and HITL: review a high-value intermediate artifact before commitment.

## Verification Checklist

- Can every stage be tested with fixed inputs and expected outputs?
- Does each handoff use a defined schema?
- Can a failed stage be retried without repeating completed side effects?
- Are independent operations parallelized rather than serialized?
- Does the final output trace back to validated intermediate evidence?

See [patterns.md](../patterns.md) for the compact catalog and [cheatsheet.md](../cheatsheet.md) for selection rules.
