# NestJS Backend Rules

## Error Handling

- Do not abuse `try/catch` — let the global exception handler do its job. Only use `try/catch` when adding context or translating external errors.
- Never silently swallow errors — no empty `catch` blocks, always log or rethrow.
- Do not wrap BullMQ processors in `try/catch` — let BullMQ handle retries and failure states.
- Handle worker errors explicitly using `@OnWorkerEvent('failed')` with structured logging (jobId, entityId, error message).
- Always attach `.catch()` to fire-and-forget promises with logging inside.

## Async Jobs & Idempotency

- Always set a deterministic `jobId` to make jobs idempotent. Job IDs must be human-readable with labeled segments — e.g. `patient=${patientId}_code=${observationCode}`, not `${patientId}_${observationCode}`.
- Every async operation must define a retry strategy and a recovery strategy (cron retry, manual reprocessing, or dead-letter queue).

## Logging

- Always log entity IDs (userId, orderId, etc.) on errors — never log bare messages without context.
- Do not use `logger.debug` for important events — use `logger.log`, `logger.warn`, or `logger.error` based on severity. `debug` is often disabled in production.

## Validation

- Validate ALL incoming data: params, query, and body.
- Trim strings, enforce min/max lengths, validate arrays for both length and uniqueness.
- Use Zod schemas and dedicated param/DTO classes — never accept raw unvalidated params.

## Type Safety

- Use exhaustive `switch` with `satisfies never` in the default case to catch unhandled enum/union values at compile time.
- Prefer explicit `| undefined` over `?` for optional properties everywhere — types, interfaces, function parameters. Makes optionality visible and forces callers to explicitly pass `undefined`.
- Prefer defensive guards over non-null assertions (`!`) — check and throw with a descriptive error.

## Environment Variables

- Never use `process.env` directly — always use `EnvVariableService` from `libs/common`.
- Every env variable must be a value in the `EnvVariable` enum. Add new keys to the enum before using them.
- Use `env.get(key)` when the variable is required (throws if missing). Use `env.getOptional(key)` when it may be absent.

## Architecture

- Do not export services directly from domain modules — this creates tight coupling. Use shared "domain lib" modules under `src/libs/` for cross-domain logic.
- Separate domain code (`/domain/user`, `/domain/patient`) from infrastructure (`/infrastructure/auth`, `/infrastructure/bullmq`).
- Each domain gets its own module — do not bundle multiple domains into one module.
- Keep all backend libraries inside the app (`src/libs/`). Only extract to an Nx workspace library when multiple backend apps share the same code. Assume a monolith by default.

## Code Structure

- Keep files under 1000 lines — split large logic into multiple services.
- Keep functions under 100 lines — decompose into named steps (validate, calculate, persist).
- NestJS provider files (services, processors, schedulers, resolvers, guards, interceptors) must contain only the class definition. Move type aliases, interfaces, and helper functions into dedicated files (`types/`, `helpers/`).
- Each NestJS class (service, processor, resolver, guard, etc.) gets its own file — no other classes, types, or interfaces in the same file. Types belong in a dedicated `types/` file.

## Performance & Concurrency

- Do not use `Promise.all` on database operations — use bulk/batch methods like `insertMany` instead.
- Use `p-limit` for concurrency control when running multiple async operations in parallel.

## Jobs & Scaling

- Separate workers (horizontally scalable) from cron jobs (single instance).

## API Design

- Use an object parameter instead of multiple positional parameters of the same type.

## Numbers

- Never use native JS float arithmetic for money or precision-sensitive calculations — use `decimal.js`.
- Be aware of division rounding — always choose an explicit rounding strategy (round, truncate, or full precision). Never silently pass unrounded division results to APIs, databases, or user-facing output.

## Documentation

- Prefer JSDoc (`/** */`) over inline comments (`//`) for functions, classes, and complex variables.
- Keep JSDoc short — one line for simple things, max 2-3 lines for complex logic. No one wants to read a wall of documentation.
- Every `Map` must have a single-line JSDoc describing key -> value meaning, especially `Map<string, string>`.

## Async Functions

- In `async` functions, use `return await ...` instead of returning a raw promise — keeps error handling and stack traces consistent.

## GraphQL

- Never expose foreign key IDs (userId, patientId) in GraphQL types — expose related entities as nested `@ResolveField` instead.
- Always resolve relations via `@ResolveField` + DataLoader — never call services/repositories directly inside a resolver.
- Keep GraphQL schema aligned with DB relation structure — if a link/join table exists, represent it explicitly in the schema (e.g. `User.memberships: [Membership]` not `User.projects: [Project]`).

## Loops & Mandatory Entities

- Do not silently `continue` when a mandatory entity is missing inside a loop — either throw an error or log with entity IDs.
