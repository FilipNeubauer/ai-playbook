# Next.js Folder Structure

Follow this structure when creating new files, features, or components. Omit folders not needed — do not create empty directories.

## Directory Tree

```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx
│       ├── loading.tsx
│       ├── not-found.tsx
│       ├── (public)/
│       │   ├── layout.tsx
│       │   └── <route>/
│       │       └── page.tsx
│       └── (protected)/
│           ├── layout.tsx
│           └── <route>/
│               ├── page.tsx
│               ├── loading.tsx
│               └── [paramId]/
│                   └── page.tsx
├── features/
│   └── <feature-name>/
│       ├── components/
│       │   ├── <ComponentName>.tsx
│       │   └── <sub-domain>/
│       │       └── <ComponentName>.tsx
│       ├── hooks/
│       │   └── use-<purpose>.ts
│       ├── lib/
│       │   ├── schema.ts
│       │   ├── <feature-name>-mappers.ts
│       │   └── index.ts
│       ├── types/
│       │   └── <feature-name>.types.ts
│       ├── constants/
│       │   └── <feature-name>.constants.ts
│       └── providers/
│           └── <FeatureName>Provider.tsx
├── components/
│   ├── shadcn-ui/
│   └── custom/
│       ├── tables/
│       ├── modals/
│       ├── empty-states/
│       ├── form-inputs/
│       ├── skeleton/
│       └── ...
├── api/
│   ├── api.ts
│   ├── auth/
│   ├── files/
│   └── graphql/
│       ├── client.tsx
│       ├── generated.ts
│       ├── codegen.ts
│       └── documents/
│           ├── queries/
│           ├── mutations/
│           ├── subscriptions/
│           └── fragments/
├── hooks/
│   └── use-<purpose>.ts
├── lib/
│   ├── constants.ts
│   ├── routes.ts
│   ├── dayjs.ts
│   ├── toast.tsx
│   └── session-storage.ts
├── utils/
│   └── <purpose>.ts
├── providers/
│   ├── Providers.tsx
│   └── <ProviderName>.tsx
├── layouts/
│   ├── RootLayout.tsx
│   ├── ProtectedLayout.tsx
│   └── PublicLayout.tsx
├── i18n/
│   ├── messages/
│   ├── navigation.ts
│   ├── routing.ts
│   └── request.ts
├── icons/
├── styles/
│   └── globals.css
└── images/
```

## Annotations

### App Router (`app/`)

- `[locale]/` — locale-prefixed routing. Omit if no i18n.
- `(public)` / `(protected)` — route groups separate auth requirements.
- `[paramId]/` — dynamic segments.
- Pages are thin — delegate to feature components.

### Features (`features/`)

One directory per domain. Kebab-case names.

| Folder        | Purpose                                                               |
| ------------- | --------------------------------------------------------------------- |
| `components/` | Feature components. PascalCase. Sub-domain subdirectories when large. |
| `hooks/`      | Feature hooks. Wrap API hooks, return clean interfaces.               |
| `lib/`        | Zod schemas, mappers, validators. Barrel export via `index.ts`.       |
| `types/`      | Internal TS types and interfaces.                                     |
| `constants/`  | Static values — enum mappings, defaults, labels.                      |
| `providers/`  | React Context providers for feature state.                            |

### Global Components (`components/`)

Shared components organized by type. `shadcn-ui/` for installed shadcn components, `custom/` for project-specific shared components (`tables/`, `modals/`, `form-inputs/`, `empty-states/`, `skeleton/`, etc.).

### API (`api/`)

| Path                 | Purpose                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `api.ts`             | REST client with auth/retry.                                                                      |
| `auth/`              | Session validation, token refresh.                                                                |
| `files/`             | File upload/download.                                                                             |
| `graphql/`           | Apollo Client setup, codegen, generated hooks. Include when using GraphQL.                        |
| `graphql/documents/` | `.gql` files in `queries/`, `mutations/`, `subscriptions/`, `fragments/`. One file per operation. |

### Other Directories

- **`hooks/`** — Cross-cutting hooks only. Feature hooks live in `features/<feature>/hooks/`.
- **`lib/`** — App-wide config and utilities (routes, date setup, toast, session storage). Keep small.
- **`utils/`** — Pure helper functions. Stateless, no React dependencies.
- **`providers/`** — Global context providers. `Providers.tsx` composes all in correct nesting order.
- **`layouts/`** — Layout components for `app/` convention files. Structural chrome only, no business logic.
- **`i18n/`** — Translation files, locale-aware navigation/routing. Include when using i18n.
- **`icons/`** — Custom SVG icon components. Use icon library for standard icons.
- **`styles/`** — Tailwind entrypoint (`globals.css`). No CSS modules.

## File Naming

| Type        | Convention                | Example                     |
| ----------- | ------------------------- | --------------------------- |
| Components  | PascalCase                | `PatientCard.tsx`           |
| Route files | lowercase                 | `page.tsx`, `layout.tsx`    |
| Hooks       | `use-` prefix, kebab-case | `use-patient-search.ts`     |
| Lib/utils   | kebab-case                | `date-utils.ts`             |
| Types       | `.types.ts`               | `patient.types.ts`          |
| Constants   | `.constants.ts`           | `notification.constants.ts` |
| Providers   | PascalCase + `Provider`   | `SecurityProvider.tsx`      |
| GraphQL     | `.gql`, kebab-case        | `create-patient.gql`        |
| Icons       | kebab-case                | `file-pdf.tsx`              |

## Rules

- **Feature-first.** Feature-specific code lives in `features/`. Global directories for cross-cutting concerns only.
- **Named exports** for reusable components. Default exports only for Next.js convention files.
- **Server Components by default.** `'use client'` only when hooks/interactivity needed.
- **Create folders only when needed.**
- **One hook per file.** Named `use-<purpose>.ts`.
- **Zod schemas in `lib/schema.ts`.** Derive types via `z.infer<>`, don't duplicate.
- **Pages are thin.** Compose feature components, no business logic.
- **GraphQL: one `.gql` per operation.** Reuse fragments, use generated hooks only.
