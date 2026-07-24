import type { AcpClientFactory } from "../acp/client.js";
import type { OwnedProcessSpawner } from "../process/owned-process.js";

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
