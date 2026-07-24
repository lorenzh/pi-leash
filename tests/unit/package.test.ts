import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

const forbiddenCandidates = [
  "tests/leak.ts",
  "specs/leak.md",
  ".github/workflows/leak.yml",
  ".test-dist/leak.js",
  ".env.test",
] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const validatedPackPaths = (value: unknown): readonly string[] => {
  if (!Array.isArray(value) || !isRecord(value[0]) || !Array.isArray(value[0].files)) {
    throw new Error("npm pack returned no result");
  }
  const files = value[0].files;
  if (!files.every((entry) => isRecord(entry) && typeof entry.path === "string")) {
    throw new Error("npm pack returned an invalid file list");
  }
  return files.map((entry) => entry.path as string).sort();
};

const parsePackOutput = (output: string): unknown => {
  const boundary = /(?:^|\r?\n)\[(?:\r?\n|$)/.exec(output);
  if (!boundary) {
    throw new Error("npm pack --dry-run --json output did not contain a standalone '[' line");
  }
  const jsonStart = boundary.index + boundary[0].indexOf("[");
  return JSON.parse(output.slice(jsonStart));
};

const packFiles = (): readonly string[] => {
  const projectRoot = process.cwd();
  const packageRoot = mkdtempSync(join(tmpdir(), "pi-leash-package-"));
  try {
    for (const path of [
      "src",
      "lefthook.yml",
      "package.json",
      "tsconfig.json",
      "tsconfig.build.json",
      "README.md",
      "LICENSE",
      "CHANGELOG.md",
    ]) {
      cpSync(join(projectRoot, path), join(packageRoot, path), { recursive: true });
    }
    for (const path of forbiddenCandidates) {
      const target = join(packageRoot, path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, "must not be packed\n", "utf8");
    }
    symlinkSync(join(projectRoot, "node_modules"), join(packageRoot, "node_modules"), "dir");
    execFileSync("git", ["init", "--quiet"], { cwd: packageRoot, encoding: "utf8" });
    execFileSync("npm", ["run", "build"], { cwd: packageRoot, encoding: "utf8" });
    const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
      cwd: packageRoot,
      encoding: "utf8",
    });
    const parsed = parsePackOutput(output);
    return validatedPackPaths(parsed);
  } finally {
    rmSync(packageRoot, { recursive: true, force: true });
  }
};

describe("npm package", () => {
  it("finds line-delimited JSON after bracket-containing lifecycle output", () => {
    for (const newline of ["\n", "\r\n"]) {
      const output = [
        "\u001b[36mlifecycle [hook]\u001b[0m",
        "[",
        '  { "files": [] }',
        "]",
        "",
      ].join(newline);

      expect(parsePackOutput(output)).toEqual([{ files: [] }]);
    }
  });

  it("reports when npm pack output has no line-delimited JSON array", () => {
    expect(() => parsePackOutput("lifecycle [hook] output only\n")).toThrow(
      "npm pack --dry-run --json output did not contain a standalone '[' line",
    );
  });

  it("contains runtime artifacts and excludes development files", () => {
    const files = packFiles();
    expect(files).toEqual(
      expect.arrayContaining([
        "dist/index.js",
        "dist/index.d.ts",
        "package.json",
        "README.md",
        "LICENSE",
      ]),
    );
    for (const candidate of forbiddenCandidates) {
      expect(files).not.toContain(candidate);
    }
  });
});
