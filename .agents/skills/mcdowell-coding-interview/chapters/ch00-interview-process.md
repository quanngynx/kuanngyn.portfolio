# Chapter 0: Interview Process

## Core Idea

Technical interviews evaluate a bundle of signals—problem solving, coding, fundamentals, testing, and communication—rather than a binary count of correct answers. Use this chapter to understand what evidence your behavior creates.

## Evaluation Dimensions

| Dimension | Evidence to produce | Weak signal |
| --- | --- | --- |
| Problem solving | Clarified contract, useful example, baseline, systematic optimization | Guessing a memorized trick |
| Coding | Correct structure, readable names, modular logic, controlled mutation | Syntax-first implementation |
| Technical foundation | Accurate complexity and data-structure trade-offs | Unsupported claims |
| Verification | Walkthrough, edge cases, correction discipline | “It should work” |
| Communication | Assumptions and decisions are observable | Silence or unstructured narration |

Performance is relative to problem difficulty, assistance needed, solution quality, and other candidates—not merely whether the final output is correct.

## Interviewer and Candidate Responsibilities

### Candidate

1. Restate the problem and surface ambiguity.
2. Use hints as new evidence rather than as failure.
3. Explain the correctness and complexity of each meaningful approach.
4. Make corrections explicitly and recheck affected invariants.
5. Keep the interviewer able to follow progress.

### Interviewer

Interviewers may guide, challenge assumptions, change constraints, or ask follow-ups. Their level of involvement varies. A prompt or hint often tests adaptation: pause, incorporate it, and say what changes.

## Behind-the-Scenes Mental Model

The source describes several company processes, but those details are historical and may no longer be current. The reusable lesson is that feedback is aggregated across multiple interviews and dimensions. One difficult round or one mistake is not automatically decisive; repeated weak evidence across dimensions is more damaging.

Do not optimize for a rumored company script. Optimize for durable evidence:

- clear technical reasoning;
- command of fundamentals;
- honest handling of prior exposure;
- collaborative response to guidance;
- code and tests that match the stated contract.

## Special Situations

| Situation | Adjustment |
| --- | --- |
| Experienced candidate | Connect decisions to real systems, ownership, trade-offs, and lessons without avoiding fundamentals. |
| Tester/SDET | Emphasize test design, failure isolation, automation judgment, and communication with developers. |
| Product/program role | Clarify users, requirements, prioritization, metrics, and cross-functional decisions alongside technical depth. |
| Engineering manager/lead | Show architecture, delegation, conflict handling, quality systems, and multi-level communication. |
| Startup | Expect breadth, ambiguity, product judgment, and resource constraints. |
| Interviewer role | Standardize evaluation criteria and avoid leading candidates toward a preferred personal style. |

## Common Mistakes

- Treating every prompt as a hidden trivia test.
- Concealing that a question was seen before.
- Interpreting a hint as proof of failure and becoming defensive.
- Optimizing for speed while losing correctness or communication.
- Making assumptions about company-specific processes from old descriptions.
- Claiming expertise unsupported by project evidence.

## Interview Communication

Use short decision checkpoints:

> “I see two interpretations of duplicates. I’ll clarify because they lead to different storage choices.”

> “The hint suggests the sorted property matters. I had not used it; I’ll revisit the lookup step and its lower bound.”

> “I found an invariant violation. I’m going to correct the transition, then rerun the two affected edge cases.”

## Practice Drill

Run a 35-minute mock with an observer scoring only observable evidence. Afterward, classify every weak moment as contract, example, baseline, optimization, coding, testing, or communication. Practice the weakest transition rather than repeating random problems.

## Connects To

- [Preparation and Behavioral](ch01-preparation-and-behavioral.md)
- [Problem-Solving Framework](ch03-problem-solving-framework.md)
- [Offers and Interview Workflow](ch04-offers-and-interview-workflow.md)
- [Hints and Deliberate Practice](ch22-hints-and-deliberate-practice.md)
