# PROJECT_SPEC.md

Project: `text-to-svg-generator`

Purpose: Build a small web app that generates several layered-outline SVG lettering from user-provided text and an Adobe Fonts (Typekit) font selection. The output SVGs must be suitable for import into TinkerCad.

This document is the **source of truth** for product behavior, architecture decisions, and key technical choices.  
All implementation work must follow `GUIDELINES.md` which is located at the root of the project.
At the start of every task and before proceeding to the next step in the PLAN, Junie must re-load PROJECT_SPEC.md and GUIDELINES.md from disk, state what the next step is, and ask the User for permission to proceed.
All behavior mentioned below are to be incrementally implemented will be broken down into smaller tasks defined in `tasks.md` and worked on one at a time.

---

## 1. Scope and Outcomes

### 1.1 Primary User Outcome
A user can:
- Select an Adobe font (list of what fonts are available is fetched from Adobe Fonts API will be defined in a later task)
- Enter text
- Preview the text rendered in that font
- Generate and download **three** SVG files:
    1) Base text (font + text only) as SVG
    2) A tight outer outline (stroke/contour) around the base text as SVG
    3) A second, larger outline outside the tight outline as SVG

### 1.2 SVG Output Requirements
- Outputs must be **SVG suitable for CAD import** (TinkerCad).
- The system must generate deterministic, repeatable geometry for the same inputs.
- Output must provide **full resolution** SVG (vector).  
  Thumbnails are previews; downloads are the original SVG.

---

## 2. Repo Layout and Boundaries

### 2.1 Code Roots
- Client (frontend) root: `src/client/`
- Service (backend) root: `src/service/`

### 2.2 Data Storage
- All persisted data must be stored in local JSON files under `src/db/`.
- Generated SVG artifacts may be stored on disk; any file paths or metadata are recorded in JSON under `src/db/`.

---

## 3. Product Requirements

### 3.1 Feature Requirements (FR.*)

**FR.1 — Select a font from a List of Fonts**
**FR.1.1** Ability to load fonts from Adobe Typekit/Adobe Fonts into a dropdown.

**FR.1.2** User can type a font name and the system fetches/install/registers it and adds it to the dropdown.

**FR.1.3** Dropdown shows the font’s name rendered in the actual font (where feasible).

**FR.2 — Add Text for Font**
**FR.2.1** User enters text and sees a preview of the text rendered in the selected font.

**FR.3 — Generate Three SVG images**
The system generates all three SVG outputs for the selected font + text:

**FR.3.1** Base SVG
- SVG image of the text in the selected font.

**FR.3.2** Tight Outline SVG
- SVG image of the text plus a small outer outline/contour around the text.

**FR.3.3** Outer Outline SVG
- SVG image of the text plus a larger outer outline/contour outside the tight outline.

**FR.4 — Download**
**FR.4.1** The UI shows 3 preview thumbnails.
**FR.4.2**  Clicking a thumbnail downloads the full-resolution SVG file.

---

## 4. Technical Requirements (TR.*)

### 4.1 Engineering Process
- Always follow the coding style and rules in `GUIDELINES.md`.
- Work in a TDD workflow when user opts in as specified by `GUIDELINES.md`.
- Before starting or resuming work after any prompt, re-read `GUIDELINES.md`.
- Before starting or resuming work after any prompt, provide the next behavior PLAN as specified by `GUIDELINES.md`.

### 4.2 Project Bootstrap
- Initial project boilerplate must be copied from: `~/zevia/code/ai/react-app-boilerplate`
- The new folder name must be: `text-to-svg-generator`

### 4.3 UI Components / Styling
- Always use shadcn/ui components when third-party UI components are needed.

### 4.4 React Architecture
- Separate application logic from React views.
- Views must be humble and ignorant of implementation details:
    - Handler, fetch, and other logic must live in hooks.
    - Hooks call repositories/services via injected dependencies. Therefore there will be two layers below hooks:
      - Repositories which make API calls and return data.
      - Business which is any app agnostic business logic that hooks need in order to orchestrate the model's use cases.

### 4.5 Testing
- Use Jest, React Testing Library, and React Hook Testing Library as appropriate.
- Tests are written first (TDD), one at a time, per `GUIDELINES.md`.
- Test naming and variables must use domain language. Do not use technical terms like "mock". Use domain terms for test data and "fake" for stubs (e.g., `fakeRepository` instead of `mockRepository`).
- Do not test for loading state in hook tests.
- Treat the System Under Test (SUT) as a black box. Avoid using spies or asserting that internal dependencies were called when the output itself can be asserted.
- UI tests must use `data-testid` instead of finding elements by text (e.g., `getByText`, `findByText`). Data test IDs must represent domain concepts (e.g., `data-testid="font-selection"`).
- Commit messages for TDD steps must follow the format: `feat: <feature-id>: Step <number>: <step-name>`.
- Function placement: Always put functions being called from the parent, below the parent.

