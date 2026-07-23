# T3: Fake ACP stdio integration (specs/001-initialize-project-structure)

**Files:**
- Create: `tests/fixtures/fake-acp-agent.ts`
- Create: `tests/integration/fake-agent.test.ts`
- Create: `docs/acp.md`

**Interfaces:**
- Consumes: T1 `build:test-fixtures` and `integration` Vitest project; official ACP SDK exports `PROTOCOL_VERSION`, `ndJsonStream`, `agent`, `client`, and `methods`.
- Produces: compiled `.test-dist/tests/fixtures/fake-acp-agent.js`; deterministic session id `fake-session-1`; streamed text `fake-agent-ready`; prompt response `{ stopReason: "end_turn" }`.
- Shared files: none.

**Blocked by:** task-01
**Template:** Official ACP SDK v1.3.0 agent/client examples recorded at `spec.md:68`.
**Verified facts:** Required protocol path and cleanup observations are fixed at `spec.md:29`; no network, credentials, or vendor executable may be used; TDD evidence is fixed at `spec.md:34`.
**Executor:** session model
**Global constraints:**
- Production code and tests use strict TypeScript compiled as native ECMAScript modules.
- Automated TypeScript tests use Vitest.
- Pi-provided runtime libraries are unbundled peer dependencies with `"*"` ranges, as required by Pi package conventions.
- Agent Client Protocol support conforms to a published specification version recorded in package metadata or project documentation.
- Behavioral implementation follows red-green-refactor: change evidence records a focused failing test before production code changes, the smallest implementation that makes it pass, and refactoring only while relevant tests remain green.
- Integration tests exercise delegation against a deterministic fake ACP agent without requiring external credentials or installed vendor harnesses.
- Core delegation depends on typed ACP transport and protocol interfaces and contains no harness-specific branches.
- Every process started by the extension is owned, observable, bounded by cancellation or timeout, and terminated during run completion or session shutdown.
- Every change that alters documented behavior, public contracts, setup, architecture, security guidance, or contributor workflows updates the affected documentation in the same pull request, or in the same commit when no pull request exists.
- Commits and pull-request titles created after this amendment conform to Conventional Commits 1.0.0; each pull-request title summarizes the overall change using `type(scope): description` or `type: description`.

**Acceptance criteria:** Covers AC-6 and the fake-agent portion of AC-11. `npm run test:integration` compiles and spawns only the local fake ACP v1 agent, observes initialize/new/prompt plus streamed/final output, closes stdin, and receives clean child exit without network or credentials.

Steps:
- [ ] RED — create `tests/integration/fake-agent.test.ts` first. Spawn `process.execPath` with `.test-dist/tests/fixtures/fake-acp-agent.js` and piped stdio; adapt streams with `Writable.toWeb(child.stdin)` and `Readable.toWeb(child.stdout)`; drive the official ACP client as follows:

```ts
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { once } from "node:events";
import { Readable, Writable } from "node:stream";
import * as acp from "@agentclientprotocol/sdk";
import { afterEach, describe, expect, it } from "vitest";

let child: ChildProcessWithoutNullStreams | undefined;
afterEach(() => {
  if (child && child.exitCode === null) child.kill("SIGKILL");
  child = undefined;
});

describe("fake ACP agent", () => {
  it("streams one prompt and exits when the client closes", async () => {
    child = spawn(process.execPath, [
      ".test-dist/tests/fixtures/fake-acp-agent.js",
    ], { stdio: ["pipe", "pipe", "pipe"] });
    const input = Writable.toWeb(child.stdin);
    const output = Readable.toWeb(child.stdout) as ReadableStream<Uint8Array>;
    const updates: acp.SessionNotification[] = [];

    const response = await acp.client({ name: "pi-leash-test" })
      .connectWith(acp.ndJsonStream(input, output), async (ctx) => {
        const initialized = await ctx.request(acp.methods.agent.initialize, {
          protocolVersion: acp.PROTOCOL_VERSION,
          clientCapabilities: {},
        });
        expect(initialized.protocolVersion).toBe(acp.PROTOCOL_VERSION);

        return ctx.buildSession(process.cwd()).withSession(async (session) => {
          session.prompt("ping");
          for (;;) {
            const message = await session.nextUpdate();
            if (message.kind === "stop") return message.response;
            updates.push(message.notification);
          }
        });
      });

    expect(response.stopReason).toBe("end_turn");
    expect(updates.some(({ update }) =>
      update.sessionUpdate === "agent_message_chunk" &&
      update.content.type === "text" &&
      update.content.text === "fake-agent-ready"
    )).toBe(true);

    child.stdin.end();
    const [code] = await once(child, "exit") as [number | null, NodeJS.Signals | null];
    expect(code).toBe(0);
  }, 5_000);
});
```

- [ ] Run `npx vitest run --project integration tests/integration/fake-agent.test.ts` before creating the fixture; expected RED: the child/ACP connection closes because the compiled fake-agent module does not exist. Record the literal failure.
- [ ] GREEN — implement `tests/fixtures/fake-acp-agent.ts` with `Writable.toWeb(process.stdout)`, `Readable.toWeb(process.stdin)`, `acp.ndJsonStream`, and `acp.agent({ name: "pi-leash-fake" })`. Register only `initialize`, `session/new`, and `session/prompt`; return protocol version 1/current `PROTOCOL_VERSION`, deterministic `fake-session-1`, one `agent_message_chunk` containing `fake-agent-ready`, and `end_turn`. Await `connect(stream)` so EOF permits clean process exit.
- [ ] Run `npm run build:test-fixtures` and the focused integration test. After the prompt response, call `child.stdin.end()`, await the child `exit` event with a bounded test timeout, and assert exit code 0, `stopReason === "end_turn"`, and the streamed text. In `afterEach`, terminate any still-owned child and fail on forced cleanup so leaks cannot pass silently.
- [ ] Refactor only under green tests. Run `npm run typecheck` and `npm run test:integration`; expected: both exit 0. T4 owns the first combined `npm test` gate after both independent test projects exist.
- [ ] Create `docs/acp.md` in the same commit, recording stable wire protocol v1/schema v1.20.0, SDK v1.3.0, local stdio lifecycle, capability negotiation, test-fixture behavior, security boundary, sequential follow-up prompts, cancel-and-reprompt steering, and the lack of portable non-cancelling mid-turn steering. T4 owns the final root documentation index after both T2 and T3 complete.
- [ ] Commit T3 together as `test(acp): add deterministic stdio agent`.
