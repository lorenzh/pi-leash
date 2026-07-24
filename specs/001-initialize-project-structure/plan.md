# Plan: Initialize project structure

Status: approved 2026-07-24
Goal: Establish a reproducible, documented, test-driven Pi extension scaffold with typed ACP boundaries, a fake ACP v1 integration agent, release gates, and a public GitHub home.
Approach: Build one layered npm package in five dependency-ordered tasks. Establish the compiler/test foundation first, add the no-op Pi and architectural boundaries with unit-level TDD, add the stdio fake agent with integration-level TDD, complete distribution/CI/documentation, then create and verify the public repository.
Human-only prerequisites: none; `gh auth status` confirms authenticated `lorenzh` access with `repo` and `workflow` scopes.
Baseline health: fork point `9ee07cb53846d5df8298ecdc0244749d3ed1c13e`; `package.json` is absent there. Branch gates `npm ci`, `npm run typecheck`, `npm run test:unit`, `npm run test:integration`, `npm test`, `npm run build`, and `npm pack --dry-run --json` were each probed against an archive of that fork point and are unavailable by design (`npm ci` exit 1 `EUSAGE`; all others exit 254 `ENOENT`). `gh repo view lorenzh/pi-leash` reports that the repository does not exist. These are scaffold deliverables, not pre-existing red gates; task-local gates are introduced with their owning task and the full branch tier applies after T4.
Commit-message convention: Conventional Commits 1.0.0; use `type(scope): description` or `type: description` for commits and the pull-request title.
Commit strategy: normal commits; `core.hooksPath` is default and no active custom hooks exist.

## Model routing

- Classification: Medium — a bounded scaffold with clear acceptance criteria, but spanning npm packaging, multiple typed layers, subprocess protocol integration, CI, documentation, and GitHub setup.
- Ladder: none configured by project policy; user selected `Executor: session model` for this plan.
- Escalation: after two focused correction attempts with a clear cause, return the failing task to the session coordinator; unclear coupling or protocol failures return immediately for replanning.

## Global constraints

- Production code and tests use strict TypeScript compiled as native ECMAScript modules.
- Automated TypeScript tests use Vitest.
- Pi-provided runtime libraries are unbundled peer dependencies with `"*"` ranges, as required by Pi package conventions.
- Agent Client Protocol support conforms to a published specification version recorded in package metadata or project documentation.
- Behavioral implementation follows red-green-refactor: change evidence records a focused failing test before production code changes, the smallest implementation that makes it pass, and refactoring only while relevant tests remain green.
- Integration tests exercise delegation against a deterministic fake ACP agent without requiring external credentials or installed vendor harnesses.
- Core delegation depends on typed ACP transport and protocol interfaces and contains no harness-specific branches.
- Every process started by the extension is owned, observable, bounded by cancellation or timeout, and terminated during run completion or session shutdown.
- Every change that alters documented behavior, public contracts, setup, architecture, security guidance, or contributor workflows updates the affected documentation in the same pull request, or in the same commit when no pull request exists.
- Commits and pull-request titles created after this amendment conform to Conventional Commits 1.0.0; each pull-request title summarizes the overall change using `type(scope): description` or `type: description`.

## Verified facts

- VERIFIED: The approved scope is a layered single package on `feature/001-initialize-project-structure` from `main` (`specs/001-initialize-project-structure/spec.md:3-6`).
- VERIFIED: Required package versions are Node.js `>=22.19.0`, TypeScript `7.0.2`, Vitest `4.1.10`, and ACP SDK `1.3.0` (`specs/001-initialize-project-structure/spec.md:24`).
- VERIFIED: The production package must emit native ESM plus declarations while excluding tests, specs, and fixtures (`specs/001-initialize-project-structure/spec.md:25-26`).
- VERIFIED: The required source boundaries are Pi entry, application lifecycle, ACP client/transport, configuration, and owned-process management (`specs/001-initialize-project-structure/spec.md:27-28`).
- VERIFIED: The fake agent must exercise ACP v1 `initialize`, `session/new`, `session/prompt`, streaming, final output, stream close, and clean child exit (`specs/001-initialize-project-structure/spec.md:29`).
- VERIFIED: The exact CI, package-content, documentation, public-repository, TDD-evidence, co-documentation, and `AGENTS.md` contracts are fixed (`specs/001-initialize-project-structure/spec.md:30-36`).
- VERIFIED: Pi extensions export a default factory receiving `ExtensionAPI`, and factories must not start long-lived resources; startup belongs in session/tool/command paths with shutdown cleanup (`CONSTITUTION.md:38-42`; Pi 0.81.1 extension source recorded at `specs/001-initialize-project-structure/spec.md:64`).
- VERIFIED: The official ACP SDK v1.3.0 examples use `ndJsonStream`, `agent(...)`, `client(...)`, `initialize`, `buildSession(cwd)`, `session.prompt(...)`, and `session.nextUpdate()` over child stdio (SDK source recorded at `specs/001-initialize-project-structure/spec.md:68`).
- VERIFIED: The base fork contains only `CONSTITUTION.md`; no package, source, test, documentation, CI, remote, or hook implementation exists (`git ls-tree -r --name-only 9ee07cb53846d5df8298ecdc0244749d3ed1c13e`).
- VERIFIED: T1 created `build:test-fixtures` but `test:integration` currently invokes only Vitest, so T3 must change that script to compile fixtures before running integration tests (`package.json:27-31`).
- VERIFIED: T4 package verification must isolate its build from the concurrently used root `dist/` and must place representative forbidden candidates in that isolated package root so exclusion assertions are non-vacuous (`tests/unit/package.test.ts:8-65`; `specs/001-initialize-project-structure/task-04-review.md`, F2-F3).

## Task index

- T1: Package and test foundation (AC-1) → `task-01.md`
- T2: Layered extension scaffold (AC-4, AC-5, AC-11) → `task-02.md`
- T3: Fake ACP stdio integration (AC-6, AC-11) → `task-03.md`
- T4: Distribution, CI, and project documentation (AC-2, AC-3, AC-7, AC-8, AC-9, AC-12, AC-13) → `task-04.md`
- T5: Public GitHub repository (AC-10) → `task-05.md`
