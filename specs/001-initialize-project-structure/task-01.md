# T1: Package and test foundation (specs/001-initialize-project-structure)

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `tsconfig.json`
- Create: `tsconfig.build.json`
- Create: `tsconfig.fixtures.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `LICENSE`
- Create: `README.md`
- Create: `CONTRIBUTING.md`
- Create: `src/index.ts`

**Interfaces:**
- Consumes: Pi package manifest rules and exact versions from AC-1.
- Produces: npm scripts `clean`, `build`, `build:test-fixtures`, `typecheck`, `test`, `test:unit`, `test:integration`, and `pack:check`; Vitest projects named `unit` and `integration`; production output at `dist/`; fixture output at `.test-dist/`.
- Shared files: `package.json`, `README.md`, and `CONTRIBUTING.md` are created here; T4 may extend their distribution and contributor guidance without changing the versions or script names established here.

**Blocked by:** none
**Template:** Pi package requirements at the immutable source recorded in `spec.md:65`; Vitest 4 project configuration documented by the selected `vitest@4.1.10` release.
**Verified facts:** Exact runtime and tool versions are fixed at `spec.md:24`; clean-install and script names are fixed at `spec.md:25`; ESM/declaration output is fixed at `spec.md:26`.
**Executor:** session model
**Global constraints:**
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

**Acceptance criteria:** Covers AC-1 and establishes the tooling required by AC-2 and AC-3. `npm ci`, `npm run typecheck`, and `npm run build` pass; `package.json` contains exact `typescript@7.0.2`, `vitest@4.1.10`, and `@agentclientprotocol/sdk@1.3.0`, Node `>=22.19.0`, native ESM metadata, a `pi.extensions` entry for `./dist/index.js`, and only imported Pi packages as `"*"` peers.

Steps:
- [ ] Create `package.json` with `type: "module"`, version `0.1.0`, MIT license, `engines.node: ">=22.19.0"`, `main`/`types`/`exports` pointing into `dist/`, `pi.extensions: ["./dist/index.js"]`, exact selected dependency versions, `@types/node@22.20.1`, and the named scripts. Set `test` to run the unit and integration scripts sequentially; do not use `--passWithNoTests`.
- [ ] Create strict NodeNext `tsconfig.json`; derive `tsconfig.build.json` to emit ESM declarations and source maps from only `src/**/*.ts` into `dist/`; derive `tsconfig.fixtures.json` with `rootDir: "."` to emit only `tests/fixtures/**/*.ts` into `.test-dist/tests/fixtures/`. Configure `vitest.config.ts` with inline `unit` (`tests/unit/**/*.test.ts`) and `integration` (`tests/integration/**/*.test.ts`) projects using the Node environment.
- [ ] Create `.gitignore` for `node_modules/`, `dist/`, `.test-dist/`, coverage, logs, temporary package tarballs, and local environment files. Create the MIT `LICENSE` for pi-leash contributors.
- [ ] Create `src/index.ts` containing only `export {};` so the compiler foundation is independently buildable; this is metadata scaffolding, not behavioral production code, so no artificial red test is required.
- [ ] Create initial `README.md` and `CONTRIBUTING.md` in the same commit, accurately documenting the package status, Node requirement, install/typecheck/build commands, the future unit/integration script names, TDD policy, documentation coupling, and Conventional Commit/PR-title syntax without claiming unimplemented delegation.
- [ ] Run `npm install` to generate `package-lock.json`, then run `npm ci`, `npm run typecheck`, and `npm run build`; expected: each exits 0 and `dist/index.js`, `dist/index.d.ts`, and their source maps exist.
- [ ] Commit all T1 files together as `build(scaffold): establish TypeScript and Vitest foundation` so setup and its documentation remain in the same commit.
