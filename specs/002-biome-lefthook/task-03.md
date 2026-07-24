# T3: CI enforcement and complete verification (specs/002-biome-lefthook)

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Modify: `AGENTS.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: T1/T2 exact scripts, Biome config, Lefthook config, tests, and documented local workflow.
- Produces: CI ordering with `npm run check` immediately after install; final synchronized quality-gate documentation and changelog.
- Shared files: preserve all existing workflow gates and T1/T2 docs; add CI/check ordering and final release-note content only.

**Blocked by:** task-02
**Template:** existing `.github/workflows/ci.yml` ordered step structure.
**Verified facts:** CI ordering is fixed at `specs/002-biome-lefthook/spec.md:29`; final docs/gates are fixed at `specs/002-biome-lefthook/spec.md:30-31`.
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

**Acceptance criteria:** Covers AC-6, completes AC-7, and covers AC-8. CI enforces Biome in the required order; all docs/changelog agree; every new and existing gate passes; package file list remains unchanged.

Steps:
- [ ] Add `- run: npm run check` immediately after `npm ci` in `.github/workflows/ci.yml`, preserving least-privilege permissions, exact Node version, and every existing gate/order after the new check.
- [ ] Update `README.md`, `CONTRIBUTING.md`, and `AGENTS.md` in the same commit so their full command sequences place `npm run check` before typecheck/tests/build/pack. Add an Unreleased Biome/Lefthook entry to `CHANGELOG.md`.
- [ ] Run fresh `npm ci`; verify `prepare` installs Lefthook and no tracked files change. Run `npm run check`, `npm run typecheck`, `npm run test:unit`, `npm run test:integration`, `npm test`, `npm run build`, and `npm pack --dry-run --json`; expected all exit 0.
- [ ] Parse the package dry-run JSON and compare its path list to the pre-feature contract: required runtime artifacts remain present and `biome.json`, `lefthook.yml`, hook internals, tests, specs, and CI remain excluded.
- [ ] Run `npm run check:fix`, then `npm run check`, then inspect `git diff`; expected no formatter-induced changes. Inspect `.github/workflows/ci.yml` to prove exact check ordering and run `git diff --check`.
- [ ] Stage T3 files, allow the pre-commit hook to run normally, inspect the resulting staged diff, and commit as `ci(quality): enforce Biome checks`.
