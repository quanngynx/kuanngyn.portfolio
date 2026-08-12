---
name: gulli-agentic-design-patterns
description: "Decision-oriented knowledge base synthesized from \"Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems\" by Antonio Gulli. Use when choosing, composing, implementing, or reviewing prompt chains, tool-using agents, planners, and multi-agent systems."
---

<!-- argument-hint: [design problem, pattern name, or chapter number] -->

# Agentic Design Patterns

**Author**: Antonio Gulli | **Source**: extracted 482-page preprint | **Coverage**: foundations, 21 patterns, and deduplicated technical references | **Generated**: 2026-08-09

## Start With the Design Decision

Do not begin by choosing an agent framework. Classify the work first:

1. **Is the requested outcome achievable without external state or actions?**
   - Yes: a model call or deterministic program may be enough.
   - No: use [Tool Use](chapters/ch05-tool-use.md) to cross the model/system boundary.
2. **Is the sequence of work already known?**
   - Yes: use [Prompt Chaining](chapters/ch01-prompt-chaining.md) for dependent stages with explicit contracts.
   - No: use [Planning](chapters/ch06-planning.md) to discover and revise the sequence under constraints.
3. **Does one agent have the required context, authority, and capability?**
   - Yes: keep one agent unless another pattern creates a clear benefit.
   - No: use [Multi-Agent Collaboration](chapters/ch07-multi-agent-collaboration.md) to partition responsibility and define coordination.
4. **Can deterministic code replace an LLM decision?**
   - If a rule is stable and testable, encode it. Reserve model judgment for ambiguity, synthesis, and adaptation.

The patterns compose. A planner may produce a prompt chain, each step may call tools, and selected steps may be delegated to specialized agents. Composition increases failure surfaces, so add a pattern only when its intent is present.

Before adding a planner or another agent, check whether the missing control is simply [Routing](chapters/ch02-routing.md), [Parallelization](chapters/ch03-parallelization.md), or bounded [Reflection](chapters/ch04-reflection.md).

## Pattern Router

| Design pressure | Prefer | Avoid when | First artifact to define |
| --- | --- | --- | --- |
| One prompt carries too many dependent transformations | Prompt Chaining | Steps are independent or the path is unknown | Typed input/output contract per step |
| One of several known paths must be selected | Routing | The path must be invented rather than selected | Route taxonomy, fallback, and confidence policy |
| Independent work is creating avoidable latency | Parallelization | Operations share dependencies or unsafe mutable state | Dependency graph and join policy |
| An artifact needs evidence-based revision | Reflection | No objective criteria or revision budget exists | Rubric, evidence, and stopping condition |
| The model needs live data, precise computation, or side effects | Tool Use | A deterministic application can perform the whole task directly | Tool schema plus authorization policy |
| The goal is known but the path must be discovered or revised | Planning | The workflow is stable and repeatable | Goal, constraints, state, and replan triggers |
| Work requires distinct expertise, tools, context, or parallel ownership | Multi-Agent Collaboration | One bounded agent can do the work more simply | Role boundaries and message contracts |
| Task or user continuity must survive turns or sessions | Memory Management | Fresh authoritative data should be retrieved instead | Typed record, provenance, scope, and retention policy |
| Repeated evaluated outcomes should improve future runs | Learning and Adaptation | No trustworthy feedback or rollback exists | Versioned candidate update and evaluation gate |
| Capabilities must be reusable across hosts | MCP | A small fixed direct tool set is sufficient | Client/server trust and capability contracts |
| Progress and completion require evidence | Goal Setting and Monitoring | The operation has an immediate deterministic result | Goal, criteria, evidence, and terminal states |
| Operational failures must restore safe state | Exception Handling and Recovery | Prevention or input validation removes the failure | Failure taxonomy and recovery policy |
| A consequential decision requires accountable judgment | Human-in-the-Loop | Review adds no expertise or authority | Trigger, reviewer, evidence, and decision schema |
| Claims need current or private source grounding | RAG | Supplied context or structured query already suffices | Governed corpus and retrieval evaluation |
| Independent agents must delegate work across system boundaries | A2A | The capability is a tool/resource rather than an agent-owned task | Agent descriptor, task lifecycle, and artifact contract |
| Quality, latency, tokens, or cost must fit an explicit budget | Resource-Aware Optimization | No meaningful budget or strategy choice exists | Budget envelope and degradation policy |
| A problem needs deliberate search, verification, or computation | Reasoning Techniques | A direct deterministic operation is sufficient | Technique choice and inspectable evidence artifact |
| Unsafe inputs, actions, or outputs must be constrained | Guardrails | The control is only an operational recovery concern | Layered policy and enforcement points |
| Behavior must be measured over tasks and production traces | Evaluation and Monitoring | The objective or evidence is not defined | Evaluation dataset, metrics, and alert policy |
| Competing ready work must be ordered | Prioritization | Dependencies already determine the only valid order | Hard constraints and scoring policy |
| The task is to discover and test unknown possibilities | Exploration and Discovery | The answer is already known or only execution remains | Hypothesis and experiment pipeline |

