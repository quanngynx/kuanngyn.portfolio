# Chapter 15: Inter-Agent Communication (A2A)

## Core Idea

Inter-Agent Communication defines interoperable task, message, artifact, and lifecycle contracts between independently operated agents. It complements [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md), which decides roles and topology.

## Problem / Intent

Agents built by different teams or frameworks cannot collaborate reliably through ad hoc prompts and undocumented HTTP endpoints. A2A-style protocols make identity, capability discovery, task state, communication modes, and authentication explicit while keeping remote implementation opaque.

## When to Use

- Independently deployed agents must exchange delegated work.
- Framework, language, or organizational boundaries prevent in-process coordination.
- Tasks are long-running and need status, streaming, polling, or callbacks.
- Capability discovery and version negotiation have operational value.
- Artifacts and provenance must cross system boundaries.

## When Not to Use

- Components belong to one process and a function/tool interface is sufficient.
- The remote component is a capability service rather than an autonomous task owner; use MCP or direct tools.
- Discovery, authentication, and lifecycle semantics are not governed.
- Network distribution adds no ownership or scaling benefit.

## Implementation Structure

1. Publish an approved agent descriptor: identity, endpoint, version, skills, input/output modes, and authentication requirements.
2. Discover through direct configuration or a curated registry; discovery does not imply trust.
3. Create a task with correlation, context, requester, expected artifact, deadline, and budget.
4. Exchange typed messages and lifecycle events.
5. Support synchronous response, polling, streaming, or callback according to task duration.
6. Preserve artifact provenance and terminal status.

```ts
type RemoteTask = {
  taskId: string;
  contextId: string;
  skill: string;
  input: unknown;
  expectedArtifact: string;
  status: "submitted" | "working" | "input_required" | "completed" | "failed";
  correlationId: string;
};
```

## A2A Versus MCP

- [MCP](ch10-model-context-protocol.md) exposes tools, resources, and prompt templates to a host.
- A2A delegates a task to another agent that owns its internal reasoning and execution.
- MCP is capability-oriented; A2A is task/lifecycle-oriented.
- An agent may use MCP internally while participating in A2A externally.

## Worked Example: Cross-Organization Report

A coordinator delegates a market-data task to an external analyst agent. The request includes scope, deadline, accepted artifact schema, and source requirements. The analyst returns working status and eventually a signed artifact with provenance. The coordinator validates the artifact before synthesis; it never assumes a completed task from a conversational acknowledgment.

## Trade-offs

Interoperability and organizational modularity come with distributed-system costs: authentication, versioning, latency, partial failure, idempotency, observability, and cross-boundary governance.

## Failure Modes

- **Descriptor spoofing**: discovered identity or capability is not trusted.
- **Protocol drift**: lifecycle or artifact versions diverge.
- **Opaque failure**: remote status says failed without actionable evidence.
- **Duplicate delegation**: retries create multiple remote tasks.
- **Context confusion**: task, session, and correlation identifiers are mixed.
- **Artifact trust**: remote output bypasses local validation.
- **Callback abuse**: unvalidated notification destinations expose data or trigger actions.

## Pattern Interactions

- [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md): defines role ownership and topology; A2A carries tasks across boundaries.
- [MCP](ch10-model-context-protocol.md): supplies capabilities to agents rather than delegating agent-owned tasks.
- [Exception Handling](ch12-exception-handling-and-recovery.md): handles remote timeout, duplicate task, unavailable agent, and ambiguous completion.
- Goal Monitoring: binds remote status to local success evidence.
- Guardrails: approve agent identities, data scopes, artifacts, and callback destinations.

## Verification Checklist

- Are identity, version, authentication, and capability contracts explicit?
- Is task creation idempotent?
- Are lifecycle states and artifacts validated locally?
- Can long-running work resume without duplicated delegation?
- Is discovery separated from approval and trust?

Named protocol methods and vendor implementations in the source are historical examples unless independently verified.
