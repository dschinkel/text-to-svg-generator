# text-to-svg-generator

## LLMs
Junie like all LLM tools forget long chat context. The way to make it reliable is to stop treating the chat as the source of truth and instead force Junie to re-load the PROJECT_SPEC..md and GUIDELINES.md from disk at the start of every task

## Main Workflow

1. Create a `PROJECT_SPEC.md` with the very high level items
2. Create a [`GUIDELINES.md`](http://GUIDELINES.md) or whatever file the tool uses as a local pesistent level context at the project level.

   For cursor you’d use `.cursor/rules` instead

   Some tools automatically apply instructions to every request (Copilot instruction file, Cursor rules), while others require that the agent “read” the file as part of its workflow unless you explicitly wire it into the tool’s rule system (for example, keeping Junie rules in .junie/guidelines.md)

3. Create a [task.md](http://task.md) (if using Junie)

   Break the main features found in PROJECT_SPEC.md down by using tasks and tasks.md.  Work in small steps, and iterate on one feature at a time.  Use tasks to work in small batches /steps

4. Start working on one task at a time
5. Commit at Green, commit at refactor
