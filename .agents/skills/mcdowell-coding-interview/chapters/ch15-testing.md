# Chapter 15: Testing

## 1. Core Concepts

Testing questions evaluate how systematically risks are discovered. Define the contract and failure model, partition the input space, then prioritize boundaries and high-impact behavior.

- Black-box tests derive from externally visible requirements.
- White-box tests target branches, data flow, and implementation hotspots.
- Unit, integration, system, performance, and reliability tests answer different questions.
- Testability improves when dependencies and state are controllable.

## 2. Recognition Signals

- Test this function -> equivalence classes, boundaries, malformed input, properties.
- Test an object/system -> state transitions, dependencies, concurrency, recovery.
- Diagnose a failure -> reproduce, minimize, isolate, form a hypothesis, verify.
- Randomized algorithm -> deterministic seed plus distribution/property checks.
- External service -> contract tests, timeouts, retries, partial failures.

## 3. Common Data Structures / Algorithms

| Technique | Purpose |
|---|---|
| Equivalence partitioning | Reduce many inputs to representative classes |
| Boundary-value analysis | Exercise transitions around limits |
| Decision table | Cover interacting rules systematically |
| Property-based testing | Check invariants across generated inputs |
| Test double | Control or observe a dependency boundary |
| Fault injection | Validate failure and recovery behavior |

## 4. Problem-Solving Patterns

### Contract-to-Test Matrix

Map each requirement and failure rule to representative normal, boundary, invalid, and recovery cases. Keep expected outcomes explicit.

### Hotspot Review

Prioritize indices, arithmetic, nullability, mutation, ordering, concurrency, and integration edges. These deserve more than uniform test counts.

### Reproduce and Minimize

For a defect, find the smallest reliable reproducer before changing code. A reduced case separates cause from noise.

## 5. Complexity Targets

Test-suite cost includes setup, execution, cleanup, and flakiness. Prefer the lowest layer that faithfully exercises the risk, but retain integration coverage for contracts that mocks cannot prove. For combinatorial inputs, use partitions, pairwise strategies, properties, and targeted risk cases rather than pretending exhaustive coverage is possible.

## 6. Typical Traps

- Listing only happy-path examples.
- Confusing coverage percentage with behavioral confidence.
- Mocking the unit so heavily that no real contract remains.
- Tests sharing mutable state or real time implicitly.
- Ignoring non-functional requirements and recovery.
- Fixing a symptom without preserving a regression test.
- Assuming nondeterministic failures are untestable.

## 7. Testing Strategy

Use this order: clarify contract -> identify partitions -> test boundaries -> test invalid input -> test state transitions -> test dependencies/failures -> test performance/concurrency where required -> map cases back to risks. For algorithms, include empty, singleton, extremes, duplicates, no-solution, and overflow-sensitive inputs.

## 8. Interview Communication Strategy

Organize cases by risk rather than producing an unstructured list. Explain what each test proves, which layer owns it, and what remains unverified. If requirements are ambiguous, ask before defining an expected result.

## 9. Representative Transformed Examples

For an API that reserves limited capacity, test:

- normal reservation and retrieval;
- zero, exact remaining capacity, and one over capacity;
- duplicate request identifier;
- concurrent attempts for the last unit;
- storage timeout before and after commit;
- retry and recovery behavior;
- authorization and malformed input.

This is a reusable risk matrix, not a source problem reproduction.

## 10. Practice Routing

- Shallow cases -> force normal/boundary/invalid/recovery categories.
- Excessive mocks -> identify one real contract test per boundary.
- Weak debugging -> practice minimizing failing inputs.
- Algorithm misses -> trace hotspots before execution.
- System gaps -> add load, concurrency, failure, and observability tests.

## Connects To

- [Problem-Solving Framework](ch03-problem-solving-framework.md): interview test procedure.
- [Object-Oriented Design](ch12-object-oriented-design.md): invariant testing.
- [System Design](ch13-system-design-and-scalability.md): load and failure testing.
- [Threads and Locks](ch19-threads-and-locks.md): concurrency tests.