For compact selection rules and failure diagnosis, read [cheatsheet.md](cheatsheet.md). For the complete reusable templates, read [patterns.md](patterns.md).

## Agent Capability Ladder

Use [Foundations](chapters/ch00-foundations.md) to choose the lowest sufficient level:

- **Level 0 — reasoning core**: model-only generation from supplied context.
- **Level 1 — connected problem-solver**: adds tools and retrieval.
- **Level 2 — strategic problem-solver**: adds context engineering, planning, adaptation, and feedback.
- **Level 3 — collaborative system**: adds specialized agents and explicit coordination.

Higher levels are not inherently better. Each level adds state, latency, cost, observability needs, and new ways to fail.

## Implementation Sequence

Apply this sequence before writing framework-specific code:

1. **Define success**: observable outcome, acceptance criteria, and stopping condition.
2. **Classify uncertainty**: unknown information, unknown action path, or uncertain evaluation.
3. **Draw boundaries**: what the model may decide, what deterministic code enforces, and what requires human approval.
4. **Design contracts**: typed step outputs, tool schemas, plan state, and agent messages.
5. **Design recovery**: validation, retries, re-planning, compensation, escalation, and budgets.
6. **Instrument decisions**: capture inputs, selected actions, tool results, state transitions, and final evidence.
7. **Test compositions**: verify each pattern alone before combining them.

## Available Chapter Index

| Chapter | Decision focus | Primary interactions |
| --- | --- | --- |
| [ch00](chapters/ch00-foundations.md) | Choose the lowest sufficient agent capability | All patterns |
| [ch01](chapters/ch01-prompt-chaining.md) | Decompose a known dependent workflow | Tool Use, Planning, Parallelization, Reflection |
| [ch02](chapters/ch02-routing.md) | Select among known paths | Tool Use, Multi-Agent Collaboration, Evaluation |
| [ch03](chapters/ch03-parallelization.md) | Run independent work concurrently | Multi-Agent Collaboration, Resource Optimization |
| [ch04](chapters/ch04-reflection.md) | Revise against criteria and evidence | Evaluation, Memory, Goal Monitoring |
| [ch05](chapters/ch05-tool-use.md) | Connect reasoning to data, computation, and actions | Chaining, Planning, Guardrails, Recovery |
| [ch06](chapters/ch06-planning.md) | Discover and adapt an action path | Tool Use, Chaining, Reflection, Monitoring |
| [ch07](chapters/ch07-multi-agent-collaboration.md) | Partition work across specialized agents | Planning, Parallelization, A2A, Evaluation |
| [ch08](chapters/ch08-memory-management.md) | Govern working, session, and durable memory | RAG, Reflection, Learning |
| [ch09](chapters/ch09-learning-and-adaptation.md) | Promote evaluated experience into future behavior | Memory, Evaluation, HITL |
| [ch10](chapters/ch10-model-context-protocol.md) | Standardize capability discovery and transport | Tool Use, Routing, Guardrails |
| [ch11](chapters/ch11-goal-setting-and-monitoring.md) | Define progress, evidence, and terminal states | Planning, Reflection, Monitoring |
| [ch12](chapters/ch12-exception-handling-and-recovery.md) | Classify failure and restore safe state | Guardrails, Tool Use, HITL |
| [ch13](chapters/ch13-human-in-the-loop.md) | Insert accountable human judgment | Guardrails, Recovery, Learning |
| [ch14](chapters/ch14-knowledge-retrieval-rag.md) | Ground claims in governed external evidence | Memory, Routing, Evaluation |
| [ch15](chapters/ch15-inter-agent-communication-a2a.md) | Delegate tasks across interoperable agent boundaries | Multi-Agent, MCP, Recovery |
| [ch16](chapters/ch16-resource-aware-optimization.md) | Select execution strategy under explicit budgets | Prioritization, Routing, Parallelization |
| [ch17](chapters/ch17-reasoning-techniques.md) | Match deliberate reasoning structure to problem shape | Planning, Reflection, Tools |
| [ch18](chapters/ch18-guardrails-safety-patterns.md) | Enforce layered safety and authority boundaries | Recovery, HITL, Tool Use |
| [ch19](chapters/ch19-evaluation-and-monitoring.md) | Measure task, trajectory, resource, and production behavior | Reflection, Goals, Learning |
| [ch20](chapters/ch20-prioritization.md) | Rank competing work after hard constraints | Resource Optimization, Planning |
| [ch21](chapters/ch21-exploration-and-discovery.md) | Generate and test hypotheses under evidence and safety controls | Prioritization, RAG, HITL |

