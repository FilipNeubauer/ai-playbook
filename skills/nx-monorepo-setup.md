---
name: nx-monorepo-setup
description: Scaffold a fullstack Nx monorepo with pnpm. Interactively selects stacks (NestJS, Next.js, React Native Expo), API style (REST/GraphQL), and sets up folder structures, coding rules, and Claude skills.
---

# Nx Monorepo Setup

Scaffolds a production-ready Nx monorepo with pnpm. Rules and templates are read from `~/.claude/playbook/`.

## Prerequisites

- Node.js >= 18
- pnpm installed globally (`npm install -g pnpm`)
- Playbook installed (`~/.claude/playbook/` must exist — run `install.sh` from the ai-playbook repo)

---

## Step 1: Gather Project Configuration

Ask the user the following questions **one at a time**.

### Q1: Project Name

> What is the project name? (kebab-case, e.g. `my-app`)

Validation: lowercase, kebab-case, no spaces. Used as Nx workspace name and npm scope `@<project-name>/`.

### Q2: Stack Selection (multi-select)

> Which stacks do you want to include? (select all that apply)

- [ ] **NestJS** — Backend API
- [ ] **Next.js** — Web frontend
- [ ] **React Native Expo** — Mobile app

At least one must be selected.

### Q3: API Style (only if NestJS selected)

> Which API style? REST or GraphQL?

This affects folder structure across all selected stacks.

### Q4: First Domain/Feature Name

> What is the first domain/feature name? (kebab-case, e.g. `user`, `patient`)

Used to scaffold one example domain/feature/screen.

### Q5: Confirmation

Show a summary and confirm before executing.

---

## Step 2: Create Nx Workspace

```bash
npx create-nx-workspace@latest <project-name> --preset=apps --pm=pnpm --nxCloud=skip
cd <project-name>
```

---

## Step 3: Install Nx Plugins

```bash
pnpm add -D @nx/js
# If NestJS: pnpm add -D @nx/nest @nx/node
# If Next.js: pnpm add -D @nx/next @nx/react
# If React Native: pnpm add -D @nx/expo @nx/react-native
```

---

## Step 4: Generate Applications

```bash
# If NestJS:  npx nx generate @nx/nest:application backend --directory=apps/backend --strict
# If Next.js: npx nx generate @nx/next:application web --directory=apps/web --style=css --appDir=true
# If React Native: npx nx generate @nx/expo:application mobile --directory=apps/mobile
```

---

## Step 5: Generate Shared Utils Library

```bash
npx nx generate @nx/js:library shared-utils --directory=libs/shared/utils --buildable
```

---

## Step 6: Install Stack-Specific Dependencies

```bash
# Biome (always — replaces ESLint/Prettier)
pnpm add -D @biomejs/biome

# NestJS (always when selected)
cd apps/backend && pnpm add zod nestjs-zod decimal.js semver drizzle-orm postgres @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt @nestjs/bullmq bullmq && pnpm add -D @types/semver @types/passport-jwt @types/bcrypt drizzle-kit && cd ../..

# NestJS + GraphQL
cd apps/backend && pnpm add @nestjs/graphql @nestjs/apollo @apollo/server graphql dataloader && cd ../..

# NestJS + REST
cd apps/backend && pnpm add @nestjs/swagger && cd ../..

# Next.js (always when selected)
cd apps/web && pnpm add react-hook-form @hookform/resolvers zod nuqs && cd ../..

# Next.js + GraphQL
cd apps/web && pnpm add @apollo/client graphql && pnpm add -D @graphql-codegen/cli @graphql-codegen/client-preset && cd ../..

# React Native (always when selected)
cd apps/mobile && pnpm add nativewind zod expo-font expo-splash-screen expo-secure-store react-native-keyboard-controller react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet && pnpm add -D tailwindcss && cd ../..

# React Native + GraphQL
cd apps/mobile && pnpm add @apollo/client graphql && pnpm add -D @graphql-codegen/cli @graphql-codegen/client-preset && cd ../..
```

---

## Step 7: Scaffold Folder Structures from Templates

Templates live in `~/.claude/playbook/templates/`. Copy them into the project, replacing placeholders in both filenames and file contents.

### Placeholder Replacement

