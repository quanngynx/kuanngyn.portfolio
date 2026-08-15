# Chapter 14: Sorting and Searching

## 1. Core Concepts

Sorting creates order that can simplify later work; searching exploits order or indexing. The central decision is whether preprocessing cost is justified by query count and required outputs.

- Comparison sorting has a general `Omega(n log n)` lower bound.
- Counting/radix approaches can beat that bound only by using key-domain structure.
- Binary search finds values, boundaries, or the first feasible answer under a monotonic predicate.
- Merge-based processing is useful when two ordered sources must be combined.

## 2. Recognition Signals

- Many membership/range queries -> sort once or build an index.
- Monotonic true/false condition -> binary search for a boundary.
- Two sorted collections -> merge/two pointers.
- Overlapping intervals -> sort by a boundary, then sweep.
- Top-k -> heap or selection instead of full sorting.
- Bounded integer keys -> counting buckets or radix processing.
- Data exceeds memory -> external runs and multiway merge.

## 3. Common Data Structures / Algorithms

| Technique | Typical time | Main property |
|---|---|---|
| Merge sort | `O(n log n)` | Stable; linear auxiliary storage for arrays |
| Quicksort | Expected `O(n log n)` | In-place variants; pivot-sensitive worst case |
| Heap sort | `O(n log n)` | In-place, not stable in common forms |
| Counting sort | `O(n + k)` | Requires bounded key range `k` |
| Binary search | `O(log n)` | Requires ordered domain or monotonic predicate |
| Heap selection | `O(n log k)` | Retain top/bottom `k` |

## 4. Problem-Solving Patterns

### Boundary Binary Search

Define the search interval and invariant. Decide whether the answer is first true, last false, exact match, lower bound, or upper bound before implementing.

### Sort Then Sweep

Use ordering to make relevant candidates adjacent. State whether sorting destroys original indices or stability and retain metadata when needed.

### Preprocess Versus Query

Compare one-time sort/index cost with the number and type of future queries. A linear scan may be best for one small query.

## 5. Complexity Targets

- One binary search is `O(log n)` only after ordered access exists.
- Sort plus linear sweep is `O(n log n)`.
- Repeated sorting inside a loop is a common hidden bottleneck.
- Library sort complexity, stability, mutation, and comparator requirements are language-specific assumptions.
- Searching a linked list cannot exploit midpoint access in constant time.

## 6. Typical Traps

- Infinite loops from inconsistent interval updates.
- Returning any match when the first/last boundary is required.
- Comparator subtraction overflowing in fixed-width languages.
- Sorting away required original positions.
- Calling binary search on a non-monotonic predicate.
- Using counting sort when the key range dwarfs input size.
- Ignoring duplicates and stability.

## 7. Testing Strategy

Test empty and singleton collections, target before/at/after boundaries, duplicates, all-equal values, sorted/reverse input, skewed pivots, very large keys, and monotonic predicates that are all false or all true. For binary search, trace `low`, `high`, and the invariant each iteration.

## 8. Interview Communication Strategy

Name what order buys you and whether preprocessing is allowed. State interval convention (`[low, high)` or inclusive) and the exact boundary being found. Include sorting cost in total complexity even when using a library call.

## 9. Representative Transformed Examples

Find the first index satisfying a monotonic predicate:

```ts
function firstTrue(length: number, predicate: (index: number) => boolean): number {
  let low = 0;
  let high = length;
  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);
    if (predicate(middle)) high = middle;
    else low = middle + 1;
  }
  return low;
}
```

The half-open invariant is: every index below `low` is false; the answer, if present, lies in `[low, high]`.

## 10. Practice Routing

- Binary-search bugs -> standardize one interval convention.
- Missed sorting strategy -> ask what becomes adjacent after ordering.
- Over-sorting -> compare selection/heap and one-query scans.
- Duplicate errors -> drill lower and upper bounds.
- External-data confusion -> practice sorted runs plus k-way merging.

## Connects To

- [Arrays and Strings](ch05-arrays-and-strings.md): two pointers and intervals.
- [Trees and Graphs](ch08-trees-and-graphs.md): heaps and ordered trees.
- [Big O](ch02-big-o.md): preprocessing and lower bounds.

