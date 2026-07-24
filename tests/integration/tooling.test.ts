import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
  }
  return result.stdout;
}

describe("tooling integration", () => {
  it("formats and re-stages only supported staged files without network access", () => {
    const temp = mkdtempSync(join(tmpdir(), "pi-leash-tooling-"));

    try {
      git(temp, "init", "--quiet");
      git(temp, "config", "user.name", "Tooling Test");
      git(temp, "config", "user.email", "tooling-test@example.invalid");
      copyFileSync(join(projectRoot, "biome.json"), join(temp, "biome.json"));
      const lefthookConfig = join(projectRoot, "lefthook.yml");
      if (existsSync(lefthookConfig)) {
        copyFileSync(lefthookConfig, join(temp, "lefthook.yml"));
      }
      symlinkSync(join(projectRoot, "node_modules"), join(temp, "node_modules"), "dir");

      writeFileSync(join(temp, "notes.txt"), "baseline\n");
      git(temp, "add", "notes.txt");
      git(temp, "commit", "--quiet", "-m", "test: add baseline");

      const unrelatedBefore = "baseline\nunrelated unstaged work\n";
      writeFileSync(join(temp, "notes.txt"), unrelatedBefore);
      writeFileSync(join(temp, "fixture.ts"), "const value={answer:42}\n");
      git(temp, "add", "fixture.ts");

      const hook = spawnSync(
        join(projectRoot, "node_modules", ".bin", "lefthook"),
        ["run", "pre-commit"],
        {
          cwd: temp,
          encoding: "utf8",
          env: { ...process.env, npm_config_offline: "true" },
        },
      );

      expect(hook.error).toBeUndefined();
      expect(hook.status, `${hook.stdout}${hook.stderr}`).toBe(0);
      expect(git(temp, "show", ":fixture.ts")).toBe("const value = { answer: 42 };\n");
      expect(git(temp, "diff", "--", "fixture.ts")).toBe("");
      expect(git(temp, "diff", "--cached", "--name-only")).toBe("fixture.ts\n");
      expect(git(temp, "diff", "--name-only")).toBe("notes.txt\n");
      expect(readFileSync(join(temp, "notes.txt"), "utf8")).toBe(unrelatedBefore);
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  });
});