| Placeholder | Replace with | Example |
|-------------|-------------|---------|
| `__domain__` | domain name (kebab-case) | `patient` |
| `__Domain__` | domain name (PascalCase) | `Patient` |
| `__DOMAIN__` | domain name (UPPER_CASE) | `PATIENT` |
| `__feature__` | same as domain name | `patient` |
| `__Feature__` | same as Domain (PascalCase) | `Patient` |
| `__FEATURE__` | same as DOMAIN (UPPER_CASE) | `PATIENT` |
| `__project__` | project name | `my-app` |

### API Style Filtering

Template files may have `// [REST]` or `// [GQL]` as their **first line**:
- If the user chose **REST**: skip all files starting with `// [GQL]`
- If the user chose **GraphQL**: skip all files starting with `// [REST]`
- Files with no marker: always include

After copying, **remove** the `// [REST]` or `// [GQL]` marker line from the file.

### Root config files

Copy from `~/.claude/playbook/templates/` into the project root:
- `biome.json` → `biome.json`
- `tsconfig.base.json` → `tsconfig.base.json` (replaces Nx-generated one)
- `docker-compose.yml` → `docker-compose.yml` (if NestJS selected — local Postgres)

After copying `tsconfig.base.json`, add the `paths` entry for shared utils:
```json
"paths": {
  "@<project-name>/shared-utils": ["libs/shared/utils/src/index.ts"]
}
```

### NestJS (if selected)

Copy `~/.claude/playbook/templates/nestjs/` into `apps/backend/src/`:

