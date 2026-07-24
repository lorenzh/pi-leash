import type { AcpTransport } from "./transport.js";

export interface AcpClientFactory {
  connect(transport: AcpTransport, signal: AbortSignal): Promise<AcpConnection>;
}

export interface AcpConnection {
  close(): Promise<void>;
}
