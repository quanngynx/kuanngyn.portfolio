# Chapter 22: Advanced Prompting Reference

## Intent

Design prompts as versioned component contracts. Prompting shapes model proposals; deterministic code still owns validation, authority, state transitions, and execution.

## When to Use

- A model transformation needs clearer task, context, examples, or output structure.
- A pattern's model-facing step is inconsistent across representative inputs.
- Intermediate results must be machine-readable or evaluated against a rubric.

## When Not to Use

- A schema validator, query, parser, or ordinary function can solve the problem exactly.
- The actual defect is missing data, excessive authority, or weak orchestration.
- Prompt wording is being used as the only safety or authorization boundary.

## Prompt Contract

Separate these fields even if the provider combines them:

```text
role_and_scope: bounded operating context
task: one explicit operation
inputs: trusted and untrusted data with delimiters
constraints: requirements and non-goals
examples: representative input/output pairs
output_contract: schema, evidence, and uncertainty fields
evaluation: acceptance rubric
```

Prefer direct verbs, relevant context, and positive requirements. Delimit untrusted data so it cannot be confused with instructions. Ask for structured outputs when code will consume the result.

## Technique Selection

| Need | Technique | Main control |
| --- | --- | --- |
| Common task with ordinary output | Zero-shot | Clear operation and format |
| Unusual format or style | One-shot | One correct representative example |
| Nuanced classification or extraction | Few-shot | Diverse, balanced, validated examples |
| Background needed for one request | Contextual prompting | Relevance, provenance, and token budget |
| Machine consumption | Structured output | Schema validation and repair/fail policy |
| Better prompt formulation | Meta-prompting or optimization | Held-out evaluation, versioning, rollback |
| Multi-step inspectable work | Decomposition or factored cognition | Typed intermediate artifacts |

Reasoning-related labels in the source, including chain-of-thought, self-consistency, step-back, tree search, ReAct, and automatic prompt engineering, are historical technique families. Do not require private chain-of-thought. Request concise rationale, evidence, plans, calculations, tool observations, or other inspectable artifacts instead; see [Reasoning Techniques](ch17-reasoning-techniques.md).

## Evaluation Loop

1. Build representative cases, including edge and adversarial inputs.
2. Record a baseline with model and configuration metadata.
3. Change one prompt variable at a time where practical.
4. Score correctness, contract compliance, safety, latency, and cost.
5. Inspect regressions by slice, not only aggregate score.
6. Version and promote only improvements that meet release thresholds.

## Trade-offs

Examples and context improve control but consume tokens and can anchor the model too narrowly. Automated prompt optimization can find unintuitive improvements but may overfit its evaluator. Personas can shape tone, but they do not create genuine authority or specialist capability.

## Failure Modes

- Conflicting instructions across prompt layers.
- Examples containing mislabeled or unrepresentative behavior.
- Untrusted retrieved text interpreted as control instructions.
- Output schemas described in prose but never validated.
- Prompt growth hiding the core task or exceeding useful context.
- Model-specific phrasing treated as a stable cross-model guarantee.

## Pattern Interactions

- [Prompt Chaining](ch01-prompt-chaining.md): give each stage its own prompt and typed contract.
- [Routing](ch02-routing.md): evaluate prompt behavior independently for every route.
- [Tool Use](ch05-tool-use.md): the model proposes calls; trusted code validates and executes.
- [RAG](ch14-knowledge-retrieval-rag.md): retrieved evidence belongs in a bounded, provenance-aware context section.
- [Evaluation](ch19-evaluation-and-monitoring.md): prompts are versioned behavioral components and need regression tests.

## Verification Checklist

- [ ] The task, relevant context, and output contract are explicit.
- [ ] Untrusted content is delimited and cannot grant authority.
- [ ] Examples are correct, diverse, and necessary.
- [ ] Structured output is validated outside the model.
- [ ] Changes are evaluated on representative held-out cases.