| Template file | Target path |
|--------------|-------------|
| `main.ts` | `apps/backend/src/main.ts` |
| `app.module.ts` | `apps/backend/src/app/app.module.ts` |
| `domain/__domain__.module.ts` | `apps/backend/src/app/domain/<domain>/<domain>.module.ts` |
| `domain/__domain__.service.ts` | `apps/backend/src/app/domain/<domain>/services/<domain>.service.ts` |
| `domain/__domain__.controller.ts` | `apps/backend/src/app/domain/<domain>/controllers/<domain>.controller.ts` |
| `domain/__domain__.resolver.ts` | `apps/backend/src/app/domain/<domain>/resolvers/<domain>.resolver.ts` |
| `domain/__domain__.input.ts` | `apps/backend/src/app/domain/<domain>/models/inputs/create-<domain>.input.ts` |
| `domain/__domain__.output.ts` | `apps/backend/src/app/domain/<domain>/models/outputs/<domain>.output.ts` |
| `domain/__domain__.dto.input.ts` | `apps/backend/src/app/domain/<domain>/dto/create-<domain>.input.dto.ts` |
| `domain/__domain__.types.ts` | `apps/backend/src/app/domain/<domain>/types/<domain>.types.ts` |
| `domain/__domain__.constants.ts` | `apps/backend/src/app/domain/<domain>/constants/<domain>.constants.ts` |
| `domain/__domain__.utils.ts` | `apps/backend/src/app/domain/<domain>/utils/<domain>.utils.ts` |
| `domain/__domain__.service.test.ts` | `apps/backend/src/app/domain/<domain>/__tests__/<domain>.service.test.ts` |
| `infra/healthcheck.controller.ts` | `apps/backend/src/app/infra/controllers/healthcheck.controller.ts` |
| `infra/http-exception.filter.ts` | `apps/backend/src/app/infra/filters/http-exception.filter.ts` |
| `infra/logging.interceptor.ts` | `apps/backend/src/app/infra/interceptors/logging.interceptor.ts` |
| `infra/auth/auth.module.ts` | `apps/backend/src/app/infra/auth/auth.module.ts` |
| `infra/auth/services/auth.service.ts` | `apps/backend/src/app/infra/auth/services/auth.service.ts` |
| `infra/auth/controllers/auth.controller.ts` | `apps/backend/src/app/infra/auth/controllers/auth.controller.ts` |
| `infra/auth/strategies/jwt.strategy.ts` | `apps/backend/src/app/infra/auth/strategies/jwt.strategy.ts` |
| `infra/auth/guards/jwt-auth.guard.ts` | `apps/backend/src/app/infra/auth/guards/jwt-auth.guard.ts` |
| `infra/auth/decorators/current-user.decorator.ts` | `apps/backend/src/app/infra/auth/decorators/current-user.decorator.ts` |
| `infra/auth/types/auth.types.ts` | `apps/backend/src/app/infra/auth/types/auth.types.ts` |
| `infra/auth/constants/auth.constants.ts` | `apps/backend/src/app/infra/auth/constants/auth.constants.ts` |
| `infra/auth/resolvers/auth.resolver.ts` | `apps/backend/src/app/infra/auth/resolvers/auth.resolver.ts` |
| `infra/auth/models/auth-token-pair.output.ts` | `apps/backend/src/app/infra/auth/models/auth-token-pair.output.ts` |
| `infra/auth/models/login.input.ts` | `apps/backend/src/app/infra/auth/models/login.input.ts` |
| `infra/bullmq.module.ts` | `apps/backend/src/app/infra/bullmq/bullmq.module.ts` |
| `infra/graphql.module.ts` | `apps/backend/src/app/infra/graphql/graphql.module.ts` |
| `infra/dataloader.module.ts` | `apps/backend/src/app/infra/dataloader/dataloader.module.ts` |
| `infra/app-config/app-config.module.ts` | `apps/backend/src/app/infra/app-config/app-config.module.ts` |
| `infra/app-config/services/app-config.service.ts` | `apps/backend/src/app/infra/app-config/services/app-config.service.ts` |
| `infra/app-config/controllers/app-config.controller.ts` | `apps/backend/src/app/infra/app-config/controllers/app-config.controller.ts` |
| `infra/app-config/types/app-config.types.ts` | `apps/backend/src/app/infra/app-config/types/app-config.types.ts` |
| `infra/app-config/constants/app-config.constants.ts` | `apps/backend/src/app/infra/app-config/constants/app-config.constants.ts` |
| `libs/common/common.module.ts` | `apps/backend/src/libs/common/common.module.ts` |
| `libs/common/services/env-variable.service.ts` | `apps/backend/src/libs/common/services/env-variable.service.ts` |
| `libs/common/constants/env-variable.constants.ts` | `apps/backend/src/libs/common/constants/env-variable.constants.ts` |
| `libs/common/utils/create-gql-enum.ts` | `apps/backend/src/libs/common/utils/create-gql-enum.ts` |
| `libs/common/utils/log-error.ts` | `apps/backend/src/libs/common/utils/log-error.ts` |
| `libs/common/constants/zod-validation.constants.ts` | `apps/backend/src/libs/common/constants/zod-validation.constants.ts` |
| `libs/common/decorators/zod-validation.decorator.ts` | `apps/backend/src/libs/common/decorators/zod-validation.decorator.ts` |
| `libs/common/pipes/global-zod-validation.pipe.ts` | `apps/backend/src/libs/common/pipes/global-zod-validation.pipe.ts` |
| `libs/common/factories/dataloader.factory.ts` | `apps/backend/src/libs/common/factories/dataloader.factory.ts` |
| `libs/drizzle/drizzle.config.ts` | `apps/backend/drizzle.config.ts` |
| `libs/drizzle/drizzle.module.ts` | `apps/backend/src/libs/drizzle/drizzle.module.ts` |
| `libs/drizzle/services/drizzle.service.ts` | `apps/backend/src/libs/drizzle/services/drizzle.service.ts` |
| `libs/drizzle/db/schemas/app-config.schema.ts` | `apps/backend/src/libs/drizzle/db/schemas/app-config.schema.ts` |
| `libs/drizzle/db/schemas/__domain__.schema.ts` | `apps/backend/src/libs/drizzle/db/schemas/<domain>.schema.ts` |
| `libs/drizzle/db/schemas/refresh-token.schema.ts` | `apps/backend/src/libs/drizzle/db/schemas/refresh-token.schema.ts` |
| `libs/drizzle/db/migrations/.gitkeep` | `apps/backend/src/libs/drizzle/db/migrations/.gitkeep` |
| `libs/drizzle/scripts/seed.ts` | `apps/backend/src/libs/drizzle/scripts/seed.ts` |
| `libs/drizzle/utils/db-helpers.ts` | `apps/backend/src/libs/drizzle/utils/db-helpers.ts` |

After scaffolding, run `cd apps/backend && npx drizzle-kit generate --name init` to create the initial migration from the schemas.

