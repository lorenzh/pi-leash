# Architecture

pi-leash is a layered native-ESM TypeScript package. Its current package entry
exports a Pi extension factory that intentionally does nothing: it does not read
the Pi API, register tools or commands, or start background resources.

## Layers

- `src/pi/` is the outer Pi integration layer and owns the extension factory.
- `src/application/` defines delegation lifecycle contracts. The core is
  mode-independent and may depend on ACP and process ports.
- `src/acp/` defines ACP client and byte-transport contracts.
- `src/config/` defines the configuration source port, without a user-facing
  configuration schema.
- `src/process/` defines owned-process and process-spawning ports.
- `src/adapters/` is reserved for future infrastructure and harness adapters;
  no harness-specific adapters currently exist.

Dependencies point from outer integration and future adapters toward the core
contracts. In particular, `src/acp/` and `src/application/` must not depend on
`src/pi/` or `src/adapters/`. Unit tests parse source imports and enforce this
rule.

## Lifecycle intent

Future delegation implementations will use the typed ACP transport and process
ports rather than harness-specific branches. Every process started by the
extension must be owned and observable, bounded by cancellation or timeout,
and terminated when its run completes or the Pi session shuts down. The
current scaffold starts no processes or delegated runs.
