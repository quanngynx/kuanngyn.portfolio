# Chapter 11: Recursion and Dynamic Programming

## 1. Core Concepts

Recursion expresses a problem in terms of smaller states. Dynamic programming removes duplicated work when many recursive paths reach the same state.

- **Recursive contract**: the precise meaning of one call's parameters and return value.
- **Base case**: a state whose result is known without further recursion.
- **Progress measure**: the quantity that moves every call toward termination.
- **Choice and undo**: backtracking explores alternatives while restoring path-local state.
- **Overlapping subproblems**: distinct call paths request the same state.
- **Memoization/top-down DP**: cache results by complete state.
- **Bottom-up DP**: evaluate states in dependency order.
- **Space optimization**: retain only prior states still needed.

## 2. Recognition Signals

- “All ways,” “all combinations,” or “choose/skip” suggests backtracking or recursive enumeration.
- A result for size `n` depends naturally on smaller sizes -> Base Case and Build.
- The same `(index, remaining, context)` appears on multiple branches -> memoization candidate.
- The problem asks for minimum, maximum, count, or feasibility across choices -> DP may apply if state repeats and subsolutions compose.
- Input can be divided into independent halves -> divide and conquer.
- A recursive solution is clear but depth can be large -> consider an explicit stack or bottom-up iteration.
- Only the previous one or two rows/states are needed -> compress DP space.

## 3. Common Data Structures / Algorithms

| Tool | Use | Main risk |
|---|---|---|
| Call stack | Natural hierarchical decomposition | Depth and hidden `O(depth)` space |
| Explicit stack | Iterative DFS or recursion replacement | Manual frame/state management |
| Memo map/array | Cache repeated states | Incomplete or mutable cache key |
| DP table | Bottom-up dependency evaluation | Wrong order or meaningless dimensions |
| Choice list/path | Backtracking output construction | Missing undo or shared mutation |
| Boolean visited set | Cycle prevention | Confusing global and path-local state |

## 4. Problem-Solving Patterns

### Define the Recursive Contract First

Write one sentence:

> `solve(state)` returns ______ for exactly ______.

Then specify base cases and prove every recursive transition reduces a progress measure. Code is premature until the contract makes combination logic obvious.

### State, Choices, Constraints, Goal

For backtracking, identify:

1. **State**: what uniquely describes the partial solution?
2. **Choices**: what can be selected next?
3. **Constraints**: when is a choice invalid?
4. **Goal**: when is a complete result emitted?
5. **Undo**: what mutation must be reversed?

### Draw the Call Tree

Label calls by state, not only function name. Count branches and depth for a first complexity estimate. Circle repeated states. Repetition—not recursion by itself—is the signal for memoization.

### Base Case and Build

Solve `n=0` or `n=1`, then the first nontrivial case. Ask how a solution for smaller `n` can be extended without invalidating its invariant. This may produce recursion, induction, or an iterative recurrence.

### Memoize Complete State

A cache key must include every input dimension that can change the result. Caching only `index` is wrong if `remainingBudget` also matters. Cache results, including valid falsy results; do not use `0` or `false` as an ambiguous “not computed” sentinel.

### Convert Top-Down to Bottom-Up

1. State what `dp[state]` means.
2. Translate recursive base cases into initialized entries.
3. Translate recursive calls into dependencies.
4. Choose an order in which every dependency is ready.
5. Return the entry corresponding to the original problem.

Use bottom-up when it simplifies stack use or iteration order. Keep top-down when it visits only a sparse fraction of possible states or mirrors the reasoning more clearly.

### Recursion Versus Iteration

All recursion can be simulated iteratively, but the explicit version may be harder to verify. Compare:

- maximum depth and stack safety;
- clarity of state transitions;
- need for backtracking frames;
- whether a natural bottom-up order exists;
- whether tail-call optimization is actually guaranteed by the language/runtime.

## 5. Complexity Targets

Analyze DP as:

```text
number of distinct states * work per state
```

- Naive branching recursion: roughly `O(branches^depth)` before pruning.
- Memoized recursion: often bounded by distinct states, plus recursion stack.
- Backtracking that emits all results: at least proportional to output size.
- Grid DP: commonly `O(rows*cols)` time and space, sometimes compressible to one row.
- Subset state: potentially `O(n * target)` for bounded-sum DP or `O(2^n)` for explicit subsets; do not conflate them.
- Divide-and-conquer: derive work per level and number of levels rather than guessing.

