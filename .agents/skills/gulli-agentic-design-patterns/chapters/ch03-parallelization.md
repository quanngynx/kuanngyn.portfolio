# Chapter 3: Parallelization

## Core Idea

Parallelization runs independent work concurrently and joins the results at an explicit synchronization point. It is a dependency optimization, not automatically a multi-agent architecture.

## Problem / Intent

Sequential execution makes total latency approximate the sum of every model, API, or database call. When tasks do not depend on one another, concurrent execution can reduce elapsed time and improve throughput.

## When to Use

- Several external lookups can begin from the same validated input.
- Data partitions or modalities can be processed independently.
- Multiple candidates or independent checks will be compared later.
- Specialized agents own independent subtasks and a fan-in stage can reconcile them.
- I/O latency dominates and services support safe concurrency.

## When Not to Use

- One task consumes another’s result; use [Prompt Chaining](ch01-prompt-chaining.md).
- Concurrent operations mutate shared state without an ownership or transaction strategy.
- Provider quotas, cost, memory, or downstream capacity cannot absorb the fan-out.
- Ordering is semantically important.
- The synthesis step cannot reconcile partial or contradictory results.

## Implementation Structure

1. Draw the dependency graph and identify independent nodes.
2. Define a shared input snapshot and one output contract per branch.
3. Bound concurrency, time, cost, and cancellation.
4. Execute branches concurrently.
5. Collect success, failure, timeout, and provenance separately.
6. Apply an explicit join policy before synthesis.

```ts
type BranchResult<T> =
  | { branch: string; status: "ok"; value: T; evidence: string[] }
  | { branch: string; status: "failed" | "timeout"; error: string };

const results = await runWithConcurrencyLimit(
  branches.map((branch) => () => branch.execute(inputSnapshot)),
  4,
);

const accepted = joinPolicy(results);
return synthesize(accepted);
```

The concurrency limit and join policy belong to application code. Do not delegate them implicitly to whichever framework schedules tasks.

## Join Policies

- **All required**: stop if any mandatory branch fails.
- **Minimum quorum**: continue when enough independent evidence arrives.
- **Best effort**: return partial results with explicit missing branches.
- **First satisfactory**: cancel remaining work when one result meets a defined threshold.
- **Rank and select**: evaluate multiple candidates before choosing one.

## Worked Example: Research Fan-Out/Fan-In

Search news, market data, internal documents, and public filings concurrently. Each branch returns findings with provenance and freshness. The fan-in stage validates coverage and contradictions before one sequential synthesis step produces the report.

This differs from [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md): concurrency is justified by dependency structure, while multiple agents are justified by responsibility or capability boundaries. Either can exist without the other.

## Trade-offs

Parallelization reduces elapsed time and can diversify evidence, but increases peak cost, quota pressure, log interleaving, cancellation complexity, and the chance that branches operate on inconsistent state.

## Failure Modes

- **False independence**: branches secretly depend on mutable or incomplete shared state.
- **Unbounded fan-out**: one request creates excessive calls, agents, or tasks.
- **Straggler domination**: the slowest branch controls total latency without being necessary.
- **Partial-result blindness**: synthesis treats missing branches as empty evidence.
- **Concurrent side effects**: branches conflict or duplicate writes.
- **Context divergence**: branches receive different versions of the input.
- **Parallel theater**: concurrency overhead exceeds the work saved.

## Pattern Interactions

- [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md): parallelize only independent responsibilities; preserve one owner for synthesis.
- [Prompt Chaining](ch01-prompt-chaining.md): combine fan-out/fan-in stages inside a larger dependent pipeline.
- [Routing](ch02-routing.md): route inputs to different parallel branch sets.
- Tool Use: enforce provider-specific rate and concurrency limits.
- Evaluation and Monitoring: compare sequential baseline, tail latency, branch failures, and cost.
- Resource-Aware Optimization: reduce or cancel branches when budgets tighten.

## Verification Checklist

- Does the dependency graph prove the branches are independent?
- Is concurrency bounded per provider and resource?
- Are partial failures represented explicitly?
- Can unnecessary branches be cancelled safely?
- Does synthesis preserve provenance and report missing evidence?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
