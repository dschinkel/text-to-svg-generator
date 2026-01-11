## 0. Copy boilerplate scaffold into existing repo [COMPLETED]
Goal:
Copy the contents of `..\react-app-boilerplate` into the existing `text-to-svg-generator` folder to establish baseline scaffolding, excluding `node_modules` and excluding `tasks.md` (this repo already has its own tasks file).

Rules:
- Do not copy `node_modules` (or any build output folders).
- Do not copy `tasks.md`.
- Preserve/merge safely: if files already exist in `svg-text-generator`, prefer the repo’s existing versions unless the file is clearly part of the boilerplate scaffold we intend to adopt.

Acceptance:
- `text-to-svg-generator` contains the boilerplate scaffold from `..\react-app-boilerplate`
- No `node_modules` directories were copied
- `tasks.md` in `text-to-svg-generator` is unchanged
- `PROJECT_SPEC.md` in `text-to-svg-generator` is unchanged
- Dependencies install successfully by running `yarn`
- Client root is `src/client/`
- Service root is `src/service/`
- Initialize the repository and push it up to the remote repo as a new repository using the github cli

## 1. Add README.md with LLM instructions [COMPLETED]
Goal:
Add a readme at the root and in it state the following under a sectoin called LLMs: "Junie like all LLM tools forget long chat context. The way to make it reliable is to stop treating the chat as the source of truth and instead force Junie to re-load the PROJECT_SPEC..md and GUIDELINES.md from disk at the start of every task"

Acceptance:
- README.md exists at root
- README.md contains the exact LLM instructions section

## Task: FR.1.1 [COMPLETED]
### Goal: Select a font from a List of Fonts
Fonts to include: Octin, Campus MN
Font source: Adobe Typekit API

Rules:
- Before starting Read PROJECT_SPEC.md and GUIDELINES.md

Acceptance: Ability to select fonts Octin or Campus MN from a list

## Task: Dev Experience - Concurrent Servers [COMPLETED]
### Goal: Start both frontend and backend servers with `yarn dev`.
Acceptance: `yarn dev` starts Vite and the Koa backend concurrently, ensuring the server starts first.

