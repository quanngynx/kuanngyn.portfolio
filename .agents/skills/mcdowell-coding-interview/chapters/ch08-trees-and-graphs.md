# Chapter 8: Trees and Graphs

## 1. Core Concepts

Tree and graph questions are assumption-sensitive. Clarify structure before selecting an algorithm.

- A binary tree only limits children; it is not automatically ordered or balanced.
- A binary search tree adds a global ordering invariant across descendants; duplicate policy varies.
- Balanced, complete, full, and perfect describe different properties.
- A graph may be directed/undirected, cyclic/acyclic, connected/disconnected, weighted/unweighted.
- Trees have a unique parent path under ordinary definitions; general graphs require visited-state control.

## 2. Recognition Signals

- **Hierarchy, subtree, ancestor, path from root** -> tree traversal and recursive state.
- **Reachability, dependencies, relationships** -> graph representation plus DFS/BFS.
- **Shortest path in an unweighted graph** -> BFS.
- **Ordering or range query** -> clarify whether the tree is a BST and balanced.
- **Top-k or repeated min/max** -> heap, not an arbitrary tree.
- **Prefix search** -> trie.
- **Prerequisites/dependencies** -> directed graph, cycle detection, topological ordering.
- **All paths or path sum** -> backtracking with explicit path state.

## 3. Common Data Structures / Algorithms

| Structure/algorithm | Use | Key cost or invariant |
|---|---|---|
| Adjacency list | Sparse graph | `O(V+E)` storage/traversal |
| Adjacency matrix | Dense graph/constant edge test | `O(V²)` storage |
| DFS | Explore component, recursive structure, backtracking | `O(V+E)`; stack may reach `O(V)` |
| BFS | Levels, shortest unweighted path | `O(V+E)`; frontier may reach `O(V)` |
| In-order traversal | BST values in sorted order | left -> node -> right |
| Pre-order traversal | Root before descendants | node -> left -> right |
| Post-order traversal | Children before parent aggregation | left -> right -> node |
| Heap | Repeated extremum/top-k | root `O(1)`, update `O(log n)` |
| Trie | Prefix lookup | roughly proportional to key length |

## 4. Problem-Solving Patterns

### Clarify the Structure

Ask: binary? BST? duplicate policy? balanced? parent pointers? directed? weighted? cycles? disconnected components? These answers determine correctness and complexity. Never infer “BST” from the word “tree.”

### Choose DFS or BFS by Evidence

- Use BFS when level order or the first unweighted path matters.
- Use DFS when recursive aggregation, exhaustive path exploration, or low expected depth makes it natural.
- Either can establish reachability; choose from path, memory, and traversal-order requirements.

### Carry Only Required State

Tree recursion often needs state from ancestors: bounds, depth, partial aggregate, or parent result. Define what the return value means. In graph traversal, distinguish global visited state from path-local state; conflating them can incorrectly prune valid paths.

### Mark Visited at Discovery

For ordinary BFS/DFS reachability, mark a node when enqueued/pushed, not later when removed. This prevents duplicate frontier entries and repeated work.

### Bounds, Not Just Parent Comparison

To validate global ordering, propagate allowable lower/upper bounds. Comparing a node only with its immediate parent misses violations deeper in a subtree.

## 5. Complexity Targets

- Full traversal: `O(number of nodes)` for a tree; `O(V+E)` for adjacency-list graphs.
- Balanced BST lookup: `O(log n)`; unbalanced worst case: `O(n)`.
- BFS/DFS auxiliary space: proportional to frontier or depth, potentially `O(V)`.
- Heap insertion/extraction: `O(log n)`; minimum/maximum at root: `O(1)`.
- Building adjacency lists: `O(V+E)` when vertices and edges are explicit.
- All-path enumeration may be exponential because output itself can be exponential.

## 6. Typical Traps

- Assuming ordered, balanced, complete, or acyclic structure.
- Checking BST ordering only against immediate children.
- Forgetting disconnected components.
- Marking visited too late and enqueuing a node repeatedly.
- Using one global visited set for a problem that asks for distinct paths under path-local constraints.
- Recursive DFS overflowing on a deep chain.
- Claiming tree operations are `O(log n)` without a balance guarantee.
- Using BFS for weighted shortest paths without validating edge weights.
- Losing parent/provenance data when the path—not just reachability—must be returned.

## 7. Testing Strategy

- Empty structure and one node.
- Balanced tree, one-sided chain, duplicate values, and a deep ordering violation.
- Directed cycle, self-loop, duplicate edge, and disconnected graph.
- Source equals target; target unreachable; multiple shortest paths.
- Wide graph for BFS memory; deep graph for DFS stack.
- Heap with even/odd sizes, repeated values, and alternating extremes.

For traversal, log node discovery order, visited state, and frontier/stack contents on a tiny irregular graph.

## 8. Interview Communication Strategy

Start by naming assumptions:

> “I’m treating this as a directed, unweighted graph that may contain cycles and disconnected vertices. Since we need a shortest edge-count path, I’ll use BFS, mark nodes when discovered, and retain a parent map for reconstruction. Runtime is `O(V+E)` with adjacency lists.”

For recursive tree solutions, define the function contract before code: “This call returns whether this subtree is valid within `(lower, upper)`,” or “returns both height and validity.”

## 9. Representative Transformed Examples

### Unweighted Reachability With Path Reconstruction

```ts
function shortestPath(
  graph: Map<string, string[]>,
  start: string,
  goal: string,
): string[] | null {
  const queue = [start];
  const parent = new Map<string, string | null>([[start, null]]);

  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    if (node === goal) return rebuildPath(parent, goal);

    for (const next of graph.get(node) ?? []) {
      if (parent.has(next)) continue;
      parent.set(next, node); // mark at discovery
      queue.push(next);
    }
  }
  return null;
}

function rebuildPath(parent: Map<string, string | null>, goal: string): string[] {
  const path: string[] = [];
  for (let node: string | null = goal; node !== null; node = parent.get(node) ?? null) {
    path.push(node);
  }
  return path.reverse();
}
```

### Global BST Invariant

```ts
type Node = { value: number; left?: Node; right?: Node };

function isOrdered(node: Node | undefined, low = -Infinity, high = Infinity): boolean {
  if (!node) return true;
  if (node.value <= low || node.value >= high) return false;
  return isOrdered(node.left, low, node.value)
    && isOrdered(node.right, node.value, high);
}
```

This version chooses a strict no-duplicates policy. If duplicates are allowed, the contract and boundary comparisons must change explicitly.

## 10. Practice Routing

- Confuses tree types -> classify binary/BST/balanced/complete/full/perfect examples.
- DFS/BFS uncertainty -> route the same graph tasks by path and ordering requirements.
- Misses cycles -> write visited timing and test a self-loop.
- Recursive contract unclear -> state return meaning before implementation.
- Complexity overclaims -> compare balanced tree with a linked-list-shaped tree.
- Path reconstruction weakness -> add parent/provenance state to reachability drills.

## Connects To

- [Big O](ch02-big-o.md): height, branching, frontier, and `V+E` analysis.
- [Problem Solving](ch03-problem-solving-framework.md): clarification and Data Structure Brainstorm.
- [Recursion and DP](ch11-recursion-and-dynamic-programming.md): subtree return contracts, backtracking, and repeated graph states.
- Planned `ch13` System Design: dependency graphs and distributed topology.

