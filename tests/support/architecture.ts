import { readdirSync, readFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { createScanner, SyntaxKind } from "typescript/unstable/ast";

export interface SourceModule {
  readonly path: string;
  readonly imports: readonly string[];
}

export interface LayerViolation {
  readonly source: string;
  readonly target: string;
}

const normalized = (path: string): string => path.split(sep).join("/");

const isCore = (path: string): boolean =>
  path.startsWith("src/acp/") || path.startsWith("src/application/");

const isForbiddenTarget = (path: string): boolean =>
  path.startsWith("src/pi/") || path.startsWith("src/adapters/");

export function findLayerViolations(modules: readonly SourceModule[]): readonly LayerViolation[] {
  return modules.flatMap(({ path: source, imports }) =>
    isCore(source) ? imports.filter(isForbiddenTarget).map((target) => ({ source, target })) : [],
  );
}

const sourceFiles = (directory: string): readonly string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return entry.isFile() && path.endsWith(".ts") ? [path] : [];
  });

const resolveImport = (source: string, specifier: string): string => {
  if (!specifier.startsWith(".")) return specifier;
  const target = resolve(dirname(source), specifier).replace(/\.js$/, ".ts");
  return normalized(relative(process.cwd(), target));
};

const staticModuleSpecifiers = (source: string): readonly string[] => {
  const scanner = createScanner(true, undefined, source);
  const specifiers: string[] = [];
  let token = scanner.scan();

  while (token !== SyntaxKind.EndOfFile) {
    if (token === SyntaxKind.ImportKeyword) {
      token = scanner.scan();
      if (token === SyntaxKind.OpenParenToken || token === SyntaxKind.DotToken) {
        continue;
      }

      while (
        token !== SyntaxKind.StringLiteral &&
        token !== SyntaxKind.SemicolonToken &&
        token !== SyntaxKind.EndOfFile
      ) {
        token = scanner.scan();
      }
      if (token === SyntaxKind.StringLiteral) {
        specifiers.push(scanner.getTokenValue());
      }
    } else if (token === SyntaxKind.ExportKeyword) {
      token = scanner.scan();
      if (token === SyntaxKind.TypeKeyword) token = scanner.scan();
      if (token !== SyntaxKind.OpenBraceToken && token !== SyntaxKind.AsteriskToken) {
        continue;
      }

      while (
        token !== SyntaxKind.FromKeyword &&
        token !== SyntaxKind.SemicolonToken &&
        token !== SyntaxKind.ImportKeyword &&
        token !== SyntaxKind.ExportKeyword &&
        token !== SyntaxKind.EndOfFile
      ) {
        token = scanner.scan();
      }
      if (token === SyntaxKind.ImportKeyword || token === SyntaxKind.ExportKeyword) {
        continue;
      }
      if (token === SyntaxKind.FromKeyword) {
        token = scanner.scan();
        if (token === SyntaxKind.StringLiteral) {
          specifiers.push(scanner.getTokenValue());
        }
      }
    }
    token = scanner.scan();
  }

  return specifiers;
};

export function parseSourceModule(path: string, source: string): SourceModule {
  const file = resolve(process.cwd(), path);
  return {
    path: normalized(relative(process.cwd(), file)),
    imports: staticModuleSpecifiers(source).map((specifier) => resolveImport(file, specifier)),
  };
}

export function readSourceModules(
  directory = resolve(process.cwd(), "src"),
): readonly SourceModule[] {
  return sourceFiles(directory).map((file) => parseSourceModule(file, readFileSync(file, "utf8")));
}
