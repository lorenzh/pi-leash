# T2: Lefthook staged-file integration (specs/002-biome-lefthook)

**Files:**
- Create: `lefthook.yml`
- Create: `tests/integration/tooling.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: T1 exact Biome dependency, `biome.json`, `check` scripts, and formatted repository.
- Produces: exact development dependency `lefthook@2.1.10`; npm script `prepare: lefthook install`; Lefthook `pre-commit` job `biome`; isolated staged-file integration test.
- Shared files: preserve every T1 dependency/script/doc line; add only Lefthook install, hook, and staged-file behavior. T3 consumes the final package/docs state.

**Blocked by:** task-01
**Template:** Official Biome Lefthook recipe recorded in `specs/002-biome-lefthook/spec.md:55`.
**Verified facts:** Exact hook glob, command, `stage_fixed`, isolated assertions, and offline requirement are fixed at `specs/002-biome-lefthook/spec.md:27-28`.
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

**Acceptance criteria:** Covers the Lefthook portion of AC-1 plus AC-4, AC-5, and hook documentation in AC-7. Install creates the hook; config exactly matches the official recipe; isolated integration proves formatting, re-staging, index/worktree agreement, unrelated unstaged preservation, and offline execution.

Steps:
- [ ] RED — create `tests/integration/tooling.test.ts` before adding Lefthook/config. The test must create a temporary Git repository, configure a local user, copy `biome.json`, symlink the project's installed `node_modules`, commit a baseline `notes.txt`, modify it without staging, write and stage misformatted `fixture.ts`, invoke the project Lefthook binary with `npm_config_offline=true`, and assert the hook result. Run the focused test; expected RED because the Lefthook binary/config is absent. Record the literal failure.
- [ ] Create exact `lefthook.yml` before installing the package so the `prepare` lifecycle has a valid configuration:

```yaml
pre-commit:
  commands:
    biome:
      glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc,css}"
      run: npx @biomejs/biome check --write --no-errors-on-unmatched --files-ignore-unknown=true {staged_files}
      stage_fixed: true
```

- [ ] Add exact `lefthook@2.1.10` and `prepare: lefthook install`, preserving all T1 scripts/versions; run `npm install` and confirm `.git/hooks/pre-commit` is installed without committing hook internals.
- [ ] GREEN — implement the isolated test with these executable assertions after `lefthook run pre-commit` exits 0:

```ts
expect(git(temp, "show", ":fixture.ts")).toBe("const value = { answer: 42 };\n");
expect(git(temp, "diff", "--", "fixture.ts")).toBe("");
expect(git(temp, "diff", "--cached", "--name-only")).toBe("fixture.ts\n");
expect(git(temp, "diff", "--name-only")).toBe("notes.txt\n");
expect(readFileSync(join(temp, "notes.txt"), "utf8")).toBe(unrelatedBefore);
```

Use `try/finally` to remove the temporary repository, and ensure the hook command environment disables npm network access while retaining PATH.
- [ ] Run the focused integration test, then `npm run test:integration`; expected all integration tests pass and no repository index/worktree changes are left by the isolated test.
- [ ] Update `README.md`, `CONTRIBUTING.md`, and `AGENTS.md` in the same commit: `npm ci`/`npm install` installs hooks, pre-commit fixes only staged supported files and re-stages them, hooks can be bypassed only for exceptional diagnosis, and `npm run check` remains the full-repository gate.
- [ ] Stage the T2 files, run `npx lefthook run pre-commit`, inspect staged and unstaged diffs, then run `npm run check`, `npm run typecheck`, `npm test`, and `npm run build`; expected all pass and unrelated work is unchanged.
- [ ] Commit T2 as `chore(quality): enforce Biome on staged files` and record the actual hook output.
