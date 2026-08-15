# Reusable Interview Patterns

## BUD: Bottlenecks, Unnecessary Work, Duplicated Work

**Intent:** Locate why a correct baseline is slower than it needs to be. **Signals:** one stage dominates; a loop searches for a derivable value; the same calculation or scan repeats. **Procedure:** state brute force and complexity -> mark bottlenecks -> remove unnecessary operations -> cache or reorganize duplicated work -> recompute complexity. **Works when:** waste is visible in a concrete walkthrough. **Does not:** replace correctness or prove optimality. **Mistakes:** optimizing a non-dominant step; caching without a stable key. **Example:** replace repeated membership scans over IDs with one indexed set. **Domains:** [Arrays](chapters/ch05-arrays-and-strings.md), [Trees/Graphs](chapters/ch08-trees-and-graphs.md), [Recursion/DP](chapters/ch11-recursion-and-dynamic-programming.md).

## Best Conceivable Runtime (BCR)

**Intent:** Establish a defensible lower-bound target from required input and output work. **Signals:** every item must be read, or output size alone imposes work. **Procedure:** ignore the current algorithm -> count unavoidable reads/writes -> state the bound -> compare the proposal -> use the gap to guide optimization. **Works when:** input/output obligations are clear. **Does not:** guarantee the bound is achievable. **Mistakes:** confusing BCR with best-case runtime; deriving it from current loops. **Example:** intersecting two sorted event streams cannot beat linear work in their combined length when all items may matter. **Domains:** [Big O](chapters/ch02-big-o.md), Arrays, Graphs.

## Data Structure Brainstorm

**Intent:** Select representation from required operations. **Signals:** the algorithm is awkward because lookup, ordering, min/max, adjacency, or updates are expensive. **Procedure:** list required operations -> compare array/list, hash map/set, stack/queue, heap, tree/trie, graph -> quantify each -> choose the smallest structure meeting the contract. **Works when:** representation dominates complexity. **Does not:** excuse ignoring constraints. **Mistakes:** choosing a familiar structure before naming operations. **Example:** maintain a stream median with a max-heap for the lower half and min-heap for the upper half. **Domains:** all technical chapters.

## Do It Yourself

**Intent:** Recover an intuitive algorithm by manually solving a concrete case. **Signals:** formal algorithm talk has stalled, but a person can solve an instance. **Procedure:** choose a specific nontrivial example -> solve it by hand -> record every shortcut -> turn shortcuts into state and operations -> analyze. **Works when:** human pattern recognition avoids obvious waste. **Does not:** prove correctness or cover edge cases. **Mistakes:** using a tiny special case. **Example:** manually track character counts across a moving token window, then formalize the update rule. **Domains:** [Arrays](chapters/ch05-arrays-and-strings.md), sorting/searching, recursion.

## Simplify and Generalize

**Intent:** Expose structure by relaxing or narrowing one constraint. **Signals:** the full data type or rule set hides the invariant. **Procedure:** state the simplification -> solve it completely -> identify which assumptions the solution uses -> replace simplified representation with a general one -> retest. **Works when:** complexity is representational. **Does not:** work if the removed constraint changes the core problem. **Mistakes:** generalizing without revalidating complexity. **Example:** solve resource availability for a fixed alphabet with an array, then generalize to arbitrary tokens with a frequency map. **Domains:** Arrays/Strings, OOD, system design.

## Base Case and Build

**Intent:** Derive a solution for size `n` from solved smaller instances. **Signals:** the problem asks for combinations, arrangements, paths, or recursively nested structure. **Procedure:** solve `n=0/1` -> inspect the first interesting case -> express how to extend `n-1` -> define state and base case -> choose recursion, memoization, or iteration. **Works when:** extension preserves a stable invariant. **Does not:** help when subproblems do not compose. **Mistakes:** missing termination or duplicating subproblems exponentially. **Example:** build length-`n` step sequences by extending valid states for smaller remaining distances. **Domains:** [Recursion/DP](chapters/ch11-recursion-and-dynamic-programming.md), trees, combinatorics.

