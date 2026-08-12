# Chapter 18: Guardrails and Safety Patterns

## Core Idea

Guardrails are layered controls that constrain inputs, decisions, tools, state transitions, and outputs. Prompts can communicate policy, but trusted enforcement must live outside model-editable text.

## Problem / Intent

Autonomous systems can process malicious input, expose data, choose unsafe tools, violate policy, or produce harmful output. Guardrails reduce likelihood and impact through defense in depth.

## When to Use

- An agent interacts with users, sensitive data, tools, or external systems.
- Outputs can cause financial, safety, legal, privacy, or reputational harm.
- Untrusted retrieved content may influence decisions.
- Regulations or organizational policy define hard constraints.
- High-impact actions need approval or least-privilege authority.

## When Not to Use

- Never omit guardrails solely because the agent is internal or experimental.
- Do not use a generic moderation model where a deterministic domain constraint is available.
- Do not treat a system prompt as sufficient enforcement.
- Do not use human review to waive non-negotiable safety invariants informally.

## Implementation Structure

1. Threat-model assets, actors, entry points, actions, and failure impact.
2. Validate and normalize input before model processing.
3. Separate trusted instructions from untrusted data.
4. Restrict available tools, arguments, resources, and destinations.
5. Enforce authorization and invariants before state changes.
6. Validate outputs and claims before release.
7. Escalate defined cases to qualified humans.
8. Monitor violations, false positives, drift, and bypass attempts.

## Defense Layers

| Layer | Examples |
| --- | --- |
| Input | Schema validation, size limits, injection isolation, content policy |
| Context | Provenance, access filtering, trusted/untrusted separation |
| Decision | Allowed routes, budgets, confidence thresholds, policy checks |
| Tool | Least privilege, allowlists, argument constraints, sandboxing |
| State | Invariants, transaction boundaries, approval gates |
| Output | Grounding, sensitive-data filtering, domain disclaimers, moderation |
| Operations | Logging, anomaly detection, incident response, rollback |

## Guardrails Versus Recovery and HITL

- [Exception Handling](ch12-exception-handling-and-recovery.md) restores stability after operational failure; it must not retry around policy rejection.
- [HITL](ch13-human-in-the-loop.md) provides accountable judgment for defined cases; hard constraints remain enforced.
- Checkpoints and rollback improve recovery but do not prevent unauthorized action.

## Worked Example: Email Agent

Treat email content as untrusted data. The agent can draft messages but may send only to authorized recipients. Trusted code validates addresses, attachment sensitivity, user approval, and rate limits. Tool results record message identity. Output filters prevent secret leakage. High-risk recipients require human approval.

## Trade-offs

Guardrails reduce risk but add latency, false positives, maintenance, and user friction. Excessively broad restrictions can make the system unusable; narrow evidence-based controls are easier to test and explain.

## Failure Modes

- **Prompt-only policy**: model instructions are treated as enforcement.
- **Single-filter defense**: one moderator guards every risk type.
- **Confused deputy**: authorized tools act on untrusted instructions.
- **Least-privilege drift**: capabilities accumulate over time.
- **Guardrail mismatch**: controls protect output text but not side effects.
- **Policy retry**: rejection is reframed until a model approves it.
- **Silent blocking**: users receive no safe explanation or escalation path.

## Pattern Interactions

- [Exception Handling](ch12-exception-handling-and-recovery.md): operational recovery must respect policy decisions.
- [Human-in-the-Loop](ch13-human-in-the-loop.md): approve bounded high-impact cases inside hard constraints.
- [Tool Use](ch05-tool-use.md): enforce least privilege, authorization, and idempotency.
- RAG and Memory: filter access before retrieval and validate writes before persistence.
- Evaluation and Monitoring: continuously test attacks, false positives, drift, and control coverage.

## Verification Checklist

- Are enforcement controls outside model-editable context?
- Does each high-impact tool have least privilege and authorization?
- Are policy rejection and operational failure distinct?
- Are retrieval, memory, and side effects protected—not only final text?
- Are guardrail effectiveness and false positives monitored?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
