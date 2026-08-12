# Chapter 7: Stacks and Queues

## 1. Core Concepts

Stacks expose the most recently added item; queues expose the earliest. Their restricted access is useful because it encodes ordering guarantees directly.

- Stack operations are push, pop, and peek.
- Queue operations are enqueue, dequeue, and front.
- A deque supports both ends and often subsumes stack/queue behavior.
- An auxiliary structure may maintain a derived property such as minimum or maximum.

## 2. Recognition Signals

- Nested scopes, matching delimiters, undo, previous greater/smaller -> stack.
- Arrival order, scheduling, level traversal, shortest unweighted path -> queue.
- Next greater/smaller element -> monotonic stack.
- Rolling maximum/minimum -> monotonic deque.
- Need stack semantics over queue operations, or vice versa -> transfer/amortization design.

## 3. Common Data Structures / Algorithms

| Tool | Best fit | Key invariant |
|---|---|---|
| Array-backed stack | LIFO state | Active top is one array end |
| Circular buffer | Bounded queue | Head/tail wrap without shifting |
| Two-stack queue | FIFO from LIFO primitives | Output stack holds oldest items |
| Min stack | Constant-time minimum | Auxiliary top is current minimum |
| Monotonic stack/deque | Nearest or window extrema | Stored values remain ordered |

## 4. Problem-Solving Patterns

### Lazy Transfer

For a queue built from two stacks, move input items to the output stack only when the output is empty. Each item transfers at most once, giving amortized constant-time operations.

### Derived-State Stack

Store a parallel minimum per depth or store `(value, minimumSoFar)` together. Duplicate minima must be represented correctly.

### Monotonic Removal

When a new element makes older candidates permanently irrelevant, pop those candidates once. The total work is linear because each element enters and leaves at most once.

## 5. Complexity Targets

- Native stack/queue operations should be `O(1)` or amortized `O(1)`.
- Avoid array-front deletion when the language shifts all remaining elements.
- A monotonic scan is usually `O(n)`, despite an inner popping loop.
- BFS is `O(V + E)` with adjacency lists and visited-on-enqueue.

## 6. Typical Traps

- Calling a dynamic-array front removal constant time without checking semantics.
- Failing to define empty-pop behavior.
- Transferring between two stacks on every operation.
- Dropping duplicate minima from auxiliary state.
- Marking BFS nodes visited at dequeue time and enqueuing duplicates.
- Using a monotonic structure without defining strict versus non-strict comparison.

## 7. Testing Strategy

Exercise empty operations, one item, alternating insert/remove, growth and wraparound, duplicate extrema, monotonic input, all-equal input, and sequences that trigger a full lazy transfer. For amortized claims, label how many times each element moves.

## 8. Interview Communication Strategy

Explain why access order matches the problem. Distinguish worst-case cost of one transfer operation from amortized cost across a sequence. For monotonic structures, state which candidates are discarded and why they can never become answers later.

## 9. Representative Transformed Examples

A minimum-tracking stack can store one record per depth:

```ts
class MinStack {
  private readonly entries: Array<{ value: number; min: number }> = [];

  push(value: number): void {
    const previousMin = this.entries.at(-1)?.min;
    this.entries.push({ value, min: previousMin === undefined ? value : Math.min(value, previousMin) });
  }

  pop(): number | undefined {
    return this.entries.pop()?.value;
  }

  min(): number | undefined {
    return this.entries.at(-1)?.min;
  }
}
```

Every record describes the minimum of exactly the prefix ending at its depth.

## 10. Practice Routing

- Wrong order -> write the required removal sequence first.
- Amortization uncertainty -> count transfers per item.
- Min-stack bugs -> test repeated equal minima.
- Monotonic-stack confusion -> identify when a candidate becomes permanently dominated.
- BFS duplication -> practice visited-on-enqueue traces.

## Connects To

- [Linked Lists](ch06-linked-lists.md): linked backing structures.
- [Trees and Graphs](ch08-trees-and-graphs.md): DFS stacks and BFS queues.
- [Big O](ch02-big-o.md): amortized analysis.

