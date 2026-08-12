# Chapter 12: Exception Handling and Recovery

## Core Idea

Exception Handling detects and classifies operational failure; Recovery restores a known stable state or exits safely. Retries are only one response and should be limited to failures that are both transient and safe to repeat.

## Problem / Intent

Agents operate across nondeterministic models and unreliable external services. Without explicit failure semantics, they may hallucinate success, repeat side effects, corrupt state, or continue from incomplete observations.

## When to Use

- Any tool, network, model, parser, or storage operation can fail.
- Work spans several state transitions or side effects.
- Partial results should degrade gracefully rather than disappear.
- Recovery may require rollback, compensation, re-planning, or human escalation.

## When Not to Use

- Failure can be prevented more simply through input validation or a guardrail.
- Retrying a non-idempotent action would compound harm.
- The system cannot identify a stable recovery point.
- “Self-correction” has no evidence that the cause changed.

## Implementation Structure

1. Detect timeout, invalid output, service error, invariant violation, or stalled progress.
2. Classify cause, impact, retryability, and whether state may have changed.
3. Record the failure with correlation and execution identity.
4. Choose retry, fallback, graceful degradation, compensation, rollback, escalation, or stop.
5. Restore or establish a known state.
6. Verify recovery before resuming.

```ts
type Failure = {
  code: string;
  category: "transient" | "invalid_input" | "policy" | "conflict" | "unknown";
  retryable: boolean;
  sideEffectState: "none" | "committed" | "unknown";
  evidence: string[];
};
```

## Recovery Decision Rules

- Retry only transient failures with bounded attempts and backoff.
- Do not retry policy rejection or invalid input unchanged.
- When commit state is unknown, reconcile before repeating the action.
- Use compensation when rollback is unavailable but an inverse action exists.
- Degrade gracefully only when missing capability is disclosed.
- Escalate when impact, ambiguity, or authority exceeds automation boundaries.

## Exception Handling Versus Guardrails

Guardrails constrain or prevent disallowed behavior before and during execution. Recovery handles operational failure and restores stability afterward. A guardrail rejection is an expected policy result, not a transient exception to retry around.

## Worked Example: Order Creation Timeout

If order creation times out, do not call it again immediately. Query by idempotency key to determine whether the order committed. If committed, return the recorded result. If absent and safe, retry within budget. If state remains unknown, escalate rather than risk a duplicate purchase.

## Trade-offs

Recovery improves resilience and user trust, but adds state machines, compensation logic, observability, and testing. Aggressive retries can worsen outages and duplicate side effects.

## Failure Modes

- **Retry storm**: many agents amplify a failing dependency.
- **Blind retry**: the cause or side-effect state is unchanged or unknown.
- **Error laundering**: a fallback hides reduced quality or missing evidence.
- **State amnesia**: recovery restarts without completed-step or commit knowledge.
- **Policy bypass**: guardrail rejection is treated as an exception to overcome.
- **Rollback fiction**: generated text claims reversal without observing it.
- **Recovery loop**: fallback and primary path repeatedly call one another.

## Pattern Interactions

- Guardrails: distinguish expected policy rejection from operational failure.
- [Tool Use](ch05-tool-use.md): tools return typed success, rejection, and failure states.
- [Planning](ch06-planning.md): non-retryable failures can trigger bounded re-planning.
- [Reflection](ch04-reflection.md): analyze a failed artifact or plan only when evidence supports a repair.
- Human-in-the-Loop: resolve unknown side effects, high impact, or exhausted recovery.

## Verification Checklist

- Are retryability and side-effect state explicit?
- Are retries bounded, delayed, and idempotent?
- Can the system reconcile ambiguous commits?
- Does every fallback disclose missing capability or evidence?
- Is stable-state restoration verified before resuming?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
