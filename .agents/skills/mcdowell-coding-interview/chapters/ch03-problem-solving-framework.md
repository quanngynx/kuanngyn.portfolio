# Chapter 3: Problem-Solving Framework

## 1. Core Concepts

An interview solution is a sequence of justified decisions: clarify, create an example, establish correctness with brute force, optimize against a lower bound, walk through, implement, test, and communicate. Skipping directly to remembered code hides the evidence interviewers need.

The reusable loop is:

```text
Listen -> Example -> Brute Force -> BCR/BUD -> Choose Structure
       -> Walk Through -> Implement -> Test -> Communicate
```

## 2. Recognition Signals

- A detail such as “sorted,” “repeated queries,” “limited memory,” or “no extra storage” probably changes the best approach.
- A tiny or perfect example hides branches; replace it with a specific irregular case.
- If you cannot optimize, state the brute force and mark its work rather than guessing a trick.
- If manual solving is fast but the proposed algorithm is slow, use **Do It Yourself**.
- If one constraint obscures the structure, use **Simplify and Generalize**.
- If results for `n-1` help solve `n`, use **Base Case and Build**.
- If required operations are expensive, use **Data Structure Brainstorm**.

## 3. Common Data Structures / Algorithms

Translate constraints into operations before choosing:

| Required operation | Candidates | Trade-off to voice |
| --- | --- | --- |
| Membership/frequency | Hash set/map, counting array | General keys versus bounded key space |
| Preserve sorted order | Balanced BST, sorted array | Update cost versus range/order access |
| Extremal item repeatedly | Heap | Fast root, slower arbitrary lookup |
| Recent/nested state | Stack | Explicit versus recursive stack |
| Arrival/level order | Queue | FIFO and memory frontier |
| Prefix matching | Trie | Lookup length versus memory |
| Relationships | Graph adjacency | Dense matrix versus sparse lists |

## 4. Problem-Solving Patterns

### Listen, Clarify, and Record Constraints

**Intent:** prevent optimizing the wrong problem. **Procedure:** restate input/output; ask about size, ordering, duplicates, mutation, character set, error cases, repeated calls, and memory; record details that may enable an optimization. **Failure mode:** asking generic questions without connecting answers to algorithm choices.

### Build a Useful Example

Use real values, enough elements to expose a pattern, and at least one irregular feature. A perfect balanced tree or two-element array often erases the hard branch. Write the expected result before using the example to derive code.

### State Brute Force

A baseline proves understanding, gives a correctness reference, and makes waste visible. State steps, time, and space; do not code it unless requested. “Obvious” is not evidence until explained.

### BUD: Bottlenecks, Unnecessary Work, Duplicated Work

**Intent:** identify wasted work in the baseline.

**Recognition signals:**

- **Bottleneck:** one stage sets the overall bound.
- **Unnecessary work:** a loop searches or enumerates something derivable directly.
- **Duplicated work:** the same scan, calculation, or subproblem recurs.

**Procedure:** walk through a concrete case; annotate each expensive operation; remove a dominant stage, compute instead of search, or cache/reorganize repeated results; then recompute complexity.

**When it works:** the brute force is correct enough to expose its work. **When it does not:** the contract or invariant is still wrong. **Common mistakes:** optimizing a non-dominant stage, caching mutable state without a valid key, or trading unbounded memory for speed.

**Transformed example:** A baseline checks whether each incoming identifier has appeared by rescanning all prior identifiers: `O(n²)`. The repeated membership scan is the bottleneck and duplicated work. A set records prior identifiers once, yielding expected `O(n)` time and `O(n)` space.

**Links:** [Arrays](ch05-arrays-and-strings.md), [Trees/Graphs](ch08-trees-and-graphs.md), [Recursion/DP](ch11-recursion-and-dynamic-programming.md).

### Best Conceivable Runtime (BCR)

**Intent:** establish a problem-level lower-bound target.

**Recognition signals:** all inputs may matter; output size is large; the current algorithm has an unexplained extra factor.

**Procedure:** ignore the current code; count unavoidable reads and writes; state the lower bound with variables; compare the baseline; investigate the gap with BUD.

**When it works:** the input/output obligations are defensible. **When it does not:** it cannot tell you whether the lower bound is achievable. **Common mistakes:** deriving BCR from an existing loop or confusing it with best-case runtime.

**Transformed example:** Finding common timestamps between two sorted streams may require reading both streams, so `Ω(a+b)` is the target. Two monotonic pointers achieve `O(a+b)`; nested comparison does not.

### Do It Yourself

**Intent:** recover the algorithm implicit in human intuition. **Procedure:** solve a nontrivial instance manually; record skipped work, maintained state, and comparisons; formalize them; test the rule on a different case. **Does not work:** when the manual process relies on hidden domain knowledge or an unrepresentative example. **Mistake:** describing intuition without extracting an invariant.

