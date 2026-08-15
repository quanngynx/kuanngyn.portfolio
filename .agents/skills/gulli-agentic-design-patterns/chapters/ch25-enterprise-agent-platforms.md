# Chapter 25: Enterprise Agent Platforms

## Intent

Evaluate no-code or managed enterprise agent platforms as governed integration products: identity, retrieval, actions, observability, and lifecycle matter more than the prompt-builder UI.

## When to Use

- Business teams need governed access to enterprise search and bounded workflows.
- Existing identity, data connectors, and operational controls can be reused.
- A managed deployment model matches compliance and ownership constraints.

## When Not to Use

- The platform cannot express required state transitions or authorization rules.
- Data residency, audit, portability, or cost requirements are not met.
- A simple search application or deterministic workflow is sufficient.

## Capability Map

Assess each layer separately:

1. **Identity and tenancy**: user identity, role mapping, delegation, service accounts.
2. **Knowledge**: connectors, indexing, access-control propagation, freshness, citations.
3. **Actions**: tool schemas, least privilege, approval, idempotency, compensation.
4. **Orchestration**: workflow, agent delegation, pause/resume, protocol boundaries.
5. **Experience**: chat, web, embedded interface, accessibility, user feedback.
6. **Operations**: tracing, evaluation, analytics, quotas, incident response, deletion.

## Adoption Spike

Use one realistic workflow containing private retrieval, an external action, a human approval, and a recoverable failure. Verify that source permissions flow through retrieval; the action executes under the correct identity; the trace explains decisions; and state can be exported or reconciled.

Google Agentspace and the UI steps described in the source are historical platform examples. Product naming, connectors, features, and setup procedures must be verified independently before use.

## Trade-offs

Managed platforms shorten integration and deployment time but can couple data, prompts, identity, and operations to one vendor. No-code interfaces broaden access while making review, version control, testing, and separation of duties more important.

## Failure Modes

- Connector availability mistaken for correct authorization propagation.
- Agent prompt treated as an enforceable enterprise policy.
- Analytics measuring usage but not outcome quality or safety.
- Sensitive data indexed without retention and deletion controls.
- Multi-agent features adopted without explicit ownership or lifecycle semantics.
- No export, replay, or migration path.

## Pattern Interactions

- [RAG](ch14-knowledge-retrieval-rag.md): governs enterprise knowledge and citations.
- [MCP](ch10-model-context-protocol.md) and [A2A](ch15-inter-agent-communication-a2a.md): separate capabilities from task delegation.
- [Guardrails](ch18-guardrails-safety-patterns.md): enforce identity, policy, and tool boundaries.
- [Evaluation](ch19-evaluation-and-monitoring.md): measures quality beyond adoption analytics.
- [Framework Selection](ch24-agentic-framework-selection.md): compares managed platform and custom implementation trade-offs.

## Verification Checklist

- [ ] Identity and source permissions survive retrieval and action boundaries.
- [ ] High-impact actions have authorization, approval, and recovery contracts.
- [ ] Prompts, configurations, and evaluations are versioned.
- [ ] Audit, deletion, incident response, and data residency are acceptable.
- [ ] Portability and exit costs are documented.
