# Chapter 19: Threads and Locks

## 1. Core Concepts

Concurrency problems concern interleavings, visibility, atomicity, and progress. A correct sequential algorithm may fail when operations overlap.

- A race occurs when correctness depends on uncontrolled interleaving.
- A critical section protects one invariant, not merely a block of code.
- Mutexes provide exclusion; semaphores represent permits; condition variables coordinate state changes.
- Deadlock requires mutually blocked progress; starvation and livelock are distinct failures.
- Immutability, ownership, and message passing can reduce shared-state synchronization.

## 2. Recognition Signals

- Read-modify-write sequence -> needs an atomic operation or lock.
- Shared counter/collection/cache -> define synchronization and visibility.
- Multiple locks -> ordering and deadlock analysis.
- Producer/consumer -> queue plus condition/permit semantics.
- Duplicate external action after retry -> idempotency and durable coordination, not only an in-process mutex.
- Throughput collapse -> contention or excessive critical section.

## 3. Common Data Structures / Algorithms

| Primitive | Use | Key question |
|---|---|---|
| Mutex/monitor | Exclusive invariant protection | What state does it guard? |
| Read-write lock | Many readers, fewer writers | Does added complexity improve workload? |
| Semaphore | Bound concurrent permits | Is it ownership or capacity? |
| Condition variable | Wait for a state predicate | Is the predicate rechecked in a loop? |
| Atomic operation | Small indivisible state update | Is the whole invariant truly one value? |
| Concurrent queue | Transfer ownership/work | Ordering and shutdown semantics |

## 4. Problem-Solving Patterns

### Invariant-Centered Locking

Name the shared invariant, list every access that can break it, and protect the complete transition. A lock around only the final write may be insufficient.

### Global Lock Order

Assign a consistent order and acquire multiple locks only in that order. This breaks circular wait when followed universally.

### Reduce Shared Mutability

Prefer immutable snapshots, partitioned ownership, and message passing before adding fine-grained locks.

## 5. Complexity Targets

Big O does not express waiting, contention, fairness, or parallel speedup. Discuss critical-section length, lock frequency, queueing, number of workers, and serial fraction. More threads can reduce throughput when coordination dominates.

## 6. Typical Traps

- Checking then acting in separate critical sections.
- Assuming a thread-safe collection makes a multi-step workflow atomic.
- Acquiring locks in inconsistent order.
- Waiting on a condition once instead of rechecking its predicate.
- Holding locks during slow external I/O.
- Using sleep/timing to establish correctness.
- Claiming idempotency from an in-memory flag across processes or crashes.

## 7. Testing Strategy

Use deterministic synchronization hooks where possible, repeated stress runs, last-unit races, duplicate requests, cancellation/shutdown, lock-order instrumentation, timeouts for deadlock detection, and assertions on invariants. A passing stress test is evidence, not proof of race freedom.

## 8. Interview Communication Strategy

Draw two or three interleavings that break the naive version. Name the state protected by each primitive and discuss liveness as well as safety. State whether coordination is process-local, machine-local, or distributed.

## 9. Representative Transformed Examples

Two transfers needing account locks can avoid circular wait by acquiring locks in stable identifier order, validating balances while both are held, applying both updates, and releasing in reverse order. For a real distributed store, a database transaction or other durable atomic boundary may be required; local locks alone do not coordinate independent processes.

## 10. Practice Routing

- Race blindness -> enumerate interleavings between reads and writes.
- Wrong lock scope -> state the invariant and full transition.
- Deadlock confusion -> check mutual exclusion, hold-and-wait, no preemption, circular wait.
- Overlocking -> shorten critical sections or partition ownership.
- Flaky tests -> introduce controllable barriers rather than sleeps.

## Connects To

- [Databases](ch18-databases.md): transactions and isolation.
- [System Design](ch13-system-design-and-scalability.md): distributed coordination.
- [Testing](ch15-testing.md): deterministic concurrency validation.
- [Object-Oriented Design](ch12-object-oriented-design.md): state ownership.

