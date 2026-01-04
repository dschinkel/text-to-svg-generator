# GUIDELINES (v1.2)

Scope: Applies to all coding tasks executed by Junie or any AI agent in this repo.

Precedence (highest wins):
1) The user’s instructions in the current chat
2) This document (GUIDELINES.md)
3) Existing codebase conventions
4) General best practices

Agent acknowledgement:
At the start of any task workflow (the message where you present the PLAN), output exactly:
ACK:GUIDELINES_READ

Do NOT output ACK when answering questions or doing non-task discussion (i.e., when you are not starting a PLAN / task workflow).

---

## P0. Agent Protocol (non-negotiable)

P0.0 When the user says `work on task <number>`, ask this question BEFORE producing any PLAN:
"Do you want the PLAN to include a full TDD workflow (RED → GREEN → REFACTOR + commit prompts), or a non-TDD execution plan?"

P0.0.1 Do not present a PLAN until the user answers the question in P0.0.

P0.1 Before writing or changing any code, produce a PLAN when the user says: `work on task <number>` and after resolving P0.0.
P0.2 The PLAN must include, in the first line, the task number and the feature name.
P0.3 The PLAN must list each planned increment and explicitly name the test(s) that will be written for each increment if (and only if) the user chose a TDD workflow in P0.0.
P0.4 After presenting the PLAN, ask whether to proceed. Do not proceed without an explicit “continue/proceed” from the user.
P0.5 If the user tells you to proceed, copy the approved PLAN into `tdd.log` before starting implementation (only applies when the user chose a TDD workflow in P0.0).
P0.5.1 When copying the PLAN into `tdd.log`, include the full PLAN text verbatim under a `PLAN:` heading.
P0.6 After completing each phase in the PLAN, summarize the phase you just completed and ask to proceed to the next phase.  Tell me what the next phase is at a high level (for example, "implementing UI components").
P0.7 If the user stops you midstream with a question or change request, log the interruption and the resolution in `tdd.log` (only applies when the user chose a TDD workflow in P0.0).
P0.8 If the user reverts an implemented plan, remove the corresponding plan and its workflow entries from `tdd.log` (only applies when the user chose a TDD workflow in P0.0).

---

## T1. TDD Workflow (non-negotiable, only when user opts-in per P0.0)

T1.1 Work in RED → GREEN → REFACTOR cycles.
T1.2 In RED, write exactly one failing test that defines a single small behavior increment. Do not write multiple tests in a single RED step.
T1.3 Default test level rules:
T1.3.1 For React work, start at the hook layer (or lower). Do not write UI/integration tests unless explicitly instructed.
T1.3.2 For non-React work, write tests at the behavioral/business layer level (headless/functional) and avoid end-to-end/system tests unless explicitly instructed.
T1.3.3 Disallowed by default (unless explicitly instructed): browser/UI integration tests, real network calls, end-to-end tests, full-stack HTTP tests.
T1.3.4 Allowed by default: in-process “integration” tests that do not require a browser and do not make real network calls (for example, repository tests using in-memory or file-backed fakes).
T1.4 In GREEN, write only the minimum production code required to pass the single failing test; no extra functionality.
T1.5 After GREEN, prompt the user to commit using: `feat: <task-id>: <behavior>`. After the commit, ask whether to push or continue.
T1.6 In REFACTOR, refactor only while tests are green. Make one refactoring change at a time and run tests after each small refactor (TCR).
T1.7 If refactoring occurred, prompt the user to commit using: `feat: <task-id>: refactor: <behavior>`. After the commit, ask whether to push or continue.
T1.8 Cleanup & Verification must include running tests and fixing lint warnings/errors. Then prompt the user to commit using: `feat: <task-id>: cleanup: <behavior>`.
T1.9 `tdd.log` must relate every RED | GREEN | REFACTOR entry to its corresponding PLAN step number.
T1.10 When fixing a defect or implementing a feature with a clear external contract, first write an “API-level” failing test. In this repo, “API-level” means the public boundary for the behavior (typically the hook public API or the domain service function), not an HTTP endpoint or end-to-end test unless explicitly requested.
T1.11 When tests fail, fix implementation first, not the test, unless the test clearly contradicts the spec.

