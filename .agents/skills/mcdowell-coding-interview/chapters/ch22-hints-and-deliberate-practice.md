# Chapter 22: Hints and Deliberate Practice

## Core Idea

Hints should preserve productive struggle while preventing unproductive repetition. Practice should route from observed weaknesses, not from random problem volume.

## Hint Ladder

Use the smallest intervention that restores progress:

1. Restate the contract and constraints.
2. Build a larger, non-special example.
3. State and trace brute force.
4. Ask which work is bottlenecked, unnecessary, or duplicated.
5. Ask for the Best Conceivable Runtime.
6. Name a relevant operation or structure family.
7. Reveal a subproblem or invariant.
8. Review a transformed solution only after documenting where reasoning stopped.

Do not consume multiple hints at once. After each hint, explain what changed and continue independently.

## Error Log

| Field | Example category |
|---|---|
| Problem shape | graph reachability, fixed window, repeated subproblem |
| Failure stage | clarification, recognition, invariant, coding, test, communication |
| Symptom | chose DFS for shortest path; incomplete memo key |
| Root cause | missed unweighted signal; state meaning undefined |
| Corrective rule | shortest unweighted path -> BFS; list all changing dimensions |
| Reattempt date | spaced review from blank page |
| Evidence | solved without hint; caught edge case before execution |

Record rules, not copied answers.

## Deliberate-Practice Loop

```text
attempt -> classify failure -> study one principle -> isolate drill
        -> blank-page reattempt -> mixed transfer problem -> spaced review
```

### Attempt Conditions

- Timebox the session.
- Use paper or a constrained editor periodically.
- Narrate assumptions and decisions.
- Do not open the solution before producing a baseline and complexity.
- Save the first draft for defect comparison.

### Reattempt Conditions

A reattempt is successful only if you can derive the approach, not recall syntax. Change names, surface form, or constraints to test transfer.

## Weakness-to-Practice Router

| Weakness | Isolated drill | Transfer test |
|---|---|---|
| Cannot start | Ten contract/example/brute-force openings | Mixed domain prompts |
| Pattern matching only | Explain why two similar problems need different structures | Constraint variants |
| Complexity errors | Derive hidden helper and recursion costs | Unseen snippets |
| BUD weakness | Annotate every operation in brute force | Optimize a new baseline |
| Data-structure bias | Operation-cost comparison | Same task under changed constraints |
| Recursion/DP state | Write contract, state, recurrence, base, order | Memoized and bottom-up versions |
| Test weakness | Predict failures before running | Mutation and boundary-heavy code |
| Communication weakness | Record narrated paper solution | Live mock with interruptions |

## Practice Mix

Balance:

- **Focused practice** for one weak skill.
- **Interleaved practice** for recognition among domains.
- **Timed mocks** for integration under pressure.
- **Implementation drills** for fluency.
- **Review sessions** for error-log rules and spaced reattempts.

Problem count is a poor metric by itself. Better measures include hint level, time to correct baseline, accuracy of complexity, defects found before execution, and successful transfer after delay.

## Using Solutions Responsibly

When reviewing a solution:

1. Compare its invariant with yours.
2. Identify the exact eliminated work.
3. Derive time and space independently.
4. Close the source and reconstruct the approach.
5. Solve a structurally related problem later.

Do not memorize a code listing or distinctive problem wording.

## Common Mistakes

- Reading solutions as the primary study method.
- Repeating the same problem immediately and mistaking recall for learning.
- Tracking only solved count.
- Practicing only comfortable domains.
- Using hints without articulating the new inference.
- Keeping an error log that records symptoms but no corrective rule.
- Skipping mock interviews because solo code passes tests.

## Weekly Review

1. Group errors by stage and domain.
2. Select the highest-frequency or highest-impact weakness.
3. Schedule one isolated drill and one transfer problem.
4. Reattempt prior failures after spacing.
5. Update the practice plan from evidence.

## Connects To

- [Preparation and Behavioral](ch01-preparation-and-behavioral.md)
- [Big O](ch02-big-o.md)
- [Problem-Solving Framework](ch03-problem-solving-framework.md)
- All technical domains through the final router in [SKILL.md](../SKILL.md)

