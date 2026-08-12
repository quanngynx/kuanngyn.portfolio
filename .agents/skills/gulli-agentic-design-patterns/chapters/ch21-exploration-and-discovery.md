# Chapter 21: Exploration and Discovery

## Core Idea

Exploration seeks new information, hypotheses, strategies, or solution regions beyond a predefined optimum. Discovery requires novelty plus validation; generating unusual ideas alone is not discovery.

## Problem / Intent

Known workflows and local optimization cannot reveal unknown unknowns. Open-ended research, design, security, and strategy tasks need controlled exploration that balances novelty with evidence, safety, and resource budgets.

## When to Use

- The solution space is incomplete or rapidly changing.
- The objective is hypothesis generation or information-gap discovery.
- Experiments can evaluate candidates safely.
- Diverse evidence or approaches may uncover non-obvious options.
- Human experts remain available for consequential validation.

## When Not to Use

- A known solution or deterministic search already meets the goal.
- Experiments can cause uncontrolled harm or legal exposure.
- Novelty cannot be evaluated separately from plausibility.
- The system lacks budget, stopping criteria, or evidence capture.
- “Explore” is being used to authorize broad access or actions.

## Implementation Structure

1. Define domain, safety envelope, known evidence, and open questions.
2. Generate diverse candidate hypotheses or search directions.
3. Deduplicate and map candidate relationships.
4. Prioritize by novelty, plausibility, expected information gain, impact, and cost.
5. Design bounded tests or retrieval steps.
6. Evaluate results and update the hypothesis set.
7. Stop, escalate, or continue under explicit budgets.

```ts
type Hypothesis = {
  claim: string;
  priorEvidence: string[];
  novelty: number;
  plausibility: number;
  expectedInformationGain: number;
  testPlan: string;
  safetyClass: string;
};
```

## Worked Example: Product Opportunity Discovery

Generate candidate unmet needs from support data, market evidence, and user research. Cluster duplicates, rank by expected information gain and business impact, then test the top candidates through bounded interviews or prototypes. A novel narrative without corroborating evidence remains a hypothesis.

The source’s multi-agent scientific systems are historical illustrations. The reusable architecture is generate -> critique -> rank -> test -> evolve, with a human expert and safety controls around consequential research.

## Trade-offs

Exploration can uncover high-value options but consumes substantial compute, time, tools, and expert review. It also increases false-positive, novelty-bias, safety, and reproducibility risk.

## Failure Modes

- **Novelty theater**: unusual wording is mistaken for a new insight.
- **Plausibility bias**: persuasive hypotheses advance without evidence.
- **Search explosion**: candidates multiply without pruning or budget.
- **Confirmation loop**: retrieval seeks only evidence supporting a candidate.
- **Unsafe experimentation**: discovery goals bypass guardrails or authorization.
- **Negative-result loss**: failed tests are discarded and repeated.
- **Premature automation**: humans are removed from validation in high-impact domains.

## Pattern Interactions

- [Prioritization](ch20-prioritization.md): rank hypotheses and experiments by information gain, impact, and cost.
- [Resource-Aware Optimization](ch16-resource-aware-optimization.md): allocate test-time compute and exploration budget.
- [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md): separate generation, critique, ranking, and validation roles when evidence differs.
- [RAG](ch14-knowledge-retrieval-rag.md): ground prior evidence and identify gaps.
- Guardrails and HITL: constrain domains and require expert validation.
- Learning and Adaptation: retain negative and positive outcomes through governed promotion.

## Verification Checklist

- Are novelty, plausibility, and evidence evaluated separately?
- Is every experiment bounded by safety and authority?
- Are negative results retained?
- Are candidates deduplicated and pruned under a budget?
- Does a qualified human validate consequential discoveries?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
