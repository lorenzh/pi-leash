# T1: Biome configuration and repository formatting (specs/002-biome-lefthook)

**Files:**
- Create: `biome.json`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/process/owned-process.ts`
- Modify: `tests/integration/fake-agent.test.ts`
- Modify: `tests/support/architecture.ts`
- Modify: `tests/unit/architecture.test.ts`
- Modify: `tests/unit/extension.test.ts`
- Modify: `tests/unit/package.test.ts`
- Modify: `tsconfig.json`
- Modify: `tsconfig.build.json`
- Modify: `tsconfig.fixtures.json`
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: existing exact npm script/dependency contract in `package.json`; existing Git ignore patterns.
- Produces: exact development dependency `@biomejs/biome@2.5.5`; npm scripts `check: biome check .` and `check:fix: biome check --write .`; repository-wide `biome.json` contract.
- Shared files: `package.json`, `package-lock.json`, `README.md`, `CONTRIBUTING.md`, and `AGENTS.md` retain every existing script/dependency/command and gain only Biome-specific entries; T2/T3 extend the same files from this state.

**Blocked by:** none
**Template:** Biome configuration source recorded in `specs/002-biome-lefthook/spec.md:56`.
**Verified facts:** The exact Biome version/settings and scripts are fixed at `specs/002-biome-lefthook/spec.md:24-26`; the read-only baseline identifies the nine formatted files listed above (`/tmp/pi-leash-biome-configured.log`).
**Executor:** session model
**Global constraints:**
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

**Acceptance criteria:** Covers the Biome portion of AC-1 plus AC-2, AC-3, and Biome-command documentation in AC-7. Exact dependency/config/scripts are present; `check:fix` makes only approved supported-file changes; a second fix is idempotent; all existing gates remain green.

Steps:
- [ ] RED — run `npm run check` before editing; record exit 1 and literal `npm error Missing script: "check"`. Run `npx --yes @biomejs/biome@2.5.5 check . --config-path=<temporary approved config>` and record `Found 11 errors` across the nine approved tracked files.
- [ ] Add exact `@biomejs/biome@2.5.5` to devDependencies and only `check`/`check:fix` to scripts; run `npm install` to update the lockfile without changing existing dependency versions.
- [ ] Create `biome.json` with schema `https://biomejs.dev/schemas/2.5.5/schema.json`; VCS enabled for Git with `useIgnoreFile: true`; formatter enabled with spaces and line width 100; linter recommended rules enabled; assist source organizeImports set to `on`.
- [ ] GREEN — run `npm run check`; expected RED for formatting, then run `npm run check:fix` and `npm run check`; expected final exit 0. Inspect the diff: formatting/import changes are limited to the nine listed source/test/config files plus package metadata.
- [ ] Run `npm run check:fix` again and capture `git diff`; expected no additional diff from the first fixed state, proving idempotence.
- [ ] Update `README.md`, `CONTRIBUTING.md`, and `AGENTS.md` in the same commit with `npm run check`, `npm run check:fix`, scope/ignore behavior, and the unchanged existing verification commands; do not document Lefthook before T2 implements it.
- [ ] Run `npm run check`, `npm run typecheck`, `npm test`, `npm run build`, and `npm pack --dry-run --json`; expected all exit 0 and package file contract unchanged.
- [ ] Commit all T1 files together as `chore(quality): add Biome checks and formatting`.
