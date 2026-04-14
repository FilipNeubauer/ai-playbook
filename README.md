# AI Playbook

A curated library of coding rules, folder structures, and [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skills for AI-assisted fullstack development.

Use it to **bootstrap new projects** with production-ready scaffolding, or **drop rules into existing projects** so your AI assistant follows your team's conventions.

## What's Inside

| Stack | Rules | Skills |
|-------|-------|--------|
| **NestJS** — Backend API | Code rules, folder structure | Drizzle migration |
| **Next.js** — Web frontend | Code rules, folder structure | — |
| **React Native Expo** — Mobile | Folder structure | — |
| **Shared** — Cross-stack | Naming, validation, error handling | Nx monorepo setup |

> **Rules** define how code should be written (conventions, patterns, architecture).
> **Skills** are Claude Code slash commands that automate multi-step workflows.

## Repository Structure

```
shared/
  rules/            Shared rules (naming, validation, error handling)
  skills/           Cross-stack skills (nx-monorepo-setup)
nestjs/
  rules/            NestJS code rules + folder structure
  skills/           NestJS skills (drizzle-migration)
nextjs/
  rules/            Next.js code rules + folder structure
  skills/
react-native/
  rules/            React Native Expo folder structure
  skills/
```

## Getting Started

### Option 1: Start a new project (recommended)

The **Nx monorepo setup** skill scaffolds a complete fullstack project — folder structures, shared libraries, coding rules, and skills — all wired up and ready to go.

**Prerequisites:** [Node.js](https://nodejs.org/) >= 18, [pnpm](https://pnpm.io/), [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

1. **Clone this repo** (or download the skill file):
   ```bash
   git clone https://github.com/<your-org>/ai-playbook.git
   ```

2. **Install the skill** to your global Claude commands:
   ```bash
   mkdir -p ~/.claude/commands
   cp ai-playbook/shared/skills/nx-monorepo-setup.md ~/.claude/commands/
   ```

3. **Create your project folder** and launch Claude Code:
   ```bash
   mkdir my-project && cd my-project
   claude
   ```

4. **Run the skill:**
   ```
   /nx-monorepo-setup
   ```

The skill will walk you through an interactive wizard:

- **Stack selection** — pick any combination of NestJS, Next.js, React Native Expo
- **API style** — REST or GraphQL (adapts folder structure across all stacks)
- **Drizzle ORM** — optional PostgreSQL database layer
- **First domain** — scaffolds an example domain/feature/screen so the project isn't empty

What you get:
- Nx monorepo with pnpm
- Complete folder structures matching the playbook conventions
- Shared libraries (types, utils, db, ui, api-client) based on your stack choices
- `CLAUDE.md` files per app with the full coding rules — Claude automatically loads the right rules when working in each app
- Relevant skills copied into `.claude/commands/`

### Option 2: Add rules to an existing project

If you already have a project and just want the coding rules and conventions:

1. **Shared rules** — copy content from [`shared/rules/`](shared/rules/) into your project's root `CLAUDE.md`
2. **Stack-specific rules** — copy from the relevant `<stack>/rules/` directory:
   - [`nestjs/rules/`](nestjs/rules/) — NestJS code rules + folder structure
   - [`nextjs/rules/`](nextjs/rules/) — Next.js code rules + folder structure
   - [`react-native/rules/`](react-native/rules/) — React Native Expo folder structure
3. **Skills** — copy from `<stack>/skills/` into your project's `.claude/commands/`:
   ```bash
   mkdir -p .claude/commands
   cp ai-playbook/nestjs/skills/drizzle-migration.md .claude/commands/
   ```

> **Tip:** For monorepos, use nested `CLAUDE.md` files — one per app directory. Claude Code automatically loads the nearest `CLAUDE.md`, so each app gets its own context-specific rules.

## Contributing

To add new rules or skills:

- **Rules** go in `<stack>/rules/` as markdown files covering a specific concern
- **Skills** go in `<stack>/skills/` (or `shared/skills/` for cross-stack) following the [Claude Code skill format](https://docs.anthropic.com/en/docs/claude-code)
- Keep rules concise and opinionated — the goal is clear guidance, not documentation
