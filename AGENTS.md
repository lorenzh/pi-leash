# Agent instructions

pi-leash is a Pi extension intended to control ACP-compatible coding agents as
subagents. Current protocol scope is ACP wire protocol v1 over local stdio; the
repository is still a no-op scaffold.

## Authoritative guidance

- `CONSTITUTION.md` — project invariants and quality policy
- `docs/architecture.md` — layers and dependency direction
- `docs/acp.md` — ACP version, lifecycle, capabilities, and security boundary
- `CONTRIBUTING.md` — contributor workflow and gates
- `SECURITY.md` — private vulnerability reporting and secret handling

## Commands

```sh
npm ci
npm run typecheck
npm run test:unit
npm run test:integration
npm test
npm run build
npm pack --dry-run --json
```

Keep Pi integration and adapters outside the ACP and application core; core
code depends on typed transport and lifecycle ports. Follow red-green-refactor
and retain focused failure/pass evidence. Update affected documentation with
setup, behavior, contract, architecture, security, or workflow changes.

Use Conventional Commit and pull-request titles in `type(scope): description`
or `type: description` form. Never put credentials, environment secrets,
authentication material, or sensitive protocol fields in prompts, fixtures,
logs, reports, or tool output; redact them and report vulnerabilities through
the private process in `SECURITY.md`.
