# NestJS Folder Structure

This document defines the folder structure for NestJS applications. Follow this structure when creating new files, modules, or domains. When a folder is not needed for the current scope, omit it — do not create empty directories.

## Directory Tree

```
src/
├── main.ts
├── app/
│   ├── app.module.ts
│   ├── domain/
│   │   └── <domain-name>/
│   │       ├── <domain-name>.module.ts
│   │       ├── services/
│   │       │   ├── <domain-name>.service.ts
│   │       │   ├── <domain-name>-dataloader.service.ts
│   │       │   └── <domain-name>-<purpose>.service.ts
│   │       ├── resolvers/
│   │       │   └── <domain-name>.resolver.ts
│   │       ├── controllers/
│   │       │   └── <domain-name>.controller.ts
│   │       ├── models/
│   │       │   ├── enums/
│   │       │   │   └── <name>.enum.ts
│   │       │   ├── inputs/
│   │       │   │   └── <name>.input.ts
│   │       │   └── outputs/
│   │       │       └── <name>.output.ts
│   │       ├── dto/
│   │       │   ├── <name>.input.dto.ts
│   │       │   └── <name>.output.dto.ts
│   │       ├── types/
│   │       │   └── <domain-name>.types.ts
│   │       ├── constants/
│   │       │   └── <domain-name>.constants.ts
│   │       ├── utils/
│   │       │   └── <domain-name>.utils.ts
│   │       ├── processors/
│   │       │   └── <domain-name>.processor.ts
│   │       ├── schedulers/
│   │       │   └── <domain-name>.scheduler.ts
│   │       ├── guards/
│   │       │   └── <domain-name>.guard.ts
│   │       ├── decorators/
│   │       │   └── <domain-name>.decorator.ts
│   │       └── __tests__/
│   │           ├── <domain-name>.service.test.ts
│   │           └── <domain-name>.integration.test.ts
│   └── infra/
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── controllers/
│       │   ├── decorators/
│       │   ├── guards/
│       │   ├── services/
│       │   ├── strategies/
│       │   ├── types/
│       │   └── utils/
│       ├── graphql/
│       │   ├── graphql.module.ts
│       │   ├── constants/
│       │   ├── types/
│       │   └── utils/
│       ├── bullmq/
│       │   └── bullmq.module.ts
│       ├── dataloader/
│       │   ├── dataloader.module.ts
│       │   ├── services/
│       │   └── types/
│       ├── controllers/
│       │   └── healthcheck.controller.ts
│       ├── filters/
│       │   └── http-exception.filter.ts
│       ├── interceptors/
│       │   └── logging.interceptor.ts
│       └── ...
└── libs/
    ├── drizzle/
    │   ├── db/
    │   │   ├── schemas/
    │   │   │   └── <domain-name>.schema.ts
    │   │   └── migrations/
    │   │       └── NNNN_<migration_name>.sql
    │   ├── utils/
    │   ├── services/
    │   └── scripts/
    └── <domain-name>-lib/
        ├── <domain-name>-lib.module.ts
        ├── services/
        ├── utils/
        ├── types/
        └── constants/
```

## Annotations

### Entry Point

- **`main.ts`** — App bootstrap, middleware, CORS, body parsers.
- **`app/app.module.ts`** — Root module. Imports all domain and infrastructure modules, registers global pipes/interceptors/filters.

### Domain Modules (`app/domain/`)

Each business domain gets its own directory under `domain/`. One domain = one NestJS module. Domain names use kebab-case (e.g., `patient`, `care-team`, `medication-task`).

| Folder / File        | Purpose                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| `<domain>.module.ts` | Module definition — imports, providers, exports                                                     |
| `services/`          | Business logic. One class per file.                                                                 |
| `resolvers/`         | GraphQL entry points (queries, mutations, subscriptions).                                           |
| `controllers/`       | REST endpoint handlers.                                                                             |
| `models/`            | GraphQL types (`@ObjectType`, `@InputType`, `@EnumType`). Subdirs: `enums/`, `inputs/`, `outputs/`. |
| `dto/`               | REST data transfer objects. `<name>.input.dto.ts` / `<name>.output.dto.ts`.                         |
| `types/`             | Internal TS interfaces and type aliases. Not models, not DTOs.                                      |
| `constants/`         | Static values — queue names, cron expressions, defaults.                                            |
| `utils/`             | Pure stateless functions. No DI — if it needs DI, it is a service.                                  |
| `processors/`        | BullMQ job processors. One processor per job type.                                                  |
| `schedulers/`        | Cron job handlers (`@Cron()`).                                                                      |
| `guards/`            | Domain-specific guards.                                                                             |
| `decorators/`        | Domain-specific decorators.                                                                         |
| `__tests__/`         | Co-located tests. Unit tests can also live alongside implementation files.                          |

