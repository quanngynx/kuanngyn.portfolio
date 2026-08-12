# Operational Glossary

- **Amortized analysis** — Average cost per operation across a sequence, even when an individual operation is expensive. See [Big O](chapters/ch02-big-o.md).
- **Backtracking** — Depth-first exploration that chooses, recurses, and undoes state. See [Recursion and DP](chapters/ch11-recursion-and-dynamic-programming.md).
- **BCR (Best Conceivable Runtime)** — Lower-bound target derived from unavoidable input/output work; not best-case runtime. See [Problem Solving](chapters/ch03-problem-solving-framework.md).
- **BFS** — Breadth-first traversal using a queue; gives shortest edge-count paths in unweighted graphs. See [Trees and Graphs](chapters/ch08-trees-and-graphs.md).
- **BUD** — Optimization search for bottlenecks, unnecessary work, and duplicated work. See [patterns](patterns.md).
- **Critical section** — Code/state transition that must execute with required atomicity to preserve a shared invariant. See [Threads and Locks](chapters/ch19-threads-and-locks.md).
- **DFS** — Depth-first traversal using recursion or an explicit stack. See [Trees and Graphs](chapters/ch08-trees-and-graphs.md).
- **Dynamic programming** — Evaluation of a recurrence while retaining overlapping subproblem results. See [Recursion and DP](chapters/ch11-recursion-and-dynamic-programming.md).
- **Equivalence partition** — Input class expected to exercise the same behavior, represented by selected tests. See [Testing](chapters/ch15-testing.md).
- **Hash contract** — Logically equal keys must produce compatible hash codes; key identity should remain stable while stored. See [Java](chapters/ch17-java.md).
- **Heap** — Structure supporting repeated access to an extremum, commonly in logarithmic update time. See [Trees and Graphs](chapters/ch08-trees-and-graphs.md).
- **Idempotency** — Repeating the same logical request does not repeat its intended effect; scope and durable key semantics must be defined. See [System Design](chapters/ch13-system-design-and-scalability.md).
- **Invariant** — Property that remains true at a defined point in an algorithm or state transition.
- **Memoization** — Top-down caching keyed by complete subproblem state. See [Recursion and DP](chapters/ch11-recursion-and-dynamic-programming.md).
- **Monotonic predicate** — Boolean condition that changes direction at most once over an ordered domain, enabling boundary binary search. See [Sorting and Searching](chapters/ch14-sorting-and-searching.md).
- **Normalization** — Converting equivalent representations into a canonical form before comparison or hashing.
- **RAII** — C++ resource ownership tied to object lifetime. See [C and C++](chapters/ch16-c-and-cpp.md).
- **Sliding window** — Contiguous interval whose state is updated as boundaries move monotonically. See [Arrays and Strings](chapters/ch05-arrays-and-strings.md).
- **Stable sort** — Sort that preserves relative order among equal keys.
- **Transaction** — Group of database operations with defined atomicity and isolation behavior. See [Databases](chapters/ch18-databases.md).
- **Trie** — Prefix-indexed tree for sequences such as characters or tokens.
- **Two pointers** — Coordinated indices/references whose monotonic movement avoids repeated scans.
- **Value object** — Identity-less concept defined by immutable values and validated invariants. See [Object-Oriented Design](chapters/ch12-object-oriented-design.md).

