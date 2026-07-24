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
npm run check
npm run check:fix
npm run typecheck
npm run test:unit
npm run test:integration
npm test
npm run build
npm pack --dry-run --json
```

`npm run check` performs a read-only repository-wide Biome check. `npm run check:fix` applies
formatting, lint, and import-order fixes to supported files. Both commands respect the existing Git
ignore rules, so generated, installed, temporary, and build artifacts remain outside their scope.
`npm ci` and `npm install` install the Lefthook-managed Git hooks. The pre-commit hook fixes and
re-stages only supported staged files while preserving unrelated unstaged work; bypass it only for
exceptional diagnosis. `npm run check` remains the full-repository gate and runs in CI immediately
after installation, before typechecking, tests, build, and package inspection.

Keep Pi integration and adapters outside the ACP and application core; core
code depends on typed transport and lifecycle ports. Follow red-green-refactor
and retain focused failure/pass evidence. Update affected documentation with
setup, behavior, contract, architecture, security, or workflow changes.

Use Conventional Commit and pull-request titles in `type(scope): description`
or `type: description` form. Never put credentials, environment secrets,
authentication material, or sensitive protocol fields in prompts, fixtures,
logs, reports, or tool output; redact them and report vulnerabilities through
the private process in `SECURITY.md`.
