# React Native Expo Folder Structure

This document defines the folder structure for React Native Expo applications. Follow this structure when creating new files, screens, or components. When a folder is not needed for the current scope, omit it — do not create empty directories.

## Directory Tree

```
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (public)/
│   │   ├── _layout.tsx
│   │   └── <route>.tsx
│   └── (protected)/
│       ├── _layout.tsx
│       ├── (tabs)/
│       │   ├── _layout.tsx
│       │   └── <tab>.tsx
│       └── <route>/
│           ├── index.tsx
│           └── [paramId].tsx
├── screens/
│   └── <screen-name>/
│       ├── index.tsx
│       ├── components/
│       │   └── <ComponentName>.tsx
│       ├── hooks/
│       │   └── use-<purpose>.ts
│       ├── utils/
│       │   └── <screen-name>.utils.ts
│       ├── types/
│       │   └── <screen-name>.types.ts
│       └── constants/
│           └── <screen-name>.constants.ts
├── components/
│   └── custom/
│       ├── bottom-sheets/
│       ├── form-inputs/
│       ├── lists/
│       ├── skeleton/
│       └── ...
├── api/
│   ├── api.ts
│   ├── auth/
│   └── graphql/
│       ├── client.ts
│       ├── generated.ts
│       ├── codegen.ts
│       └── documents/
│           ├── queries/
│           ├── mutations/
│           ├── subscriptions/
│           └── fragments/
├── hooks/
│   └── use-<purpose>.ts
├── utils/
│   ├── constants.ts
│   ├── storage.ts
│   └── <purpose>.ts
├── providers/
│   ├── Providers.tsx
│   └── <ProviderName>.tsx
├── i18n/
│   └── messages/
├── icons/
├── styles/
│   └── global.css
└── images/
```

## Annotations

### Expo Router (`app/`)

- `_layout.tsx` — layout wrapper for child routes. Root layout configures navigation container, providers, fonts.
- `(public)` / `(protected)` — route groups separate auth requirements.
- `(tabs)/` — tab navigator. Each `<tab>.tsx` is a tab screen.
- `[paramId].tsx` — dynamic segments.
- Route files are thin — import and render from `screens/`.

### Screens (`screens/`)

One directory per screen. Kebab-case names (e.g., `home`, `patient-detail`, `settings`).

| Folder        | Purpose                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| `index.tsx`   | Screen root component. Exported and imported by route file in `app/`.   |
| `components/` | Screen-specific components. PascalCase. Sub-directories when large.     |
| `hooks/`      | Screen-specific hooks. Wrap API calls, return clean interfaces.         |
| `utils/`      | Schemas, mappers, helpers. One `<screen>.utils.ts` to start, split into more files as needed. |
| `types/`      | Internal TS types and interfaces.                                       |
| `constants/`  | Static values — enum mappings, defaults, labels.                        |

For simple screens, a single `index.tsx` without subdirectories is fine.

### Global Components (`components/`)

Shared components organized by type under `custom/` (e.g., `bottom-sheets/`, `form-inputs/`, `lists/`, `skeleton/`).

### API (`api/`)

| Path                 | Purpose                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `api.ts`             | REST client with auth/retry.                                                                      |
| `auth/`              | Session validation, token refresh.                                                                |
| `graphql/`           | GraphQL client setup, codegen config, generated hooks.                                            |
| `graphql/documents/` | `.gql` files in `queries/`, `mutations/`, `subscriptions/`, `fragments/`. One file per operation. |

### Other Directories

- **`hooks/`** — Cross-cutting hooks only. Screen-specific hooks live in `screens/<screen>/hooks/`.
- **`utils/`** — Pure helper functions, app-wide config (routes, constants, async storage). Stateless, no React dependencies.
- **`providers/`** — Global context providers. `Providers.tsx` composes all in correct nesting order.
- **`i18n/`** — Translation files and locale configuration.
- **`icons/`** — Custom SVG icon components.
- **`styles/`** — NativeWind/Tailwind entrypoint (`global.css`). No StyleSheet.
- **`images/`** — Static image assets.

## File Naming

| Type              | Convention                | Example                      |
| ----------------- | ------------------------- | ---------------------------- |
| Components        | PascalCase                | `PatientCard.tsx`            |
| Route files       | lowercase                 | `_layout.tsx`, `index.tsx`   |
| Hooks             | `use-` prefix, kebab-case | `use-patient-search.ts`     |
| Utils             | kebab-case                | `date-utils.ts`              |
| Types             | `.types.ts`               | `patient.types.ts`           |
| Constants         | `.constants.ts`           | `notification.constants.ts`  |
| Providers         | PascalCase + `Provider`   | `AuthProvider.tsx`           |
| Icons             | kebab-case                | `file-pdf.tsx`               |
| Platform-specific | `.<platform>.tsx`         | `bar-chart.native.tsx`, `bar-chart.web.tsx` |

Platform extensions: `.ios.tsx`, `.android.tsx`, `.native.tsx`, `.web.tsx`. A default version (without extension) is always required.

## Rules

- **Screens-first.** Screen-specific code lives in `screens/`. Global directories for cross-cutting concerns only.
- **Route files are thin.** `app/` route files import and render screen components — no business logic.
- **Named exports** for reusable components. Default exports only for Expo Router convention files.
- **Create folders only when needed.** Simple screens can be a single `index.tsx`.
- **One hook per file.** Named `use-<purpose>.ts`.
- **Zod schemas in `utils/schema.ts`.** Derive types via `z.infer<>`, don't duplicate.
- **Platform extensions for divergent UI.** Use `.native.tsx` / `.web.tsx` when platform behavior differs significantly. Avoid platform checks inside components.
- **Co-located tests.** Place test files alongside source (e.g., `format-date.test.ts` next to `format-date.ts`).
- **Use NativeWind for styling.** Use Tailwind classes via `className` prop. Do not use `StyleSheet.create()`.