Also handle the `// [IF GraphQL]` and `// [IF REST]` conditional comments inside `app.module.ts` and `__domain__.module.ts`:
- If **REST**: uncomment `// [IF REST]` lines, remove `// [IF GraphQL]` lines entirely
- If **GraphQL**: uncomment `// [IF GraphQL]` lines, remove `// [IF REST]` lines entirely

Create an empty `apps/backend/src/libs/` directory with a note: this is for app-internal cross-domain shared logic (not Nx libs).

### Next.js (if selected)

Copy `~/.claude/playbook/templates/nextjs/` into `apps/web/src/`:

| Template file | Target path |
|--------------|-------------|
| `app/locale-layout.tsx` | `apps/web/src/app/[locale]/layout.tsx` |
| `app/loading.tsx` | `apps/web/src/app/[locale]/loading.tsx` |
| `app/not-found.tsx` | `apps/web/src/app/[locale]/not-found.tsx` |
| `app/public-layout.tsx` | `apps/web/src/app/[locale]/(public)/layout.tsx` |
| `app/login-page.tsx` | `apps/web/src/app/[locale]/(public)/login/page.tsx` |
| `app/protected-layout.tsx` | `apps/web/src/app/[locale]/(protected)/layout.tsx` |
| `app/__feature__-page.tsx` | `apps/web/src/app/[locale]/(protected)/<feature>/page.tsx` |
| `features/__Feature__List.tsx` | `apps/web/src/features/<feature>/components/<Feature>List.tsx` |
| `features/use-__feature__.ts` | `apps/web/src/features/<feature>/hooks/use-<feature>.ts` |
| `features/schema.ts` | `apps/web/src/features/<feature>/lib/schema.ts` |
| `features/index.ts` | `apps/web/src/features/<feature>/lib/index.ts` |
| `features/__feature__.types.ts` | `apps/web/src/features/<feature>/types/<feature>.types.ts` |
| `features/__feature__.constants.ts` | `apps/web/src/features/<feature>/constants/<feature>.constants.ts` |
| `api/api.ts` | `apps/web/src/api/api.ts` |
| `api/graphql-codegen.ts` | `apps/web/src/api/graphql/codegen.ts` |
| `api/graphql-client.tsx` | `apps/web/src/api/graphql/client.tsx` |
| `lib/constants.ts` | `apps/web/src/lib/constants.ts` |
| `lib/routes.ts` | `apps/web/src/lib/routes.ts` |
| `lib/toast.tsx` | `apps/web/src/lib/toast.tsx` |
| `providers/Providers.tsx` | `apps/web/src/providers/Providers.tsx` |
| `layouts/RootLayout.tsx` | `apps/web/src/layouts/RootLayout.tsx` |
| `layouts/ProtectedLayout.tsx` | `apps/web/src/layouts/ProtectedLayout.tsx` |
| `layouts/PublicLayout.tsx` | `apps/web/src/layouts/PublicLayout.tsx` |
| `i18n/en.json` | `apps/web/src/i18n/messages/en.json` |
| `styles/globals.css` | `apps/web/src/styles/globals.css` |
| `features/auth/hooks/use-auth.ts` | `apps/web/src/features/auth/hooks/use-auth.ts` |
| `features/auth/components/LoginForm.tsx` | `apps/web/src/features/auth/components/LoginForm.tsx` |
| `providers/AuthProvider.tsx` | `apps/web/src/providers/AuthProvider.tsx` |
| `app/well-known-apple-app-site-association-route.ts` | `apps/web/src/app/.well-known/apple-app-site-association/route.ts` |
| `app/well-known-assetlinks-route.ts` | `apps/web/src/app/.well-known/assetlinks.json/route.ts` |

Also create empty directories with `.gitkeep`: `components/shadcn-ui/`, `components/custom/tables/`, `components/custom/modals/`, `components/custom/form-inputs/`, `components/custom/skeleton/`, `components/custom/empty-states/`, `hooks/`, `utils/`, `icons/`, `images/`, `api/auth/`.

If REST: create `api/rest/.gitkeep`.

### React Native Expo (if selected)

Copy `~/.claude/playbook/templates/react-native/` into `apps/mobile/src/`:

