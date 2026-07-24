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

## Model routing (subagent-driven work)

Work subagent-driven: classify every task and route it per the `choosing-models` skill before
delegating. Plan first when the classification calls for it (Medium and above); delegate
implementation tasks to subagents per the resulting route.

Models available through Pi's native subagent surface (use the benchmark names shown when building
the escalation ladder):

| Role | Pi model | Benchmark name |
| --- | --- | --- |
| Routable | `openai-codex/gpt-5.4` | `gpt-5-4` |
| Routable | `openai-codex/gpt-5.5` | `gpt-5-5` |
| Routable | `openai-codex/gpt-5.6-luna` | `gpt-5-6-luna` |
| Routable | `openai-codex/gpt-5.6-sol` | `gpt-5-6-sol` |
| Routable | `openai-codex/gpt-5.6-terra` | `gpt-5-6-terra` |
| Aux (read-only surveys/searches; never on the ladder) | `openai-codex/gpt-5.4-mini` | — |

Do not pin model/effort routes here. Recompute the ladder from the listed benchmark names, then
select and escalate according to `choosing-models`. Models missing from the benchmark remain
excluded from routable work until they have a project evaluation.

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
after installation, before typechecking, tests, build, and package inspection. When programmatically parsing
`npm pack --dry-run --json`, account for `prepare` lifecycle output before the JSON; follow the
standalone-array parsing used in `tests/unit/package.test.ts`.

Keep Pi integration and adapters outside the ACP and application core; core
code depends on typed transport and lifecycle ports. Follow red-green-refactor
and retain focused failure/pass evidence. Update affected documentation with
setup, behavior, contract, architecture, security, or workflow changes.

Use Conventional Commit and pull-request titles in `type(scope): description`
or `type: description` form. Never put credentials, environment secrets,
authentication material, or sensitive protocol fields in prompts, fixtures,
logs, reports, or tool output; redact them and report vulnerabilities through
the private process in `SECURITY.md`.
