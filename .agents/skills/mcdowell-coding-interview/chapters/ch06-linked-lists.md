# Chapter 6: Linked Lists

## 1. Core Concepts

A linked list trades random access for cheap local relinking. Interview problems usually test pointer invariants, identity, and whether state can be retained while links change.

- A node is identified by its reference, not merely its value.
- Singly linked lists support forward traversal; doubly linked lists add predecessor access at a space and maintenance cost.
- Insertion or deletion is constant time only after the relevant node or predecessor is known.
- A dummy head can remove special cases at the first real node.

## 2. Recognition Signals

- Unknown length or midpoint -> slow/fast runners.
- Cycle or repeated node identity -> tortoise/hare or a visited set.
- Delete/filter while traversing -> predecessor plus current pointer, often with a dummy head.
- Reverse order in place -> previous/current/next invariant.
- Two lists merge by reference -> align lengths or compare tails.
- Need the kth node from the end -> maintain a fixed gap between two runners.

## 3. Common Data Structures / Algorithms

| Technique | Purpose | Cost |
|---|---|---|
| Dummy head | Uniform insertion/deletion | `O(1)` extra space |
| Slow/fast runners | Midpoint, cycle, fixed gap | `O(n)` time, `O(1)` space |
| Hash set of nodes | Explicit identity tracking | `O(n)` expected time and space |
| Iterative reversal | Reverse links safely | `O(n)` time, `O(1)` space |
| Stack/recursion | Reverse-order comparison | `O(n)` time and space |

## 4. Problem-Solving Patterns

### Preserve Before Rewiring

Save `next` before changing the current node's link. Maintain the invariant that the reversed prefix ends at `previous` and the untouched suffix begins at `current`.

### Runner Gap

Advance one pointer `k` steps, then move both until the leading pointer reaches the end. Define whether `k=1` means the last node before coding.

### Identity, Not Equality

Intersection and cycles concern the same node object. Equal values do not imply shared structure.

## 5. Complexity Targets

- A single traversal should normally be `O(n)`.
- Searching for a value remains `O(n)`; a linked list is not an index.
- Repeatedly scanning from the head to reach positions can create `O(n^2)` work.
- Recursion adds `O(n)` call-stack space even when no explicit collection is used.

## 6. Typical Traps

- Losing the remaining list after overwriting `next`.
- Skipping consecutive matches during deletion.
- Dereferencing `fast.next` without checking both runner conditions.
- Comparing values when reference identity is required.
- Claiming constant-time deletion when the predecessor must first be found.
- Forgetting that a cycle makes an ordinary end-based traversal non-terminating.

## 7. Testing Strategy

Test empty, one-node, two-node, and longer lists; changes at head, middle, and tail; all nodes removed; duplicate values stored in distinct nodes; cycles entering at head and middle; and two lists with equal values but no shared nodes. Draw nodes and arrows for every rewiring step.

## 8. Interview Communication Strategy

State ownership and identity assumptions. Name the pointer invariant before code, then explain why every node is visited a bounded number of times. If using recursion, include stack depth in the space analysis.

## 9. Representative Transformed Examples

Reverse a singly linked chain without copying nodes:

```ts
type Link<T> = { value: T; next: Link<T> | null };

function reverse<T>(head: Link<T> | null): Link<T> | null {
  let previous: Link<T> | null = null;
  let current = head;
  while (current !== null) {
    const remaining = current.next;
    current.next = previous;
    previous = current;
    current = remaining;
  }
  return previous;
}
```

The key proof is structural: after each iteration, every node before `current` belongs to a valid reversed chain ending in the original prefix boundary.

## 10. Practice Routing

- Pointer loss -> narrate `previous/current/remaining` on paper.
- Head special cases -> repeat deletion exercises with a dummy node.
- Cycle confusion -> trace runner positions by step number.
- Identity mistakes -> use diagrams containing duplicate values.
- Hidden quadratic work -> count how often traversal restarts from the head.

## Connects To

- [Stacks and Queues](ch07-stacks-and-queues.md): list-backed implementations.
- [Trees and Graphs](ch08-trees-and-graphs.md): reference identity and visited state.
- [Problem-Solving Framework](ch03-problem-solving-framework.md): pointer walkthroughs and BUD.

