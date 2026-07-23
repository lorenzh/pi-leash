# T4: Distribution, CI, and project documentation (specs/001-initialize-project-structure)

**Files:**
- Modify: `package.json` (final publish whitelist and verification script only)
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Create: `SECURITY.md`
- Create: `CHANGELOG.md`
- Create: `AGENTS.md`
- Create: `.github/workflows/ci.yml`
- Create: `tests/unit/package.test.ts`

**Interfaces:**
- Consumes: T1 package/build scripts, T2 compiled extension/declarations, T3 complete test suites and docs.
- Produces: npm package dry-run contract; CI gate; shallow documentation index; root agent instructions; private-reporting guidance.
- Shared files: `package.json`, `README.md`, and `CONTRIBUTING.md` retain all T1-T3 versions, scripts, architecture, and ACP guidance. This task may only complete and cross-link them.

**Blocked by:** task-02, task-03
**Template:** Pi package manifest and peer-dependency rules at immutable source recorded in `spec.md:65`; no repository CI template exists.
**Verified facts:** CI and package file contracts are exact at `spec.md:30-31`; documentation files and responsibilities are exact at `spec.md:32`; co-documentation and `AGENTS.md` contracts are exact at `spec.md:35-36`.
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

**Acceptance criteria:** Covers AC-2, AC-3, AC-7, AC-8, AC-9, AC-12, and AC-13. Every local gate passes; CI runs the same gates on Node 22.19.0; package output contains required distribution files and excludes development/spec files; all approved documentation and agent instructions exist and agree with the implementation.

Steps:
- [ ] RED — create `tests/unit/package.test.ts` with the executable package contract below. Run it before finalizing `package.json.files`; expected RED because source/tests/specs or other development files appear. Record the literal assertion.

```ts
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const packFiles = (): readonly string[] => {
  const output = execFileSync(
    "npm",
    ["pack", "--dry-run", "--json"],
    { encoding: "utf8" },
  );
  const parsed: unknown = JSON.parse(output);
  if (!Array.isArray(parsed) || !isRecord(parsed[0])) {
    throw new Error("npm pack returned no result");
  }
  const files = parsed[0].files;
  if (!Array.isArray(files) || !files.every(
    (entry) => isRecord(entry) && typeof entry.path === "string",
  )) {
    throw new Error("npm pack returned an invalid file list");
  }
  return files.map((entry) => entry.path as string).sort();
};

describe("npm package", () => {
  it("contains runtime artifacts and excludes development files", () => {
    const files = packFiles();
    expect(files).toEqual(expect.arrayContaining([
      "dist/index.js",
      "dist/index.d.ts",
      "package.json",
      "README.md",
      "LICENSE",
    ]));
    expect(files).not.toEqual(expect.arrayContaining([
      expect.stringMatching(/^(?:src|tests|specs|\.github|\.test-dist)\//),
      expect.stringMatching(/(?:^|\/)\.env(?:\.|$)/),
    ]));
  });
});
```
- [ ] GREEN — finalize `package.json.files` and package metadata so the focused package test passes without broad exclusions or bundling Pi peer packages. Keep the exact dependency versions and scripts from T1.
- [ ] Create `.github/workflows/ci.yml` for pushes and pull requests using `actions/checkout@v4`, `actions/setup-node@v4`, Node exactly `22.19.0` with npm cache, then `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, and `npm pack --dry-run`; grant only `contents: read`.
- [ ] Complete `README.md` with purpose, pre-implementation status, install/quick-start instructions that do not claim a delegation tool exists, all gate commands, and links to contributing, security, architecture, and ACP docs. Complete `CONTRIBUTING.md` with environment setup, red-green-refactor evidence, separate test suites, full pre-PR gates, documentation coupling, and Conventional Commit plus PR-title syntax.
- [ ] Create `SECURITY.md` with supported pre-1.0 status, instructions to use GitHub private vulnerability reporting rather than public issues, secret-redaction expectations, and response expectations without inventing an email address. Create `CHANGELOG.md` with an Unreleased section and a `0.1.0` scaffold entry dated 2026-07-23.
- [ ] Create concise root `AGENTS.md`: state project purpose and ACP v1/local-stdio scope; point to `CONSTITUTION.md`, `docs/architecture.md`, `docs/acp.md`, `CONTRIBUTING.md`, and `SECURITY.md`; list install/typecheck/unit/integration/test/build/pack commands; summarize dependency direction, TDD, co-documentation, Conventional Commits/PR titles, and secret handling. Do not copy whole constitution lines and do not include a model-routing block.
- [ ] Run `npm ci`, `npm run typecheck`, `npm run test:unit`, `npm run test:integration`, `npm test`, `npm run build`, and `npm pack --dry-run --json`; expected: all exit 0. Inspect the JSON file list against AC-8. Run a repository grep confirming `AGENTS.md` contains no model-routing heading or model names.
- [ ] Review `git diff` to confirm every setup, architecture, ACP, security, and workflow change across T1-T4 is accompanied by its corresponding documentation in the same task commit. Commit T4 as `chore(project): complete distribution and contributor setup`.
