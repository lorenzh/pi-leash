# T5: Public GitHub repository (specs/001-initialize-project-structure)

**Files:**
- none (evidence-only)

**Interfaces:**
- Consumes: complete committed T1-T4 scaffold history on `feature/001-initialize-project-structure`; authenticated `gh` account `lorenzh`.
- Produces: public `github.com/lorenzh/pi-leash`; Git `origin`; remote `main`; enabled issues; enabled private vulnerability reporting.
- Shared files: none.

**Blocked by:** task-04
**Template:** none
**Verified facts:** The repository does not exist at planning time; `gh auth status` reports authenticated `lorenzh` access with `repo` and `workflow` scopes. Exact remote description and verification fields are fixed at `spec.md:33`.
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

**Acceptance criteria:** Covers AC-10. GitHub reports the exact owner/name, public visibility, approved description, issues, private vulnerability reporting, and default `main`; local `origin` targets it; remote `main` contains the constitution, approved spec/plan, and complete scaffold history without an auto-generated commit.

Steps:
- [ ] Re-run all branch gates before publishing: `npm ci`, `npm run typecheck`, `npm run test:unit`, `npm run test:integration`, `npm test`, `npm run build`, and `npm pack --dry-run --json`; expected: all exit 0.
- [ ] Confirm `git status --short` is clean and the current branch contains the approved plan plus committed T1-T4 history. Confirm `gh repo view lorenzh/pi-leash` still reports not found; if it exists unexpectedly, stop without modifying it and return to the coordinator.
- [ ] Create the empty public repository without generated files: `gh repo create lorenzh/pi-leash --public --description "A Pi extension for controlling ACP-compatible coding agents as subagents"`.
- [ ] Add `origin` using the authenticated account's SSH Git protocol, then push the current complete `HEAD` directly to remote `main` with `git push -u origin HEAD:main`. Set remote default branch to `main` and explicitly enable issues with `gh repo edit lorenzh/pi-leash --default-branch main --enable-issues`.
- [ ] Enable private vulnerability reporting with `gh api --method PUT repos/lorenzh/pi-leash/private-vulnerability-reporting`.
- [ ] Verify `gh repo view lorenzh/pi-leash --json nameWithOwner,visibility,description,hasIssuesEnabled,defaultBranchRef`, `gh api repos/lorenzh/pi-leash/private-vulnerability-reporting --jq .enabled`, `git remote get-url origin`, and `git ls-remote origin refs/heads/main`. Compare the remote-main SHA to local `HEAD`; all AC-10 values must match exactly.
- [ ] Return the command outputs as evidence. Do not create an extra evidence commit or npm publication.
