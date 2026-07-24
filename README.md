# pi-leash

A Pi extension for controlling ACP-compatible coding agents as subagents.

## Status

pi-leash is in its initial scaffolding phase. The package exports a no-op Pi
extension factory and typed architecture boundaries. It does not yet implement
delegation, register Pi tools or commands, or start agent processes.

The planned protocol boundary targets ACP v1, using the published
`schema-v1.20.0` specification. No ACP behavior is implemented yet.

## Requirements

- Node.js 22.19.0 or newer
- npm

## Development setup

```sh
npm install
npm run typecheck
npm run build
```

The production build writes native ESM JavaScript, declarations, and source
maps to `dist/`.

Run the test suites with:

```sh
npm run test:unit
npm run test:integration
npm test
```

The unit suite verifies the no-op source and compiled extension factories and
the dependency rules. The integration suite is reserved for the deterministic
ACP agent scaffold.

## Documentation

- [Architecture and dependency direction](docs/architecture.md)

## License

[MIT](LICENSE)
