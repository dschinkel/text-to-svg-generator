## 0. Copy boilerplate scaffold into existing repo
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

## 1. Add README.md with LLM instructions
Goal:
Add a readme at the root and in it state the following under a sectoin called LLMs: "Junie like all LLM tools forget long chat context. The way to make it reliable is to stop treating the chat as the source of truth and instead force Junie to re-load the PROJECT_SPEC..md and GUIDELINES.md from disk at the start of every task"

Acceptance:
- README.md exists at root
- README.md contains the exact LLM instructions section

## 2. 
Goal:
