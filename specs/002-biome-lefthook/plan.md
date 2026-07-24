# Plan: Add Biome and Lefthook quality gates

Status: approved 2026-07-24
Goal: Add one repository-wide Biome quality contract and a Lefthook pre-commit gate that safely fixes and re-stages only supported staged files.
Approach: Establish Biome and its exact npm scripts first, formatting the existing supported files and documenting the commands. Add the official Lefthook staged-file workflow with an isolated Git integration test, then wire the same check into CI and run the complete branch gates.
Human-only prerequisites: none.
Baseline health: fork point `a60db72974aebaf5453e1d5ea3a48d76d2e7539d`; existing branch gates `npm ci`, `npm run typecheck`, `npm run test:unit`, `npm run test:integration`, `npm test`, `npm run build`, and `npm pack --dry-run --json` all exit 0. New gate `npm run check` exits 1 with `npm error Missing script: "check"`, as expected before this feature. A read-only `@biomejs/biome@2.5.5 check` probe with the approved config checks 19 Git-tracked supported files and reports 11 fixable errors across nine files; generated `dist/` and `.test-dist/` are ignored once VCS ignore handling is enabled.
Commit-message convention: Conventional Commits 1.0.0; use `type(scope): description` or `type: description` for commits and pull-request titles.
Commit strategy: normal commits with no bypass; T2 adds the Lefthook dependency, configuration, and `prepare` installer together. Before every later commit, run the focused checks first because pre-commit may rewrite and re-stage supported staged files by design.

## Model routing

- Classification: Medium — bounded developer tooling, but it changes shared npm scripts, formatting, Git-hook behavior, CI, documentation, and an isolated Git integration path.
- Ladder: none configured; user selected `Executor: session model`.
- Escalation: after two focused correction attempts with a clear cause, return the task to the coordinator; unclear hook/index behavior returns immediately for replanning.

## Global constraints

- Production code and tests use strict TypeScript compiled as native ECMAScript modules.
- Automated TypeScript tests use Vitest.
- New runtime dependencies require a demonstrated need that cannot be met safely by Node.js, Pi APIs, or existing dependencies; accepted packages must have active maintenance, compatible licensing, published security reporting, broad production adoption, and native ESM and supported-Node compatibility.
- Behavioral implementation follows red-green-refactor: change evidence records a focused failing test before production code changes, the smallest implementation that makes it pass, and refactoring only while relevant tests remain green.
- Tests, strict typechecking, and the production build pass before changes are considered complete.
- Every release passes `npm pack --dry-run` and inspection of the resulting package file list.
- Every change that alters documented behavior, public contracts, setup, architecture, security guidance, or contributor workflows updates the affected documentation in the same pull request, or in the same commit when no pull request exists.
- Commits and pull-request titles created after this amendment conform to Conventional Commits 1.0.0; each pull-request title summarizes the overall change using `type(scope): description` or `type: description`.
- The pre-commit hook changes only supported staged files and preserves unrelated unstaged work.
- Biome and Lefthook remain development-only tooling and do not alter production or package runtime contracts.

## Verified facts

- VERIFIED: Exact versions, script names, Biome settings, hook command/glob, CI ordering, documentation, and complete gates are fixed (`specs/002-biome-lefthook/spec.md:22-31`).
- VERIFIED: Existing scripts occupy `package.json:32-40`; existing exact development dependencies occupy `package.json:48-52`.
- VERIFIED: CI currently runs install, typecheck, tests, build, and pack in that order (`.github/workflows/ci.yml:13-23`).
- VERIFIED: The official Biome recipe uses the selected glob, `{staged_files}`, `--write --no-errors-on-unmatched --files-ignore-unknown=true`, and `stage_fixed: true` (source recorded at `specs/002-biome-lefthook/spec.md:57`).
- VERIFIED: With VCS ignore handling, the approved Biome configuration checks 19 tracked supported files and identifies fixable changes only in `src/process/owned-process.ts`, `tests/integration/fake-agent.test.ts`, `tests/support/architecture.ts`, `tests/unit/architecture.test.ts`, `tests/unit/extension.test.ts`, `tests/unit/package.test.ts`, and the three `tsconfig*.json` files (`/tmp/pi-leash-biome-configured.log`).
- VERIFIED: Contributor commands and gates are documented in `README.md:38-50`, `CONTRIBUTING.md:39-55`, and `AGENTS.md:15-25`.
- VERIFIED: The base has no active custom Git hooks and uses the default hooks path; Lefthook installation is a feature deliverable.

## Task index

- T1: Biome configuration and repository formatting (AC-1 Biome portion, AC-2, AC-3, AC-7) → `task-01.md`
- T2: Lefthook staged-file integration (AC-1 Lefthook portion, AC-4, AC-5, AC-7) → `task-02.md`
- T3: CI enforcement and complete verification (AC-6, AC-7, AC-8) → `task-03.md`
