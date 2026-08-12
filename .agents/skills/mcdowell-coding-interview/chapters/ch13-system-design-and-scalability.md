# Chapter 13: System Design and Scalability

## 1. Core Concepts

System design is a sequence of scoped decisions under load, reliability, and consistency constraints. Begin with requirements and estimates; introduce components only when a requirement justifies them.

- Functional requirements define workflows; non-functional requirements define operating limits.
- Capacity estimates expose dominant storage, bandwidth, and throughput costs.
- Horizontal scaling requires state placement, partitioning, and failure handling.
- Caches improve latency/read load but create freshness and invalidation decisions.
- Replication improves availability/read capacity but introduces consistency and failover trade-offs.

## 2. Recognition Signals

- Read-heavy repeated access -> cache or read replicas.
- Write throughput exceeds one owner -> partition by a stable key.
- Bursty work can be delayed -> queue and asynchronous workers.
- Large static objects -> object storage and edge delivery.
- Cross-partition workflow -> reconsider boundaries or coordinate explicitly.
- Hot key/skew -> salting, adaptive partitioning, or separate treatment.

## 3. Common Data Structures / Algorithms

| Component | Role | Decision to expose |
|---|---|---|
| Load balancer | Distribute requests | Health, affinity, retry behavior |
| Cache | Reduce repeated work | Key, TTL, eviction, invalidation |
| Queue/log | Decouple producers/consumers | Ordering, delivery, retry, poison work |
| Database/index | Durable queryable state | Access patterns, consistency, transactions |
| Partition map | Route data/work | Key choice, skew, rebalancing |
| Rate limiter | Bound resource use | Scope, window semantics, failure policy |

## 4. Problem-Solving Patterns

### Scope, Estimate, Sketch, Stress

Clarify users and operations -> estimate peak traffic and data -> define APIs/data model -> sketch the smallest design -> stress one bottleneck at a time.

### Access-Pattern-First Storage

List reads and writes with scale and consistency needs before selecting storage. Product names are historical/current examples only unless independently verified.

### Failure as a Workflow

For each remote edge, state timeout, retry eligibility, idempotency, partial-success behavior, and observability.

## 5. Complexity Targets

Use orders of magnitude rather than false precision. Estimate peak requests per second, payload size, retention, fan-out, and growth. For critical paths, count network hops and serial dependencies. A design that scales storage but retains a single coordination bottleneck is not horizontally scalable.

## 6. Typical Traps

- Naming infrastructure before defining requirements.
- Assuming average traffic represents peak load.
- Adding a cache without invalidation or stampede handling.
- Claiming retries are safe without idempotency semantics.
- Ignoring hot partitions and uneven key distributions.
- Treating availability, consistency, and latency as independently maximizable.
- Drawing components without tracing one read, one write, and one failure.

## 7. Testing Strategy

Validate the design with normal traffic, peak bursts, hot keys, slow dependencies, partial outages, duplicate delivery, stale cache, partition movement, and recovery. Check observability for latency, saturation, errors, queue age, and correctness signals.

## 8. Interview Communication Strategy

Timebox scope, state assumptions and estimates, and mark the critical path. Present a minimal design before scaling it. When adding a component, tie it to a measured or estimated bottleneck and name the new failure mode it introduces.

## 9. Representative Transformed Examples

For a read-dominant metadata service:

1. Define lookup and update APIs plus freshness requirements.
2. Estimate peak reads, writes, record size, and retention.
3. Start with indexed durable storage behind stateless handlers.
4. Add a cache only if the read estimate or latency target requires it.
5. Define invalidation, stale-read tolerance, hot-key protection, and dependency failure behavior.

The reusable lesson is decision order, not a vendor-specific architecture.

## 10. Practice Routing

- Component soup -> require a stated requirement for every box.
- Weak estimates -> practice powers-of-ten traffic/storage calculations.
- Missing failures -> trace timeout, retry, duplication, and recovery per edge.
- Storage guessing -> write access patterns first.
- Scale hand-waving -> locate the first saturated resource and partition boundary.

## Connects To

- [Object-Oriented Design](ch12-object-oriented-design.md): responsibility boundaries.
- [Databases](ch18-databases.md): indexes, transactions, and data modeling.
- [Threads and Locks](ch19-threads-and-locks.md): concurrent coordination.
- [Testing](ch15-testing.md): failure and load validation.

