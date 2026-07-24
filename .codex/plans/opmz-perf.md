# Full-Codebase React Doctor Cleanup

## Summary

Run a full scan from `portfolio/`, fix every confirmed error and warning, and leave all changes unstaged for review. React render and GSAP guidance will validate performance findings without adding speculative memoization or abstractions.

## Implementation

- According to Byterover memory layer requirements, save this plan once approved, retrieve project/module knowledge before each task, update progress as fixes land, and store material findings. Retry tool discovery because Byterover is not currently exposed.
- Preserve the existing dirty worktree, including `portfolio/package.json` and untracked skill files. Do not stage, commit, push, change dependency versions, edit lockfiles unnecessarily, or touch CI workflows.
- Run the canonical full scan from `portfolio/`:
  - `pnpm dlx react-doctor@latest --json --yes`
  - Save diagnostics under `C:\tmp`; omit `--diff` so all 102 TSX files are covered.
- Filter findings through `.react-doctor/false-positives.md` if later added and fetch each surviving rule’s canonical validation/fix prompt from the [React Doctor playbook](https://www.react.doctor/prompts/react-doctor-agent.md).
- Triage individual occurrences:
  - Fix errors first, serially, with a typecheck after each change.
  - Fix warnings afterward as one batch; if validation fails, revert that batch and reapply serially.
  - Defer only occurrences requiring runtime knowledge, sensitive behavior changes, or unsafe cross-file refactors; report them explicitly.
- Apply React performance guidance only where confirmed by diagnostics or code evidence: remove redundant derived state, unstable subscriptions, render-time component definitions, unnecessary high-frequency state, and layout read/write interleaving. Do not add `memo`, `useMemo`, or `useCallback` without an actual expensive subtree or reference-stability need.
- Audit every GSAP/animation path, prioritizing the cursor and scroll/measurement code:
  - Replace repeated high-frequency tweens with reusable `quickTo` or the already-used motion-value mechanism.
  - Prefer transforms/opacity over animated layout properties.
  - Batch DOM reads and writes, scope `will-change`, stop off-screen loops, and verify listener/tween cleanup.
- Re-run the full React Doctor scan and report score change, fixed errors/warnings, reverted fixes, deferred findings, and candidate false positives.

## Interfaces

- Preserve routes, rendered content, exported component APIs, localization keys, and animation behavior.
- No new dependencies, configuration layers, or public types are planned.
- Internal component or hook signatures may change only when required for a confirmed diagnostic.

## Validation

- After each error fix: `tsc --noEmit`.
- After warning fixes: TypeScript plus ESLint on touched files.
- Final checks:
  - `tsc --noEmit`
  - `eslint src --max-warnings=0`
  - Prettier check on touched files
  - `pnpm run build`
  - Full React Doctor rescan with no surviving fixable diagnostics
- Manually verify desktop/mobile navigation, locale/theme switching, smooth scrolling, cursor behavior, modals, reduced/coarse-pointer behavior, and animation cleanup after navigation or unmount.

## Assumptions

- Delivery defaults to unstaged working-tree changes because no output mode was selected and the repository is already dirty.
- “Fix all” means every validated, safely fixable React Doctor error and warning plus confirmed React/GSAP performance defects—not false positives or speculative micro-optimizations.
- The baseline React Doctor scan was not executed during planning because unsandboxed execution of the latest third-party scanner was rejected; it will be the first implementation step after explicit execution authorization.
- Current baseline: TypeScript passes, and `eslint src --max-warnings=0` passes.