---

## N1. Test Naming (non-negotiable; applies when tests are being written)

N1.1 Tests must describe business behavior in clear prose.
N1.2 Do not include function names, endpoints, browser/view terms, or technical sources in test names.
N1.3 Avoid “should” and avoid overly-specific phrasing. Prefer short domain behavior labels.
N1.4 Canonical examples live in Appendix D.

---

## A1. Architecture & DDD

A1.1 Use domain language for files, functions, variables, tests, and modules.
A1.2 Organize by business domain rather than technical layer names (for example billing/, registration/).
A1.3 Domain naming rule: domain files must not contain the word “domain” (Prompt.ts not PromptDomain.ts).
A1.4 Avoid generic buckets like util, utils, helper, helpers. Use domain terms instead.

A1.5 Repository abstractions:
A1.5.1 Repository modules represent domain objects (PromptRepository, UserRepository).
A1.5.2 Repositories depend on injected lower-level data sources for IO.
A1.5.3 Inject mechanisms that perform IO (HTTP clients, SDKs, DB drivers, file system adapters) into a data layer, then inject that data layer into repositories, then inject repositories into hooks/components.
A1.5.4 Persistence and API details must not leak into UI components or domain logic.

A1.6 Backend Onion Architecture (Command + Controller + Request/Response DTOs):
A1.6.1 Commands represent user commands/use-cases. Each command is responsible for executing exactly one use-case.
A1.6.2 Controllers are delivery-mechanism adapters and must be pass-through only:
- Accept delivery-specific input (HTTP, queue, RPC, etc.)
- Translate it into a pure request data object with delivery concerns stripped
- Call the command to carry out the use case
- Translate the command response DTO into the delivery mechanism response
  A1.6.3 Data passed between layers uses explicit Request and Response data objects. Data Objects must be plain data (plan js objects) with no delivery or framework types.
  A1.6.4 Commands must not depend on delivery/framework concerns (Express/Fastify request, headers, auth middleware, etc.). They accept only the request DTO.
  A1.6.5 Commands must use injected pure business logic to fulfill the use-case:
- Domain objects and any necessary pure business objects are are injected into the command in order for the command to carry out its use-case
- Data layer and persistence access is injected indirectly (via repositories/data services), not constructed inside the command
  A1.6.6 The command owns orchestration of the use-case:
- Validate/interpret the request Data Object in domain terms
- Invoke domain logic and required injected business objects
- Produce a response Data Object for the controller to return to the service caller
  A1.6.7 Controllers must not contain business decisions. Commands must not contain delivery decisions.

---

## R1. React Rules

R1.1 Humble views: UI components are thin; logic belongs in hooks below.
R1.2 No fetch/service/tool-call logic inside React components.
R1.3 Hooks may orchestrate IO by calling injected repositories, but must not embed HTTP/SDK/file logic directly. Repositories encapsulate use-case intent and call injected data-layer dependencies for IO.
R1.4 No useEffect inside React components. useEffect may exist only inside hooks.
R1.5 Avoid spaghetti JSX. Extract mapping/conditions into small, well-named domain components.
R1.6 Component naming must be domain-oriented and must not include unnecessary technical suffixes (Component, View, Module, Modal, Input). Use domain ideas instead.
R1.7 Use guard clauses by extracting conditional rendering into a domain component that returns null when not applicable.
R1.8 Tests: default to hook-layer tests (React Hook Testing Library) and then unit tests for lower-level pure functions.

---

## Q1. Code Quality

