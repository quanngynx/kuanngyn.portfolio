# Chapter 8: Memory Management

## Core Idea

Memory gives an agent controlled continuity across turns, tasks, or sessions. Treat working state, episodic history, durable facts, and procedural lessons as different data classes with separate retention and retrieval policies.

## Problem / Intent

Without memory, an agent repeatedly reconstructs context and cannot track task progress or user-specific continuity. Unbounded memory is equally harmful: stale, sensitive, or irrelevant information can dominate decisions and create privacy risk.

## When to Use

- A conversation or task spans multiple turns.
- Work must resume after interruption.
- User-approved preferences or durable facts should persist across sessions.
- Prior outcomes can improve later decisions.
- The agent needs an auditable history of state transitions.

## When Not to Use

- The task is isolated and all relevant context is supplied.
- Data has no lawful retention basis or cannot be governed safely.
- Fresh authoritative data should be retrieved instead of remembered.
- The system cannot distinguish observation, inference, preference, and instruction.

## Implementation Structure

| Layer | Purpose | Typical lifetime |
| --- | --- | --- |
| Working context | Inputs needed for the current decision | One call or bounded step |
| Session state | Task progress, recent events, temporary variables | One conversation or execution |
| Episodic memory | Prior interactions and outcomes with provenance | Governed cross-session retention |
| Semantic memory | Durable facts and preferences | Until invalidated or deleted |
| Procedural memory | Tested strategies or rules | Versioned and reviewed |

```ts
type MemoryRecord = {
  subjectId: string;
  kind: "event" | "fact" | "preference" | "procedure";
  value: unknown;
  source: string;
  observedAt: string;
  expiresAt?: string;
  confidence?: number;
  consentScope?: string;
};
```

1. Record an event or state transition.
2. Decide whether it deserves durable retention.
3. Normalize metadata, provenance, ownership, and expiry.
4. Retrieve only records relevant to the current decision.
5. Resolve conflicts using freshness and authority.
6. Support correction, deletion, and audit.

## Memory Versus RAG

[RAG](ch14-knowledge-retrieval-rag.md) retrieves governed source material to ground an answer. Memory preserves agent-, task-, or user-specific continuity. Both may use vector search, but they differ in ownership and truth semantics:

- A policy document belongs in a knowledge corpus.
- “The user approved option B in task 42” belongs in episodic memory.
- A remembered claim should not override a newer authoritative source.

## Worked Example: Resumable Support Case

Store the current case status, completed diagnostic steps, tool observations, user approvals, and unresolved questions as session state. Promote only durable user preferences or verified case facts to long-term memory. On resume, reconstruct a compact working context from state instead of replaying the entire transcript.

## Trade-offs

Memory improves continuity and personalization but adds storage, privacy, conflict resolution, retrieval quality, and lifecycle responsibilities. Larger context windows expand working memory; they do not replace durable, governed memory.

## Failure Modes

- **Transcript dumping**: raw history replaces structured state.
- **Stale truth**: old observations override current sources.
- **Memory poisoning**: untrusted content becomes a durable instruction or fact.
- **Scope leakage**: records cross users, tenants, tasks, or consent boundaries.
- **No forgetting**: irrelevant or sensitive data persists indefinitely.
- **Premature promotion**: an inference becomes a durable fact without verification.
- **Retrieval flooding**: too many memories crowd out current evidence.

## Pattern Interactions

- [RAG](ch14-knowledge-retrieval-rag.md): use RAG for source-grounded knowledge and memory for temporal continuity.
- [Reflection](ch04-reflection.md): retain critiques and outcomes selectively to avoid repeating defects.
- [Planning](ch06-planning.md): persist plan state and evidence for resume/re-plan.
- Learning and Adaptation: memory supplies evaluated experience; adaptation changes behavior only through a governed update.
- Guardrails: enforce retention, access, tenant, and deletion policies outside the model.

## Verification Checklist

- Is every record typed, scoped, sourced, and time-bounded where appropriate?
- Can users inspect, correct, or delete retained information?
- Does retrieval prefer authoritative and fresh evidence?
- Can session state be resumed without replaying raw conversation?
- Are memory writes validated before becoming durable?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
