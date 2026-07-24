import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { once } from "node:events";
import { Readable, Writable } from "node:stream";
import * as acp from "@agentclientprotocol/sdk";
import { afterEach, describe, expect, it } from "vitest";

let child: ChildProcessWithoutNullStreams | undefined;

afterEach(async () => {
  const ownedChild = child;
  child = undefined;

  if (
    !ownedChild ||
    ownedChild.exitCode !== null ||
    ownedChild.signalCode !== null
  ) {
    return;
  }

  const exited = once(ownedChild, "exit");
  ownedChild.kill("SIGKILL");
  await exited;
  throw new Error("fake ACP agent required forced cleanup");
});

describe("fake ACP agent", () => {
  it("streams one prompt and exits when the client closes", async () => {
    child = spawn(
      process.execPath,
      [".test-dist/tests/fixtures/fake-acp-agent.js"],
      { stdio: ["pipe", "pipe", "pipe"] },
    );
    const input = Writable.toWeb(child.stdin);
    const output = Readable.toWeb(
      child.stdout,
    ) as ReadableStream<Uint8Array>;
    const updates: acp.SessionNotification[] = [];

    const response = await acp
      .client({ name: "pi-leash-test" })
      .connectWith(acp.ndJsonStream(input, output), async (ctx) => {
        const initialized = await ctx.request(acp.methods.agent.initialize, {
          protocolVersion: acp.PROTOCOL_VERSION,
          clientCapabilities: {},
        });
        expect(initialized.protocolVersion).toBe(acp.PROTOCOL_VERSION);

        return ctx.buildSession(process.cwd()).withSession(async (session) => {
          expect(session.sessionId).toBe("fake-session-1");
          session.prompt("ping");
          for (;;) {
            const message = await session.nextUpdate();
            if (message.kind === "stop") return message.response;
            updates.push(message.notification);
          }
        });
      });

    expect(response.stopReason).toBe("end_turn");
    expect(
      updates.some(
        ({ update }) =>
          update.sessionUpdate === "agent_message_chunk" &&
          update.content.type === "text" &&
          update.content.text === "fake-agent-ready",
      ),
    ).toBe(true);

    child.stdin.end();
    const [code] = (await once(child, "exit")) as [
      number | null,
      NodeJS.Signals | null,
    ];
    expect(code).toBe(0);
  }, 5_000);
});