## Walk Through

**Intent:** Turn a plausible algorithm into an implementation-ready invariant. **Signals:** the idea sounds right but variable state or transition order is unclear. **Procedure:** use a specific case -> narrate each state change -> name invariants -> cover termination and failure -> derive modules before syntax. **Works when:** logic is settled enough to simulate. **Does not:** rescue an undefined algorithm. **Mistakes:** walking only the happy path. **Example:** trace queue contents, visited state, and parent links through three BFS levels. **Domains:** all.

## Test

**Intent:** Find defects systematically before execution. **Signals:** implementation is complete enough to simulate. **Procedure:** conceptual review -> unusual code -> hotspots (indices, arithmetic, nulls) -> small normal case -> base/empty case -> edge and error cases -> repair carefully. **Works when:** expected behavior is explicit. **Does not:** replace a correct contract. **Mistakes:** using one large happy-path example. **Example:** test a window algorithm with empty input, window one, repeated values, exact fit, and no match. **Domains:** all.

## Optimize

**Intent:** Improve a correct baseline deliberately. **Signals:** complexity misses BCR or constraints. **Procedure:** use unused information -> try another example -> examine an almost-correct shortcut -> trade space for time -> precompute -> consider hashing -> apply BUD -> re-derive complexity. **Works when:** a baseline exposes work. **Does not:** justify premature cleverness. **Mistakes:** changing code before explaining the eliminated work. **Domains:** [Big O](chapters/ch02-big-o.md), [Problem Solving](chapters/ch03-problem-solving-framework.md), all technical chapters.

## Communicate

**Intent:** Make assumptions, progress, and trade-offs observable to the interviewer. **Signals:** any clarification, choice, optimization, or correction. **Procedure:** restate contract -> narrate example and baseline -> state complexity -> explain each optimization -> confirm before coding -> call out tests and limitations. **Works when:** concise reasoning accompanies evidence. **Does not:** mean filling silence with speculation. **Mistakes:** going silent while coding or claiming optimality without a bound. **Domains:** all.

## Domain Pattern Router

| Pattern | Recognition signal | Route |
|---|---|---|
| Runner / dummy head | Pointer chain, midpoint, deletion, cycle | [Linked Lists](chapters/ch06-linked-lists.md) |
| Lazy transfer / monotonic state | FIFO from LIFO, next/window extremum | [Stacks and Queues](chapters/ch07-stacks-and-queues.md) |
| Explicit visited state | Hierarchy, dependency, shortest unweighted path | [Trees and Graphs](chapters/ch08-trees-and-graphs.md) |
| Fixed-width mask | Bounded flags, parity, toggles | [Bit Manipulation](chapters/ch09-bit-manipulation.md) |
| Sample space / invariant | Probability, reachability, measurement | [Math and Logic](chapters/ch10-math-and-logic-puzzles.md) |
| Use cases before classes | Responsibility and lifecycle design | [OOD](chapters/ch12-object-oriented-design.md) |
| Scope, estimate, sketch, stress | Scalable service/system prompt | [System Design](chapters/ch13-system-design-and-scalability.md) |
| Boundary search / sort-sweep | Monotonic predicate or ordered adjacency | [Sorting and Searching](chapters/ch14-sorting-and-searching.md) |
| Contract-to-test matrix | Function, object, system, or failure testing | [Testing](chapters/ch15-testing.md) |
| Ownership/lifetime trace | Native resource or pointer safety | [C and C++](chapters/ch16-c-and-cpp.md) |
| Equality/hash contract | Java values and hashed collections | [Java](chapters/ch17-java.md) |
| Access-pattern-first index | Query, schema, transaction | [Databases](chapters/ch18-databases.md) |
| Invariant-centered locking | Shared read-modify-write state | [Threads and Locks](chapters/ch19-threads-and-locks.md) |
| Normalize/decompose/combine | Disguised or multi-structure problem | [Moderate](chapters/ch20-moderate-problems.md) / [Hard](chapters/ch21-hard-problems.md) |
