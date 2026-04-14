# AI Playbook

A curated library of coding rules, folder structures, and [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skills for AI-assisted fullstack development.

Use it to **bootstrap new projects** with production-ready scaffolding, or **drop rules into existing projects** so your AI assistant follows your team's conventions.

## What's Inside

| Directory | Contents |
|-----------|----------|
| `rules/` | Coding rules and folder structure conventions per stack |
| `templates/` | Real skeleton source files (.ts/.tsx) used by the setup skill |
| `skills/` | Claude Code slash commands that automate multi-step workflows |

### Rules

| File | Scope |
|------|-------|
| `shared-rules.md` | Code clarity, naming, error handling — applies everywhere |
| `nestjs-code-rules.md` | NestJS code conventions (validation, architecture, async) |
| `nestjs-folder-structure-rules.md` | NestJS project structure (domains, infra, libs) |
| `nextjs-code-rules.md` | Next.js code conventions (components, forms, state) |
| `nextjs-folder-structure-rules.md` | Next.js project structure (features, app router) |
| `react-native-folder-structure-rules.md` | React Native Expo project structure (screens, routing) |

### Templates

```
templates/
├── nestjs/          NestJS skeleton files (main.ts, modules, services, controllers, resolvers)
├── nextjs/          Next.js skeleton files (layouts, pages, features, api)
├── react-native/    React Native Expo skeleton files (screens, navigation, tabs)
└── shared-utils/    Shared utility library (validation, formatting)
```

Template files use `__domain__`, `__Feature__`, `__project__` as placeholders that get replaced at setup time. Files marked `// [REST]` or `// [GQL]` are only included when that API style is selected.

### Skills

| Skill | Purpose |
|-------|---------|
| `nx-monorepo-setup.md` | Scaffold a fullstack Nx monorepo with selected stacks |
| `drizzle-migration.md` | Generate Drizzle ORM migrations after schema changes |

## Installation

```bash
git clone https://github.com/<your-org>/ai-playbook.git
cd ai-playbook
./install.sh
```

This copies to:
- `~/.claude/playbook/rules/` — all rule files
- `~/.claude/playbook/templates/` — all template files
- `~/.claude/commands/nx-monorepo-setup.md` — the setup skill

To update after pulling new changes, just run `./install.sh` again.

## Usage

### New project

1. Create a folder and open Claude Code:
   ```bash
   mkdir my-project && cd my-project
   claude
   ```

2. Run the skill:
   ```
   /nx-monorepo-setup
   ```

3. Answer the interactive questions:
   - **Project name** — kebab-case (e.g. `my-app`)
   - **Stacks** — pick any combination of NestJS, Next.js, React Native Expo
   - **API style** — REST or GraphQL
   - **First domain** — name for the example domain/feature/screen

The skill reads rules from `~/.claude/playbook/rules/` and copies templates from `~/.claude/playbook/templates/` — always using the latest installed versions.

**What you get:**
- Nx monorepo with pnpm
- Complete folder structures per stack
- Shared utils library
- `CLAUDE.md` per app with the relevant coding rules baked in
- GraphQL codegen wired up (if GQL selected)

### Existing project

Copy the rules you need directly into your project's `CLAUDE.md` files:

1. **Shared rules** — copy from [`rules/shared-rules.md`](rules/shared-rules.md) into your root `CLAUDE.md`
2. **Stack rules** — copy the relevant files:
   - [`rules/nestjs-code-rules.md`](rules/nestjs-code-rules.md) + [`rules/nestjs-folder-structure-rules.md`](rules/nestjs-folder-structure-rules.md)
   - [`rules/nextjs-code-rules.md`](rules/nextjs-code-rules.md) + [`rules/nextjs-folder-structure-rules.md`](rules/nextjs-folder-structure-rules.md)
   - [`rules/react-native-folder-structure-rules.md`](rules/react-native-folder-structure-rules.md)
3. **Skills** — copy any relevant skills into your project's `.claude/commands/`:
   ```bash
   mkdir -p .claude/commands
   cp ~/path/to/ai-playbook/skills/drizzle-migration.md .claude/commands/
   ```

> **Tip:** For monorepos, put shared rules in the root `CLAUDE.md` and stack-specific rules in each app's `CLAUDE.md`. Claude Code auto-loads the nearest one.

## Contributing

- **Rules** go in `rules/` as standalone markdown files — one file per concern
- **Templates** go in `templates/<stack>/` as real source files with `__placeholder__` conventions
- **Skills** go in `skills/` following the [Claude Code skill format](https://docs.anthropic.com/en/docs/claude-code)

After changes, run `./install.sh` to update your local installation.
