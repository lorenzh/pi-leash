import { execFileSync } from "node:child_process";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import extension from "../../src/index.js";

const resources = (): readonly string[] => [...process.getActiveResourcesInfo()].sort();

const rejectingPi = (): ExtensionAPI =>
  new Proxy(
    {},
    {
      get(_target, property) {
        throw new Error(`unexpected Pi API access: ${String(property)}`);
      },
    },
  ) as unknown as ExtensionAPI;

describe("extension scaffold", () => {
  let compiledExtension: typeof extension;

  beforeAll(async () => {
    execFileSync("npm", ["run", "build"], { stdio: "pipe" });
    const compiledPath = "../../dist/index.js";
    const compiled = await import(compiledPath);
    compiledExtension = compiled.default as typeof extension;
  });

  afterEach(() => vi.useRealTimers());

  it.each([
    ["source", () => extension],
    ["compiled", () => compiledExtension],
  ])("loads the %s factory without registrations or background resources", (_name, factory) => {
    vi.useFakeTimers();
    const beforeResources = resources();
    expect(factory()(rejectingPi())).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);
    expect(resources()).toEqual(beforeResources);
  });
});
