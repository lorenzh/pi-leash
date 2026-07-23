# pi-leash Constitution

Status: approved 2026-07-23

## Tech stack

- Production code and tests use strict TypeScript compiled as native ECMAScript modules.
- The package supports the minimum Node.js version declared by its installed Pi SDK version or newer.
- The extension is distributed as an npm Pi package with extension resources declared in the `pi` package manifest.
- Pi-provided runtime libraries are unbundled peer dependencies with `"*"` ranges, as required by Pi package conventions.
- Agent Client Protocol support conforms to a published specification version recorded in package metadata or project documentation.

## Coding standards

- Public APIs and cross-module data use explicit exported types; unchecked `any` is prohibited.
- Data received from Pi, ACP agents, configuration, and child processes is validated at its trust boundary before use.
- Errors crossing a tool or command boundary are actionable and identify the failed harness, operation, and recovery options.
- Logs and tool results redact credentials, environment secrets, authentication material, and protocol fields classified as sensitive.
- New runtime dependencies require a demonstrated need that cannot be met safely by Node.js, Pi APIs, or existing dependencies.
- Public tool, configuration, and protocol-facing contracts follow semantic versioning and document breaking changes.

## Testing policy

- Protocol encoding, decoding, capability negotiation, lifecycle transitions, validation, cancellation, timeout handling, and adapter behavior require automated unit tests.
- Integration tests exercise delegation against a deterministic fake ACP agent without requiring external credentials or installed vendor harnesses.
- Every defect fix includes a regression test that fails without the fix.
- Tests, strict typechecking, and the production build pass before changes are considered complete.
- Every release passes `npm pack --dry-run` and inspection of the resulting package file list.

## Architecture principles

- Core delegation depends on typed ACP transport and protocol interfaces and contains no harness-specific branches.
- ACP behavior conforms strictly to the selected published specification; version differences and vendor extensions remain behind capability negotiation and adapters.
- UI behavior is isolated from core delegation so the extension operates in Pi TUI, RPC, JSON, and print modes.
- Every delegated run has one lifecycle owner responsible for streaming, timeout handling, cancellation, cleanup, and terminal state.
- Concurrent delegated runs have isolated mutable state, process ownership, output streams, and cancellation signals.
- Every run validates its working directory and capability boundaries before starting and passes only the environment data required by the harness.
- Every process started by the extension is owned, observable, bounded by cancellation or timeout, and terminated during run completion or session shutdown.
- ACP input is untrusted external data; malformed or unsupported messages fail closed with typed errors.

## Amendment process

- Constitution changes require an explicit proposed diff, downstream-impact assessment, and human approval before modification.
- Approved amendments are committed separately from feature implementation and update affected specs, plans, tasks, code, tests, verification, and documentation.