Corrections I had the LLM make during this task:
- fetchAndSave should be two separate small methods. Methods should never do more than one thing.  If one method needs to do something, it should call another but fetch and save are two different concerns that should be separated by their own composed functions.
- refactor JS classes to modules (it didn't do what guidelines.md told it to do which is not to create classes)
- Added `wait-on` to ensure server is ready before client starts.
- Fixed `wait-on` to use `tcp` protocol instead of `http` to avoid blocking on 404 responses from the root path.

## Task: FR.1.2 [COMPLETED]
### Goal: User can type a font name and the system fetches and adds it to the dropdown.

Rules:
- The current fonts dropdown unless we can also type in it will not work here.  Provide me suggestions on other controls we can use for this scenario.  Still list the fonts, be able to select them but also be able to type in new fonts to the same control.  Keep it simple
- Before starting Read PROJECT_SPEC.md and GUIDELINES.md

## Task: FR.1.3 [COMPLETED]
### Goal: Listed fonts show up rendered in their actual typeface (rendert heir names in the list using their unique web fonts) (where feasible)

Rules:
- Before you start, repeat back to me what you think a user would do once this Acceptance criteria is met.
- Before starting Read PROJECT_SPEC.md and GUIDELINES.md
- Use Adobe Fonts web font loading to render the font names in the dropdown.

Acceptance:
AS an Etsy Seller
When I veiw the list of fonts
Then I see their name rendered in that font

## Task: FR.1.4 [COMPLETED]
### Goal: Improve UI/UX interms of asthetics and usability.

Acceptance:
- Add a good looking modern site header and footer
- Add a good looking modern site layout
- Make the fonts list show with larger size font
- Move The fonts list to be under the fold, more toward the top as we'll be adding more stuff below it soon
- Make header and its text larger
- Change theme color from blue to green

## Task: FR.2 [COMPLETED]
### Goal:User enters text and sees a preview of the text rendered in the selected font.
Acceptance:
Given I have selected a font
When I input some text
I see a preview of the text realtime using the selected font


## Task: FR.3.1 [COMPLETED]
### Goal: Generate the Base SVG (Text only).
Rules:
- Before starting Read PROJECT_SPEC.md and GUIDELINES.md
- SVG generation must happen on the server.
- The base SVG must be an image of the text in the selected font.

Acceptance:
Given I have selected a font and entered text
When the system generates the output
Then I see a preview thumbnail of the text rendered as an SVG.

## Task: FR.3.2 [COMPLETED]
### Goal: Generate the Tight Outline SVG (Text + small contour).
Rules:
- Before starting Read PROJECT_SPEC.md and GUIDELINES.md
- SVG generation must happen on the server.
- The tight outline SVG must include the text plus a small outer outline/contour around it.
- **TinkerCad Compatibility**: Outline must be real path geometry, not a stroke.

Acceptance:
- Given I have a base SVG
- When the system applies a tight contour
- Then I see a preview thumbnail of the text with a tight outline.
- And the downloaded SVG imports into TinkerCad as a filled outline.

## Task: FR.3.3 [COMPLETED]
### Goal: Generate the Outer Outline SVG (Text + larger outer contour).
Rules:
- Before starting Read PROJECT_SPEC.md and GUIDELINES.md
- SVG generation must happen on the server.
- The outer outline SVG must include the text plus a larger outer outline/contour outside the tight outline.
- **TinkerCad Compatibility**: Outline must be real path geometry, not a stroke.

Acceptance:
- Given I have a tight outline SVG
- When the system applies a larger outer contour
- Then I see a preview thumbnail of the text with a large outer outline.
- And the downloaded SVG imports into TinkerCad as a filled outline.

## Task: FR.4.1 [COMPLETED]
### Goal: Clicking a Base, Tight, or Outer thumbnail downloads its full-resolution SVG file.
Acceptance:
- Given I see the three SVG previews
- When I click a preview thumbnail
- Then the corresponding full-resolution SVG file is downloaded to my computer.

## Task: FR.6.1 [COMPLETED]
### Goal: Upload a flat image (PNG/JPEG) and see a preview of the uploaded image.
Acceptance:
- User can select a local image file.
- The selected image is displayed in a preview area to the right of the Text Generator.

## Task: FR.6.2 [COMPLETED]
### Goal: Convert the uploaded image to SVG on the server and see an SVG preview.
Acceptance:
- Pressing a "Convert" button sends the image to the server.
- The server processes the image and returns SVG data.
- The SVG result is displayed as a preview.

## Task: FR.6.3 [COMPLETED]
### Goal: Ability to download the converted SVG.
Acceptance:
- Clicking the SVG preview or a download button triggers a download of the .svg file.

## Task: FR.6.5 [COMPLETED]
### Goal: Fix stalling in Image to SVG generation.
Acceptance:
- Large images do not cause the server to hang (increased body size limits).
- Failed conversions do not cause infinite retry loops.
- Robust parsing of base64 image data on the server.

## Task: TinkerCad Scaling [COMPLETED]
### Goal: Ensure generated SVGs fit within TinkerCad's 2000 mm³ workspace limit.
Acceptance:
- Both text-to-SVG and image-to-SVG outputs are scaled if their dimensions exceed a safe threshold (e.g., 1000 units).
- Scaling preserves aspect ratio.
- Verified with unit tests.

## Task: FR.6.6 [COMPLETED]
### Goal: Generate Tight Outline SVG for uploaded images.
Acceptance:
- Given I have uploaded an image
- When the conversion is complete
- Then I see both the base vectorized SVG and a Tight Outline SVG preview.
- And the Tight Outline SVG can be downloaded.
- And the Tight Outline SVG imports into TinkerCad as a filled outline.

## Task: FR.7.1 [COMPLETED]
### Goal: Upload and Preview existing SVG
Acceptance:
- [COMPLETED] User can select a local SVG file.
- [COMPLETED] The selected SVG is displayed in a preview area to the right of "Image to SVG".
- [COMPLETED] The UI state resets when a new SVG is selected.

## Task: FR.7.2 [COMPLETED]
### Goal: Generate Tight Outline SVG for uploaded SVG
Acceptance:
- The system extracts path data from the uploaded SVG.
- The system automatically generates a Tight Outline SVG (offset geometry).
- The Tight Outline SVG fills all internal gaps (solid silhouette).
- The resulting SVG units are scaled to fit TinkerCad limits (max 300 units).

## Task: FR.7.4 [COMPLETED]
### Goal: Troubleshoot Original SVG Preview layers
Acceptance:
- [COMPLETED] The Original SVG Preview shows distinct colors for different layers/elements.
- [COMPLETED] The preview handling is robust for complex SVGs (handles matrix transformations).
- [COMPLETED] Original colors are preserved but visibility is enhanced (fixes 0.001mm strokes).
- [COMPLETED] Layers without fill are given semi-transparent fills for visual contrast.
- [COMPLETED] No `jest.fn()` or "mock" magic is used in tests; all stubs are plain JS functions.
- [COMPLETED] All tests pass.

## Task: FR.7.5 [COMPLETED]
### Goal: Implement Layered Preview for SVG to Tight Outline
Acceptance:
- [COMPLETED] A new preview area shows the Original SVG layered on top of the generated Tight Outline SVG.
- [COMPLETED] The Tight Outline SVG acts as a base layer (usually in a contrasting color or silhouette).
- [COMPLETED] The Original SVG is rendered on top to show alignment.
- [COMPLETED] The UI follows the same pattern as the text Layered Preview.

## Task: 90: Specific Font Variation Installation [COMPLETED]
### Goal: Support installing specific variations of a font (e.g., Cholla Wide OT Ultra Bold).
Acceptance:
- [COMPLETED] User can search for a font and see its variations if multiple exist.
- [COMPLETED] User can select a specific variation to install.
- [COMPLETED] The system correctly adds the specific variation to the Adobe Kit.
- [COMPLETED] TDD workflow followed with RED/GREEN/REFACTOR cycles.
- [COMPLETED] Repository integration test verifies variation storage.
- [COMPLETED] All tests pass.

## Task: 89: Fix Cholla Font Pull [COMPLETED]
### Goal: Pull the font 'Cholla' from Adobe Typekit.
Acceptance:
- [COMPLETED] Successfully fetching 'Cholla' (or its variation like 'Cholla Sans') from Adobe Typekit API.
- [COMPLETED] Robust family slug resolution in `fontRepository`.
- [COMPLETED] All tests pass.

## Task: 91: Indented Font Variations in List [COMPLETED]
### Goal: Show font variations indented under the main font name in the list, always visible, and ensuring previews work when selected.
Acceptance:
- [COMPLETED] Font variations are indented in the `FontSelector` list.
- [COMPLETED] Variations are visible even when not searching.
- [COMPLETED] Selecting a variation correctly updates the UI and SVG previews.
- [COMPLETED] Fixed `AddFont` use case to correctly handle `variationId`.
- [COMPLETED] Integration test verifies the full flow.
- [COMPLETED] All tests pass.

## Task: 93: Optimize Font Variation Selection Speed [COMPLETED]
### Goal: Reduce the time it takes to see the variation selected by avoiding redundant Adobe Typekit API calls.
Acceptance:
- [COMPLETED] `AddFont` use case checks the local repository before calling Adobe's `fetch`.
- [COMPLETED] `AddFont` checks the current kit families and avoids `publishKit` if the family is already present.
- [COMPLETED] `SyncFontKit` avoids redundant `publishKit` calls on startup.
- [COMPLETED] All tests pass.

## Task: 92: Fix Font Variation Previews [COMPLETED]
### Goal: Ensure selecting a font variation (e.g., Bungee Hairline) correctly updates the SVG previews.
Acceptance:
- [COMPLETED] Selecting a variation correctly fetches the specific font file for that variation.
- [COMPLETED] SVG previews reflect the selected variation's style.
- [COMPLETED] Robust CSS parsing handles multiple variations with the same font-family name.
- [COMPLETED] All tests pass.
