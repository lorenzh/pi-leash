import { describe, expect, it } from "vitest";
import {
  findLayerViolations,
  parseSourceModule,
  readSourceModules,
  type SourceModule,
} from "../support/architecture.js";

const modules = (...values: SourceModule[]): readonly SourceModule[] => values;

describe("layer dependency rules", () => {
  it("rejects ACP dependencies on Pi integration", () => {
    expect(
      findLayerViolations(
        modules({
          path: "src/acp/client.ts",
          imports: ["src/pi/extension.ts"],
        }),
      ),
    ).toEqual([
      {
        source: "src/acp/client.ts",
        target: "src/pi/extension.ts",
      },
    ]);
  });

  it("rejects ACP re-exports from Pi integration", () => {
    expect(
      findLayerViolations(
        modules(
          parseSourceModule(
            "src/acp/re-export.ts",
            'export { createExtension } from "../pi/extension.js";',
          ),
        ),
      ),
    ).toEqual([
      {
        source: "src/acp/re-export.ts",
        target: "src/pi/extension.ts",
      },
    ]);
  });

  it("allows application dependencies on ACP and process ports", () => {
    expect(
      findLayerViolations(
        modules({
          path: "src/application/delegation.ts",
          imports: ["src/acp/client.ts", "src/process/owned-process.ts"],
        }),
      ),
    ).toEqual([]);
  });

  it("keeps real core sources independent from Pi and adapter layers", () => {
    expect(findLayerViolations(readSourceModules())).toEqual([]);
  });
});
