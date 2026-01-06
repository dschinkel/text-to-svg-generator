# text-to-svg-generator

## LLMs
Junie like all LLM tools forget long chat context. The way to make it reliable is to stop treating the chat as the source of truth and instead force Junie to re-load the `PROJECT_SPEC.md` and `GUIDELINES.md` from disk at the start of every task.

## SVG Generation
For server-side SVG generation, this project uses `opentype.js`. It was chosen because:
1. **Precision**: It provides exact vector paths from OpenType and TrueType fonts, which is critical for 3D extrusion in tools like TinkerCad.
2. **Server-Side Compatibility**: It runs in Node.js, allowing for consistent SVG generation without a browser environment.
3. **Control**: It facilitates path manipulation and bounding box calculations, which are necessary for creating layered outlines.

## Main Workflow

1. Create a `PROJECT_SPEC.md` with the very high level items and a baseline plan at a very high level.  You'll use this to break down into tasks (or AKA smaller use cases)
2. Create a [`GUIDELINES.md`](http://GUIDELINES.md) or whatever file the tool uses as a local pesistent level context at the project level.

   For cursor you’d use `.cursor/rules` instead

   Some tools automatically apply instructions to every request (Copilot instruction file, Cursor rules), while others require that the agent “read” the file as part of its workflow unless you explicitly wire it into the tool’s rule system (for example, keeping Junie rules in .junie/guidelines.md)

3. Create a [task.md](http://task.md) (if using Junie)

   Break the main features found in PROJECT_SPEC.md down by using tasks and tasks.md.  Work in small steps, and iterate on one feature at a time.  Use tasks to work in small batches /steps

4. Start working on one task at a time for the feature you're working to complete.  Features at a higher level are found in PROJECT_SPEC.md prefixed with an F, for example `FR.1`
5. Commit at Green, commit at refactor

## Adobe Fonts Kits (Web Projects)

An Adobe Fonts **Kit** (also called a **Web Project**) is a container for the specific fonts you want to use on your website. It bridges the Adobe Typekit API to your browser.

- **Purpose**: Kits allow the browser to render specific typefaces on the screen.
- **Workflow**:
  1. Add font families to a Kit (via API or Adobe dashboard).
  2. **Publish** the Kit to rebuild its CSS.
  3. Load the Kit's CSS link in your application (e.g., `https://use.typekit.net/[KIT_ID].css`).
  4. Use the font names in your CSS `font-family` property.
- **Rendering**: Without a Kit, we can fetch font metadata, but we cannot render the typeface in the browser.
