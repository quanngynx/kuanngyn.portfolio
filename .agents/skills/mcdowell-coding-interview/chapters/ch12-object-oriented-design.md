# Chapter 12: Object-Oriented Design

## 1. Core Concepts

Object-oriented design interviews test requirement discovery, responsibility assignment, and change resilience. The goal is a coherent model, not the largest class diagram.

- Objects combine state with behavior that protects its invariants.
- Encapsulation hides decisions likely to change.
- Composition usually provides more flexible reuse than inheritance.
- Interfaces belong at genuine variation or integration boundaries.
- State transitions and failure cases deserve first-class modeling.

## 2. Recognition Signals

- Design a real-world system -> identify actors, use cases, entities, and boundaries.
- Multiple implementations of one capability -> interface/strategy.
- Behavior changes by state -> explicit state model rather than scattered booleans.
- Notifications or event reactions -> observer/event boundary.
- Construction varies by type/configuration -> factory only if creation logic warrants it.
- Shared lifecycle/ownership -> composition and an explicit owner.

## 3. Common Data Structures / Algorithms

| Design tool | Use | Caution |
|---|---|---|
| Value object | Immutable validated concept | Define equality semantics |
| Entity | Identity across state changes | Protect lifecycle transitions |
| Strategy | Swappable policy | Avoid one-class-per-trivial-branch |
| Repository boundary | Persistence abstraction | Do not hide every query behind generic CRUD |
| Event | Notify decoupled consumers | Define ordering and failure behavior |

## 4. Problem-Solving Patterns

### Use Cases Before Classes

Write the core workflows and exceptional paths first. Extract responsibilities, then assign them to the smallest cohesive objects.

### Responsibility and Collaborator Check

For each object, state what it knows, what it does, and whom it calls. Move behavior toward the state it protects.

### Explicit State Transition

Represent allowed transitions and rejected operations centrally. This prevents combinations of booleans from creating impossible states.

## 5. Complexity Targets

OOD discussions still require operational costs: lookup structures, queue behavior, concurrency boundaries, and storage calls. State expected object counts and whether operations are constant, linear, or external-I/O bound. Do not use patterns to obscure an inefficient core operation.

## 6. Typical Traps

- Starting with nouns/classes before clarifying workflows.
- One manager class owning every behavior.
- Deep inheritance for code reuse alone.
- Interfaces with only one stable implementation and no meaningful boundary.
- Modeling happy paths but no invalid transitions.
- Mixing persistence, policy, and presentation in one object.
- Claiming extensibility without naming the anticipated change.

## 7. Testing Strategy

Test entity invariants, every allowed and rejected state transition, strategy substitution, duplicate commands, absent dependencies, and collaborator failures. Use sequence examples to validate responsibilities and object ownership.

## 8. Interview Communication Strategy

Start with scope and actors, narrate two or three workflows, then sketch objects and relationships. Explain why each abstraction exists and what future change it isolates. Call out unresolved scale, persistence, and concurrency questions instead of silently assuming them away.

## 9. Representative Transformed Examples

For a reservable resource, separate:

- `Resource`: stable identity and availability facts.
- `Reservation`: lifecycle with `requested`, `confirmed`, and `cancelled` transitions.
- `AllocationPolicy`: chooses among eligible resources.
- `ReservationRepository`: persistence boundary required by the workflow.

The example is intentionally domain-neutral. Its value is the transition invariant: a cancelled reservation cannot later be confirmed without an explicit new request.

## 10. Practice Routing

- Class explosion -> return to three primary use cases.
- God object -> assign state-protecting behavior to entities/value objects.
- Pattern memorization -> justify the variation it handles.
- Missing failures -> add invalid-transition and dependency-failure scenarios.
- Vague extensibility -> name one change and show its impact.

## Connects To

- [System Design](ch13-system-design-and-scalability.md): service and persistence boundaries.
- [Testing](ch15-testing.md): invariant and transition testing.
- [Threads and Locks](ch19-threads-and-locks.md): shared-state ownership.

