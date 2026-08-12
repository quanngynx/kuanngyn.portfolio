# Agentic Pattern Decision Cheatsheet

## Select the Smallest Sufficient Pattern

| Design signal | Prefer | Avoid when / warning |
| --- | --- | --- |
| Known dependent transformations | Prompt Chaining | Independent work or unknown path |
| One known destination must be selected | Routing | Stable rules suffice; low confidence has no fallback |
| Independent work dominates latency | Parallelization | Shared mutation, dependencies, unbounded fan-out |
| Artifact needs evidence-based repair | Reflection | No rubric, evidence, or revision budget |
| Live data, computation, or effects are needed | Tool Use | Broad authority or deterministic code suffices |
| Goal is clear but path is uncertain | Planning | Stable workflow or missing completion test |
| Real expertise, context, tools, or authority differ | Multi-Agent | Roles are only personas |
| Continuity must persist | Memory | Fresh authoritative retrieval is required |
| Evaluated experience should improve future runs | Learning | No baseline, gate, or rollback |
| Capabilities must be reusable across hosts | MCP | Direct functions are simpler |
| Progress needs evidence and terminal states | Goal Monitoring | Immediate deterministic result |
| Operational failure must restore safe state | Recovery | Prevention removes the problem |
| Accountable judgment is required | HITL | Review adds no authority or expertise |
| Claims need governed evidence | RAG | Supplied context or query suffices |
| Agents delegate across system boundaries | A2A | A tool, queue, or MCP resource suffices |
| Quality must fit resource budgets | Resource Optimization | No budget or quality floor |
| Deliberate search or computation is checkable | Reasoning | Direct deterministic execution suffices |
| Unsafe content or action must be constrained | Guardrails | Concern is only operational recovery |
| Behavior must be measured or monitored | Evaluation | Success is unobservable |
| Competing ready work needs ordering | Prioritization | Dependencies determine the order |
| Valuable alternatives are unknown | Exploration | A known answer only needs execution |

## Composition Rules

1. Start with deterministic code and a typed state model.
2. Add Chaining for known dependencies; Parallelization for independent branches.
3. Add Routing before a planner when destinations are already known.
4. Add Tools only at external capability boundaries.
5. Add Planning only where observations can change the path.
6. Add multiple agents only when role boundaries repay coordination cost.
7. Apply Guardrails across every boundary; use Recovery for operational failure and HITL for bounded judgment.
8. Instrument goals and trajectories before enabling adaptation.

## Adjacent Concepts

| Pair | Distinction |
| --- | --- |
| Routing / Tool Use | Routing selects; Tool Use executes under authorization. |
| Parallelization / Multi-Agent | Concurrency is timing; multi-agent is responsibility. |
| Reflection / Evaluation | Reflection repairs; Evaluation measures independently. |
| Planning / Goal Monitoring | Planning chooses actions; monitoring judges progress. |
| Memory / RAG | Memory preserves continuity; RAG supplies documentary evidence. |
| Recovery / Guardrails | Recovery responds to failure; Guardrails enforce policy. |
| HITL / Guardrails | Humans judge inside hard constraints, not around them. |
| Prioritization / Resource Optimization | Priority chooses what first; optimization chooses resources. |

## Failure Diagnosis

| Symptom | Corrective move |
| --- | --- |
| Bad intermediate becomes confident output | Validate and stop or repair before forwarding. |
| Agent repeats an external action | Tool call lacks idempotency or execution identity; add request IDs and reconciliation. |
| Route reaches the wrong capability | Clarify taxonomy; add confidence fallback and escalation. |
| Parallel results cannot combine | Define snapshots, result schemas, and partial-failure join policy. |
| Planner stays busy without finishing | Bind steps and completion to evidence and budgets. |
| Retry follows policy rejection | Make denial terminal or route to authorized review. |
| Reflection changes style, not correctness | Add an evidence-based rubric and regression checks. |
| Offline score rises while production falls | Refresh cases; monitor live slices, trajectories, and drift. |

## Practical Defaults

- Structured data between components; prose only at required boundaries.
- Model proposals remain separate from trusted execution.
- Persist state transitions and evidence, not hidden assumptions.
- Bound retries, actions, planning iterations, concurrency, and delegation.
Read the [master router](SKILL.md), [pattern catalog](patterns.md), or [operational glossary](glossary.md).
