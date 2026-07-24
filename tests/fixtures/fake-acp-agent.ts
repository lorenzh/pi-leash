import { Readable, Writable } from "node:stream";
import * as acp from "@agentclientprotocol/sdk";

const stream = acp.ndJsonStream(
  Writable.toWeb(process.stdout),
  Readable.toWeb(process.stdin) as ReadableStream<Uint8Array>,
);

const fakeAgent = acp
  .agent({ name: "pi-leash-fake" })
  .onRequest(acp.methods.agent.initialize, () => ({
    protocolVersion: acp.PROTOCOL_VERSION,
    agentCapabilities: {},
  }))
  .onRequest(acp.methods.agent.session.new, () => ({
    sessionId: "fake-session-1",
  }))
  .onRequest(acp.methods.agent.session.prompt, async ({ client, params }) => {
    await client.notify(acp.methods.client.session.update, {
      sessionId: params.sessionId,
      update: {
        sessionUpdate: "agent_message_chunk",
        content: {
          type: "text",
          text: "fake-agent-ready",
        },
      },
    });

    return { stopReason: "end_turn" };
  });

await fakeAgent.connect(stream);
