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

## Task: FR.2
### Goal:User enters text and sees a preview of the text rendered in the selected font.
Acceptance:
Given I have selected a font
When I input some text
I see a preview of the text realtime using the selected font
