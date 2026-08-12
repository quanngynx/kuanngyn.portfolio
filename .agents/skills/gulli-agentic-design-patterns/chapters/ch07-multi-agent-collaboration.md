# Chapter 7: Multi-Agent Collaboration

## Core Idea

Use multiple agents when responsibility can be partitioned by real differences in expertise, tools, context, authority, or parallel ownership. Multiple personas alone do not create a sound multi-agent system; explicit roles, messages, topology, and decision ownership do.

## Problem / Intent

A monolithic agent can become a context, capability, or authority bottleneck on multifaceted work. Multi-Agent Collaboration decomposes the objective into bounded responsibilities and coordinates their outputs toward one result.

## When to Use

- Subtasks require distinct data sources, tools, domain knowledge, or permissions.
- Independent work can run concurrently and later be reconciled.
- A creator/critic separation provides meaningful independent verification.
- Existing organizational boundaries require different owners.
- Failure isolation or modular replacement is important.

## When Not to Use

- One agent can complete the bounded task with lower cost and clearer accountability.
- Roles differ only in names, tone, or backstory.
- All agents receive the same context and use the same capabilities.
- Shared state, message contracts, conflict resolution, or completion ownership are undefined.
- Coordination overhead exceeds the work being distributed.

## Choose a Coordination Topology

| Topology | Use when | Main risk |
| --- | --- | --- |
| **Sequential handoff** | Each specialist transforms a predecessor’s result | Error propagation and latency |
| **Parallel fan-out/fan-in** | Subtasks are independent and results can be merged | Inconsistent assumptions and expensive synthesis |
| **Debate / consensus** | Competing interpretations benefit from explicit challenge | Premature agreement or verbose loops |
| **Supervisor** | One coordinator can assign and reconcile bounded work | Bottleneck and single point of failure |
| **Hierarchy** | Work decomposes across several management layers | Lost context and opaque accountability |
| **Peer network** | Decentralized agents must exchange information directly | Communication explosion and conflict |
| **Specialist as tool** | A parent needs one narrow expert capability | Hidden internal failure if the result contract is weak |

Default to the simplest topology that preserves ownership. A custom topology should answer a concrete constraint, not merely demonstrate flexibility.

## Implementation Structure

### Role and Message Contracts

Each role needs more than a persona:

```ts
type AgentRole<I, O> = {
  name: string;
  responsibility: string;
  inputSchema: unknown;
  outputSchema: unknown;
  allowedTools: string[];
  authority: string[];
  completionEvidence: string[];
};

type AgentMessage<T> = {
  taskId: string;
  from: string;
  to: string;
  intent: "delegate" | "result" | "question" | "review" | "escalate";
  payload: T;
  evidence?: string[];
  correlationId: string;
};
```

Trusted orchestration should own routing, delegation depth, timeouts, retries, shared-state updates, and final synthesis. Agents may recommend delegation; they should not create unbounded recursive organizations.

## Worked Example: Software Change Team

For a cross-cutting code change:

1. A **coordinator** normalizes acceptance criteria and partitions work.
2. A **repository analyst** returns affected modules and evidence, without editing.
3. An **implementer** receives the bounded change and writes the patch.
4. A **verifier** independently runs relevant checks and reports results, including failures.
5. The coordinator reconciles evidence and decides whether the outcome meets acceptance criteria.

Use parallelism only for independent analysis. Implementation that touches shared files requires ownership rules. Verification must not simply echo the implementer’s claim.

## Communication and State Rules

- Send task-scoped context, not every agent’s full transcript.
- Make the owner of each artifact and decision explicit.
- Carry provenance and correlation IDs through handoffs.
- Separate shared facts from private working context.
- Resolve conflicts through evidence or a named decision owner.
- Bound delegation depth, message count, elapsed time, and total cost.
- Treat agent outputs as proposals until validated at the receiving boundary.

## Trade-offs

**Benefits**:

- Specialized tools and context.
- Parallel execution of independent work.
- Modular replacement and potential failure isolation.
- Independent review or diverse evidence gathering.

**Costs**:

- Communication, synchronization, and synthesis overhead.
- Duplicated tokens and inconsistent assumptions.
- Harder tracing, evaluation, and reproducibility.
- New deadlock, livelock, delegation, and consensus failures.

## Failure Modes

- **Persona theater**: several prompts act like roles but share identical responsibility and capability.
- **Ambiguous ownership**: multiple agents edit or decide the same artifact.
- **Circular delegation**: agents repeatedly hand the task to one another.
- **Supervisor saturation**: all details flow through one context-heavy coordinator.
- **State divergence**: agents act on different versions of shared facts.
- **Consensus amplification**: multiple agents reinforce the same unsupported assumption.
- **Provenance loss**: synthesis cannot trace a claim to the contributing agent or evidence.
- **Failure masking**: a worker fails, but downstream agents continue with guessed output.
- **Unbounded organization**: agents create agents or messages without depth and cost limits.

## Pattern Interactions

- [Prompt Chaining](ch01-prompt-chaining.md): sequential handoffs require validated contracts.
- [Tool Use](ch05-tool-use.md): expose a specialist as a narrow capability or give roles least-privilege tools.
- [Planning](ch06-planning.md): decompose work and assign ownership; keep one owner for plan revision.
- Parallelization: run independent roles concurrently and synthesize through a defined fan-in stage.
- Inter-Agent Communication/A2A: standardize interoperable task and result messages.
- Evaluation: use independent critics or judges while protecting against shared blind spots.

## Verification Checklist

- Does every role have a distinct responsibility or capability?
- Is there one owner for each task, artifact, and final decision?
- Are topology and message contracts explicit?
- Can failed or slow workers be isolated, retried, or replaced?
- Are delegation depth, messages, time, and cost bounded?
- Can every synthesized claim be traced to evidence?
- Would one agent be simpler without losing required capability?

See [patterns.md](../patterns.md) for the compact catalog and [cheatsheet.md](../cheatsheet.md) for topology and failure guidance.