**Example:** While finding reordered tokens in a longer sequence, a person tracks a fixed-size window rather than generating every ordering. Formalize the window counts and incremental updates.

### Simplify and Generalize

**Intent:** remove representational complexity temporarily. **Procedure:** relax one constraint; solve the smaller problem; list assumptions; replace the simplified representation; revalidate correctness and complexity. **Does not work:** when the removed constraint changes the central invariant.

**Example:** Count required symbols with a fixed array for a small alphabet, then generalize to arbitrary tokens with a map.

### Base Case and Build

**Intent:** construct size `n` from solved smaller states. **Procedure:** define `n=0/1`; find the first interesting case; express the extension from `n-1`; define state and transitions; choose recursion, memoization, or bottom-up iteration. **Does not work:** when smaller solutions cannot compose. **Mistakes:** incomplete base cases and exponential recomputation.

**Example:** Count ways to reach a distance using steps of one or two: every valid final move comes from `n-1` or `n-2`. The recurrence is useful only after base values and state meaning are explicit.

### Data Structure Brainstorm

**Intent:** let operations select representation. **Procedure:** list required lookup, ordering, update, min/max, adjacency, and memory operations; compare candidate costs; choose and justify. **Does not work:** as a ritual list without the operation contract.

**Example:** For a streaming median, one heap cannot expose both middle candidates. A max-heap for the lower half and min-heap for the upper half make the boundary values available while rebalancing sizes.

### Walk Through

**Intent:** make the algorithm implementation-ready. **Procedure:** trace one useful case; name variables and invariants; describe every transition; include termination and failure; identify helper boundaries. **Mistake:** coding while the trace still contains “and then somehow.”

### Test

**Intent:** find defects deliberately. **Procedure:** conceptual review; unusual code; index/arithmetic/null hotspots; small representative input; empty/base/singleton; duplicates/extremes/no-solution; repair without destabilizing unrelated code. **Mistake:** one large happy-path test.

### Optimize and Communicate

Optimization is a claim about removed work, not clever syntax. Explain the baseline, lower bound, eliminated waste, new complexity, and space trade-off. Keep speaking while coding, but prefer concise state and invariant updates over a stream of guesses.

## 5. Complexity Targets

- State both time and auxiliary space for baseline and optimized approaches.
- Define variables when inputs have different sizes.
- Use BCR to explain why you continue optimizing or why you stop.
- Count preprocessing separately when queries repeat.
- Include output size and recursive stack depth.

## 6. Typical Traps

- Assuming the first interpretation instead of clarifying.
- Choosing a tiny, sorted, balanced, or otherwise special example.
- Hiding the brute force because it seems unimpressive.
- Coding before the invariant is stable.
- Treating a memorized pattern as proof.
- Claiming “optimal” without a lower bound.
- Going silent during implementation.
- Fixing a test failure locally without rechecking the invariant.

## 7. Testing Strategy

Create a test matrix before code:

| Dimension | Cases |
| --- | --- |
| Size | empty, one, two, representative, large |
| Shape | sorted, reverse, skewed, disconnected, repetitive |
| Values | duplicates, negatives, extremes, missing target |
| Boundaries | first/last index, exact capacity, off-by-one transitions |
| Contract | invalid input, mutation allowed/forbidden, repeated invocation |

## 8. Interview Communication Strategy

Use short checkpoints:

- “I’m assuming duplicates are allowed; that changes how I store visited values.”
- “The baseline is quadratic because each item rescans the prefix.”
- “Reading every item gives a linear BCR, so I’m looking for that extra scan.”
- “A set removes it at the cost of linear space.”
- “Before coding, I’ll trace the invariant on a duplicate-heavy case.”

## 9. Representative Transformed Example

Given event identifiers, report whether any identifier repeats.

1. Clarify whether identifiers are normalized and whether mutation is allowed.
2. Example: `[a, c, b, c]` -> repetition exists.
3. Baseline: compare every pair, `O(n²)` time and `O(1)` space.
4. BCR: any unseen final element could be the duplicate, so all `n` items may need reading.
5. BUD: repeated prefix scans duplicate membership work.
6. Structure: a set supports expected constant-time membership.
7. Walkthrough invariant: before processing index `i`, the set contains exactly indices `< i`.
8. Test empty, singleton, adjacent duplicate, late duplicate, and all unique.

## 10. Practice Routing

- Cannot clarify -> rewrite five prompts as explicit contracts.
- Cannot form a baseline -> solve only brute force for a session.
- Cannot optimize -> mark B/U/D on every operation in a trace.
- Cannot choose structures -> practice operation-cost comparison tables.
- Cannot test -> predict three failures before running any code.
- Communication weakness -> record narrated paper solutions and review silent gaps.
