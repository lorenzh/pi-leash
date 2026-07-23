# pi-leash Constitution

Status: approved 2026-07-23

## Tech stack

- Production code and tests use strict TypeScript compiled as native ECMAScript modules.
- The package supports Node.js 22.19.0 or newer, matching the minimum runtime of the Pi SDK used by the package.
- Pi-provided runtime libraries (`@earendil-works/pi-coding-agent`, `@earendil-works/pi-ai`, `@earendil-works/pi-tui`, `@earendil-works/pi-agent-core`, and `typebox`) remain unbundled peer dependencies with `"*"` ranges.
- The package is distributed as an npm Pi package and declares its extension and skill resources in the `pi` package manifest.

## Coding standards

- Public APIs and cross-module data use explicit exported types; unchecked `any` and unvalidated external data are prohibited.
- Errors crossing the tool or command boundary are actionable and identify the failed harness, operation, or allowed policy values.
- New runtime dependencies require a demonstrated need that cannot be met by Node.js or Pi APIs.
- Harness-specific detection, arguments, parsing, cost extraction, and cancellation remain inside the owning adapter.

## Testing policy

- Policy resolution, effort mapping, adapter registry behavior, model filtering, adapter output parsing, and delegation lifecycle require automated unit tests.
- Every defect fix includes a regression test that fails without the fix.
- Tests, strict typechecking, and the production build run before changes are considered complete.
- Every release additionally passes `npm pack --dry-run` and inspection of the resulting file list.

## Architecture principles

- Core delegation depends on the `HarnessAdapter` contract and contains no harness-specific branches.
- Policy is harness-agnostic and validates harness, model, and effort before any child process or Pi session starts.
- Missing policy keys and wildcard entries are permissive; an explicit restricted list fails closed with a typed error listing allowed values.
- Project-local configuration is loaded only when Pi reports the project as trusted.
- Every delegated run has one lifecycle owner responsible for streaming, timeout handling, cancellation, process or session cleanup, and terminal state.
- Supervision decisions operate on events pi-leash observes; documentation and code must not imply that external harnesses share or implement AHP.
- v0.2 supervision remains isolated behind typed hooks so the v0.1 delegation path does not depend on unimplemented supervision behavior.

## Amendment process

- Constitution changes require an explicit proposed diff, downstream-impact assessment, and human approval before modification.
- Approved amendments are committed separately from feature implementation and update affected specs, plans, tests, and documentation before release.