| Template file | Target path |
|--------------|-------------|
| `app/root-layout.tsx` | `apps/mobile/src/app/_layout.tsx` |
| `app/index.tsx` | `apps/mobile/src/app/index.tsx` |
| `app/public-layout.tsx` | `apps/mobile/src/app/(public)/_layout.tsx` |
| `app/login.tsx` | `apps/mobile/src/app/(public)/login.tsx` |
| `app/protected-layout.tsx` | `apps/mobile/src/app/(protected)/_layout.tsx` |
| `app/tabs-layout.tsx` | `apps/mobile/src/app/(protected)/(tabs)/_layout.tsx` |
| `app/home-tab.tsx` | `apps/mobile/src/app/(protected)/(tabs)/home.tsx` |
| `app/settings-tab.tsx` | `apps/mobile/src/app/(protected)/(tabs)/settings.tsx` |
| `app/__feature__-route.tsx` | `apps/mobile/src/app/(protected)/<feature>/index.tsx` |
| `app/__feature__-detail-route.tsx` | `apps/mobile/src/app/(protected)/<feature>/[id].tsx` |
| `features/__Feature__Screen.tsx` | `apps/mobile/src/features/<feature>/components/<Feature>Screen.tsx` |
| `features/__Feature__Header.tsx` | `apps/mobile/src/features/<feature>/components/<Feature>Header.tsx` |
| `features/use-__feature__.ts` | `apps/mobile/src/features/<feature>/hooks/use-<feature>.ts` |
| `features/__feature__.types.ts` | `apps/mobile/src/features/<feature>/types/<feature>.types.ts` |
| `features/__feature__.constants.ts` | `apps/mobile/src/features/<feature>/constants/<feature>.constants.ts` |
| `utils/constants.ts` | `apps/mobile/src/utils/constants.ts` |
| `utils/async-storage.service.ts` | `apps/mobile/src/utils/async-storage.service.ts` |
| `api/graphql-codegen.ts` | `apps/mobile/src/api/graphql/codegen.ts` |
| `api/graphql-client.ts` | `apps/mobile/src/api/graphql/client.ts` |
| `providers/Providers.tsx` | `apps/mobile/src/providers/Providers.tsx` |
| `i18n/en.json` | `apps/mobile/src/i18n/messages/en.json` |
| `styles/global.css` | `apps/mobile/src/styles/global.css` |
| `app.config.ts` | `apps/mobile/app.config.ts` |
| `tailwind.config.ts` | `apps/mobile/tailwind.config.ts` |
| `metro.config.js` | `apps/mobile/metro.config.js` |
| `babel.config.js` | `apps/mobile/babel.config.js` |
| `nativewind-env.d.ts` | `apps/mobile/nativewind-env.d.ts` |
| `assets/fonts/.gitkeep` | `apps/mobile/src/assets/fonts/.gitkeep` |
| `features/auth/hooks/use-auth.ts` | `apps/mobile/src/features/auth/hooks/use-auth.ts` |
| `features/auth/hooks/use-token-storage.ts` | `apps/mobile/src/features/auth/hooks/use-token-storage.ts` |
| `features/auth/components/LoginForm.tsx` | `apps/mobile/src/features/auth/components/LoginForm.tsx` |
| `providers/AuthProvider.tsx` | `apps/mobile/src/providers/AuthProvider.tsx` |
| `features/force-update/components/ForceUpdateModal.tsx` | `apps/mobile/src/features/force-update/components/ForceUpdateModal.tsx` |
| `features/force-update/hooks/use-version-check.ts` | `apps/mobile/src/features/force-update/hooks/use-version-check.ts` |
| `providers/ForceUpdateProvider.tsx` | `apps/mobile/src/providers/ForceUpdateProvider.tsx` |

Also create empty directories with `.gitkeep`: `components/custom/bottom-sheets/`, `components/custom/form-inputs/`, `components/custom/lists/`, `components/custom/skeleton/`, `hooks/`, `icons/`, `images/`, `api/auth/`.

If REST: create `api/rest/.gitkeep`.

### Shared Utils

Copy `~/.claude/playbook/templates/shared-utils/` into `libs/shared/utils/src/`, replacing any generated content.

---

## Step 8: Compose CLAUDE.md Files from Rules

Read rule files from `~/.claude/playbook/rules/` and compose CLAUDE.md files for the project.

