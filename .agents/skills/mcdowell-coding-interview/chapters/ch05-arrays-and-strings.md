# Chapter 5: Arrays and Strings

## 1. Core Concepts

Array and string problems often differ only in mutability and element type. The central interview decisions are usually representation, lookup strategy, and whether a range can be updated incrementally.

- Arrays provide constant-time index access but expensive middle insertion/deletion.
- Resizable arrays preserve index access and offer amortized constant-time append.
- Strings may be immutable; repeated concatenation can copy growing prefixes.
- Hash tables trade extra space and ordering guarantees for expected constant-time lookup.
- A bounded alphabet can replace a general map with a compact count array or bit set.

## 2. Recognition Signals

- **Duplicates, membership, complements, counts** -> set, map, or bounded counting array.
- **Permutation/anagram-like relation** -> normalized frequency state or sorting.
- **Contiguous substring/subarray** -> sliding window, two pointers, prefix aggregates.
- **Sorted arrays** -> monotonic pointers or binary search.
- **In-place edits** -> read/write pointers, careful capacity and interval conventions.
- **Matrix rows/columns** -> coordinate invariants and boundary-layer processing.
- **Repeated string append** -> mutable buffer rather than immutable concatenation.

Before selecting, ask about character set, case/whitespace normalization, duplicates, ordering, mutation, memory, and whether calls repeat.

## 3. Common Data Structures / Algorithms

| Tool | Best fit | Typical cost |
|---|---|---|
| Hash set | Seen/membership/deduplication | Expected `O(1)` per operation, `O(n)` space |
| Frequency map | Counts over arbitrary keys | `O(n)` build, key-dependent space |
| Count array | Small fixed key domain | `O(n + alphabet)` time |
| Bit set | Boolean state over bounded domain | Compact membership |
| Two pointers | Sorted data or converging boundaries | Often `O(n)` |
| Sliding window | Contiguous interval with incremental state | Often `O(n)` if pointers only advance |
| Prefix sum/state | Repeated range queries | `O(n)` preprocessing, often `O(1)` query |
| Mutable string buffer | Repeated append | Amortized linear total construction |

## 4. Problem-Solving Patterns

### Frequency-State Pattern

Define exactly what one count means. Increment from one input and decrement from another, or maintain a mismatch counter. Prefer a count array only when normalization creates a small known domain.

### Sliding Window

State the invariant before coding:

> The window contains indices `[left, right)`, and its stored counts describe exactly those elements.

Expand `right`, update state, and move `left` only while a validity condition requires it. If either pointer moves backward, the claimed linear bound needs rechecking.

### Read/Write Compaction

Use a read pointer to inspect source values and a write pointer for the next retained or transformed value. Prove which prefix is already final. Clarify whether overwriting unread data is possible.

### Sort Versus Hash

- Hash when expected linear time and extra space are acceptable.
- Sort when ordering is useful, deterministic comparison behavior matters, or auxiliary space constraints favor an in-place sort.
- Do not say sorting is `O(n)` because a library call looks like one statement.

### BUD Application

Nested membership scans are frequently duplicated work. Repeatedly rebuilding a window or substring is unnecessary work when counts can be updated at the two boundaries.

## 5. Complexity Targets

| Shape | Target question |
|---|---|
| Single-array membership/count | Can one pass plus `O(n)` or bounded-domain space solve it? |
| Two sorted arrays | Can two pointers achieve `O(a+b)`? |
| Fixed-size contiguous windows | Can each boundary update be `O(1)`? |
| Immutable string construction | Can a buffer make total copying linear? |
| All pairs/substrings | Is quadratic output required, or only one aggregate/answer? |
| Matrix transform | Is every cell touched once: `O(rows*cols)`? |

## 6. Typical Traps

- Assuming ASCII, lowercase, or normalized Unicode without asking.
- Treating expected hash lookup as an unconditional worst-case guarantee.
- Losing duplicate counts by using a boolean set where multiplicity matters.
- Sorting when original order or indices are part of the output.
- Returning a slice/view whose semantics differ from a copied value.
- Mixing inclusive and exclusive window boundaries.
- Repeated immutable concatenation creating quadratic copying.
- Performing an in-place transform without enough capacity or with unread-data overwrite.
- Using a special example containing no duplicates, spaces, or boundary matches.

## 7. Testing Strategy

- Empty input, singleton, exact-size window, and window larger than input.
- All unique, all equal, one late duplicate, and multiple duplicate counts.
- Match at first boundary, last boundary, overlapping matches, and no match.
- Mixed case, spaces, punctuation, and non-ASCII if the contract permits them.
- Sorted, reverse sorted, and already-normalized data.
- Matrices with one row, one column, rectangular shape, and affected first row/column.

For pointer algorithms, trace `(left, right, state)` after every boundary movement.

## 8. Interview Communication Strategy

Explain the representation choice before code:

> “Multiplicity matters, so a set is insufficient. I’ll keep counts for the current half-open window. Adding the right element and removing the left element are constant-time updates; each pointer advances at most `n` times, giving `O(n)` time.”

State normalization and mutation assumptions explicitly. If offering both sort and hash approaches, compare time, space, ordering, and worst-case behavior rather than presenting one as universally superior.

## 9. Representative Transformed Examples

### Fixed-Window Multiset Match

Determine whether a token stream contains a contiguous window with the same token multiplicities as a required multiset.

```ts
function hasMatchingWindow(stream: string[], required: string[]): boolean {
  if (required.length === 0) return true;
  if (required.length > stream.length) return false;

  const need = new Map<string, number>();
  const have = new Map<string, number>();
  for (const token of required) need.set(token, (need.get(token) ?? 0) + 1);

  const adjust = (token: string, delta: number) => {
    const next = (have.get(token) ?? 0) + delta;
    if (next === 0) have.delete(token);
    else have.set(token, next);
  };

  for (let right = 0; right < stream.length; right++) {
    adjust(stream[right], 1);
    if (right >= required.length) adjust(stream[right - required.length], -1);
    if (right + 1 >= required.length && sameCounts(need, have)) return true;
  }
  return false;
}

function sameCounts(a: Map<string, number>, b: Map<string, number>): boolean {
  if (a.size !== b.size) return false;
  for (const [key, count] of a) if (b.get(key) !== count) return false;
  return true;
}
```

This readable version may compare maps per window, so its exact complexity depends on distinct-key count. The optimization decision is to maintain a mismatch counter, making each boundary update constant time. Explain that change before implementing it.

### String Construction Smell

Appending each token to an immutable accumulated string may repeatedly copy the entire prefix. Collect pieces and join once, or use the language's mutable builder.

## 10. Practice Routing

- Misses hash solutions -> membership, complement, and count drills.
- Loses multiplicity -> frequency-map invariants and duplicate-heavy tests.
- Window bugs -> write half-open intervals and trace both boundaries.
- Space constraints -> compare sort, bit set, in-place marking, and count array.
- String complexity mistakes -> manually sum copied prefix lengths.
- Matrix bugs -> practice coordinate invariants on rectangular and one-row cases.

## Connects To

- [Big O](ch02-big-o.md): hidden copy and library-operation costs.
- [Problem Solving](ch03-problem-solving-framework.md): BUD, DIY, and representation selection.
- [Sorting and Searching](ch14-sorting-and-searching.md): binary search and ordered-array strategies.
- [Recursion and DP](ch11-recursion-and-dynamic-programming.md): subsequence state versus contiguous windows.