Q1.1 No comments in production or test code unless it is a linter suppression. If you want to comment, extract a named function/component instead.
Q1.2 File size limits:
Q1.2.1 Non-React files must not exceed 150 lines.
Q1.2.2 React component files must not exceed 200 lines.
Q1.3 Do not keep appending new behavior into one file. Refactor by extracting well-named domain functions/components during REFACTOR. If you are ever not sure what to name it, ask the user.
Q1.4 Functions should read like well-written prose and communicate domain intent. Prefer guard clauses and small composed functions over nested conditionals.
Q1.5 Minimize state and side effects; keep pure logic in `domain/` for backend and for client under `src\client\domain.

---

## TS1. Types & TypeScript

TS1.1 Do not prefix interfaces/types with “I” (PromptRepository, not IPromptRepository).
TS1.2 Prefer explicit domain types over ad-hoc inline shapes.

---

## G1. Git Discipline

G1.1 Only commit when tests are green and lint/compile warnings are resolved.
G1.2 Keep commits small and frequent.
G1.3 Separate structural changes from behavioral changes (Tidy First).
G1.4 Commit messages must be domain/behavior oriented:
G1.4.1 Behavioral: `feat: <task-id>: <behavior>`
G1.4.2 Refactor: `feat: <task-id>: refactor: <behavior>`
G1.4.3 Cleanup: `feat: <task-id>: cleanup: <behavior>`
G1.5 If no task exists in tasks.md, still commit with a meaningful message.

---

## D1. Directory Structure

D1.0 Repo Roots:
D1.0.1 Client root is `src/client/` (all frontend/client code).
D1.0.2 Service root is `src/service/` (all server-side/service code).

D1.1 `domain/` contains pure TypeScript business logic and entity definitions.
D1.2 `data/` contains IO implementations and adapters (HTTP clients, SDK wrappers, DB drivers, file system access). It is injected into repositories and must not contain domain decisions.
D1.3 `repositories/` contains repository interfaces and implementations that orchestrate use-cases and depend on injected `data/` dependencies for IO. Repositories must not directly own low-level IO.
D1.4 `components/` contains React UI components organized by domain context.
D1.5 Root `src/` organizes by domain folders containing use-cases (for example /billing/make-payment.tsx, /registration/unregister.tsx).

---

## Appendix

### Appendix A — PLAN Template (TDD)

Use this template when the user opts-in to a TDD workflow per P0.0.

```md
Here is the PLAN for Task <number>: "<feature name>"

PLAN:
1. <Phase name>
   TDD Increment 1
   RED:
   - Test name: <business behavior test name>
   - Location: <path/to/test>
   - Intent: <one sentence describing the behavior we’re defining>

   GREEN:
   - Minimal implementation: <one sentence>
   - Files expected to change: <paths>

   COMMIT:
   - Proposed message: feat: <task-id>: <behavior>

   REFACTOR:
   - Candidate refactors (only if needed): <one sentence>
   - Files expected to change: <paths>

   COMMIT (only if refactor happened):
   - Proposed message: feat: <task-id>: refactor: <behavior>

2. <Next Phase name>
   TDD Increment 2
   RED:
   - Test name: <...>
   - Location: <...>
   - Intent: <...>

   GREEN:
   - Minimal implementation: <...>
   - Files expected to change: <...>

   COMMIT:
   - Proposed message: feat: <task-id>: <behavior>

   REFACTOR:
   - Candidate refactors (only if needed): <...>

3. Cleanup & Verification
   - Run all tests
   - Fix linting errors
   COMMIT:
   - Proposed message: feat: <task-id>: cleanup: <behavior>

Do you want me to proceed with this plan?
```

Phase-gating message template (must be used between phases):
```
I have completed Phase <n> (<phase name>).

Summary:
<2–5 sentences describing what changed, what tests were added, and what behavior is now supported.>

I am proceeding to Phase <n+1>: <phase name>.
Do you want me to proceed?
```

### Appendix A.1 — PLAN Template (Non-TDD)

Use this template when the user opts-out of a TDD workflow per P0.0.

```md
Here is the PLAN for Task <number>: "<feature name>"

PLAN:
1. <Phase name>
   - Goal: <one sentence>
   - Changes: <what files/areas will change>
   - Verification: <how we will verify correctness>

2. <Next Phase name>
   - Goal: <one sentence>
   - Changes: <...>
   - Verification: <...>

3. Cleanup & Verification
   - Run relevant checks/tests (as applicable)
   - Fix linting errors
   - Verify the feature manually (as applicable)