### Root `CLAUDE.md`

Read `~/.claude/playbook/rules/shared-rules.md` and write a root CLAUDE.md containing:

1. **Project header** — name, stacks used
2. **Workspace structure** — list of apps and libs
3. **Commands** — `pnpm nx serve backend`, `pnpm nx dev web`, `pnpm nx start mobile`, build/test/affected commands
4. **Shared rules** — the full content of `shared-rules.md`

### `apps/backend/CLAUDE.md` (if NestJS selected)

Read these files from `~/.claude/playbook/rules/`:
- `nestjs-code-rules.md`
- `nestjs-folder-structure-rules.md`

Write them into `apps/backend/CLAUDE.md` with:
- A header: `# Backend — NestJS API ([REST|GraphQL])`
- **If REST**: remove all GraphQL-specific sections (resolvers, models, `@ResolveField`, DataLoader, graphql infra)
- **If GraphQL**: remove all REST-specific sections (controllers in domain, dto, Swagger)

### `apps/web/CLAUDE.md` (if Next.js selected)

Read these files from `~/.claude/playbook/rules/`:
- `nextjs-code-rules.md`
- `nextjs-folder-structure-rules.md`

Write them into `apps/web/CLAUDE.md`. If REST, adapt API section to reference `api/rest/` instead of `api/graphql/`.

### `apps/mobile/CLAUDE.md` (if React Native selected)

Read `react-native-folder-structure-rules.md` from `~/.claude/playbook/rules/` and write into `apps/mobile/CLAUDE.md`. If REST, adapt API section.

---

## Step 9: Configure Workspace

### Remove ESLint (replaced by Biome)

Delete any ESLint configs that Nx generated:
```bash
rm -f .eslintrc.json .eslintignore
rm -f apps/backend/.eslintrc.json apps/web/.eslintrc.json apps/mobile/.eslintrc.json
```

Also remove `eslint` and related packages from `devDependencies` if present.

Add lint/format scripts to root `package.json`:
```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --fix .",
    "format": "biome format --write ."
  }
}
```

### `.env.example`

```bash
# Database (if NestJS selected — matches docker-compose.yml)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/__project__

# Backend (if NestJS selected)
PORT=3000
NODE_ENV=development
JWT_SECRET=change-me-to-a-random-secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Frontend (if Next.js selected)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Mobile (if React Native selected)
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### `.gitignore`

Verify it includes: `node_modules`, `dist`, `.env`, `.env.local`, `.nx/cache`.

### GraphQL codegen scripts (if GraphQL selected)

Add to root `package.json`:
```json
{
  "scripts": {
    "codegen:web": "cd apps/web && npx graphql-codegen --config src/api/graphql/codegen.ts",
    "codegen:mobile": "cd apps/mobile && npx graphql-codegen --config src/api/graphql/codegen.ts"
  }
}
```

Only include scripts for selected frontend stacks. Backend must be running first so `apps/backend/schema.graphql` exists.

### Create `.claude/commands/`

Create `.claude/commands/` in the project root for project-specific skills.

---

## Step 10: Verify

```bash
pnpm nx graph
pnpm nx run-many --target=build
```

Print a summary: apps created, shared libs, CLAUDE.md files, next steps.

---

## Post-Setup Checklist

1. Copy `.env.example` to `.env`
2. Start Postgres: `docker compose up -d`
3. Run initial migration: `cd apps/backend && npx drizzle-kit migrate`
4. Seed the database: `npx tsx src/libs/drizzle/scripts/seed.ts`
5. Start dev servers: `pnpm nx serve backend` / `pnpm nx dev web` / `pnpm nx start mobile`
4. Start building in the scaffolded `<domain>` domain

---

## Edge Cases

- **Only NestJS (no frontends)**: Root CLAUDE.md only lists backend. Shared utils still created.
- **Next.js without NestJS**: Skip API style question. `api/api.ts` is a generic REST client.
- **Only React Native**: Skip API style question. Single app CLAUDE.md.
- **REST mode**: NestJS uses controllers + dto. Frontends get `api/rest/`. Skip GQL template files.
- **GraphQL mode**: NestJS uses resolvers + models + DataLoader. Frontends get `api/graphql/` with codegen.
