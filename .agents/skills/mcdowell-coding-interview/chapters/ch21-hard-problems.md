# Chapter 21: Hard Mixed-Domain Problems

## 1. Core Concepts

Hard problems combine several ordinary ideas or require a less obvious state representation. Progress comes from decomposition, lower bounds, smaller analogues, and explicit invariants—not from guessing a trick.

- Separate subproblems by responsibility and prove their interfaces.
- Preprocessing is justified when it serves repeated expensive operations.
- Advanced solutions often combine two structures, such as trie plus dynamic programming or heap plus indexing.
- The best solution may be output-sensitive or constrained by an unavoidable lower bound.

## 2. Recognition Signals

- Huge search tree with repeated state -> memoization/DP or meet-in-the-middle.
- Prefix-driven text search -> trie, automaton, or indexed prefix state.
- Repeated rank/median/extremum -> balanced partitions, heaps, or order statistics.
- Many overlapping ranges -> sweep line, interval structure, prefix/event aggregation.
- Global optimum built from local choices -> prove greedy choice or use DP/graph search.
- Constraint too large for naive domain -> compress state or exploit sparsity.

## 3. Common Data Structures / Algorithms

| Need | Candidates |
|---|---|
| Prefix matching | Trie, rolling/indexed prefix state |
| Dynamic optimum | Memoization, bottom-up DP, shortest-path formulation |
| Online rank | Two heaps, balanced ordered structure |
| Sparse relation | Hash maps, adjacency lists |
| Range aggregation | Prefix state, Fenwick/segment-style structure when justified |
| Large choice space | Pruning, bidirectional search, meet-in-the-middle |

## 4. Problem-Solving Patterns

### Decompose and Contract

Define smaller functions with precise inputs, outputs, and complexity budgets. Solve and test them independently before composing.

### Simplify, Solve, Restore

Remove one hard constraint, solve the reduced problem, identify the invariant, and add the constraint back deliberately. Recheck correctness and complexity after restoration.

### State Compression

Retain only information needed for future decisions. Prove that two histories with the same compressed state have equivalent futures.

### Combine Structures by Operation

Assign each required operation to the structure that makes it cheap, then account for synchronization between structures.

## 5. Complexity Targets

State BCR before pursuing sophisticated machinery. Track independent variables, preprocessing, query count, output size, and memory. A faster query may be worthwhile only after enough queries amortize construction. Exponential algorithms need an explicit bound on state count and pruning—not merely a smaller constant.

## 6. Typical Traps

- Searching memory for a named solution instead of decomposing.
- Adding a sophisticated structure without an operation that needs it.
- Memoizing an incomplete or oversized state.
- Proving components but not their composition.
- Ignoring preprocessing and auxiliary-memory costs.
- Optimizing average behavior while constraints require a worst-case guarantee.
- Using an example too small to expose interacting states.

## 7. Testing Strategy

Build an exponential or straightforward oracle for tiny inputs, then differential-test the optimized form. Include adversarial ordering, maximum branching/depth, duplicate states, ties, sparse/dense extremes, no solution, and outputs at lower-bound size. Test each decomposed contract separately.

## 8. Interview Communication Strategy

Keep the interviewer oriented: summarize the current subproblem, invariant, and unresolved gap. Explicitly distinguish a conjecture from a proof. Offer the correct baseline and partial optimization if the complete design is unfinished; this preserves evaluable reasoning.

## 9. Representative Transformed Examples

For repeated dictionary-prefix queries over a token stream, separate: prefix indexing, candidate generation, and result aggregation. A trie can serve prefix navigation, while memoization may avoid recomputing suffix states. The combined complexity must include trie construction, visited states, and emitted results; neither structure is justified solely by the word “string.”

## 10. Practice Routing

- Overwhelmed -> isolate one contract and solve a smaller version.
- State explosion -> define future-relevant information and merge equivalent histories.
- Tool overuse -> map every structure to one required operation.
- Proof gaps -> write invariants at component boundaries.
- Hard-problem memorization -> redo with changed constraints and explain adaptation.

## Connects To

- [Problem-Solving Framework](ch03-problem-solving-framework.md): simplify/generalize and BCR.
- [Recursion and DP](ch11-recursion-and-dynamic-programming.md): state and repeated work.
- [Trees and Graphs](ch08-trees-and-graphs.md): tries and graph formulations.
- [Moderate Problems](ch20-moderate-problems.md): mixed-domain recognition.
- [Hints and Practice](ch22-hints-and-deliberate-practice.md): controlled escalation.

