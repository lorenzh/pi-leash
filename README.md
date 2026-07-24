# pi-leash

A Pi extension for controlling ACP-compatible coding agents as subagents.

## Status

pi-leash is in its initial scaffolding phase. The package currently provides a
buildable TypeScript entry point and does not yet implement delegation, register
Pi tools or commands, or start agent processes.

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

The test scripts are reserved for the test suites introduced with the
behavioral scaffold:

```sh
npm run test:unit
npm run test:integration
npm test
```

At this stage there are no tests, and the test scripts intentionally do not
hide that condition with `--passWithNoTests`.

## License

[MIT](LICENSE)
