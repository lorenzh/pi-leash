# T2: Layered extension scaffold (specs/001-initialize-project-structure)

**Files:**
- Modify: `src/index.ts` (replace the T1 placeholder)
- Create: `src/pi/extension.ts`
- Create: `src/application/delegation.ts`
- Create: `src/acp/client.ts`
- Create: `src/acp/transport.ts`
- Create: `src/config/source.ts`
- Create: `src/process/owned-process.ts`
- Create: `tests/support/architecture.ts`
- Create: `tests/unit/architecture.test.ts`
- Create: `tests/unit/extension.test.ts`
- Create: `docs/architecture.md`
- Modify: `README.md` (add architecture link and accurate scaffold behavior)

**Interfaces:**
- Consumes: T1 native-ESM compiler and `unit` Vitest project.
- Produces: `createExtension(pi: ExtensionAPI): void`; default extension export; `DelegationDependencies`, `DelegationRun`, `AcpClientFactory`, `AcpConnection`, `AcpTransport`, `ConfigurationSource<T>`, `OwnedProcess`, `OwnedProcessSpawner`; `SourceModule { readonly path: string; readonly imports: readonly string[] }`; `LayerViolation { readonly source: string; readonly target: string }`; `findLayerViolations(modules: readonly SourceModule[]): readonly LayerViolation[]`.
- Shared files: `src/index.ts` starts as `export {};` from T1 and becomes the package entry here. `README.md` contains T1 setup commands and must retain them while adding the architecture link; T4 may extend its documentation index.

**Blocked by:** task-01
**Template:** Pi factory signature from the immutable extension source recorded at `spec.md:64`; no existing repository implementation pattern exists.
**Verified facts:** Source boundaries and forbidden dependency direction are fixed at `spec.md:27`; the compiled factory must register nothing and start no resource at `spec.md:28`; TDD evidence is required at `spec.md:34`.
**Executor:** session model
**Global constraints:**
- Production code and tests use strict TypeScript compiled as native ECMAScript modules.
- Automated TypeScript tests use Vitest.
- Pi-provided runtime libraries are unbundled peer dependencies with `"*"` ranges, as required by Pi package conventions.
- Agent Client Protocol support conforms to a published specification version recorded in package metadata or project documentation.
- Behavioral implementation follows red-green-refactor: change evidence records a focused failing test before production code changes, the smallest implementation that makes it pass, and refactoring only while relevant tests remain green.
- Integration tests exercise delegation against a deterministic fake ACP agent without requiring external credentials or installed vendor harnesses.
- Core delegation depends on typed ACP transport and protocol interfaces and contains no harness-specific branches.
- Every process started by the extension is owned, observable, bounded by cancellation or timeout, and terminated during run completion or session shutdown.
- Every change that alters documented behavior, public contracts, setup, architecture, security guidance, or contributor workflows updates the affected documentation in the same pull request, or in the same commit when no pull request exists.
- Commits and pull-request titles created after this amendment conform to Conventional Commits 1.0.0; each pull-request title summarizes the overall change using `type(scope): description` or `type: description`.

**Acceptance criteria:** Covers AC-4, AC-5, and the extension portion of AC-11. Unit tests prove forbidden inward dependencies are detected and the source plus compiled extension factory is a no-op with no registrations or new active resources.

Steps:
- [ ] RED — create `tests/unit/extension.test.ts` before changing `src/index.ts`. The focused test imports the default factory, supplies a throwing `Proxy` cast through `unknown` to `ExtensionAPI`, records `process.getActiveResourcesInfo()` and Vitest timer count before/after invocation, expects no Pi property access, no added resource types, no timers, and `undefined` return:

```ts
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { afterEach, describe, expect, it, vi } from "vitest";
import extension from "../../src/index.js";

const resources = (): readonly string[] =>
  [...process.getActiveResourcesInfo()].sort();

const rejectingPi = (): ExtensionAPI => new Proxy({}, {
  get(_target, property) {
    throw new Error(`unexpected Pi API access: ${String(property)}`);
  },
}) as unknown as ExtensionAPI;

describe("extension scaffold", () => {
  afterEach(() => vi.useRealTimers());

  it("loads without registrations or background resources", () => {
    vi.useFakeTimers();
    const beforeResources = resources();
    expect(extension(rejectingPi())).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);
    expect(resources()).toEqual(beforeResources);
  });
});
```