## 6. Typical Traps

- Missing or overlapping base cases.
- A recursive transition that does not strictly progress.
- Exponential duplicated work hidden by small examples.
- Memoizing an incomplete state key.
- Caching results that depend on mutable external state.
- Using a global visited set where backtracking needs path-local membership.
- Forgetting to undo a choice after a recursive call.
- Counting only DP table size but ignoring transition work.
- Bottom-up loops evaluated before dependencies exist.
- Claiming `O(n)` space for a table after compressing it—or `O(1)` while recursion still uses `O(n)` stack.

## 7. Testing Strategy

- Base states: `0`, `1`, empty collection, exact target.
- First interesting state where multiple transitions meet.
- Impossible state and state with many valid paths.
- Duplicate values and choices that lead to the same state.
- Deep input for stack behavior.
- Memo hit validation: instrument the number of computed distinct states.
- Compare memoized and bottom-up results for small exhaustive inputs.
- Backtracking: verify path state before and after undo.

## 8. Interview Communication Strategy

Explain the evolution rather than presenting DP as a trick:

> “The direct recursion branches on the final choice. Its call tree repeats the same remaining distance, so runtime is exponential. The complete state is just `remaining`; caching each value means `n+1` states with constant transition work, giving `O(n)` time and `O(n)` cache/stack space. A bottom-up loop can remove the recursive stack, and only two prior values are needed.”

For backtracking, state whether output size is exponential and whether that makes the runtime unavoidable.

## 9. Representative Transformed Examples

### Count Step Sequences

Count how many ordered sequences of steps of length one or two reach an exact distance. This is a generic recurrence illustration, not a reproduced interview question.

```ts
function countWays(distance: number): number {
  const memo = new Map<number, number>();

  const solve = (remaining: number): number => {
    if (remaining === 0) return 1;
    if (remaining < 0) return 0;
    const cached = memo.get(remaining);
    if (cached !== undefined) return cached;

    const result = solve(remaining - 1) + solve(remaining - 2);
    memo.set(remaining, result);
    return result;
  };

  return solve(distance);
}
```

State meaning: `solve(r)` is the number of valid ordered step sequences that cover exactly `r` remaining units. There are `O(distance)` distinct states and constant work per state.

Bottom-up space compression:

```ts
function countWaysIterative(distance: number): number {
  if (distance < 0) return 0;
  let waysToPrevious = 1; // distance 0
  let waysToCurrent = 1;  // distance 1

  for (let d = 2; d <= distance; d++) {
    [waysToPrevious, waysToCurrent] = [waysToCurrent, waysToPrevious + waysToCurrent];
  }
  return distance === 0 ? waysToPrevious : waysToCurrent;
}
```

### Backtracking Skeleton

```ts
function explore<State, Choice>(
  state: State,
  choices: (state: State) => Choice[],
  apply: (state: State, choice: Choice) => void,
  undo: (state: State, choice: Choice) => void,
  complete: (state: State) => boolean,
  emit: (state: State) => void,
) {
  if (complete(state)) {
    emit(state);
    return;
  }
  for (const choice of choices(state)) {
    apply(state, choice);
    explore(state, choices, apply, undo, complete, emit);
    undo(state, choice);
  }
}
```

Real implementations must filter invalid choices and ensure emitted state is copied when later mutations would alter it.

## 10. Practice Routing

- Cannot write recursion -> contract/base/progress drills without optimization.
- Exponential surprise -> draw call trees and label repeated states.
- Cache bugs -> list every changing input dimension before choosing the key.
- Bottom-up confusion -> translate one memoized recurrence into table meaning/base/order/result.
- Stack concerns -> rewrite tree/graph recursion with explicit frames.
- Backtracking corruption -> trace apply/undo on two branches and inspect shared references.
- Complexity weakness -> count distinct states and transition work separately.

## Connects To

- [Big O](ch02-big-o.md): branching, depth, stack, and distinct-state analysis.
- [Problem Solving](ch03-problem-solving-framework.md): Base Case and Build, DIY, BUD, and BCR.
- [Trees and Graphs](ch08-trees-and-graphs.md): recursive traversal, path state, and graph cycles.
- [Arrays and Strings](ch05-arrays-and-strings.md): DP tables, subsequences, and index-based state.