### 4.6 Data / JSON DB
Store all data in local JSON files under `src/db/`.

Minimum required:
- `src/db/fonts.json` stores font metadata used by the app (name, IDs, Adobe metadata needed by the system).

### 4.7 LLM Requests (TOON)
Whenever sending API calls to LLMs, ensure request tokens are converted first using TOON format notation:
- https://github.com/toon-format/toon

---

## 5. UI Specification

### 5.1 Primary Screen
The primary screen must include:
- A font selector (dropdown)
    - Searchable by font name
    - Shows font names in their own font where feasible
    - Ordered ASC
- A text input
- A live preview area showing the text rendered in the selected font
- A “Generate” action

### 5.2 Generation Result Panel
After generation completes, show:
1) Thumbnail preview of Base SVG
2) Thumbnail preview of Tight Outline SVG
3) Thumbnail preview of Outer Outline SVG

Each thumbnail is clickable and triggers download of the full SVG.

---

## 6. Backend / Service Architecture

### 6.1 Onion Architecture Layers (required)
The service code must follow this strict layering:

**Controller → Command → Business Logic -> Repository → Data Layer**

Rules:
- Controllers are pass-through adapters only (delivery mechanism boundary).
- Commands represent user commands/use-cases and orchestrate the use-case.
- Business logic is pure and domain agnostic.
- Repositories orchestrate access to data sources and provide stable domain-oriented interfaces.
- Data layer performs IO (HTTP, filesystem, DB drivers, SDK wrappers) and is injected into repositories.

### 6.2 Controller Layer (Pass-through)
Controllers must:
- Accept delivery mechanism input (HTTP request, queue message, etc.)
- Translate it into a pure request Data JS Object (no framework types)
- Call the command with the request Data JS Object
- Translate the response Data JS Object back into a delivery mechanism response

Controllers must not:
- Contain business decisions
- Perform domain orchestration
- Touch persistence directly

### 6.3 Command Layer (Use-cases)
Commands must:
- Represent a single user use-case
- Accept request DTOs that have been stripped of delivery concerns
- Use injected pure business logic and injected repositories/services to execute the use-case
- Produce a response Data JS Object

Commands must not:
- Depend on HTTP/framework types (Express/Fastify req/res, headers, etc.)
- Construct their dependencies internally

### 6.4 Request/Response DTOs
- Request and response objects passed between layers must be plain data (serializable, delivery-agnostic).
- No framework objects, no HTTP types, no SDK types inside DTOs.

---

## 7. Data Model (Initial)

### 7.1 Fonts
`src/db/fonts.json` must store enough data to:
- Show fonts in the dropdown
- Resolve a chosen font into a renderable selection for preview and for SVG generation

Suggested minimal shape (not final, subject to evolution via TDD):
- `familyId` / stable identifier
- `name`
- `variations` (weight/style identifiers)
- any Adobe metadata needed to fetch or reference the font consistently

### 7.2 Generations (Optional but Recommended)
A generations record may be stored to support reproducibility and debugging:
- generation ID
- selected font (IDs)
- input text
- outline parameters (tight/outer values)
- created timestamp
- file paths to stored artifacts if persisted to disk

---

## 8. Technology Plan (Bird’s-eye)

### 8.1 Client (src/client)
- React + TypeScript
- shadcn/ui components:
    - Combobox/dropdown for fonts
    - Inputs for text
    - Cards/tiles for thumbnails
- Preview rendering:
    - Render SVG inline as preview thumbnails (scaled) OR render HTML preview using loaded webfont

### 8.2 Service (src/service)
- Node + TypeScript service exposing endpoints to:
    - Sync fonts / fetch font metadata
    - Generate SVGs (base + tight outline + outer outline)
- Onion architecture enforced with Controller → Command → Repository → Data layer

### 8.3 Adobe Fonts Integration
- Use Adobe Typekit / Adobe Fonts API to obtain font lists and metadata:
    - https://fonts.adobe.com/docs/api

### 8.4 SVG Generation (High Quality)
- Generate base text geometry as vector paths suitable for CAD but small enough to be imported into TinkerCad. The file size of the SVG must be 4mb or under.
- Generate outlines as offset contours outside the base geometry.

Key activities:
- Obtain font outline data (font file / usable vector source)
- Convert text to path
- Apply offset/outline expansion twice (tight + outer)
- Output each result as SVG

### 8.5 Download Mechanism
- The UI provides three clickable thumbnails.
- Clicking a thumbnail triggers download of the corresponding SVG.
- Downloads must be the original SVG (not rasterized).

---

## 9. Open Decisions / Risk Areas (Explicit)
These items must be resolved early via small spike tasks or research tasks:
- How the system obtains usable font outline data for SVG path generation for Adobe Fonts selections.
- The exact outline algorithm/library to produce consistent offset contours.
- How “installing” a font into the dropdown is implemented (cached metadata vs dynamic API fetch).

These decisions must be documented as they are made (in this file or adjacent docs) and reflected in the codebase.

---
