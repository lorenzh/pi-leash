# Agent Client Protocol

pi-leash targets the stable Agent Client Protocol (ACP) wire protocol v1. The
selected schema release is v1.20.0 and the TypeScript implementation uses the
official `@agentclientprotocol/sdk` v1.3.0 package. Experimental ACP v2 and
vendor-specific extensions are outside the current scope.

## Local stdio lifecycle

An ACP agent is a local child process connected through newline-delimited JSON
on piped standard input and output. The client owns the process and transport:
it starts the child, performs `initialize`, creates a session, sends prompts,
and closes standard input when the run or host session ends. End-of-file lets
the agent close its connection and exit cleanly. Owners must bound active runs
with cancellation or a timeout and terminate a child that does not exit.

Initialization negotiates the protocol version and capabilities before any
session is created. pi-leash must use only capabilities advertised by both
sides; an absent capability is unsupported rather than permission to attempt a
method optimistically.

## Prompt and steering scope

A session may receive sequential follow-up prompts after each preceding turn
has reached a stop response. To steer work already in progress using portable
ACP v1 behavior, cancel the current turn, wait for its cancelled stop response,
and then send a replacement prompt. ACP v1 has no portable mechanism for
non-cancelling, mid-turn prompt steering. Vendor-specific behavior is not a
substitute for that missing protocol contract.

## Security boundary

The child process and every protocol message cross a trust boundary. Launch
only explicitly configured local executables, avoid shell interpolation, pass
the minimum environment needed, and never place credentials in prompts, logs,
or diagnostic output. Validate protocol messages through the typed SDK and do
not grant filesystem, terminal, or other client capabilities unless the run
requires them. Local stdio transport does not by itself sandbox the agent or
limit the operating-system permissions inherited by its process.

## Deterministic test fixture

Integration tests compile and spawn only
`.test-dist/tests/fixtures/fake-acp-agent.js`; they require no network,
credentials, or vendor executable. The fixture advertises no optional agent
capabilities and handles only `initialize`, `session/new`, and
`session/prompt`. It returns session ID `fake-session-1`, streams one
`agent_message_chunk` containing `fake-agent-ready`, and finishes with
`{ "stopReason": "end_turn" }`. The test closes the child's standard input,
requires exit code 0 within its bounded timeout, and fails if cleanup must
force-kill a leaked process.
