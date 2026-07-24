# Contributing to pi-leash

## Setup

Use Node.js 22.19.0 or newer, then install the exact locked dependencies:

```sh
npm install
```

For a clean checkout or CI-style install, use `npm ci` once the lockfile is
present.

## Development commands

```sh
npm run typecheck
npm run build
npm run test:unit
npm run test:integration
npm test
npm run pack:check
```

The unit and integration commands are established for the behavioral work that
follows this initial scaffold. Until tests are added, they fail rather than
silently passing with no tests.

## Test-driven development

Behavioral changes follow red-green-refactor:

1. Add a focused test and record its expected failure.
2. Make the smallest production change that passes the test.
3. Refactor only while the relevant tests remain green.

Defect fixes require a regression test. Integration tests must use the
repository's deterministic fake ACP agent and must not require credentials or
vendor harnesses.

## Documentation and change history

Update documentation in the same pull request as changes to setup, behavior,
public contracts, architecture, security guidance, or contributor workflows.
When working without a pull request, keep the implementation and its affected
documentation in the same commit.

Use Conventional Commits 1.0.0 for commits and pull-request titles:

```text
type(scope): description
```

The scope is optional, so `type: description` is also valid. Pull-request
titles should summarize the overall change in the same format.
