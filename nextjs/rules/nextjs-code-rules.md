# Next.js Frontend Rules

## Component Structure

- Named exports for reusable components — default exports only for Next.js convention files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`).
- Define props as `type Props = { ... }` above the component function.
- `'use client'` only when the component needs hooks, event handlers, or interactivity — default to Server Components.
- PascalCase filenames matching the exported component name. Route modules keep lowercase convention.

## Feature Module Organization

- Each feature gets its own directory under `src/features/` with `components/`, `hooks/`, `lib/`, and optionally `providers/`, `types/`, `constants/`.
- Feature-specific hooks, schemas, types, and constants live inside the feature — not in global directories.
- Barrel exports (`index.ts`) only for sub-feature public APIs.
- Global `hooks/`, `utils/`, `lib/` for truly cross-cutting concerns only.

## Forms & Validation

- React Hook Form with `zodResolver` — no other form libraries.
- Zod schemas in `features/*/lib/schema.ts` — derive types via `z.infer<typeof schema>`, do not duplicate type definitions.
- Use `Controller` for custom field components, `FormProvider` for nested/multi-step forms.
- Provide mapping functions (`mapFormDataToInput`) to convert form data to API input — keep form schemas and API types separate.
- Use `mode: 'onTouched'` or `'onSubmit'` — never `'onChange'`.

## Error Handling

- Show errors to users via toast notifications — never `alert()` or `console.error` alone.
- Mutation handlers: wrap in `try/catch`, return `boolean` success status, show toast on error.
- Attach `.catch()` to fire-and-forget promises — never leave unhandled rejections.
- Do not swallow errors silently — if catching without rethrowing, add a comment explaining why.

## Data Fetching

- Use generated hooks from your API layer — never write raw client calls.
- One operation per file in your API documents directory.
- Reuse fragments/shared types across queries — do not duplicate field selections.

## Custom Hooks

- File naming: `use-[purpose].ts` in kebab-case.
- Wrap API hooks with feature-specific input transformation — return clean interfaces (`{ data, loading, error, refetch }`).
- Combine multiple mutation loading states with `||` into a single `isLoading`.
- Use `useCallback` and `useMemo` for stable references passed to children.
- Use `useRef` for mutable values that should not trigger re-renders.

## State Management

- Server state: use your data fetching library (Apollo, TanStack Query, etc.) — do not add Redux or Zustand unless justified.
- URL state: use a URL state library (`nuqs`, `useSearchParams`, etc.) for table filters, pagination, sort — keep URL in sync.
- Feature state: React Context with a provider and a `use[Feature]Provider()` hook that throws if used outside the provider.

## Type Safety

- Derive types from Zod schemas (`z.infer<>`) — do not duplicate type definitions manually.
- Import enums from generated API types — do not redefine them locally.
- Use `Record<SourceEnum, TargetEnum>` with `as const` for enum mapping between domains.

## Styling & UI

- Tailwind CSS only — no CSS modules, no styled-components, no inline `style=`.
- Use the project's UI library for base components — do not rebuild what it provides.
- Custom SVG icons go in `src/icons/`. Use the project's icon library for standard icons.

## Loading & Empty States

- Create dedicated `*Skeleton.tsx` components for loading states — do not use generic spinners.
- Create shared empty state and error state components for consistent UX.
- Check `if (loading && !data)` before rendering skeletons — allow showing stale data while refetching.

## Internationalization

- All user-facing strings go through the i18n library — no hardcoded strings.
- Use locale-aware `Link`, `useRouter`, `usePathname` from the i18n setup — not from `next/navigation` directly.
- Translation keys organized by feature namespace (e.g., `patients.table.columns.name`).

## Navigation & Routing

- Use centralized route constants — do not hardcode path strings in components.
- Protect unsaved form data with a navigation guard hook.

## Date & Time

- Use a date library (`dayjs`, `date-fns`, etc.) with a centralized setup — do not use raw `Date` or `moment`.
- Display a consistent placeholder for null/undefined dates — never show "Invalid Date".

## Code Splitting

- Use `next/dynamic` for lazy-loading heavy tab content and modals.
- Keep page components thin — delegate logic and rendering to feature components.

## Documentation

- Prefer JSDoc (`/** */`) over inline comments (`//`) for hooks and utility functions.
- Keep JSDoc short — one line for simple things, max 2-3 lines for complex logic.
