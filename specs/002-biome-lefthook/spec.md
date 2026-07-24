# Add Biome and Lefthook quality gates

Status: approved 2026-07-24
Branch: feature/002-biome-lefthook
Base: main
Approach: Use Biome as the single formatter/linter/import organizer and the official direct Lefthook staged-file recipe with automatic fixes and re-staging; CI checks the whole repository.
Source work item: none (trackerless repository; user chose to proceed without a work item on 2026-07-24)

## Problem

pi-leash has strict typechecking and tests but no automated formatting or linting, so style and static-quality drift can enter commits and CI; contributors also lack a pre-commit gate that fixes only the supported files they staged without disturbing unrelated work.

## User stories

- As a contributor, I want one fast command for formatting and linting so that local and CI quality checks agree.
- As a contributor, I want staged supported files automatically fixed and re-staged before commit so that routine style issues do not interrupt development.
- As a maintainer, I want CI to enforce the same repository-wide Biome rules so that bypassed hooks cannot merge unchecked changes.

## Acceptance criteria

- AC-1: `package.json` uses exactly `@biomejs/biome@2.5.5` and `lefthook@2.1.10` as development dependencies, adds `check` (`biome check .`), `check:fix` (`biome check --write .`), and `prepare` (`lefthook install`) scripts, and preserves all existing runtime, peer, development dependency, and script contracts.
- AC-2: Root `biome.json` is accepted by `biome check` and enables VCS integration with Git ignore-file handling, space indentation, 100-character line width, recommended lint rules, and import organization; generated, installed, temporary, and build artifacts remain ignored through the existing Git ignore contract.
- AC-3: `npm run check` exits 0 on the repository, and `npm run check:fix` followed by `npm run check` is idempotent with no remaining tracked-file diff caused by Biome.
- AC-4: Root `lefthook.yml` defines a pre-commit Biome job using the official supported-file glob `*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc,css}`, runs `npx @biomejs/biome check --write --no-errors-on-unmatched --files-ignore-unknown=true {staged_files}`, and sets `stage_fixed: true`.
- AC-5: An automated integration test creates an isolated temporary Git repository with the project Biome/Lefthook configuration and installed toolchain, stages a deliberately misformatted supported file, runs the pre-commit hook, and proves the staged blob is formatted, the fix is re-staged, unrelated unstaged content is unchanged, and the hook exits 0 without network access.
- AC-6: GitHub Actions runs `npm run check` immediately after `npm ci` and before typechecking, tests, build, and package inspection.
- AC-7: `README.md`, `CONTRIBUTING.md`, and `AGENTS.md` document `check`, `check:fix`, automatic staged-file fixing, hook installation through `npm ci`/`npm install`, and the unchanged full verification gates in the same change.
- AC-8: Fresh `npm ci`, `npm run check`, `npm run typecheck`, `npm run test:unit`, `npm run test:integration`, `npm test`, `npm run build`, and `npm pack --dry-run --json` all exit 0; the package file contract remains unchanged.

## Non-goals

- Replacing TypeScript typechecking or Vitest.
- Formatting Markdown or YAML files that Biome does not support.
- Running Biome against the whole repository in the pre-commit hook.
- Adding a commit-message hook or enforcing Conventional Commit syntax in hook code.
- Changing production behavior, ACP behavior, public APIs, Node.js support, or package publication.
- Deleting the already-merged feature branch.

## Open questions

- None.

## Context map

- `CONSTITUTION.md:14` — dependency, documentation, and Conventional Commit standards.
- `CONSTITUTION.md:25` — TDD and completion-gate requirements.
- `package.json:32` — existing scripts that must remain stable while quality scripts are added.
- `package.json:48` — existing exact development dependencies.
- `.github/workflows/ci.yml:13` — current ordered CI steps.
- `.gitignore:1` — artifact ignore contract Biome must respect.
- `CONTRIBUTING.md:15` — existing TDD workflow.
- `CONTRIBUTING.md:39` — existing pre-PR gates.
- `AGENTS.md:15` — agent command reference that must stay synchronized.

## Requirement sources

- `CONSTITUTION.md` — governing project invariants.
- `https://biomejs.dev/recipes/git-hooks/#lefthook` — official Lefthook staged-file and `stage_fixed` recipe.
- `https://biomejs.dev/reference/configuration/` — Biome configuration contract.
- `https://lefthook.dev/configuration/run.html` — Lefthook run-command placeholders and staged-file behavior.
- Source work item: none (trackerless repository by explicit user choice).
- User request dated 2026-07-24 — add and configure Biome and a commit hook using Lefthook.
- User decision dated 2026-07-24 — auto-fix and re-stage supported staged files, use recommended Biome defaults, and run whole-repository checks in CI.
