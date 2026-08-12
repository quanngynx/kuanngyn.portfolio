# Chapter 5: Tool Use (Function Calling)

## Core Idea

Tool Use connects model judgment to external data, deterministic computation, and real actions. The model should propose a structured call; trusted orchestration should validate, authorize, execute, and return a bounded observation.

## Problem / Intent

An LLM’s internal knowledge can be stale, incomplete, or unsuitable for precise computation. It also cannot change external state by generating text. Tools bridge that gap without granting the model direct, unbounded system access.

## When to Use

- Retrieve current or private information.
- Query databases or specialized search systems.
- Perform exact calculations or sandboxed code execution.
- Send messages, update records, or operate devices and services.
- Delegate a bounded capability to a specialist agent.

## When Not to Use

- The answer can be produced from supplied context.
- Deterministic code already knows which operation to run.
- The action lacks an authorization model, audit trail, timeout, or safe failure policy.
- A broad shell/database/API tool would expose more authority than the task needs.

## Implementation Structure

The source’s six-stage sequence becomes a trust-boundary protocol:

1. **Define** a narrow tool with typed arguments and a structured result.
2. **Select**: the model proposes a tool name and arguments.
3. **Validate** arguments against schema and domain constraints.
4. **Authorize** against user, tenant, resource, and action policy.
5. **Execute** with timeout, idempotency, and isolation where needed.
6. **Observe**: return data or a typed error for the next decision.

```ts
type ToolResult<T> =
  | { status: "success"; data: T; evidence?: string[] }
  | { status: "rejected"; reason: string }
  | { status: "failed"; code: string; retryable: boolean };

type Tool<I, O> = {
  name: string;
  description: string;
  inputSchema: unknown;
  authorize(actor: Actor, input: I): Promise<boolean>;
  execute(input: I, requestId: string): Promise<ToolResult<O>>;
};
```

The model sees the description and schema. It does not own credentials, authorization, transaction boundaries, or the actual function dispatch.

## Tool Design Rules

- Give each tool one bounded capability and a precise action-oriented name.
- Describe when to call it and when not to call it.
- Use enums, identifiers, units, and required fields to reduce argument ambiguity.
- Return clean domain data; do not hide failures inside friendly prose.
- Separate read tools from write tools and low-impact actions from consequential actions.
- Require confirmation or human approval before irreversible or high-impact operations.
- Treat tool output as untrusted input when it can contain user or third-party content.
- Attach provenance, timestamps, and request IDs when freshness or auditability matters.

## Worked Example: Inventory and Purchase Assistant

A user asks whether an item is available and, if so, to buy it.

1. The model proposes `get_inventory({ productId })`.
2. Orchestration validates the identifier and executes a read-only tool.
3. The observation returns quantity, price, currency, and `observedAt`.
4. The model prepares a purchase proposal but cannot execute it yet.
5. Trusted code checks user identity, price limits, and explicit confirmation.
6. `create_order({ productId, quantity, quotedPrice })` executes with an idempotency key.
7. The final response reports the recorded order result, not an assumed success.

This combines a read tool, a human/policy boundary, and a write tool without giving the model raw API access.

## Trade-offs

**Benefits**:

- Current, verifiable information.
- Precise computation and specialized capabilities.
- Ability to complete real workflows rather than only describe them.

**Costs**:

- Security, privacy, and authorization obligations.
- External latency, availability, quotas, and cost.
- Side-effect recovery and audit requirements.
- Larger prompt and routing surface as the tool catalog grows.

## Failure Modes

- **Over-broad capability**: one tool exposes arbitrary SQL, shell commands, or unrestricted HTTP.
- **Schema ambiguity**: units, identifiers, defaults, or required fields are unclear.
- **Hallucinated success**: the agent reports completion before receiving a success observation.
- **Repeated side effects**: retries execute the same write twice.
- **Prompt injection through observations**: retrieved content is treated as trusted instruction.
- **Tool loops**: the agent repeatedly calls tools without progress or a budget.
- **Error-as-data confusion**: a failure string is interpreted as a valid result.
- **Authority collapse**: tool selection and authorization are both delegated to the model.

## Pattern Interactions

- [Prompt Chaining](ch01-prompt-chaining.md): order dependent tool calls and validate each observation.
- [Planning](ch06-planning.md): choose tools dynamically and re-plan after failures or new facts.
- [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md): expose a specialist agent as a narrow tool instead of sharing its entire internal context.
- Guardrails: constrain arguments, resources, destinations, and permitted actions.
- Exception Handling: classify retryable failures, compensation, and escalation.
- Memory: persist stable facts and execution state without caching stale live data indefinitely.

## Verification Checklist

- Can trusted code reject every proposed call before execution?
- Are write operations idempotent or compensatable?
- Are results structured, timestamped, and distinguishable from errors?
- Can untrusted tool output influence instructions or permissions?
- Are tool-call count, duration, and cost bounded?
- Does the final claim reflect an observed execution result?

See [patterns.md](../patterns.md) for the compact catalog and [cheatsheet.md](../cheatsheet.md) for failure diagnosis.
