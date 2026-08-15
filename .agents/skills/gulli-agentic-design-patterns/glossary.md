# Operational Glossary

This deduplicated glossary defines terms as used by this skill. It omits the source's repeated glossary and index and favors implementation meaning over model-history background.

## Core Terms

- **Agent**: A system that observes state, chooses bounded actions, and pursues an explicit goal through model and deterministic components.
- **Artifact**: A durable output such as a document, patch, dataset, or report, usually carrying schema and provenance.
- **Context**: Information supplied for the current decision. Context is not automatically memory, trusted evidence, or authority.
- **Context window**: The finite token capacity available to a model invocation, shared by instructions, inputs, tool results, and output.
- **Contract**: A machine- or human-checkable definition of inputs, outputs, errors, authority, and state transitions.
- **Grounding**: Connecting claims to attributable external evidence and preserving the relationship in the output.
- **Idempotency**: The property that repeating an operation with the same identity does not create an unintended additional effect.
- **Observation**: Structured evidence returned by a tool, environment, agent, or monitor after an action or query.
- **Prompt**: The versioned model-facing instructions, context, examples, and output requirements for one invocation.
- **Provenance**: Evidence of where information or an artifact came from and how it was transformed.
- **Trajectory**: The sequence of decisions, tool calls, observations, messages, and state transitions during a run.

## Pattern Boundaries

- **A2A**: Agent-to-agent interaction for delegating tasks and exchanging messages or artifacts across agent boundaries. Contrast with MCP.
- **Evaluation**: Independent measurement of behavior or outcomes. Contrast with Reflection, which uses criteria to repair an artifact.
- **Exception recovery**: Response to operational failure through retry, fallback, compensation, rollback, or escalation. It does not override policy denial.
- **Guardrail**: An enforced control that constrains unsafe input, context, decisions, tools, state, or output.
- **HITL**: Human-in-the-loop; a stateful handoff to an accountable person for a defined decision.
- **Memory**: Governed task, session, user, or durable state retained across decisions. Contrast with RAG, which retrieves external documentary evidence.
- **MCP**: Model Context Protocol; a capability boundary for discovering and invoking tools/resources through a host-client-server relationship.
- **Monitoring**: Ongoing collection and comparison of evidence against goals, budgets, thresholds, or production baselines.
- **Planning**: Discovering and revising a path toward a goal. Contrast with Prompt Chaining, which executes a known path.
- **Prioritization**: Ranking competing work. Contrast with Resource-Aware Optimization, which selects how much capacity or quality strategy to allocate.
- **RAG**: Retrieval-augmented generation; retrieval, ranking, and presentation of governed evidence to ground a model response.
- **Reflection**: Bounded critique and revision against explicit criteria and evidence.
- **Routing**: Selecting one destination among known alternatives. Routing does not grant authorization.
- **Tool**: A typed external capability for data, computation, or side effects whose execution is owned by trusted code.

## Control Terms

- **Budget**: An explicit limit for time, cost, tokens, retries, actions, or delegation depth.
- **Checkpoint**: A durable known state from which work can safely resume or recover.
- **Compensation**: A domain action that semantically counteracts a completed side effect when atomic rollback is unavailable.
- **Fallback**: A bounded alternative strategy selected for a classified failure or uncertainty state.
- **Quality floor**: The minimum acceptable result quality below which resource savings or graceful degradation are rejected.
- **Terminal state**: A defined end condition such as completed, failed, cancelled, denied, or escalated.

For selection guidance, use [SKILL.md](SKILL.md); for full pattern cards, use [patterns.md](patterns.md).
