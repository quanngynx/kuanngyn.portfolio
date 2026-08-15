# Chapter 24: Agentic Framework Selection

## Intent

Choose implementation machinery from required control-flow and operational properties after the pattern design is clear. A framework is a delivery choice, not the architecture.

## Start With Requirements

Classify the system before comparing products:

| Requirement | Useful abstraction |
| --- | --- |
| Known linear transformations | Pipeline or chain |
| Independent branches and explicit join | DAG/workflow engine |
| Cycles, conditional edges, durable state | State graph or state machine |
| Specialist roles and task delegation | Multi-agent orchestrator |
| Retrieval-heavy data application | Indexing/retrieval framework |
| Enterprise plugins and conventional code | SDK with typed functions/connectors |

Then evaluate durability, checkpoints, human pauses, tracing, replay, idempotency, deployment model, security, portability, testing, and lock-in.

## When to Use a Framework

- It supplies required state, lifecycle, integration, or observability primitives.
- Its abstraction matches the workflow and reduces tested code you would otherwise own.
- The team can inspect, operate, and migrate the resulting system.

## When Not to Use One

- A few ordinary functions and a queue solve the workflow clearly.
- The framework hides state transitions or authorization that must be auditable.
- Selection is based on product popularity rather than requirements.

## Evaluation Spike

1. Express the same representative workflow in the smallest plausible candidates.
2. Include a tool failure, retry, human pause, resume, and partial branch failure.
3. Measure implementation complexity, trace quality, state recovery, latency, and cost.
4. Review dependency surface, licensing, release cadence, and exit strategy.
5. Record an architecture decision with rejected alternatives and migration triggers.

LangChain, LangGraph, Google ADK, CrewAI, AutoGen, LlamaIndex, Haystack, MetaGPT, SuperAGI, Semantic Kernel, and Strands Agents appear in the source as historical examples of different abstraction levels. Their current APIs and capabilities must be verified independently before implementation.

## Trade-offs

Higher-level systems accelerate common cases but constrain control and portability. Low-level libraries expose state and execution clearly but require more orchestration, persistence, and observability work. Explicit graphs make transitions inspectable; role-oriented systems can simplify delegation but may obscure emergent conversational paths.

## Failure Modes

- Framework-first architecture that adds unnecessary agents or loops.
- Assuming built-in persistence implies correct domain recovery.
- Business state embedded only in framework messages.
- Vendor examples copied without version or security verification.
- No escape hatch from proprietary tool, memory, or deployment formats.
- Comparing happy-path demos instead of failure and resume behavior.

## Pattern Interactions

- [Prompt Chaining](ch01-prompt-chaining.md), [Parallelization](ch03-parallelization.md), and [Planning](ch06-planning.md) determine control-flow needs.
- [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md) defines roles before an orchestrator implements them.
- [MCP](ch10-model-context-protocol.md) and [A2A](ch15-inter-agent-communication-a2a.md) define interoperability boundaries.
- [Evaluation](ch19-evaluation-and-monitoring.md) validates that framework choice improves the actual system.

## Verification Checklist

- [ ] Patterns and state transitions are defined independently of products.
- [ ] The candidate supports failure, pause, resume, and replay requirements.
- [ ] Framework state is separated from authoritative domain state.
- [ ] Current APIs, security posture, and licensing are verified before adoption.
- [ ] An exit strategy and migration trigger are documented.
