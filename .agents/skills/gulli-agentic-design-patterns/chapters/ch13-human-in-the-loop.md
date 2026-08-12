# Chapter 13: Human-in-the-Loop

## Core Idea

Human-in-the-Loop (HITL) assigns defined judgment, approval, correction, or escalation decisions to accountable people. A human checkpoint is effective only when the reviewer receives sufficient context, authority, time, and a clear decision contract.

## Problem / Intent

Some decisions involve ambiguity, ethics, expertise, legal accountability, or impact that automation should not own. HITL combines scalable machine processing with human responsibility at explicit boundaries.

## When to Use

- Actions are irreversible, high-impact, regulated, or weakly specified.
- Confidence is low and the cost of error is high.
- Nuanced policy, empathy, creativity, or domain judgment is required.
- Human feedback will label data or approve a governed improvement.
- An exception or conflict exceeds automated authority.

## When Not to Use

- The review adds no expertise or authority.
- Volume or latency makes the checkpoint operationally impossible.
- Sensitive data cannot be exposed safely to the reviewer.
- A deterministic policy can resolve the decision consistently.
- “Human review” is used to shift responsibility without usable evidence.

## Implementation Structure

```ts
type ReviewRequest = {
  decisionId: string;
  action: string;
  impact: string;
  evidence: string[];
  alternatives: string[];
  policyContext: string[];
  expiresAt: string;
};

type ReviewDecision = {
  decision: "approve" | "reject" | "modify" | "request_information";
  reviewerId: string;
  rationale: string;
  decidedAt: string;
};
```

1. Define triggers and the human role that owns each decision.
2. Pause before the consequential boundary.
3. Present evidence, uncertainty, alternatives, and impact.
4. Authenticate the reviewer and capture a structured decision.
5. Revalidate state before execution; approvals can become stale.
6. Record action and outcome for audit and improvement.

## HITL Versus Guardrails

Guardrails encode constraints the system can enforce consistently. HITL resolves decisions that require accountable judgment inside those constraints. Humans should not be asked to waive hard safety boundaries through an informal approval prompt.

**Human-on-the-loop** is appropriate when people define policy and monitor automation while immediate low-risk actions proceed automatically. Use in-loop approval when a particular action must pause.

## Worked Example: High-Value Refund

The agent gathers order history, policy, prior actions, and proposed refund. A policy guardrail blocks amounts above the agent’s authority. A trained reviewer receives the evidence and chooses approve, reject, modify, or request more information. Before issuing the refund, trusted code rechecks order state and authorization.

## Trade-offs

HITL improves accountability and judgment but creates queues, latency, staffing, training, privacy, and consistency challenges. Human decisions can also be biased or wrong and require quality monitoring.

## Failure Modes

- **Approval theater**: reviewers click approve without sufficient context or time.
- **Unbounded escalation**: no triage, priority, or service-level expectation exists.
- **Stale approval**: underlying state changes before execution.
- **Privacy leakage**: reviewers see unnecessary sensitive data.
- **Authority ambiguity**: the reviewer cannot legally or operationally own the decision.
- **Automation bias**: the recommendation anchors human judgment.
- **Feedback misuse**: one reviewer correction becomes general policy without evaluation.

## Pattern Interactions

- Guardrails: enforce hard constraints and decide which cases require people.
- [Exception Handling](ch12-exception-handling-and-recovery.md): escalate exhausted, ambiguous, or high-impact recovery.
- [Planning](ch06-planning.md): approve consequential plans or changed constraints.
- [Reflection](ch04-reflection.md): human critique can guide bounded revision.
- Learning and Adaptation: aggregate reviewed outcomes through governed evaluation before promotion.

## Verification Checklist

- Does each trigger name a qualified, accountable reviewer role?
- Is the decision request concise, evidence-rich, and privacy-minimized?
- Are approval expiry and state revalidation defined?
- Can reviewers reject, modify, or request information—not only approve?
- Are queue health and reviewer consistency monitored?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
