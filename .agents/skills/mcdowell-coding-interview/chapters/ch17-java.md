# Chapter 17: Java

## 1. Core Concepts

Java interviews often test object semantics, collections, generics, exceptions, and managed-runtime behavior. Treat source-era APIs and platform details as historical examples; verify current behavior when version accuracy matters.

- Reference equality and logical equality are different.
- Equal objects must have compatible hash codes when used in hashed collections.
- Generics improve type safety but interact with invariance and type erasure.
- Checked and unchecked exceptions communicate different API decisions.
- Garbage collection manages reachability, not every external resource.

## 2. Recognition Signals

- Hash collection cannot find a key -> `equals`/`hashCode` or mutation issue.
- Overload confusion -> compile-time parameter types.
- Override/polymorphism -> runtime receiver type and method contract.
- Resource cleanup -> try-with-resources and `AutoCloseable`-style ownership.
- Collection choice -> ordering, duplicates, lookup, concurrency, mutation.
- Shared mutable state -> immutability or explicit synchronization.

## 3. Common Data Structures / Algorithms

| Tool | Best fit | Main decision |
|---|---|---|
| `ArrayList` | Indexed, append-heavy sequence | Middle edits shift elements |
| `HashMap` / `HashSet` | Expected fast lookup | Stable equality/hash contract |
| Ordered map/set | Sorted traversal/range operations | Logarithmic operations in common implementations |
| `Deque` | Stack or queue | Prefer clear end conventions |
| Priority queue | Repeated extremum | Comparator and heap direction |
| Immutable record/value | Safe value semantics | Validate construction invariants |

## 4. Problem-Solving Patterns

### Equality Contract

Define identity fields, implement logical equality consistently, derive matching hash codes, and avoid mutating fields used as hash keys while stored.

### Program to Required Semantics

Choose a collection from required ordering, multiplicity, access, and mutation. Do not default to a linked list or hash map by habit.

### Resource Scope

Use lexical resource management for files, streams, and other closeable resources. Garbage collection does not guarantee timely release.

## 5. Complexity Targets

Include collection semantics and boxing/allocation costs where material. Dynamic-array append is amortized constant; indexed access is constant; middle insertion shifts elements; hashed lookup is expected constant under a sound key contract; ordered-tree operations are commonly logarithmic.

## 6. Typical Traps

- Using `==` when logical equality is required.
- Overriding equality without a compatible hash code.
- Mutating a map key's identity fields.
- Assuming garbage collection closes external resources promptly.
- Confusing overload resolution with override dispatch.
- Catching overly broad exceptions or swallowing failure context.
- Relying on platform/version trivia without verification.

## 7. Testing Strategy

Test equality reflexivity/symmetry/transitivity, equal-object hash behavior, collection behavior after attempted mutation, null policy, generic boundary cases, resource closure on success/failure, and concurrent access where required.

## 8. Interview Communication Strategy

Separate language guarantees from implementation habits. Explain the semantic reason for a collection or equality decision. State when a detail depends on the Java/platform version and offer to verify it rather than bluffing.

## 9. Representative Transformed Examples

A value used as a hash key should derive equality from immutable identity fields:

```java
record Coordinate(int row, int column) {}
```

The concise syntax is only an example; the reusable rule is immutable logical identity with consistent equality and hashing. For older or constrained environments, express the same contract explicitly.

## 10. Practice Routing

- Equality bugs -> write the contract before implementations.
- Collection mistakes -> compare required operations and ordering.
- Exception confusion -> classify caller-recoverable versus programming errors.
- Resource leaks -> trace closure through every exit path.
- Version questions -> verify current official documentation separately.

## Connects To

- [Object-Oriented Design](ch12-object-oriented-design.md): identity and polymorphism.
- [Arrays and Strings](ch05-arrays-and-strings.md): collection costs.
- [Threads and Locks](ch19-threads-and-locks.md): shared state and synchronization.

