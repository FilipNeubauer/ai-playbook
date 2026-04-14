# Shared Rules

Rules that apply across all stacks and projects.

## Git Conventions

<!-- Add your git commit message format, branch naming, etc. -->

## Pull Requests

<!-- Add your PR format, review expectations, etc. -->

## Code Clarity

Write code so obvious that a junior developer can understand it without comments.

- If you need a comment to explain *what* code does, rewrite the code instead. Comments explain *why*, never *what*.
- One thing per function. If the function name needs "and" in it, split it.
- No clever tricks, no one-liners that save a line but cost a minute to read. Boring code is good code.
- Name variables and functions for what they are/do — `getRemainingAttempts()` not `calc()`, `isExpired` not `flag`.
- No abbreviations in names unless universally known (`id`, `url`, `db`). Write `patient` not `pt`, `message` not `msg`.
- Keep functions short — if you can't see the whole function on screen, it's too long.
- Extract magic numbers and strings into named constants.
- Prefer early returns over deeply nested `if/else` chains.
- Avoid negated boolean names — use `isActive` not `isNotDisabled`.

## Linting & Formatting

- Use **Biome** for linting and formatting — no ESLint, no Prettier.
- Run `pnpm lint` to check, `pnpm lint:fix` to auto-fix, `pnpm format` to format.
- Biome config lives in `biome.json` at the workspace root — shared across all apps.
- Tabs for indentation, 120 character line width, double quotes, semicolons only as needed.
- Biome enforces: `useConst`, `useBlockStatements`, `noNestedTernary`, `noShadow`, `noUselessElse`, import organization.

## Code Quality

<!-- Add linting, formatting, general code style rules -->

## Naming Conventions

<!-- Add general naming rules that apply across stacks -->

## Testing

<!-- Add testing philosophy, coverage expectations, etc. -->

## Error Handling

<!-- Add general error handling patterns -->
