# Chapter 20: Moderate Mixed-Domain Problems

## 1. Core Concepts

Moderate problems test whether familiar tools can be recognized when the topic label is hidden. The skill is translating a story into operations, finding a correct baseline, and removing one or two dominant sources of waste.

- Mixed-domain problems rarely require obscure algorithms.
- Representation and boundary decisions often matter more than syntax.
- BUD and Best Conceivable Runtime provide a disciplined optimization path.
- A compact proof and strong tests distinguish a robust solution from a plausible one.

## 2. Recognition Signals

- Repeated membership/counting -> hash state.
- Sorted boundaries or intervals -> sort and sweep/two pointers.
- Repeated extremum -> heap or monotonic structure.
- Stream with limited memory -> retained summary, reservoir-like reasoning, or online invariant.
- Geometric coordinates -> normalize representation and handle degeneracy.
- Parsing/evaluation -> stack, state machine, or recursive structure.
- Random output -> define distribution before implementation.

## 3. Common Data Structures / Algorithms

| Problem shape | First candidates |
|---|---|
| Counts, pairs, complements | Map/set, sorting, two pointers |
| Intervals and boundaries | Sorting, sweep, prefix events |
| Online top/bottom values | Heap, bounded ordered state |
| Nested tokens | Stack or parser state |
| Grid/coordinates | Hashing normalized points, BFS/DFS |
| Repeated query | Preprocessing, cache, index |

## 4. Problem-Solving Patterns

### Baseline to One Structural Improvement

Write brute force and mark repeated scans, searches, or recomputation. Replace the dominant waste with one structure or maintained invariant, then recalculate complexity.

### Normalize Before Comparing

Canonicalize equivalent strings, coordinates, ranges, or ratios so equality and hashing are reliable. Define signs, zero cases, and precision rules.

### Online State

When data arrives once, state exactly what summary is retained and why discarded history cannot change future answers.

## 5. Complexity Targets

Use BCR from required input/output. Common targets are linear for one-pass counting, `O(n log n)` when general sorting creates necessary order, `O(n log k)` for bounded top-k, and output-sensitive complexity when all combinations must be produced.

## 6. Typical Traps

- Treating the source chapter label as an algorithm hint.
- Replacing brute force with a hash map without defining keys.
- Losing multiplicity or original indices.
- Floating-point equality for normalized geometry/ratios.
- Claiming uniform randomness without proving the distribution.
- Hiding important work inside library calls.
- Coding before the transformed example exposes the invariant.

## 7. Testing Strategy

Use empty/singleton cases, duplicates, ties, negative and zero values, sorted/reverse order, degenerate geometry, malformed tokens, very skewed frequencies, and no-solution cases. Compare optimized output against brute force for small generated inputs.

## 8. Interview Communication Strategy

Classify operations aloud without naming a memorized source problem. Explain baseline, BUD observation, structure choice, invariant, and exact complexity change. If several strategies tie asymptotically, compare simplicity, memory, ordering, and worst-case behavior.

## 9. Representative Transformed Examples

Given timestamped category events, find the most frequent category in a requested interval. A baseline scans all events per query. If many queries are expected, sort/index by time and retain category aggregates appropriate to the query contract. The design decision depends on update frequency, category count, and whether intervals are known in advance.

## 10. Practice Routing

- Cannot classify -> list required operations before structures.
- Optimization stalls -> annotate BUD line by line.
- Geometry errors -> canonicalize signs and degenerate cases.
- Randomness errors -> enumerate tiny outcome distributions.
- Fragile solution -> differential-test against brute force.

## Connects To

- [Problem-Solving Framework](ch03-problem-solving-framework.md): BUD and BCR.
- [Sorting and Searching](ch14-sorting-and-searching.md): order and intervals.
- [Arrays and Strings](ch05-arrays-and-strings.md): hashing and windows.
- [Hints and Practice](ch22-hints-and-deliberate-practice.md): weakness routing.

