# Verification: Initialize project structure

Date: 2026-07-24
Status: passed
Candidate: `ceccd85c44c5c646bef2658c4f2c2ec38617523f`

- AC-1 | MET | Fresh metadata inspection after `npm ci` printed `PASS AC-1/3/7/8/9/11/13: metadata exact`; exact package identity, Node floor, TypeScript 7.0.2, Vitest 4.1.10, ACP SDK 1.3.0, Pi `"*"` peer, and Pi extension manifest were asserted.
- AC-2 | MET | Fresh `npm ci`, `npm run typecheck`, `npm run test:unit`, `npm run test:integration`, `npm test`, and `npm run build` all exited 0; npm reported `found 0 vulnerabilities`, unit reported `3 passed` files/`7 passed` tests, and integration reported `1 passed` file/test.
- AC-3 | MET | Fresh `npm run build` exited 0; fresh pack inspection found native ESM/declarations and printed `32 package files valid` with no test/spec/fixture paths.
- AC-4 | MET | Fresh focused Vitest run reported four passing architecture assertions: rejects ACP→Pi imports, rejects ACP→Pi re-exports, allows application→ACP/process ports, and keeps real core sources independent.
- AC-5 | MET | Fresh focused Vitest run reported `loads the source factory without registrations or background resources` and the equivalent compiled-factory assertion, `2 passed`.
- AC-6 | MET | Fresh focused integration run reported `fake ACP agent > streams one prompt and exits when the client closes`, `1 passed`; the fixture build ran immediately beforehand.
- AC-7 | MET | Fresh workflow inspection asserted push/PR triggers, `contents: read`, checkout/setup-node v4, Node 22.19.0 with npm cache, and install/typecheck/test/build/pack commands; combined output printed `CI ... contract valid`.
- AC-8 | MET | Fresh `npm pack --dry-run --json` inspection asserted all five required files and no source, tests, specs, CI, fixture, or environment files; output printed `32 package files valid`.
- AC-9 | MET | Fresh declared inspection confirmed all seven non-empty documentation files; output printed `seven docs ... contract valid`.
- AC-10 | MET | Fresh GitHub/API/Git checks printed `PASS AC-10 repository metadata` and confirmed public `lorenzh/pi-leash`, exact description, issues, default `main`, private vulnerability reporting, exact SSH origin, and remote main `208acbb...` containing the constitution/package/approved plan without a generated commit.
- AC-11 | MET | Fresh review-artifact inspection found recorded literal RED and GREEN evidence for both the extension factory (`task-02-review.md`) and fake ACP agent (`task-03-review.md`); combined output printed `TDD ... contract present`.
- AC-12 | MET | Fresh `git show --name-only` checks printed `PASS AC-12 documented changes accompany T1-T4 commits`, pairing setup, architecture, ACP, and CI changes with their affected documentation.
- AC-13 | MET | Fresh `AGENTS.md` inspection asserted every authoritative pointer, command, TDD/convention summary, and absence of model-routing headings/model names; output printed `AGENTS contract valid`.
