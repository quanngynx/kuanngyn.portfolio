# Chapter 17: Reasoning Techniques

## Core Idea

Reasoning techniques allocate structure, search, deterministic computation, or environmental feedback to difficult decisions. Prefer inspectable plans, evidence, tool observations, and test results over requiring or exposing private model reasoning traces.

## Problem / Intent

Some tasks cannot be solved reliably by one direct generation. They require decomposition, alternative search, exact computation, action/observation loops, or independent challenge.

## When to Use

- The problem has multiple dependent constraints or candidate paths.
- Intermediate choices can be verified externally.
- Deterministic computation can replace probabilistic arithmetic or logic.
- Environmental observations should update the next action.
- The value of better decisions exceeds added latency and cost.

## When Not to Use

- A direct answer or deterministic algorithm is sufficient.
- More generated reasoning has no external verification signal.
- Internal trace disclosure would expose sensitive information or create false confidence.
- The technique duplicates existing planning, reflection, or multi-agent control.

## Technique Router

| Technique | Use for | Operational artifact |
| --- | --- | --- |
| Decomposition / stepwise reasoning | Break a constrained problem into subproblems | Concise plan or structured intermediate results |
| Tree search | Explore competing paths with pruning/backtracking | Candidate states and evaluation scores |
| Self-correction | Repair against criteria | Structured critique and revised artifact |
| Program-aided reasoning | Exact math, logic, or data manipulation | Sandboxed code plus result evidence |
| ReAct-style loop | Interleave decisions with tools and observations | Action/observation trajectory |
| Debate / independent candidates | Surface competing evidence or assumptions | Claims, counterclaims, evidence, decision rule |

## Implementation Structure

1. Classify why direct generation is insufficient.
2. Select one reasoning control matched to that deficiency.
3. Externalize only decision-relevant artifacts—not hidden internal monologue.
4. Verify intermediate results with tools, evidence, tests, or scoring.
5. Bound branches, iterations, tokens, time, and tool use.
6. Return the conclusion with evidence and uncertainty.

```ts
type Candidate = {
  proposal: unknown;
  evidence: string[];
  score: number;
  rejectedBecause?: string[];
};
```

## Worked Example: Constrained Architecture Choice

Generate three architectures from the same requirements. Evaluate each against latency, data residency, failure recovery, and operational complexity. Use deterministic cost calculations where possible. Select the highest-scoring feasible candidate and publish the decision matrix, not a long private reasoning transcript.

## Trade-offs

Structured reasoning can improve complex decisions but consumes tokens, time, and tools. More reasoning may reinforce a false premise, fabricate justification, or create an illusion of transparency without evidence.

## Failure Modes

- **Reasoning theater**: long explanations replace verification.
- **Branch explosion**: tree or debate search has no pruning budget.
- **Self-consistency error**: repeated samples agree because they share the same blind spot.
- **Tool-free simulation**: the model imagines retrieval or execution instead of observing it.
- **Debate dominance**: persuasive style outweighs evidence.
- **Private-trace dependency**: the system requires hidden reasoning for auditability.
- **Technique stacking**: several reasoning patterns add cost without independent benefit.

## Pattern Interactions

- [Planning](ch06-planning.md): produces executable steps and adapts to observations.
- [Reflection](ch04-reflection.md): applies criteria-based repair rather than generic self-correction.
- [Tool Use](ch05-tool-use.md): program-aided and ReAct-style methods require bounded execution.
- [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md): debate roles need distinct evidence and a decision owner.
- Evaluation and Monitoring: compare decision quality, trajectory efficiency, and cost against simpler baselines.

## Verification Checklist

- Is the selected technique tied to a specific reasoning deficiency?
- Are intermediate artifacts externally verifiable?
- Are branches, iterations, tokens, and actions bounded?
- Could deterministic code replace a reasoning step?
- Does the final answer expose evidence and uncertainty without private traces?

Named models and research systems in the source are historical examples unless independently verified.
