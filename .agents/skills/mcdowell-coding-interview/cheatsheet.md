# Coding Interview Decision Cheatsheet

## One Interview Loop

| Stage | Decision | Say or produce |
|---|---|---|
| Listen | Which details change the algorithm? | Restated contract and assumptions |
| Example | Is it specific, large enough, and non-special? | Concrete input with expected result |
| Brute force | What is the simplest correct baseline? | Steps plus time and space |
| BCR | What work is unavoidable? | Lower-bound target, separate from current code |
| Optimize | Where is BUD? What information is unused? | Eliminated work and new complexity |
| Structure | Which operations must be cheap? | Data-structure comparison |
| Walk through | Are state and invariants implementation-ready? | Trace with transitions and termination |
| Implement | Can code mirror the explanation? | Small modules, clear names, guarded boundaries |
| Test | What breaks first? | Normal, base, hotspot, edge, and error cases |
| Communicate | Can the interviewer follow every trade-off? | Assumptions, corrections, evidence, limitations |

## Data-Structure First Thoughts

| Need | Consider | Immediate challenge |
|---|---|---|
| Membership, counts, complements | Hash set/map | Ordering, collisions, key normalization |
| Stable index access | Array/resizable array | Insert/delete cost, capacity, bounds |
| Contiguous range | Sliding window/two pointers | Fixed vs variable window, monotonic movement |
| LIFO / nested state | Stack | Underflow, matching, implicit recursion |
| FIFO / shortest unweighted path | Queue/BFS | Visited timing and path reconstruction |
| Repeated min/max or top-k | Heap | Update/delete support and heap direction |
| Ordered lookup/range | Balanced BST | Balance and duplicate policy |
| Prefix lookup | Trie | Alphabet size and memory |
| Relationships/dependencies | Graph | Direction, cycles, disconnected components |

## Complexity Tells

- Sequential phases: add runtimes; nested “for each” work: multiply.
- Repeated halving suggests `O(log n)`.
- Branching recursion suggests roughly `branches^depth` before pruning or caching.
- Recursive depth counts toward space even when local work is constant.
- Drop constants and non-dominant terms, but keep independent variables.
- A rare linear resize can still yield amortized `O(1)` insertion.
- Output size can define BCR; BCR is not best-case runtime and may be unattainable.

## Testing Order

1. Conceptual code review against the invariant.
2. Unusual or non-standard logic.
3. Hotspots: indices, arithmetic, nulls, mutation, boundaries.
4. Small representative case.
5. Empty/base/singleton case.
6. Extremes, duplicates, malformed input, and no-solution case.

## Weakness Routing

| Symptom | Practice next |
|---|---|
| No starting point | Clarify -> example -> brute-force drills |
| Slow optimization | Annotate BUD and state BCR before structures |
| Wrong structure | Translate requirements into operations and compare costs |
| Recursive blow-up | Draw call tree; mark repeated states; define cache key |
| DP confusion | State meaning -> recurrence -> base -> evaluation order |
| Off-by-one bugs | Tiny arrays/windows and explicit interval convention |
| Weak explanation | Narrated paper coding and mock interviews |

## Technical Domain Routing

| Signal | Route |
|---|---|
| Pointer chain, cycle, kth-from-end | [Linked Lists](chapters/ch06-linked-lists.md) |
| LIFO/FIFO, nested state, next extremum | [Stacks and Queues](chapters/ch07-stacks-and-queues.md) |
| Hierarchy, connectivity, shortest unweighted path | [Trees and Graphs](chapters/ch08-trees-and-graphs.md) |
| Flags, parity, subsets, XOR | [Bit Manipulation](chapters/ch09-bit-manipulation.md) |
| Probability, divisibility, invariant | [Math and Logic](chapters/ch10-math-and-logic-puzzles.md) |
| Choices, repeated subproblems | [Recursion and DP](chapters/ch11-recursion-and-dynamic-programming.md) |
| Responsibilities and lifecycle | [OOD](chapters/ch12-object-oriented-design.md) |
| Load, storage, consistency, failure | [System Design](chapters/ch13-system-design-and-scalability.md) |
| Ordered boundary or repeated queries | [Sorting and Searching](chapters/ch14-sorting-and-searching.md) |
| Test design or defect isolation | [Testing](chapters/ch15-testing.md) |
| Native lifetime and ownership | [C and C++](chapters/ch16-c-and-cpp.md) |
| Java equality, collections, generics | [Java](chapters/ch17-java.md) |
| Schema, query, index, transaction | [Databases](chapters/ch18-databases.md) |
| Race, lock, shared state | [Threads and Locks](chapters/ch19-threads-and-locks.md) |
| Cross-domain recognition/decomposition | [Moderate](chapters/ch20-moderate-problems.md) / [Hard](chapters/ch21-hard-problems.md) |

Read [SKILL.md](SKILL.md) for routing and [patterns.md](patterns.md) for the reusable procedures.
