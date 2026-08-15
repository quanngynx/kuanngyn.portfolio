# Chapter 18: Databases

## 1. Core Concepts

Database interview questions connect data modeling, query semantics, indexing, and transactions. Start from access patterns and correctness requirements, not from schema fashion.

- Keys identify rows and relationships.
- Normalization reduces update anomalies; denormalization can serve measured read needs.
- Indexes accelerate selected access paths at storage and write cost.
- Transactions define atomicity and isolation boundaries.
- Query plans determine actual work beyond SQL surface syntax.

## 2. Recognition Signals

- Filter/order/join is slow -> candidate composite index and plan inspection.
- Repeated aggregates -> precompute/materialize only with freshness rules.
- Duplicate or lost updates -> constraints, transaction, isolation, atomic update.
- Many-to-many relation -> junction table with appropriate uniqueness.
- Hierarchy -> adjacency, path, or closure representation based on queries.
- Cross-record invariant -> transactional boundary or redesigned ownership.

## 3. Common Data Structures / Algorithms

| Tool | Use | Trade-off |
|---|---|---|
| Primary/unique key | Identity and enforced uniqueness | Key width/locality affects storage |
| Composite index | Multi-column access path | Column order matters |
| Foreign key | Referential integrity | Write checks and lifecycle policy |
| Join | Combine normalized relations | Cardinality can multiply work |
| Transaction | Atomic correctness boundary | Contention and isolation cost |
| Query plan | Evidence of execution strategy | Statistics can become stale |

## 4. Problem-Solving Patterns

### Access Patterns Before Indexes

List predicates, joins, ordering, projected fields, cardinalities, and frequency. Design the smallest useful index and verify with a plan.

### Constraint in the Database

When correctness must hold across writers, prefer enforceable uniqueness, referential, and check constraints over application-only prechecks.

### Transaction Boundary by Invariant

Group operations that must succeed or fail together. State isolation needs based on anomalies that must be prevented.

## 5. Complexity Targets

Avoid simplistic `O(log n)` claims without considering index type, selectivity, returned rows, join cardinality, and I/O. A selective index may reduce scanned rows, but reading `k` results still costs at least `O(k)`. Writes pay for every maintained index.

## 6. Typical Traps

- Adding indexes without matching query order/selectivity.
- Ignoring duplicates caused by join cardinality.
- Using application checks as concurrency-safe uniqueness.
- Selecting non-aggregated columns with unclear grouping semantics.
- Treating transactions as automatically serializable.
- Denormalizing without an update/freshness strategy.
- Optimizing SQL text without examining the execution plan.

## 7. Testing Strategy

Test empty relations, duplicate attempts, missing references, null semantics, one-to-many multiplication, concurrent writes, rollback, isolation anomalies, large/skewed datasets, and plans under representative cardinalities. Verify constraints from more than one writer.

## 8. Interview Communication Strategy

State the core entities, relationships, cardinalities, and invariants. Sketch representative queries before indexes. Explain what correctness belongs in constraints/transactions and which performance assumptions require plan evidence.

## 9. Representative Transformed Examples

For accounts joining groups, use an association relation with a unique pair `(account_id, group_id)`. This models many-to-many membership and makes duplicate membership enforceable. An index beginning with `account_id` supports account-to-groups lookup; the reverse lookup may require another index if frequent.

## 10. Practice Routing

- Join mistakes -> draw cardinalities and expected row multiplication.
- Index guessing -> write access patterns and inspect plans.
- Race conditions -> replace precheck-then-insert with constraints/transactions.
- Schema over-normalization -> compare actual read/write paths.
- SQL syntax focus -> practice explaining semantics and data volume first.

## Connects To

- [System Design](ch13-system-design-and-scalability.md): storage and partitioning.
- [Threads and Locks](ch19-threads-and-locks.md): isolation and concurrent writers.
- [Testing](ch15-testing.md): constraint and transaction validation.