- [ ] Run `npx vitest run --project unit tests/unit/extension.test.ts`; expected RED: module/default-export resolution fails because the T1 placeholder has no extension factory. Record the command and literal failure in execution evidence.
- [ ] GREEN — implement `src/pi/extension.ts` and `src/index.ts` exactly at the public boundary:

```ts
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export function createExtension(_pi: ExtensionAPI): void {}
export default createExtension;
```

```ts
export { createExtension, default } from "./pi/extension.js";
```

- [ ] Run the focused extension test; expected: PASS with no Pi access, timers, or active-resource delta. Run `npm run build`, dynamically import `dist/index.js` in the same test after build, and apply the same assertions to the compiled default export.
- [ ] RED — create `tests/support/architecture.ts` declarations plus `tests/unit/architecture.test.ts` with this executable contract. Run the focused test; expected RED until `findLayerViolations` implements the rule.

```ts
import { describe, expect, it } from "vitest";
import { findLayerViolations, type SourceModule } from "../support/architecture.js";

const modules = (...values: SourceModule[]): readonly SourceModule[] => values;

describe("layer dependency rules", () => {
  it("rejects ACP dependencies on Pi integration", () => {
    expect(findLayerViolations(modules({
      path: "src/acp/client.ts",
      imports: ["src/pi/extension.ts"],
    }))).toEqual([{
      source: "src/acp/client.ts",
      target: "src/pi/extension.ts",
    }]);
  });

  it("allows application dependencies on ACP and process ports", () => {
    expect(findLayerViolations(modules({
      path: "src/application/delegation.ts",
      imports: ["src/acp/client.ts", "src/process/owned-process.ts"],
    }))).toEqual([]);
  });
});
```
- [ ] GREEN — implement `findLayerViolations` using the TypeScript compiler API to parse static imports. Enforce that `src/acp/**` and `src/application/**` cannot import `src/pi/**` or `src/adapters/**`; then add a test scanning real `src/**/*.ts` and expecting no violations.
- [ ] Add minimal exported interfaces, with no implementation or user-facing config schema, using these exact signatures:

```ts
export interface DelegationDependencies {
  readonly acp: AcpClientFactory;
  readonly processes: OwnedProcessSpawner;
}
export interface DelegationRun {
  readonly id: string;
  readonly signal: AbortSignal;
  cancel(reason?: unknown): void;
  close(): Promise<void>;
}
export interface AcpClientFactory {
  connect(transport: AcpTransport, signal: AbortSignal): Promise<AcpConnection>;
}
export interface AcpConnection { close(): Promise<void>; }
export interface AcpTransport {
  readonly readable: ReadableStream<Uint8Array>;
  readonly writable: WritableStream<Uint8Array>;
  close(): Promise<void>;
}
export interface ConfigurationSource<T> {
  load(signal: AbortSignal): Promise<T>;
}
export interface SpawnOptions {
  readonly cwd: string;
  readonly env: Readonly<Record<string, string | undefined>>;
}
export interface OwnedProcess {
  readonly pid: number;
  readonly exited: Promise<number | null>;
  terminate(): void;
  close(): Promise<void>;
}
export interface OwnedProcessSpawner {
  spawn(command: string, args: readonly string[], options: SpawnOptions): OwnedProcess;
}
```
- [ ] Refactor only under green tests. Run `npm run typecheck`, `npm run test:unit`, and `npm run build`; expected: all exit 0 and declarations exist for every source boundary.
- [ ] Create `docs/architecture.md` in the same commit, documenting the exact layers, allowed dependency direction, current no-op factory, process ownership intent, mode-independent core, and absence of harness-specific adapters; update `README.md` to link it.
- [ ] Commit T2 together as `feat(scaffold): define extension architecture boundaries`.
