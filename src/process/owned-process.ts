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
