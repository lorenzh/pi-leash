# Initialize project structure

Status: approved 2026-07-23
Branch: feature/001-initialize-project-structure
Base: main
Approach: Use a layered single npm package whose Pi extension, application lifecycle, ACP boundary, process/configuration boundaries, and tests have explicit dependency directions.
Source work item: none (trackerless repository; user chose to proceed without a work item on 2026-07-23)

## Problem

pi-leash has an approved constitution but no package metadata, source layout, build, tests, documentation, or continuous-integration setup, so contributors cannot safely begin implementing ACP-based subagent delegation or verify that future work respects Pi packaging and protocol boundaries.

## User stories

- As a maintainer, I want a reproducible npm project so that I can build, test, and package the extension from a clean checkout.
- As a maintainer, I want a public GitHub repository so that users can discover the project and contributors can collaborate through issues and Git.
- As a contributor, I want explicit module boundaries so that Pi integration, delegation lifecycle, ACP communication, configuration, and process ownership do not become coupled.
- As a protocol implementer, I want a deterministic fake ACP agent so that later delegation behavior can be tested without credentials or vendor harnesses.
- As a Pi user, I want the installed package to expose a valid extension entry point without performing background work at load time.
- As a coding agent, I want concise repository instructions so that I can find authoritative rules, commands, and architecture boundaries without duplicating project documentation.

## Acceptance criteria

- AC-1: `package.json` identifies `pi-leash` version `0.1.0` as an MIT-licensed native-ESM npm Pi package, requires Node.js `>=22.19.0`, uses exactly `typescript@7.0.2` and `vitest@4.1.10` as development dependencies, declares its compiled extension entry in the `pi` manifest, uses exactly `@agentclientprotocol/sdk@1.3.0` in runtime dependencies, and declares imported Pi-provided libraries as unbundled `"*"` peer dependencies.
- AC-2: On Node.js 22.19.0 or newer, a clean checkout completes `npm ci`, `npm run typecheck`, `npm run test:unit`, `npm run test:integration`, `npm test`, and `npm run build` with exit code 0 and without external credentials or installed vendor harnesses; `npm test` executes both Vitest suites.
- AC-3: The production build emits native ESM JavaScript and declaration files from strict TypeScript without compiling tests, specifications, or fixtures into the publishable extension output.
- AC-4: The source tree exposes separate typed boundaries for the Pi extension entry, application/delegation lifecycle, ACP client/transport, configuration, and owned-process management; an automated architecture check rejects dependencies from core ACP or lifecycle modules back into Pi UI integration or harness-specific adapters.
- AC-5: Loading the compiled extension factory against a minimal Pi API test double registers no tool or command and starts no process, socket, timer, watcher, or delegated run.
- AC-6: `npm run test:integration` uses Vitest to spawn a deterministic fake ACP v1 agent over stdio, completes `initialize`, `session/new`, and one `session/prompt`, verifies streamed and final output, closes the client stream, confirms clean process exit, and requires no network access, credentials, or vendor executable.
- AC-7: GitHub Actions installs with `npm ci` on Node.js 22.19.0 and runs typechecking, tests, the production build, and `npm pack --dry-run`.
- AC-8: `npm pack --dry-run --json` succeeds and its file list includes the compiled extension, declarations, package metadata, README, and license while excluding source tests, fake-agent fixtures, specifications, CI configuration, and local configuration.
- AC-9: Documentation remains shallow and consists of `README.md` for purpose, status, installation, quick start, and links; `CONTRIBUTING.md` for setup, TDD workflow, commands, and pull-request gates; `SECURITY.md` for private vulnerability reporting; `CHANGELOG.md` for versioned user-visible changes; `docs/architecture.md` for layered responsibilities and dependency direction; and `docs/acp.md` for ACP wire protocol v1, local-stdio lifecycle and scope, capabilities, and the absence of portable mid-turn steering.
- AC-10: `gh repo view lorenzh/pi-leash --json nameWithOwner,visibility,description,hasIssuesEnabled,defaultBranchRef` reports `lorenzh/pi-leash`, `PUBLIC`, description `A Pi extension for controlling ACP-compatible coding agents as subagents`, issues enabled, and `main` as the default branch; `gh api repos/lorenzh/pi-leash/private-vulnerability-reporting --jq .enabled` reports `true`; the local `origin` points to that repository and its `main` contains the existing constitution plus the approved scaffold history without an auto-generated remote commit.
- AC-11: Implementation evidence for the extension factory and fake ACP agent records the focused Vitest failure before each behavioral implementation, the corresponding passing focused test after the smallest implementation, and the final green unit and integration suites after refactoring.
- AC-12: The implementation pull-request diff contains documentation updates alongside every change it makes to setup, public contracts, architecture, security guidance, or contributor workflow; if implementation proceeds without a pull request, `git show` confirms each such change and its affected documentation are in the same commit.
- AC-13: Root `AGENTS.md` records the project purpose and ACP v1 scope; points to `CONSTITUTION.md` and `docs/` as authoritative sources; lists development, typecheck, unit, integration, build, and pack commands; summarizes dependency direction, TDD, documentation, Conventional Commit, pull-request-title, and secret-handling requirements without duplicating the constitution; and contains no model-routing block.

