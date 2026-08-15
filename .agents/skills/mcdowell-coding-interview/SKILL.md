---
name: mcdowell-coding-interview
description: "Decision-oriented interview preparation from \"Cracking the Coding Interview, 6th Edition\" by Gayle Laakmann McDowell. Use to approach coding problems, select data structures, set complexity targets, optimize with BUD and BCR, test solutions, communicate reasoning, or route practice by weakness."
---

<!-- argument-hint: [problem, weakness, technical domain, framework, or chapter] -->

# Coding Interview Problem-Solving Router

**Source**: *Cracking the Coding Interview, 6th Edition* by Gayle Laakmann McDowell | **Pages**: 712 extracted | **Architecture**: 23 chapters | **Status**: complete transformed skill | **Generated**: 2026-08-09

## Start With the Interview Decision

Do not search for a memorized answer. Classify the problem and expose your reasoning:

1. **Clarify the contract**: inputs, outputs, constraints, mutation rules, duplicates, ordering, scale, and error behavior.
2. **Build a specific example**: large enough to show structure and deliberately not a perfect or trivial case.
3. **State a correct brute force**: explain its time and space complexity before optimizing.
4. **Set a lower-bound target** with [Best Conceivable Runtime](chapters/ch03-problem-solving-framework.md#best-conceivable-runtime-bcr).
5. **Find wasted work** with [BUD](chapters/ch03-problem-solving-framework.md#bud-bottlenecks-unnecessary-work-duplicated-work).
6. **Choose a representation**: brainstorm structures from required operations, not topic labels.
7. **Walk through before coding**: make invariants and state transitions explicit.
8. **Implement, test, and communicate**: use small cases, edge cases, hotspots, and complexity evidence.

If the interviewer changes a constraint, return to the contract and complexity target rather than patching the code blindly.

## Problem Router

| Signal in the problem | Consider first | Ask before committing | Calibration chapter |
|---|---|---|---|
| Membership, duplicates, frequency, complements | Hash set/map, counting array | Is ordering required? Is the key space bounded? | [Arrays and Strings](chapters/ch05-arrays-and-strings.md) |
| Contiguous range, substring, running aggregate | Sliding window, two pointers, prefix state | Fixed or variable window? Can the left edge move monotonically? | [Arrays and Strings](chapters/ch05-arrays-and-strings.md) |
| Pointer chain, unknown length, shared node | Runners, dummy head, identity tracking | Singly or doubly linked? Cyclic? | [Linked Lists](chapters/ch06-linked-lists.md) |
| LIFO, FIFO, nested state, next extremum | Stack, queue, monotonic structure | Which removal order is required? | [Stacks and Queues](chapters/ch07-stacks-and-queues.md) |
| Sorted input or monotonic predicate | Binary search, two pointers | Search for value, boundary, or feasible answer? | [Sorting and Searching](chapters/ch14-sorting-and-searching.md) |
| Hierarchy, ancestry, subtree, dependency | DFS/BFS, recursion, parent state | Tree or graph? Directed? Cycles? Balanced or ordered? | [Trees and Graphs](chapters/ch08-trees-and-graphs.md) |
| Shortest unweighted path or level order | BFS | Must reconstruct the path? Multiple sources? | [Trees and Graphs](chapters/ch08-trees-and-graphs.md) |
| All combinations or choices | Backtracking | What defines state, choices, validity, and completion? | [Recursion and DP](chapters/ch11-recursion-and-dynamic-programming.md) |
| Repeated subproblems plus optimal substructure | Memoization or bottom-up DP | What is the minimal state? Which dependencies must be ready? | [Recursion and DP](chapters/ch11-recursion-and-dynamic-programming.md) |
| Repeated min/max extraction or top-k | Heap | Do updates, deletions, or stable ordering matter? | [Trees and Graphs](chapters/ch08-trees-and-graphs.md) |
| Fixed-width flags, toggles, parity | Masks, shifts, XOR | What width and signedness apply? | [Bit Manipulation](chapters/ch09-bit-manipulation.md) |
| Probability, divisibility, reachability | Sample space, modular arithmetic, invariant | Are outcomes equally likely? What is preserved? | [Math and Logic](chapters/ch10-math-and-logic-puzzles.md) |
| Object responsibilities and lifecycle | Use cases, composition, state transitions | Which invariant belongs to which object? | [Object-Oriented Design](chapters/ch12-object-oriented-design.md) |
| Design, scale, or service boundaries | Requirements, estimates, bottlenecks, trade-offs | Users, load, consistency, failure, and growth? | [System Design](chapters/ch13-system-design-and-scalability.md) |
| Test strategy or defect isolation | Partitions, boundaries, properties, fault injection | Which risk and layer does each test cover? | [Testing](chapters/ch15-testing.md) |
| Native ownership/lifetime | RAII, values, smart ownership | Who owns and when is it invalidated? | [C and C++](chapters/ch16-c-and-cpp.md) |
| Java object/collection semantics | Equality, hashing, collection contract | Which behavior is version dependent? | [Java](chapters/ch17-java.md) |
| Relational data, query, transaction | Keys, indexes, joins, constraints | What are the access patterns and invariants? | [Databases](chapters/ch18-databases.md) |
| Shared mutable state | Atomics, locks, ownership, messages | What invariant and coordination scope? | [Threads and Locks](chapters/ch19-threads-and-locks.md) |
| Mixed or disguised domain | Operations, BUD, BCR, decomposition | Which familiar operation is expensive? | [Moderate](chapters/ch20-moderate-problems.md) / [Hard](chapters/ch21-hard-problems.md) |

## Optimization Router

| Observation | Move | Why |
|---|---|---|
| One stage dominates total runtime | Remove or change the bottleneck | Optimizing a cheaper stage cannot improve the bound materially. |
| A loop searches for a value derivable from current state | Compute or index it | The search may be unnecessary work. |
| The same result is recomputed | Cache, precompute, or reorganize | Duplicated work often reveals memoization or indexing. |
| Manual solving is faster than the proposed algorithm | Use **Do It Yourself** | Reverse-engineer the shortcuts your intuition used. |
| The full problem hides its structure | **Simplify and Generalize** | Solve a constrained version, then restore complexity carefully. |
| Size `n` relates naturally to `n-1` | **Base Case and Build** | The construction may reveal recursion, induction, or DP. |
| Representation feels wrong | **Data Structure Brainstorm** | Required operations should select the structure. |
| Proposed runtime is above the input/output lower bound | Continue optimizing with BUD | BCR is a target, not proof that it is achievable. |

See [patterns.md](patterns.md) for reusable framework cards and [cheatsheet.md](cheatsheet.md) for a one-page interview loop.

## Practice Router

| Weakness observed | Practice prescription | Evidence of improvement |
|---|---|---|
| Cannot start | Clarification -> example -> brute-force drills | Produces a correct baseline within a fixed timebox |
| Jumps to code | Verbal walkthroughs without an editor | States invariants and transitions before syntax |
| Misses optimization | Annotate brute force with BUD and BCR | Names the wasted work and resulting complexity change |
| Chooses structures by habit | Operation-to-structure comparisons | Explains lookup, ordering, update, and memory trade-offs |
| Recursion explodes | Draw call trees and mark repeated states | Derives branching/depth and proposes a cache state |
| DP state is vague | Write state meaning and recurrence in words | Every table/cache entry has one precise interpretation |
| Testing is shallow | General/base/error/hotspot/edge checklist | Finds defects before executing code |
| Communication drops while coding | Narrated mock interviews | Interviewer can follow assumptions and trade-offs |

## Chapter Index

- Foundations: [ch00 Interview Process](chapters/ch00-interview-process.md), [ch01 Preparation and Behavioral](chapters/ch01-preparation-and-behavioral.md), [ch02 Big O](chapters/ch02-big-o.md), [ch03 Problem Solving](chapters/ch03-problem-solving-framework.md), [ch04 Offers and Workflow](chapters/ch04-offers-and-interview-workflow.md).
- Core structures: [ch05 Arrays and Strings](chapters/ch05-arrays-and-strings.md), [ch06 Linked Lists](chapters/ch06-linked-lists.md), [ch07 Stacks and Queues](chapters/ch07-stacks-and-queues.md), [ch08 Trees and Graphs](chapters/ch08-trees-and-graphs.md), [ch09 Bit Manipulation](chapters/ch09-bit-manipulation.md), [ch10 Math and Logic](chapters/ch10-math-and-logic-puzzles.md), [ch11 Recursion and DP](chapters/ch11-recursion-and-dynamic-programming.md).
- Design and engineering: [ch12 OOD](chapters/ch12-object-oriented-design.md), [ch13 System Design](chapters/ch13-system-design-and-scalability.md), [ch14 Sorting and Searching](chapters/ch14-sorting-and-searching.md), [ch15 Testing](chapters/ch15-testing.md), [ch16 C and C++](chapters/ch16-c-and-cpp.md), [ch17 Java](chapters/ch17-java.md), [ch18 Databases](chapters/ch18-databases.md), [ch19 Threads and Locks](chapters/ch19-threads-and-locks.md).
- Mixed practice: [ch20 Moderate](chapters/ch20-moderate-problems.md), [ch21 Hard](chapters/ch21-hard-problems.md), [ch22 Hints and Deliberate Practice](chapters/ch22-hints-and-deliberate-practice.md).
- Supporting references: [patterns](patterns.md), [cheatsheet](cheatsheet.md), and [glossary](glossary.md).

## Scope and Limits

This is a transformed reasoning and practice system, not an answer key. It does not reproduce all 189 questions or their solutions. OCR-derived code is never trusted verbatim; examples are semantically reconstructed and omitted when intent is uncertain.