## Technical Reference Index

Use these after the router identifies the relevant pattern:

| Reference | Use for |
| --- | --- |
| [ch22](chapters/ch22-advanced-prompting.md) | Prompt contracts, examples, structured outputs, and prompt evaluation |
| [ch23](chapters/ch23-agent-environment-interactions.md) | GUI, multimodal, sensor, and physical perception-action boundaries |
| [ch24](chapters/ch24-agentic-framework-selection.md) | Selecting chain, graph, orchestration, retrieval, or managed abstractions |
| [ch25](chapters/ch25-enterprise-agent-platforms.md) | Evaluating managed enterprise knowledge/action platforms |
| [ch26](chapters/ch26-cli-agents.md) | Operating repository-aware command-line agents safely |
| [ch27](chapters/ch27-coding-agent-teams.md) | Structuring implementation, test, review, documentation, and integration roles |
| [Glossary](glossary.md) | Resolve operational terminology and adjacent-pattern boundaries |

## Topic Index

- **Agent capability levels** -> [ch00](chapters/ch00-foundations.md)
- **Context engineering** -> [ch00](chapters/ch00-foundations.md), [ch01](chapters/ch01-prompt-chaining.md)
- **Function calling and tools** -> [ch05](chapters/ch05-tool-use.md)
- **Conditional dispatch and triage** -> [ch02](chapters/ch02-routing.md)
- **Concurrent fan-out/fan-in** -> [ch03](chapters/ch03-parallelization.md)
- **Critique and revision loops** -> [ch04](chapters/ch04-reflection.md)
- **Known workflow decomposition** -> [ch01](chapters/ch01-prompt-chaining.md)
- **Plan adaptation and re-planning** -> [ch06](chapters/ch06-planning.md)
- **Memory, session state, and retention** -> [ch08](chapters/ch08-memory-management.md)
- **Learning and governed adaptation** -> [ch09](chapters/ch09-learning-and-adaptation.md)
- **MCP capability servers** -> [ch10](chapters/ch10-model-context-protocol.md)
- **Goals, progress, and terminal states** -> [ch11](chapters/ch11-goal-setting-and-monitoring.md)
- **Retries, rollback, compensation, and recovery** -> [ch12](chapters/ch12-exception-handling-and-recovery.md)
- **Human approval and escalation** -> [ch13](chapters/ch13-human-in-the-loop.md)
- **RAG, grounding, and citations** -> [ch14](chapters/ch14-knowledge-retrieval-rag.md)
- **Agent-to-agent tasks, messages, and artifacts** -> [ch15](chapters/ch15-inter-agent-communication-a2a.md)
- **Cost, latency, token, and quality budgets** -> [ch16](chapters/ch16-resource-aware-optimization.md)
- **Reasoning search, decomposition, and verification** -> [ch17](chapters/ch17-reasoning-techniques.md)
- **Safety layers and least privilege** -> [ch18](chapters/ch18-guardrails-safety-patterns.md)
- **Offline evaluation, trajectories, monitoring, and drift** -> [ch19](chapters/ch19-evaluation-and-monitoring.md)
- **Urgency, impact, dependencies, and queue ordering** -> [ch20](chapters/ch20-prioritization.md)
- **Hypothesis generation and bounded experiments** -> [ch21](chapters/ch21-exploration-and-discovery.md)
- **Prompt contracts and few-shot examples** -> [ch22](chapters/ch22-advanced-prompting.md)
- **GUI, multimodal, and physical interaction** -> [ch23](chapters/ch23-agent-environment-interactions.md)
- **Framework and platform selection** -> [ch24](chapters/ch24-agentic-framework-selection.md), [ch25](chapters/ch25-enterprise-agent-platforms.md)
- **CLI and coding-agent workflows** -> [ch26](chapters/ch26-cli-agents.md), [ch27](chapters/ch27-coding-agent-teams.md)
- **Role specialization and coordination topology** -> [ch07](chapters/ch07-multi-agent-collaboration.md)
- **Structured intermediate outputs** -> [ch01](chapters/ch01-prompt-chaining.md), [ch05](chapters/ch05-tool-use.md)

## Scope and Source Quality

This skill synthesizes the extracted corpus rather than reproducing it. Framework, model, API, benchmark, and platform references are historical examples unless independently verified as current. The source preprint lists Appendix F but does not contain it, and duplicates Appendix G, the glossary, and the index; this skill does not invent or duplicate that material.
