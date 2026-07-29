# Repository Guidelines

## Project Structure & Module Organization

The deployable Next.js application lives in `portfolio/`; run project commands there. Routes and layouts are under `portfolio/src/app`, including locale-aware pages in `src/app/[locale]`. Shared code lives in `src/common`: components follow an atomic hierarchy (`atoms`, `molecules`, `organisms`, and `templates`), while hooks, providers, utilities, configuration, and translations have dedicated folders. Place browser-served assets in `portfolio/public`; repository-level design references and CV content belong in `static`. Deployment automation is in `.github/workflows/deploy.yml`.

## Build, Test, and Development Commands

From `portfolio/`:

- `pnpm install --frozen-lockfile` installs the exact lockfile versions.
- `pnpm dev` starts the Turbopack development server at `http://localhost:3000`.
- `pnpm build` creates the production/static-export build used by deployment.
- `pnpm start` serves a completed Next.js build locally.
- `pnpm exec eslint .` checks Next.js, React, and TypeScript rules; use `pnpm lint:fix` only for intentional repository-wide fixes.
- `pnpm doctor` runs React Doctor diagnostics.

## Coding Style & Naming Conventions

Use TypeScript with strict checking, two-space indentation, double quotes, and semicolons. Prettier, its Tailwind plugin, and ESLint are authoritative; format touched files with `pnpm exec prettier --write <path>`. Use the `@/` alias for `src` imports. Name components in PascalCase, hooks with `use-`, and files in kebab-case (for example, `project-modal.tsx`). Keep reusable UI in the smallest appropriate atomic layer. Add user-facing copy to both `src/common/i18n/en.json` and `vi.json`.

## Testing Guidelines

No automated test framework or coverage threshold is currently configured. Before submitting, run ESLint and `pnpm build`, then manually verify affected routes in both locales. For visual or motion changes, check desktop and mobile layouts, keyboard interaction, reduced-motion behavior, and browser console errors. Add a focused test only when introducing non-trivial logic and a test runner is adopted.

## Commit & Pull Request Guidelines

History follows Conventional Commit prefixes such as `feat:` and `refactor:`. Keep commits focused and use an imperative summary, for example `fix: preserve locale in project links`. Pull requests should explain the change and validation performed, link related issues, and include before/after screenshots or recordings for UI and animation work. Call out translation, accessibility, or deployment effects explicitly.

## Agent-Specific Notes

When Byterover MCP tools are available, retrieve relevant project knowledge before implementation and store durable insights after material module changes.

[byterover-mcp]

# Byterover MCP Server Tools Reference

There are two main workflows with Byterover tools and recommended tool call strategies that you **MUST** follow precisely.

## Onboarding workflow

Trigger this workflow only if users particularly ask you to start the onboarding process. You **MUST** follow these steps.

1. **ALWAYS USE** **byterover-check-handbook-existence** first to check if the byterover handbook already exists. If not, You **MUST** call **byterover-create-handbook** to create the byterover handbook.
2. If the byterover handbook already exists, first you **MUST** USE **byterover-check-handbook-sync** to analyze the gap between the current codebase and the existing byterover handbook.
3. Then **IMMEDIATELY USE** **byterover-update-handbook** to update these changes to the byterover handbook.
4. Next, you **MUST** run **byterover-retrieve-knowledge** to gather context and knowledge about the project before generating the handbook.
5. During the onboarding, you **MUST** use **byterover-list-modules** **FIRST** to get the available modules, and then **byterover-store-modules** and **byterover-update-modules** if there are new modules or changes to existing modules in the project.

## Planning workflow

Trigger this workflow when users require you to start an implementation plan, carry out bug fixes, or make a new feature to the project. You **MUST** follow these steps.

1. If asked to continue an unfinished implementation, **CALL** **byterover-retrieve-active-plans** to find the most relevant active plan.
2. **CRITICAL PLAN PERSISTENCE RULE**: Once a user approves a plan, you **MUST IMMEDIATELY CALL** **byterover-save-implementation-plan** to save it.
3. Throughout the plan, you **MUST** run **byterover-retrieve-knowledge** several times to retrieve sufficient knowledge and context for the plan's tasks.
4. In addition, you **MUST** run **byterover-search-modules** and **byterover-update-modules** if the tasks require or update knowledge about certain modules.
5. **MUST** use **byterover-update-plan-progress** to mark tasks (and then the whole plan) as completed.
6. Then, you might call **byterover-store-knowledge** to save knowledge and experience implemented throughout the plan or in important tasks.
7. During the plan's implementation, you **MUST** frequently call **byterover-think-about-collected-information** and **byterover-assess-context-completeness** to make sure you're on the right track and gather sufficient context for the tasks.
