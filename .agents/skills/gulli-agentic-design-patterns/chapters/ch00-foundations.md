# Foundations: Choose the Lowest Sufficient Agent Capability

## Core Idea

An agent is not merely an LLM with a persona. It is a goal-directed system that observes relevant state, chooses or follows actions, acts through bounded capabilities, and uses outcomes to continue, adapt, or stop. Add capability only when the problem requires it.

## Problem / Intent

Agent designs often begin with a framework or an ambition for autonomy. The more useful starting point is the gap between the desired outcome and what a bounded model call can accomplish. The capability ladder makes that gap explicit and prevents accidental complexity.

## The Operating Loop

The source presents a five-stage loop. For implementation, express it as state transitions:

1. **Mission**: normalize the goal, constraints, and success condition.
2. **Observe**: acquire only the state needed for the next decision.
3. **Think**: select a known action or construct a plan.
4. **Act**: execute through tools or delegated components.
5. **Learn**: evaluate the observation and update state, policy, memory, or the plan.

“Learn” does not require model training. It can mean recording an outcome, updating working memory, changing a later step, or asking for human correction.

## Capability Ladder

| Level | Adds | Use when | Do not use when |
| --- | --- | --- | --- |
| **0 — Reasoning core** | Generation from supplied context | Explanation, classification, synthesis, drafting | The answer requires live/private data or side effects |
| **1 — Connected problem-solver** | Retrieval and tools | Current information, precise computation, external actions | The model does not need to choose the operation |
| **2 — Strategic problem-solver** | Context engineering, planning, adaptation | The route is uncertain or observations change the route | A fixed workflow already solves the problem |
| **3 — Collaborative system** | Specialized agents and coordination | Distinct expertise, tools, authority, or parallel ownership | One bounded agent can do the work more simply |

## Context Is Part of the Architecture

Context engineering is broader than prompt wording. It selects and packages system rules, retrieved evidence, tool observations, user state, history, and environmental state for a particular decision. Treat context as a budgeted data product:

- Include information that can change the next decision.
- Preserve provenance for claims and actions.
- Summarize or discard stale state.
- Keep authorization rules outside model-editable context.
- Avoid passing the entire transcript when a typed state object is sufficient.

## Implementation Structure

Define these boundaries before choosing a framework:

```text
Goal -> Orchestrator -> Decision component -> Proposed action
                  |                         |
                  v                         v
             Trusted state <- Observation <- Controlled executor
```

- **Orchestrator** owns state transitions, budgets, and stopping.
- **Decision component** may be an LLM, deterministic rule, planner, or agent.
- **Controlled executor** owns authorization and side effects.
- **Trusted state** records observations and evidence, not just conversation text.

## Worked Example: Scheduling Assistant

A request to “organize my schedule” can be implemented at several levels:

- Level 0 drafts a proposed agenda from supplied events.
- Level 1 reads calendars and suggests open slots through tools.
- Level 2 reconciles constraints, proposes alternatives when a slot disappears, and requests approval before booking.
- Level 3 delegates availability, travel, and participant coordination to bounded specialists, then gives one coordinator authority to synthesize the proposal.

The correct level depends on the required data, uncertainty, and authority—not on how impressive the architecture appears.

## Failure Modes

- **Agent by naming**: a prompt calls a model an “agent,” but no state/action loop exists.
- **Autonomy without authority design**: the model can propose and execute consequential actions through the same boundary.
- **Context dumping**: every available document and message is sent to every decision.
- **Capability inflation**: planning or multiple agents are added to a known deterministic workflow.
- **Learning theater**: the system claims adaptation but does not persist or apply outcomes.
- **No stop condition**: the loop continues because success is not represented in state.

## Pattern Interactions

- Use [Prompt Chaining](ch01-prompt-chaining.md) when the route is known and dependent.
- Use [Tool Use](ch05-tool-use.md) to cross into external data, computation, or actions.
- Use [Planning](ch06-planning.md) when the route must be discovered or revised.
- Use [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md) when responsibility must be partitioned.
- Return to the [master router](../SKILL.md) when a lower capability level may suffice.

## Verification Checklist

- Is success observable and represented in state?
- Is every external action executed by trusted code?
- Can the system explain why its capability level is necessary?
- Are context, authority, retries, and stopping bounded?
- Can each added pattern be tested independently?