**GraphQL vs REST:** A domain uses `resolvers/` + `models/` for GraphQL, or `controllers/` + `dto/` for REST. A domain can use both if the app exposes both API styles, but this is uncommon — pick one per project and stay consistent.

### Infrastructure (`app/infra/`)

Cross-cutting concerns, not business logic. Each concern gets its own module.

| Module          | Purpose                                                                      |
| --------------- | ---------------------------------------------------------------------------- |
| `auth/`         | Authentication and authorization — guards, strategies, decorators, services. |
| `graphql/`      | GraphQL server config — schema, context, plugins, scalars.                   |
| `bullmq/`       | Job queue setup — connection, queue registration.                            |
| `dataloader/`   | DataLoader factory for batching resolver queries.                            |
| `controllers/`  | Infra-level HTTP endpoints (health checks, readiness).                       |
| `filters/`      | Global exception filters.                                                    |
| `interceptors/` | Global interceptors — logging, security, response transformation.            |

Add new infrastructure modules as needed (e.g., `cache/`, `storage/`, `webhook/`). Each follows the same pattern: a module file plus internal organization by concern.

### App-Internal Libraries (`libs/`)

Libraries that live **inside the backend app** (`src/libs/`) for sharing logic across domain modules within a single monolith. These are **not** Nx libraries — they are plain TypeScript modules co-located with the app code.

Only extract code into an **Nx library** (under the workspace `libs/` directory) when multiple backend apps in the monorepo need to share it. For a single backend, keep everything inside the app.

#### Drizzle (`libs/drizzle/`)

| Folder           | Purpose                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `db/schemas/`    | Drizzle table definitions. One file per domain (e.g., `patient.schema.ts`).                                 |
| `db/migrations/` | Generated SQL migrations. Numeric prefix + snake_case verb-first name (e.g., `0001_add_patient_table.sql`). |
| `utils/`         | Shared database query helpers.                                                                              |
| `services/`      | Drizzle client provider and connection management.                                                          |
| `scripts/`       | Seeding, backfilling, one-off data operations.                                                              |

#### Domain Libraries (`libs/<domain-name>-lib/`)

Extract shared domain logic into a lib under `libs/` when two or more domain modules need it. Same internal structure as a domain module (services, utils, types, constants). Do not preemptively create libs — extract only when duplication appears.

## File Naming Conventions

All file names use **kebab-case**. The suffix indicates the file's role:

| Suffix                 | Example                                               |
| ---------------------- | ----------------------------------------------------- |
| `.module.ts`           | `patient.module.ts`                                   |
| `.service.ts`          | `patient.service.ts`, `patient-dataloader.service.ts` |
| `.resolver.ts`         | `patient.resolver.ts`                                 |
| `.controller.ts`       | `patient.controller.ts`                               |
| `.processor.ts`        | `patient.processor.ts`                                |
| `.scheduler.ts`        | `patient.scheduler.ts`                                |
| `.guard.ts`            | `patient-access.guard.ts`                             |
| `.decorator.ts`        | `patient-id.decorator.ts`                             |
| `.utils.ts`            | `patient-db.utils.ts`                                 |
| `.constants.ts`        | `patient.constants.ts`                                |
| `.types.ts`            | `patient.types.ts`                                    |
| `.enum.ts`             | `patient-status.enum.ts`                              |
| `.input.ts`            | `create-patient.input.ts`                             |
| `.output.ts`           | `patient-summary.output.ts`                           |
| `.input.dto.ts`        | `create-patient.input.dto.ts`                         |
| `.output.dto.ts`       | `patient-summary.output.dto.ts`                       |
| `.schema.ts`           | `patient.schema.ts` (Drizzle)                         |
| `.test.ts`             | `patient.service.test.ts`                             |
| `.integration.test.ts` | `patient.integration.test.ts`                         |

## Rules

- **One class per file.** Services, processors, resolvers, controllers, guards — each gets its own file. No exceptions.
- **Types go in `types/`.** Do not define TypeScript interfaces or type aliases in service, resolver, or controller files. Move them to a dedicated `types/` file.
- **Utils are pure functions.** No NestJS decorators, no injected dependencies. If it needs DI, it is a service.
- **Create folders only when needed.** If a domain has no processors, do not create a `processors/` directory. Add it when the first processor is needed.
- **Domain modules do not import other domain modules directly.** If domains need to share logic, extract it into a domain lib under `src/libs/` or use events/queues for communication.
- **Keep libs inside the app.** The `libs/` directory under `src/` is for cross-domain sharing within the monolith. Only promote to an Nx workspace library when multiple backend apps need the same code.
- **Infrastructure modules are generic.** They should not contain business logic or reference specific domains.
- **Tests are co-located.** Integration tests go in `__tests__/`. Unit tests for utils and pure functions can live alongside the implementation file. Do not create a top-level `test/` directory.