## Non-goals

- Implementing Pi tools or commands that delegate work to an ACP agent.
- Defining the user-facing agent configuration format.
- Supporting HTTP, WebSocket, or other remote ACP transports.
- Adding Claude Code, Codex, Gemini, or other harness-specific adapters.
- Implementing multi-turn orchestration, cancellation policy, permissions UI, timeout policy, or process supervision beyond the fake agent's test cleanup.
- Supporting experimental ACP v2 or vendor-specific ACP extensions.
- Publishing the package to npm.
- Adding a generated documentation site, generated API reference, nested documentation hierarchy, or architecture-decision-record directory.
- Configuring model routing in `AGENTS.md`.

## Open questions

- None.

## Context map

- `CONSTITUTION.md:5` — required TypeScript, Node.js, Pi-package, peer-dependency, and ACP technology invariants.
- `CONSTITUTION.md:14` — trust-boundary validation, error, secret-redaction, dependency, and versioning standards.
- `CONSTITUTION.md:25` — mandatory TDD, unit, fake-agent integration, build, and package verification policy.
- `CONSTITUTION.md:34` — required ACP/Pi separation, lifecycle ownership, isolation, and fail-closed architecture.

## Requirement sources

- `CONSTITUTION.md` — governing project invariants.
- `https://github.com/earendil-works/pi/blob/20be4b18d4c57487f8993d2762bace129f0cf7c6/packages/coding-agent/docs/extensions.md` (Pi 0.81.1) — Pi extension lifecycle, package imports, mode behavior, and shutdown requirements.
- `https://github.com/earendil-works/pi/blob/20be4b18d4c57487f8993d2762bace129f0cf7c6/packages/coding-agent/docs/packages.md` (Pi 0.81.1) — Pi npm manifest, runtime dependency, peer dependency, and packaging requirements.
- `https://agentclientprotocol.com/` — stable ACP v1 protocol role and lifecycle requirements.
- `https://github.com/agentclientprotocol/agent-client-protocol/releases/tag/schema-v1.20.0` — selected published ACP v1 schema artifact release.
- `https://www.npmjs.com/package/@agentclientprotocol/sdk/v/1.3.0` — selected official TypeScript SDK release.
- Source work item: none (trackerless repository by explicit user choice).
- User request dated 2026-07-23 — create `github.com/lorenzh/pi-leash` as a public repository with the approved description and existing local history.
- User request dated 2026-07-23 — use stable `typescript@7.0.2` rather than the native preview or another compiler version.
- User request dated 2026-07-23 — use `vitest@4.1.10`, follow red-green-refactor, and expose separate unit and fake-agent integration test suites.
- User request dated 2026-07-23 — establish the approved shallow documentation structure and keep affected documentation in the same pull request, or the same commit when no pull request exists.
- User request dated 2026-07-23 — create a concise root `AGENTS.md` with the approved scope and no model-routing block.
