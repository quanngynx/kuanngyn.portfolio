# Chapter 27: Coding Agent Teams

## Intent

Organize coding assistance around real engineering responsibilities and independent evidence. The human or designated technical owner retains architecture and acceptance authority.

## When to Use

- Implementation, testing, review, documentation, or research can be separated by artifact and evidence.
- Independent review materially reduces correlated mistakes.
- Parallel work has non-overlapping ownership and an explicit integration point.

## When Not to Use

- “Roles” are only personas over the same prompt and context.
- The change is small enough for one bounded workflow.
- Nobody owns conflicts, integration, or final acceptance.

## Team Design

| Responsibility | Required input | Evidence-bearing output |
| --- | --- | --- |
| Implementer | Specification, relevant code, constraints | Patch plus design notes |
| Test engineer | Behavior contract and interfaces | Tests, failures, coverage rationale |
| Reviewer | Diff, requirements, independent repository evidence | Prioritized actionable findings |
| Documenter | Verified behavior and public contract | User/developer documentation |
| Integrator | All artifacts and acceptance criteria | Reconciled change and validation record |

Assign roles because their evidence or authority differs, not because a persona sounds specialized. Give each task a bounded context package: objective, requirements, relevant code, standards, known risks, and expected output. Generated work remains a proposal until validated.

## Implementation Structure

1. Name the integration owner and acceptance criteria.
2. Decompose work by file ownership or artifact dependency.
3. Choose sequential handoffs or bounded parallel branches from the dependency graph.
4. Give reviewers independent criteria and evidence.
5. Integrate through diffs and tests, resolving contradictions explicitly.
6. Capture reusable lessons only after the outcome is verified.

The source's product/model examples and industry productivity claims are historical material and are not carried forward as current facts. Its duplicate Appendix G is represented once here.

## Trade-offs

Specialized roles can improve focus and throughput but multiply context, review, and integration costs. Human-led orchestration protects architectural coherence but can become a bottleneck; distribute bounded decisions while keeping final ownership clear.

## Failure Modes

- Decorative agents duplicate the same work and assumptions.
- Implementer and tester derive expectations from the same mistaken output.
- Automatic review floods the team with low-impact findings.
- Parallel agents edit overlapping files without a merge owner.
- Documentation describes proposed rather than verified behavior.
- “Vibe coding” prototypes enter production without hardening.

## Pattern Interactions

- [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md): supplies role, topology, and ownership design.
- [Parallelization](ch03-parallelization.md): applies only to dependency-independent work.
- [Reflection](ch04-reflection.md) and [Evaluation](ch19-evaluation-and-monitoring.md): revision and independent measurement remain distinct.
- [Human-in-the-Loop](ch13-human-in-the-loop.md): the accountable owner accepts consequential changes.
- [CLI Agents](ch26-cli-agents.md): provides the repository operating contract for each coding role.

## Verification Checklist

- [ ] Every role has distinct responsibility, context, and evidence.
- [ ] Dependencies and overlapping file ownership are explicit.
- [ ] Review is independent enough to detect correlated errors.
- [ ] One owner resolves conflicts and accepts the integrated result.
- [ ] Prototype code is hardened before production use.
