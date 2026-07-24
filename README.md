# pi-leash

A Pi extension for controlling ACP-compatible coding agents as subagents.

## Status

pi-leash is a pre-implementation scaffold. It exports a no-op Pi extension
factory and typed architecture boundaries, but it does not yet delegate work,
register tools or commands, or start agent processes.

The planned protocol boundary targets ACP wire protocol v1, specifically the
published `schema-v1.20.0` release, over local stdio.

## Requirements

- Node.js 22.19.0 or newer
- npm
- Pi, only when loading the extension locally

## Install and quick start

The package is not published yet. From a checkout, install the locked
dependencies and build the extension:

```sh
npm ci
npm run build
```

To verify that Pi can load the local no-op package for one run:

```sh
pi -e .
```

Loading the current scaffold has no user-visible delegation behavior.

## Verification

Biome checks and formats supported source and configuration files across the repository while
respecting the existing Git ignore rules:

```sh
npm run check
npm run check:fix
```

Use `check` for a read-only formatting, lint, and import-order check. Use `check:fix` to apply
supported fixes; generated, installed, temporary, and build artifacts covered by `.gitignore` remain
outside both commands.

Run the complete verification gates with:

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

`npm run pack:check` is an alias for the final package inspection command.

The unit suite checks extension loading, architecture boundaries, and package
contents. The integration suite builds and spawns a deterministic fake ACP
agent; it requires no network access, credentials, or vendor executable.

## Documentation

- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Architecture and dependency direction](docs/architecture.md)
- [ACP v1 and local-stdio scope](docs/acp.md)

## License

[MIT](LICENSE)
