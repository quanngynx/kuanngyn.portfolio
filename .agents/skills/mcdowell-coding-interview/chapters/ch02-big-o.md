# Chapter 2: Big O

## 1. Core Concepts

Big O is a model of how resource use grows with input, not an instruction-count stopwatch. In interviews, state the tight, relevant growth rate and define every variable.

- **Time complexity**: growth in executed work.
- **Space complexity**: additional memory, including simultaneous recursive stack frames.
- **Worst versus expected case**: name the case when they differ; best case is rarely useful.
- **Amortized cost**: an occasional expensive operation distributed across many cheap operations.
- **Best Conceivable Runtime (BCR)**: a problem-level lower-bound target derived from unavoidable input/output work, not from an algorithm.

## 2. Recognition Signals

- A loop over `n` items suggests linear work unless its body hides another input-dependent operation.
- Sequential independent phases add: `O(a + b)`.
- Work performed for every combination multiplies: `O(a * b)`.
- Repeatedly halving the remaining search space suggests `O(log n)`.
- Divide, solve both halves, and combine commonly suggests `O(n log n)` when each level does linear total work.
- A recursion with `b` branches and depth `d` may approach `O(b^d)` before pruning or memoization.
- Generating output can impose a lower bound even if lookup is cheap.

## 3. Common Data Structures / Algorithms

| Operation | Typical target | Conditions |
| --- | ---: | --- |
| Array index | `O(1)` | Valid index and direct addressing |
| Hash lookup | Expected `O(1)` | Good hashing; worst case may degrade |
| Balanced-tree lookup | `O(log n)` | Balance and comparison ordering |
| Binary search | `O(log n)` | Sorted data or monotonic predicate |
| Heap insert/extract | `O(log n)` | Min/max access at root |
| BFS/DFS | `O(V + E)` | Adjacency representation |
| Comparison sort | `O(n log n)` | General comparison model |
| Resizable-array append | Amortized `O(1)` | Geometric capacity growth |

## 4. Problem-Solving Patterns

### Derive, Do Not Guess

1. Define input variables independently.
2. Count how many times each stage executes.
3. Include hidden work in helpers and library calls.
4. Add sequential stages and multiply nested dependent stages.
5. Count peak simultaneous memory, not total allocations over time.
6. Drop constants and non-dominant terms only after deriving the expression.

### Recursion Tree

Draw one level per call depth. Label branching, shrinking input, repeated states, and non-recursive work. Sum work across levels. This prevents the common mistake of treating “two recursive calls” as automatically quadratic.

### BCR Gap

If a proposal is `O(n²)` while every input must only be read once, ask what causes the extra factor: repeated lookup, pair enumeration, sorting, or duplicated subproblems. The gap directs [BUD](ch03-problem-solving-framework.md#bud-bottlenecks-unnecessary-work-duplicated-work).

## 5. Complexity Targets

Use these as prompts, not universal requirements:

| Problem shape | Initial target question |
| --- | --- |
| Read or transform every element | Can this be `O(n)`? |
| Search sorted input | Can the decision space be halved? |
| Compare two sorted collections | Can two monotonic pointers achieve `O(a+b)`? |
| Repeated membership checks | Can indexing replace a scan? |
| Enumerate all subsets | Is exponential output unavoidable? Can invalid branches be pruned? |
| Repeated recursive states | How many distinct states exist? |
| Produce all pairs | Does output itself require `Θ(n²)`? |

## 6. Typical Traps

- Writing `O(2n)` instead of `O(n)` or retaining a dominated `+ n` term.
- Collapsing independent variables without a stated relationship: `O(a + b)` is not automatically `O(n)`.
- Multiplying sequential loops or adding nested loops.
- Ignoring string copies, slicing, hashing, sorting, or collection operations.
- Counting recursive calls over time as space even when frames are not simultaneous—or ignoring stack depth when they are.
- Calling an expected hash-table lookup an unconditional worst-case guarantee.
- Confusing BCR with the best case of one implementation.
- Assuming BCR is achievable.

## 7. Testing Strategy

Complexity claims need adversarial shapes:

- Empty and singleton inputs expose base behavior.
- Already sorted, reverse sorted, all equal, and highly skewed inputs expose expected/worst-case differences.
- Deep chains expose recursive stack use hidden by balanced examples.
- Repeated values expose collision, deduplication, and caching behavior.
- Instrument call counts for small `n`; compare the observed growth when `n` doubles.

## 8. Interview Communication Strategy

Say the derivation, not only the answer:

> “Let `n` be the number of records. Building the index touches each record once, so that is `O(n)` time and space. The second pass performs expected constant-time lookups, also `O(n)`. Sequential phases add to `O(n)`, and the index dominates auxiliary space.”

If assumptions matter, state them: expected hashing, balanced tree, bounded alphabet, mutation allowed, or input already sorted.

## 9. Representative Transformed Examples

### Sequential Versus Nested Work

```ts
function report(left: number[], right: number[]) {
  for (const value of left) console.log(value);
  for (const value of right) console.log(value);
  // O(left.length + right.length)
}

function reportPairs(left: number[], right: number[]) {
  for (const a of left) {
    for (const b of right) console.log(a, b);
  }
  // O(left.length * right.length); output has the same lower bound.
}
```

### Amortized Append

A growable buffer doubles when full. Copies occur at capacities `1, 2, 4, ...`. Across `n` appends, total copying is less than a constant multiple of `n`, so average append cost is amortized `O(1)` even though one resize costs `O(n)`.

### Branching Recursion

```ts
function duplicateWork(depth: number): number {
  if (depth <= 0) return 1;
  return duplicateWork(depth - 1) + duplicateWork(depth - 1);
}
```

The call tree has two branches per level and depth `depth`, so calls grow exponentially. Cache by `depth` or remove the duplicate call; syntax alone does not reveal the fix, the repeated state does.

## 10. Practice Routing

- Wrong add/multiply decisions -> annotate sequential and nested phases on five snippets.
- Weak recursive analysis -> draw call trees with branching, depth, and repeated states.
- Space mistakes -> track peak live frames and auxiliary structures.
- Overconfident optimality -> state BCR separately, then explain whether it is achievable.
- Hidden-operation mistakes -> expand standard-library calls into their likely costs.

## Connects To

- [Problem-Solving Framework](ch03-problem-solving-framework.md): uses complexity as evidence during optimization.
- [Arrays and Strings](ch05-arrays-and-strings.md): exposes copy, resize, lookup, and window costs.
- [Trees and Graphs](ch08-trees-and-graphs.md): connects shape to height and `V+E` traversal.
- [Recursion and DP](ch11-recursion-and-dynamic-programming.md): converts recursion trees into distinct-state analysis.
