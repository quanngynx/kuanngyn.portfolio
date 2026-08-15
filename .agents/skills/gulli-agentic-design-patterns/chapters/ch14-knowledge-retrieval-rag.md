# Chapter 14: Knowledge Retrieval (RAG)

## Core Idea

Retrieval-Augmented Generation (RAG) selects relevant governed evidence before generation so claims can be current, domain-specific, and attributable. Retrieval quality and source governance matter more than merely adding a vector database.

## Problem / Intent

Model training knowledge is static and cannot reliably represent current or private sources. RAG turns generation into an open-book process by retrieving evidence, packaging it as context, and requiring the answer to remain grounded in that evidence.

## When to Use

- Answers depend on proprietary, current, or specialized documents.
- Users need citations or claim-level provenance.
- The corpus is large enough that full-context prompting is inefficient.
- Sources have identifiable authority, freshness, and access rules.
- Retrieval can be evaluated independently from generation.

## When Not to Use

- The required source set is already small enough to supply directly.
- The corpus is ungoverned, outdated, or inaccessible to the requesting user.
- The task requires durable user/task continuity rather than factual grounding; use [Memory](ch08-memory-management.md).
- Structured querying or deterministic search can answer more reliably without an LLM.

## Implementation Structure

1. Ingest authoritative sources with identity, version, access, and timestamps.
2. Parse and chunk along semantic boundaries.
3. Index for keyword, vector, graph, or hybrid retrieval.
4. Transform the query and retrieve candidates under access control.
5. Rerank, deduplicate, and check freshness/authority.
6. Build a bounded evidence context.
7. Generate with citation and abstention rules.
8. Evaluate retrieval and answer grounding separately.

```ts
type EvidenceChunk = {
  sourceId: string;
  version: string;
  text: string;
  authority: number;
  observedAt: string;
  accessScope: string[];
};
```

## Retrieval Choices

- **Keyword/BM25**: precise literal terms, identifiers, and rare phrases.
- **Vector search**: semantic similarity when wording differs.
- **Hybrid search**: combine lexical precision and semantic recall.
- **Graph retrieval**: explicit multi-hop relationships justify graph cost.
- **Agentic RAG**: add reasoning only when validation, conflict resolution, query decomposition, or gap detection materially improves evidence.

## RAG Versus Memory

- RAG asks, “Which governed source supports this claim?”
- Memory asks, “What state or experience should this agent retain?”
- Memory may use retrieval infrastructure, but a remembered preference is not documentary truth.
- Current authoritative sources override stale remembered facts.

## Worked Example: Policy Assistant

Retrieve only policy documents the user may access. Prefer the latest approved version over older drafts. Return citations with document version and section. If evidence conflicts or coverage is insufficient, disclose the conflict or abstain instead of synthesizing certainty.

## Trade-offs

RAG improves freshness and attribution but adds ingestion, indexing, access control, latency, token cost, and source reconciliation. Agentic RAG can solve complex gaps but also introduces loops and reasoning errors.

## Failure Modes

- **Bad chunking**: evidence is split away from qualifiers or relationships.
- **Retrieval noise**: irrelevant chunks distract generation.
- **Missing multi-hop context**: required facts span sources or chunks.
- **Stale authority**: old drafts outrank current approved sources.
- **Access leakage**: retrieval occurs before tenant or user filtering.
- **Citation decoration**: citations exist but do not support the claim.
- **Agentic overreach**: a reasoning layer discards relevant evidence or loops indefinitely.
- **Knowledge-base drift**: source changes are not reconciled into the index.

## Pattern Interactions

- [Memory](ch08-memory-management.md): retrieve governed knowledge separately from user/task continuity.
- [Routing](ch02-routing.md): select corpus, retrieval strategy, or structured database path.
- [Tool Use](ch05-tool-use.md): retrieval executes through bounded search tools.
- [Reflection](ch04-reflection.md): check claim support against retrieved evidence.
- Evaluation and Monitoring: measure retrieval recall/precision, answer faithfulness, freshness, latency, and access failures.

## Verification Checklist

- Are source authority, version, freshness, and access metadata preserved?
- Can retrieval be tested independently of answer generation?
- Does each citation support the associated claim?
- Can the system abstain when evidence is missing or contradictory?
- Is agentic retrieval justified over a simpler pipeline?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