Do you want me to proceed with this plan?
```

### Appendix B — `tdd.log` Entry Template (TDD only)

Use this structure when appending to `tdd.log`. Each section must reference the PLAN step number.
```
GOAL: <use case in business language>
PLAN STEP: <phase.step>

----------------------------------------------------------------------

=== RED PHASE ===
TEST ADDED: <path> - <one-line business expectation>
CHANGESET:
<only the single test added/modified, pasted here>

COMMANDS RUN: <command(s)>
TEST OUTPUT: RED - <brief failure summary>

NEXT STEP: <one sentence describing the smallest change to go green>

=== GREEN PHASE ===
CHANGESET:
<only the minimal production code to pass the test, pasted here>

COMMANDS RUN: <command(s)>
TEST OUTPUT: GREEN - All tests passing

=== COMMIT ===
PROPOSED COMMIT: feat: <task-id>: <behavior>
USER DECISION: <commit? push?>

=== REFACTOR PHASE ===
REFRACTORING NOTES:
<what refactoring happened OR "No refactoring was necessary">

CHANGESET:
<only the refactor diff/code pasted here if refactored>

COMMANDS RUN: <command(s)>
TEST OUTPUT: GREEN - All tests passing

=== COMMIT (REFACTOR) ===
PROPOSED COMMIT: feat: <task-id>: refactor: <behavior>
USER DECISION: <commit? push?>

=== CLEANUP & VERIFICATION ===
- Ran full test suite
- Fixed linting errors
- Verified website/services run

=== COMMIT (CLEANUP) ===
PROPOSED COMMIT: feat: <task-id>: cleanup: <behavior>
USER DECISION: <commit? push?>
```

### Appendix C — Example `tdd.log` Entry (canonical)
```
GOAL: rollback shows decremented current version on system-prompt page
----------------------------------------------------------------------

=== RED PHASE ===
TEST ADDED: src/seo/repositories/systemPromptOverridesRepository.int.test.ts (modified) - expects rollback version to decrease by 1
CHANGESET:
    test('decrements current version', () => {
        const v1 = 'TEST_OVERRIDE_' + Math.random().toString(36).slice(2);
        const e1 = appendOverride(v1, new Date('2025-01-02T03:04:05.000Z'), 'new', 'first save comment');

        expect(e1.value).toBe(v1);
        expect(typeof e1.version).toBe('number');
        expect(e1.version).toBe(1);
    });

COMMANDS RUN: npm test (expected to fail before implementation)
TEST OUTPUT: RED - rollback version is not decremented (was incremented)

NEXT STEP: Modify appendOverride to set version to last.version - 1 on rollback (min 1), both in repository and production server

=== GREEN PHASE ===
- Implemented scoreRepository with Node fs + browser localStorage fallback
- Hooked saveCurrentScores into openAiApi.generateSuggestions
- Added test openAiApi.persist.test.ts to verify stored values and keying by listing_id
- Documented data format and keys in README (SEO Scores Database section)
- Checked off task 88 in tasks.md

COMMANDS RUN: npm test --silent -- --runInBand
TEST OUTPUT: GREEN - All tests passing

=== REFACTOR PHASE ===
- Extracted title score calculation to a new function called scoreTitle
- Moved function scoreTitle, scoreDescription, and scoreTags to a new domain layer file called scorer.ts
```

### Appendix D — Test Naming Examples

Bad examples (do not use):
```
test('should correctly parse tags from the OpenAI response')
test('myFunction should be called with correct arguments')
test('renders slider and handles value change')
test('parseTags() returns valid results')
test('GET /api/scoring creates [store]-seo-scores.json = {} if missing')
```

Good examples (use this style):
```
test('parses tags')
test('lists new cars for sale')
test('shows prompt temperature slider')
test('saves initial seo scores')
test('saves scores for a unique etsy shop')
```

### Appendix E — Naming and File Structure Examples

Preferred:
```
registration/register.tsx
billing/make-payment.tsx
src/seo/domain/scorer.ts
src/seo/repositories/PromptRepository.ts
```

Avoid:
```
UserView.js
EditableTagListView.tsx
src/seo/utils/htmlencoder.ts
PromptDomain.ts
```
