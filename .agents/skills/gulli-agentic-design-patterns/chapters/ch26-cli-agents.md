# Chapter 26: CLI Agents

## Intent

Use command-line coding agents as controlled repository operators: inspect first, propose bounded changes, execute with scoped authority, and verify through the project's real toolchain.

## When to Use

- Repository-wide context and coordinated edits are needed.
- Terminal commands, tests, version control, and code review form the natural workflow.
- Work can be isolated, inspected, and reversed.

## When Not to Use

- The repository or execution environment cannot be sandboxed or backed up.
- Success criteria and permitted paths are undefined.
- Credentials or production operations would be exposed without suitable controls.

## Operating Contract

```text
scope: repository, paths, branch/worktree, permitted systems
objective: observable outcome and non-goals
authority: read, edit, execute, network, version-control limits
evidence: tests, diagnostics, diffs, screenshots, traces
recovery: checkpoints, idempotency, rollback or compensation
handoff: changed files, validation, warnings, remaining work
```

## Safe Workflow

1. Inspect repository instructions, status, architecture, and validation commands.
2. Establish a narrow task boundary and clean isolation strategy.
3. Read relevant code before editing; keep user changes intact.
4. Make reviewable increments and inspect diffs between risky steps.
5. Run proportionate tests and report failures truthfully.
6. Require approval for destructive, privileged, external, or irreversible operations.
7. Hand off evidence without claiming unrun checks passed.

Claude Code, Gemini CLI, Aider, GitHub Copilot CLI, and Terminal-Bench appear in the source as historical examples. Their names, command syntax, models, integrations, benchmark status, and product behavior require current independent verification.

## Trade-offs

CLI agents combine broad repository context with direct execution, making them productive and correspondingly high impact. Automatic commits provide auditability but can conflict with a team's review policy. Large context helps coordination but does not replace targeted reading or verification.

## Failure Modes

- Broad shell or filesystem authority for a narrowly scoped task.
- Editing unrelated dirty files or overwriting user work.
- Running destructive commands against unresolved paths.
- Treating generated commands as safe because they are syntactically valid.
- Passing a unit test while skipping the actual acceptance path.
- Inventing current framework or dependency APIs from stale training data.

## Pattern Interactions

- [Tool Use](ch05-tool-use.md): shell, filesystem, browser, and Git are bounded tools.
- [Planning](ch06-planning.md): coordinate multi-file work and adapt from test evidence.
- [Exception Handling](ch12-exception-handling-and-recovery.md): reconcile partial commands and preserve user state.
- [Guardrails](ch18-guardrails-safety-patterns.md): scope paths, credentials, network, and destructive actions.
- [Evaluation](ch19-evaluation-and-monitoring.md): benchmark real task completion, not persuasive narration.

## Verification Checklist

- [ ] Repository instructions and dirty state were inspected.
- [ ] Read, write, execute, and network authority are explicit.
- [ ] Changes are narrow and reviewable.
- [ ] Validation matches the affected behavior.
- [ ] The handoff distinguishes passed, failed, skipped, and unverified checks.
