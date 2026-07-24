# Contributing to pi-leash

## Environment setup

Use Node.js 22.19.0 or newer. From a clean checkout, install the exact locked
dependencies:

```sh
npm ci
```

Use `npm install` only when intentionally updating dependencies and the
lockfile.

## Code quality

Biome checks supported source and configuration files repository-wide and respects the existing
Git ignore rules. Generated, installed, temporary, and build artifacts ignored by Git are therefore
outside its scope.

```sh
npm run check
npm run check:fix
```

`npm run check` performs a read-only formatting, lint, and import-order check. Run
`npm run check:fix` to apply supported fixes before repeating the check.

## Test-driven development

Behavioral changes follow red-green-refactor:

1. Add a focused test and record the failing command and literal assertion.
2. Make the smallest production change that passes that test.
3. Refactor only while the relevant tests remain green.

Defect fixes require a regression test. Keep the red and green command output
as review evidence.

Unit and integration coverage are separate:

```sh
npm run test:unit
npm run test:integration
npm test
```

Unit tests cover isolated behavior and architecture rules. Integration tests
build and spawn the deterministic fake ACP agent over local stdio; they must
not require network access, credentials, or installed vendor harnesses.
`npm test` runs both suites.

## Pre-pull-request gates

Run the complete local gate set:

```sh
npm ci
npm run check
npm run typecheck
npm run test:unit
npm run test:integration
npm test
npm run build
npm pack --dry-run --json
```

Inspect the package file list to confirm runtime artifacts and declarations are
included while source, tests, fixtures, specifications, CI files, and local
configuration are excluded.

## Documentation and history

Update documentation in the same pull request as changes to setup, behavior,
public contracts, architecture, security guidance, or contributor workflows.
Without a pull request, keep implementation and affected documentation in the
same commit.

Use Conventional Commits 1.0.0 for commits and pull-request titles:

```text
type(scope): description
```

The scope is optional, so `type: description` is also valid. A pull-request
title must summarize the overall change in the same format.
