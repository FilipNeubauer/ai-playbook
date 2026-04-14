# AI Playbook — Claude Instructions

This repo is a reference library of coding rules, templates, and skills for AI-assisted fullstack development. Not a runnable project.

## Structure

- `rules/` — Coding rules and folder structure conventions (one file per concern, filename indicates stack)
- `templates/` — Real skeleton source files (.ts/.tsx) organized by stack, with `__placeholder__` conventions
- `skills/` — Claude Code slash commands for automating multi-step workflows
- `install.sh` — Copies rules, templates, and skills to `~/.claude/` for global use

## Conventions

- Rule files: `<stack>-<concern>-rules.md` (e.g., `nestjs-code-rules.md`, `nextjs-folder-structure-rules.md`)
- Template files: real source files with `__domain__`, `__Feature__`, `__project__` as placeholders
- Template API markers: `// [REST]` or `// [GQL]` as first line for API-style-specific files
- Skills: markdown files following Claude Code skill format with `---` frontmatter
