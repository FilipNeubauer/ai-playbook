---
name: nx-monorepo-setup
description: Scaffold a fullstack Nx monorepo with pnpm. Interactively selects stacks (NestJS, Next.js, React Native Expo), API style (REST/GraphQL), and generates complete folder structures, shared libs, CLAUDE.md files with coding rules, and Claude skills.
---

# Nx Monorepo Setup

Scaffolds a production-ready Nx monorepo with pnpm, including complete folder structures, shared libraries, CLAUDE.md coding rules, and Claude skills — all based on the developer's stack choices.

## Prerequisites

- Node.js >= 18
- pnpm installed globally (`npm install -g pnpm`)
- Git initialized in the target directory

---

## Step 1: Gather Project Configuration

Ask the user the following questions **one at a time**. Later questions depend on earlier answers.

### Q1: Project Name

> What is the project name? (kebab-case, e.g. `my-app`)

- Validation: lowercase, kebab-case, no spaces
- Used as: Nx workspace name, npm scope `@<project-name>/...`, root directory name

### Q2: Stack Selection (multi-select)

> Which stacks do you want to include? (select all that apply)

- [ ] **NestJS** — Backend API
- [ ] **Next.js** — Web frontend
- [ ] **React Native Expo** — Mobile app

At least one must be selected.

### Q3: API Style (only if NestJS selected)

> Which API style? REST or GraphQL?

- **REST** — Controllers + DTOs + Swagger
- **GraphQL** — Resolvers + Models + DataLoader

This choice affects folder structure across ALL selected stacks (backend resolvers vs controllers, frontend api layer).

### Q4: First Domain/Feature Name

> What is the first domain/feature name? (kebab-case, e.g. `user`, `patient`, `product`)

Used to scaffold one example domain (NestJS), feature (Next.js), and screen (React Native) so the project isn't empty.

### Q5: Confirmation

Display a summary of all selections and ask for confirmation before executing:

```
Project: <project-name>
Stacks: NestJS, Next.js, React Native Expo
API: GraphQL
First domain: patient

Proceed? (Y/n)
```

---

## Step 2: Create Nx Workspace

```bash
npx create-nx-workspace@latest <project-name> --preset=apps --pm=pnpm --nxCloud=skip
cd <project-name>
```

The `apps` preset creates a blank workspace — we add everything ourselves to match playbook conventions.

---

## Step 3: Install Nx Plugins

```bash
# Always
pnpm add -D @nx/js

# If NestJS selected
pnpm add -D @nx/nest @nx/node

# If Next.js selected
pnpm add -D @nx/next @nx/react

# If React Native Expo selected
pnpm add -D @nx/expo @nx/react-native
```

---

## Step 4: Generate Applications

```bash
# If NestJS selected
npx nx generate @nx/nest:application backend --directory=apps/backend --strict

# If Next.js selected
npx nx generate @nx/next:application web --directory=apps/web --style=css --appDir=true

# If React Native Expo selected
npx nx generate @nx/expo:application mobile --directory=apps/mobile
```

---

## Step 5: Generate Shared Utils Library

Create one shared utility library accessible from all apps:

```bash
npx nx generate @nx/js:library shared-utils --directory=libs/shared/utils --buildable
```

---

## Step 6: Install Stack-Specific Dependencies

```bash
# NestJS (always when selected)
cd apps/backend && pnpm add zod decimal.js @nestjs/bullmq bullmq
cd ../..

# NestJS + GraphQL
cd apps/backend && pnpm add @nestjs/graphql @nestjs/apollo @apollo/server graphql
cd ../..

# Next.js + GraphQL codegen
cd apps/web && pnpm add -D @graphql-codegen/cli @graphql-codegen/client-preset
cd ../..

# React Native + GraphQL codegen (if selected)
cd apps/mobile && pnpm add -D @graphql-codegen/cli @graphql-codegen/client-preset
cd ../..

# NestJS + REST
cd apps/backend && pnpm add @nestjs/swagger
cd ../..

# Next.js (always when selected)
cd apps/web && pnpm add react-hook-form @hookform/resolvers zod nuqs
cd ../..

# Next.js + GraphQL
cd apps/web && pnpm add @apollo/client graphql
cd ../..

# React Native Expo (always when selected)
cd apps/mobile && pnpm add nativewind zod
cd ../..

# React Native + GraphQL
cd apps/mobile && pnpm add @apollo/client graphql
cd ../..
```

---

## Step 7: Scaffold NestJS Folder Structure

**Only if NestJS is selected.** Replace the Nx-generated `apps/backend/src/` contents with the playbook structure.

Replace `<DOMAIN>` with the domain name from Q4 (e.g., `patient`). Replace `<DomainPascal>` with PascalCase (e.g., `Patient`).

### Directory Structure

```
apps/backend/src/
├── main.ts
├── app/
│   ├── app.module.ts
│   ├── domain/
│   │   └── <DOMAIN>/
│   │       ├── <DOMAIN>.module.ts
│   │       ├── services/
│   │       │   └── <DOMAIN>.service.ts
│   │       ├── [IF GraphQL] resolvers/
│   │       │   └── <DOMAIN>.resolver.ts
│   │       ├── [IF GraphQL] models/
│   │       │   ├── enums/
│   │       │   ├── inputs/
│   │       │   └── outputs/
│   │       ├── [IF REST] controllers/
│   │       │   └── <DOMAIN>.controller.ts
│   │       ├── [IF REST] dto/
│   │       │   ├── create-<DOMAIN>.input.dto.ts
│   │       │   └── <DOMAIN>.output.dto.ts
│   │       ├── types/
│   │       │   └── <DOMAIN>.types.ts
│   │       ├── constants/
│   │       │   └── <DOMAIN>.constants.ts
│   │       ├── utils/
│   │       │   └── <DOMAIN>.utils.ts
│   │       └── __tests__/
│   │           └── <DOMAIN>.service.test.ts
│   └── infra/
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── guards/
│       │   ├── strategies/
│       │   ├── services/
│       │   ├── decorators/
│       │   └── types/
│       ├── [IF GraphQL] graphql/
│       │   ├── graphql.module.ts
│       │   ├── constants/
│       │   ├── types/
│       │   └── utils/
│       ├── [IF GraphQL] dataloader/
│       │   ├── dataloader.module.ts
│       │   ├── services/
│       │   └── types/
│       ├── bullmq/
│       │   └── bullmq.module.ts
│       ├── controllers/
│       │   └── healthcheck.controller.ts
│       ├── filters/
│       │   └── http-exception.filter.ts
│       └── interceptors/
│           └── logging.interceptor.ts
└── libs/
    └── (created as needed — for cross-domain shared logic within this app)
```

> **Note:** `libs/` lives inside the backend app, not as Nx workspace libraries. These are plain TypeScript modules for sharing logic across domains within the monolith. Only extract to an Nx library (`libs/` at workspace root) if you add a second backend that needs the same code.

### Skeleton Files

**`main.ts`**:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();
```

**`app/app.module.ts`**:
```typescript
import { Module } from '@nestjs/common';
import { <DomainPascal>Module } from './domain/<DOMAIN>/<DOMAIN>.module';
import { AuthModule } from './infra/auth/auth.module';
import { BullmqModule } from './infra/bullmq/bullmq.module';
// [IF GraphQL] import { GraphqlModule } from './infra/graphql/graphql.module';
// [IF GraphQL] import { DataloaderModule } from './infra/dataloader/dataloader.module';
import { HealthcheckController } from './infra/controllers/healthcheck.controller';
import { HttpExceptionFilter } from './infra/filters/http-exception.filter';
import { LoggingInterceptor } from './infra/interceptors/logging.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    BullmqModule,
    // [IF GraphQL] GraphqlModule,
    // [IF GraphQL] DataloaderModule,
    <DomainPascal>Module,
  ],
  controllers: [HealthcheckController],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
```

**`app/domain/<DOMAIN>/<DOMAIN>.module.ts`**:
```typescript
import { Module } from '@nestjs/common';
import { <DomainPascal>Service } from './services/<DOMAIN>.service';
// [IF GraphQL] import { <DomainPascal>Resolver } from './resolvers/<DOMAIN>.resolver';
// [IF REST] import { <DomainPascal>Controller } from './controllers/<DOMAIN>.controller';

@Module({
  // [IF REST] controllers: [<DomainPascal>Controller],
  providers: [
    <DomainPascal>Service,
    // [IF GraphQL] <DomainPascal>Resolver,
  ],
  exports: [<DomainPascal>Service],
})
export class <DomainPascal>Module {}
```

**`app/domain/<DOMAIN>/services/<DOMAIN>.service.ts`**:
```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class <DomainPascal>Service {
  private readonly logger = new Logger(<DomainPascal>Service.name);

  async findAll(): Promise<void> {
    this.logger.log('Finding all <DOMAIN> records');
    // TODO: implement
  }

  async findById(id: string): Promise<void> {
    this.logger.log(`Finding <DOMAIN> by id=${id}`);
    // TODO: implement
  }
}
```

**[IF GraphQL] `app/domain/<DOMAIN>/resolvers/<DOMAIN>.resolver.ts`**:
```typescript
import { Resolver, Query } from '@nestjs/graphql';
import { <DomainPascal>Service } from '../services/<DOMAIN>.service';

@Resolver()
export class <DomainPascal>Resolver {
  constructor(private readonly <domainCamel>Service: <DomainPascal>Service) {}

  @Query(() => String)
  async <domainCamel>Hello(): Promise<string> {
    return 'Hello from <DOMAIN>';
  }
}
```

**[IF REST] `app/domain/<DOMAIN>/controllers/<DOMAIN>.controller.ts`**:
```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { <DomainPascal>Service } from '../services/<DOMAIN>.service';

@Controller('<DOMAIN>')
export class <DomainPascal>Controller {
  constructor(private readonly <domainCamel>Service: <DomainPascal>Service) {}

  @Get()
  async findAll() {
    return this.<domainCamel>Service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.<domainCamel>Service.findById(id);
  }
}
```

**`app/domain/<DOMAIN>/types/<DOMAIN>.types.ts`**:
```typescript
export type <DomainPascal>Id = string;
```

**`app/domain/<DOMAIN>/constants/<DOMAIN>.constants.ts`**:
```typescript
export const <DOMAIN_UPPER>_QUEUE_NAME = '<DOMAIN>-queue';
```

**`app/domain/<DOMAIN>/utils/<DOMAIN>.utils.ts`**:
```typescript
// Pure stateless utility functions for <DOMAIN>
```

**`app/domain/<DOMAIN>/__tests__/<DOMAIN>.service.test.ts`**:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { <DomainPascal>Service } from '../services/<DOMAIN>.service';

describe('<DomainPascal>Service', () => {
  let service: <DomainPascal>Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [<DomainPascal>Service],
    }).compile();

    service = module.get<<DomainPascal>Service>(<DomainPascal>Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

**`app/infra/controllers/healthcheck.controller.ts`**:
```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthcheckController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
```

**`app/infra/filters/http-exception.filter.ts`**:
```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    this.logger.error(`HTTP ${status}: ${exception.message}`);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

**`app/infra/interceptors/logging.interceptor.ts`**:
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request?.method || 'UNKNOWN';
    const url = request?.url || 'UNKNOWN';

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`${method} ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}
```

**`app/infra/auth/auth.module.ts`**:
```typescript
import { Module } from '@nestjs/common';

@Module({
  providers: [],
  exports: [],
})
export class AuthModule {}
```

**`app/infra/bullmq/bullmq.module.ts`**:
```typescript
import { Module } from '@nestjs/common';

@Module({
  providers: [],
  exports: [],
})
export class BullmqModule {}
```

**[IF GraphQL] `app/infra/graphql/graphql.module.ts`**:
```typescript
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/backend/schema.graphql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
    }),
  ],
})
export class GraphqlModule {}
```

> **Note:** `autoSchemaFile` writes `apps/backend/schema.graphql` on startup. Frontend codegen configs point to this file. Start the backend first, then run codegen on web/mobile.

**[IF GraphQL] `app/infra/dataloader/dataloader.module.ts`**:
```typescript
import { Module } from '@nestjs/common';

@Module({
  providers: [],
  exports: [],
})
export class DataloaderModule {}
```

---

## Step 8: Scaffold Next.js Folder Structure

**Only if Next.js is selected.** Replace the Nx-generated `apps/web/src/` with the playbook structure.

Replace `<FEATURE>` with the domain name from Q4. Replace `<FeaturePascal>` with PascalCase.

### Directory Structure

```
apps/web/src/
├── app/
│   └── [locale]/
│       ├── layout.tsx
│       ├── loading.tsx
│       ├── not-found.tsx
│       ├── (public)/
│       │   ├── layout.tsx
│       │   └── login/
│       │       └── page.tsx
│       └── (protected)/
│           ├── layout.tsx
│           └── <FEATURE>/
│               ├── page.tsx
│               └── [id]/
│                   └── page.tsx
├── features/
│   └── <FEATURE>/
│       ├── components/
│       │   └── <FeaturePascal>List.tsx
│       ├── hooks/
│       │   └── use-<FEATURE>.ts
│       ├── lib/
│       │   ├── schema.ts
│       │   └── index.ts
│       ├── types/
│       │   └── <FEATURE>.types.ts
│       └── constants/
│           └── <FEATURE>.constants.ts
├── components/
│   ├── shadcn-ui/
│   │   └── .gitkeep
│   └── custom/
│       ├── tables/
│       │   └── .gitkeep
│       ├── modals/
│       │   └── .gitkeep
│       ├── form-inputs/
│       │   └── .gitkeep
│       ├── skeleton/
│       │   └── .gitkeep
│       └── empty-states/
│           └── .gitkeep
├── api/
│   ├── api.ts
│   ├── auth/
│   │   └── .gitkeep
│   ├── [IF GraphQL] graphql/
│   │   ├── client.tsx
│   │   ├── codegen.ts
│   │   └── documents/
│   │       ├── queries/
│   │       │   └── .gitkeep
│   │       ├── mutations/
│   │       │   └── .gitkeep
│   │       ├── subscriptions/
│   │       │   └── .gitkeep
│   │       └── fragments/
│   │           └── .gitkeep
│   └── [IF REST] rest/
│       └── .gitkeep
├── hooks/
│   └── .gitkeep
├── lib/
│   ├── constants.ts
│   ├── routes.ts
│   └── toast.tsx
├── utils/
│   └── .gitkeep
├── providers/
│   └── Providers.tsx
├── layouts/
│   ├── RootLayout.tsx
│   ├── ProtectedLayout.tsx
│   └── PublicLayout.tsx
├── i18n/
│   └── messages/
│       └── en.json
├── icons/
│   └── .gitkeep
├── styles/
│   └── globals.css
└── images/
    └── .gitkeep
```

### Skeleton Files

**`app/[locale]/layout.tsx`**:
```tsx
import { RootLayout } from '@/layouts/RootLayout';

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
}
```

**`app/[locale]/loading.tsx`**:
```tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

**`app/[locale]/not-found.tsx`**:
```tsx
export default function NotFound() {
  return <div>Page not found</div>;
}
```

**`app/[locale]/(public)/layout.tsx`**:
```tsx
import { PublicLayout } from '@/layouts/PublicLayout';

export default function PublicRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
```

**`app/[locale]/(public)/login/page.tsx`**:
```tsx
export default function LoginPage() {
  return <div>Login</div>;
}
```

**`app/[locale]/(protected)/layout.tsx`**:
```tsx
import { ProtectedLayout } from '@/layouts/ProtectedLayout';

export default function ProtectedRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
```

**`app/[locale]/(protected)/<FEATURE>/page.tsx`**:
```tsx
import { <FeaturePascal>List } from '@/features/<FEATURE>/components/<FeaturePascal>List';

export default function <FeaturePascal>Page() {
  return <<FeaturePascal>List />;
}
```

**`features/<FEATURE>/components/<FeaturePascal>List.tsx`**:
```tsx
'use client';

type Props = {
  // TODO: define props
};

export function <FeaturePascal>List({}: Props) {
  return (
    <div>
      <h1><FeaturePascal> List</h1>
      {/* TODO: implement */}
    </div>
  );
}
```

**`features/<FEATURE>/hooks/use-<FEATURE>.ts`**:
```typescript
export function use<FeaturePascal>() {
  // TODO: wrap API hooks, return clean interface
  return {
    data: [],
    loading: false,
    error: null,
  };
}
```

**`features/<FEATURE>/lib/schema.ts`**:
```typescript
import { z } from 'zod';

export const <domainCamel>Schema = z.object({
  name: z.string().min(1).max(255),
});

export type <FeaturePascal>FormData = z.infer<typeof <domainCamel>Schema>;
```

**`features/<FEATURE>/lib/index.ts`**:
```typescript
export { <domainCamel>Schema, type <FeaturePascal>FormData } from './schema';
```

**`features/<FEATURE>/types/<FEATURE>.types.ts`**:
```typescript
export type <FeaturePascal>Id = string;
```

**`features/<FEATURE>/constants/<FEATURE>.constants.ts`**:
```typescript
// Static values, enum mappings, defaults
```

**`api/api.ts`**:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
```

**[IF GraphQL] `api/graphql/codegen.ts`**:
```typescript
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../../apps/backend/schema.graphql',
  documents: ['src/api/graphql/documents/**/*.gql'],
  generates: {
    './src/api/graphql/generated.ts': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
```

> Run `npx graphql-codegen --config src/api/graphql/codegen.ts` from `apps/web/` after the backend is running and `schema.graphql` has been generated.

**[IF GraphQL] `api/graphql/client.tsx`**:
```tsx
'use client';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

type Props = { children: React.ReactNode };

export function GraphQLProvider({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

**`lib/constants.ts`**:
```typescript
export const APP_NAME = '<project-name>';
```

**`lib/routes.ts`**:
```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  <DOMAIN_UPPER>: '/<FEATURE>',
} as const;
```

**`lib/toast.tsx`**:
```tsx
// Toast notification setup — configure with your preferred library
```

**`providers/Providers.tsx`**:
```tsx
'use client';

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return <>{children}</>;
}
```

**`layouts/RootLayout.tsx`**:
```tsx
type Props = { children: React.ReactNode };

export function RootLayout({ children }: Props) {
  return <>{children}</>;
}
```

**`layouts/ProtectedLayout.tsx`**:
```tsx
type Props = { children: React.ReactNode };

export function ProtectedLayout({ children }: Props) {
  return <>{children}</>;
}
```

**`layouts/PublicLayout.tsx`**:
```tsx
type Props = { children: React.ReactNode };

export function PublicLayout({ children }: Props) {
  return <>{children}</>;
}
```

**`i18n/messages/en.json`**:
```json
{
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "notFound": "Page not found"
  }
}
```

**`styles/globals.css`**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Step 9: Scaffold React Native Expo Folder Structure

**Only if React Native Expo is selected.** Replace the Nx-generated `apps/mobile/` internals with the playbook structure.

Replace `<SCREEN>` with the domain name from Q4. Replace `<ScreenPascal>` with PascalCase.

### Directory Structure

```
apps/mobile/src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (public)/
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   └── (protected)/
│       ├── _layout.tsx
│       ├── (tabs)/
│       │   ├── _layout.tsx
│       │   ├── home.tsx
│       │   └── settings.tsx
│       └── <SCREEN>/
│           ├── index.tsx
│           └── [id].tsx
├── screens/
│   ├── home/
│   │   └── index.tsx
│   ├── settings/
│   │   └── index.tsx
│   └── <SCREEN>/
│       ├── index.tsx
│       ├── components/
│       │   └── <ScreenPascal>Header.tsx
│       ├── hooks/
│       │   └── use-<SCREEN>.ts
│       ├── types/
│       │   └── <SCREEN>.types.ts
│       └── constants/
│           └── <SCREEN>.constants.ts
├── components/
│   └── custom/
│       ├── bottom-sheets/
│       │   └── .gitkeep
│       ├── form-inputs/
│       │   └── .gitkeep
│       ├── lists/
│       │   └── .gitkeep
│       └── skeleton/
│           └── .gitkeep
├── api/
│   ├── api.ts
│   ├── auth/
│   │   └── .gitkeep
│   ├── [IF GraphQL] graphql/
│   │   ├── client.ts
│   │   ├── codegen.ts
│   │   └── documents/
│   │       ├── queries/
│   │       │   └── .gitkeep
│   │       ├── mutations/
│   │       │   └── .gitkeep
│   │       ├── subscriptions/
│   │       │   └── .gitkeep
│   │       └── fragments/
│   │           └── .gitkeep
│   └── [IF REST] rest/
│       └── .gitkeep
├── hooks/
│   └── .gitkeep
├── utils/
│   ├── constants.ts
│   └── async-storage.service.ts
├── providers/
│   └── Providers.tsx
├── i18n/
│   └── messages/
│       └── en.json
├── icons/
│   └── .gitkeep
├── styles/
│   └── global.css
└── images/
    └── .gitkeep
```

### Skeleton Files

**`app/_layout.tsx`**:
```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

**`app/index.tsx`**:
```tsx
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(protected)/(tabs)/home" />;
}
```

**`app/(public)/_layout.tsx`**:
```tsx
import { Stack } from 'expo-router';

export default function PublicLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

**`app/(public)/login.tsx`**:
```tsx
import { View, Text } from 'react-native';

export default function LoginScreen() {
  return (
    <View>
      <Text>Login</Text>
    </View>
  );
}
```

**`app/(protected)/_layout.tsx`**:
```tsx
import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

**`app/(protected)/(tabs)/_layout.tsx`**:
```tsx
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
```

**`app/(protected)/(tabs)/home.tsx`**:
```tsx
import { HomeScreen } from '@/screens/home';

export default function HomeTab() {
  return <HomeScreen />;
}
```

**`app/(protected)/(tabs)/settings.tsx`**:
```tsx
import { SettingsScreen } from '@/screens/settings';

export default function SettingsTab() {
  return <SettingsScreen />;
}
```

**`app/(protected)/<SCREEN>/index.tsx`**:
```tsx
import { <ScreenPascal>Screen } from '@/screens/<SCREEN>';

export default function <ScreenPascal>Route() {
  return <<ScreenPascal>Screen />;
}
```

**`app/(protected)/<SCREEN>/[id].tsx`**:
```tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function <ScreenPascal>DetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text><ScreenPascal> Detail: {id}</Text>
    </View>
  );
}
```

**`screens/home/index.tsx`**:
```tsx
import { View, Text } from 'react-native';

export function HomeScreen() {
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
}
```

**`screens/settings/index.tsx`**:
```tsx
import { View, Text } from 'react-native';

export function SettingsScreen() {
  return (
    <View>
      <Text>Settings</Text>
    </View>
  );
}
```

**`screens/<SCREEN>/index.tsx`**:
```tsx
import { View, Text } from 'react-native';
import { <ScreenPascal>Header } from './components/<ScreenPascal>Header';

export function <ScreenPascal>Screen() {
  return (
    <View>
      <<ScreenPascal>Header />
      <Text><ScreenPascal> Screen</Text>
    </View>
  );
}
```

**`screens/<SCREEN>/components/<ScreenPascal>Header.tsx`**:
```tsx
import { View, Text } from 'react-native';

type Props = {
  // TODO: define props
};

export function <ScreenPascal>Header({}: Props) {
  return (
    <View>
      <Text><ScreenPascal></Text>
    </View>
  );
}
```

**`screens/<SCREEN>/hooks/use-<SCREEN>.ts`**:
```typescript
export function use<ScreenPascal>() {
  return {
    data: [],
    loading: false,
    error: null,
  };
}
```

**`utils/constants.ts`**:
```typescript
export const APP_NAME = '<project-name>';
```

**`utils/async-storage.service.ts`**:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const asyncStorageService = {
  get: (key: string) => AsyncStorage.getItem(key),
  set: (key: string, value: string) => AsyncStorage.setItem(key, value),
  remove: (key: string) => AsyncStorage.removeItem(key),
};
```

**[IF GraphQL] `api/graphql/codegen.ts`**:
```typescript
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../../apps/backend/schema.graphql',
  documents: ['src/api/graphql/documents/**/*.gql'],
  generates: {
    './src/api/graphql/generated.ts': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
```

> Run `npx graphql-codegen --config src/api/graphql/codegen.ts` from `apps/mobile/` after the backend is running and `schema.graphql` has been generated.

**[IF GraphQL] `api/graphql/client.ts`**:
```typescript
import { ApolloClient, InMemoryCache } from '@apollo/client';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const apolloClient = new ApolloClient({
  uri: `${API_URL}/graphql`,
  cache: new InMemoryCache(),
});
```

**`providers/Providers.tsx`**:
```tsx
type Props = { children: React.ReactNode };

export function Providers({ children }: Props) {
  return <>{children}</>;
}
```

**`i18n/messages/en.json`**:
```json
{
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong"
  }
}
```

**`styles/global.css`**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Step 10: Scaffold Shared Utils Library Internals

Replace the generated `libs/shared/utils/src/` with:

### `libs/shared/utils/src/`

**`index.ts`**:
```typescript
export * from './validation';
export * from './formatting';
```

**`validation.ts`**:
```typescript
import { z } from 'zod';

export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email().trim().toLowerCase();
export const nonEmptyString = z.string().trim().min(1);
```

**`formatting.ts`**:
```typescript
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

---

## Step 11: Create CLAUDE.md Files

### Root `CLAUDE.md`

Write to `<project-root>/CLAUDE.md`:

```markdown
# <PROJECT_NAME>

Nx monorepo with pnpm.

## Stacks

<!-- Only list the selected stacks -->
- `apps/backend/` — NestJS API ([REST|GraphQL])
- `apps/web/` — Next.js web frontend
- `apps/mobile/` — React Native Expo mobile app
- `libs/shared/utils/` — Shared utility functions (validation, formatting)

## Commands

- `pnpm nx serve backend` — Start backend dev server
- `pnpm nx dev web` — Start Next.js dev server
- `pnpm nx start mobile` — Start Expo dev server
- `pnpm nx run-many --target=build` — Build all apps
- `pnpm nx run-many --target=test` — Run all tests
- `pnpm nx affected --target=test` — Test only affected projects
- `pnpm nx graph` — Visualize dependency graph

## Shared Rules

### Code Clarity

- Write code so obvious that a junior developer can understand it without comments.
- If you need a comment to explain *what* code does, rewrite the code instead. Comments explain *why*, never *what*.
- One thing per function. If the function name needs "and" in it, split it.
- No clever tricks, no one-liners that save a line but cost a minute to read. Boring code is good code.
- Name variables and functions for what they are/do — `getRemainingAttempts()` not `calc()`, `isExpired` not `flag`.
- No abbreviations unless universally known (`id`, `url`, `db`). Write `patient` not `pt`, `message` not `msg`.
- Keep functions short — if you can't see the whole function on screen, it's too long.
- Extract magic numbers and strings into named constants.
- Prefer early returns over deeply nested `if/else` chains.
- Avoid negated boolean names — use `isActive` not `isNotDisabled`.

### Naming Conventions

- Files: kebab-case for utilities, hooks, types. PascalCase for components and classes.
- Hooks: `use-<purpose>.ts`
- Types: `<name>.types.ts`
- Constants: `<name>.constants.ts`

### Code Quality

- Zod for all runtime validation. Derive types with `z.infer<>`, never duplicate type definitions.
- Exhaustive `switch` with `satisfies never` in the default case.
- Explicit `| undefined` over `?` for optional properties.
- No empty catch blocks. No silently swallowed errors.
- Never use `any`. Prefer `unknown` when type is truly unknown.

### Error Handling

- Show errors to users — never swallow silently.
- Attach `.catch()` to fire-and-forget promises with logging.
- Log entity IDs on errors — never bare messages without context.

### Architecture

- One domain/feature per module — no bundling multiple concerns.
- Domain code does not import other domains directly. Use shared libs or events.
- Infrastructure is generic — no business logic.
- Create folders only when needed — no empty directories.
- Backend libraries (`src/libs/`) stay inside the backend app — only extract to Nx workspace libs when multiple apps share the same code.
- `libs/shared/utils/` at the workspace root is for utilities shared across backend, web, and mobile.
```

### `apps/backend/CLAUDE.md` (if NestJS selected)

Write the full NestJS rules inline, **filtered by the chosen API style**:

- Include the complete content of the NestJS code rules
- Include the complete NestJS folder structure rules
- **If REST**: remove all mentions of resolvers, models, `@ResolveField`, DataLoader, graphql infra. Keep controllers, dto, Swagger references.
- **If GraphQL**: remove all mentions of REST controllers in domain modules, dto. Keep resolvers, models, DataLoader, graphql infra.

The full content to inline is from:
- `nestjs/rules/nestjs-code-rules.md` (83 lines)
- `nestjs/rules/nestjs-folder-structure-rules.md` (195 lines)

### `apps/web/CLAUDE.md` (if Next.js selected)

Write the full Next.js rules inline:

- Include the complete content of `nextjs/rules/nextjs-code-rules.md` (95 lines)
- Include the complete content of `nextjs/rules/nextjs-folder-structure-rules.md` (164 lines)
- **If REST**: adapt the API section to reference `api/rest/` instead of `api/graphql/`
- **If GraphQL**: keep the graphql documents section as-is

### `apps/mobile/CLAUDE.md` (if React Native Expo selected)

Write the full React Native rules inline:

- Include the complete content of `react-native/rules/react-native-folder-structure-rules.md` (147 lines)
- **If REST**: adapt the API section to reference `api/rest/` instead of `api/graphql/`
- **If GraphQL**: keep the graphql section as-is

---

## Step 12: Create `.claude/commands/`

Create `.claude/commands/` in the generated project root. This is where project-specific Claude skills go. For now, leave it empty — skills can be added as needed.

---

## Step 13: Configure Workspace

### Update `tsconfig.base.json` path aliases

Add to `compilerOptions.paths`:

```json
{
  "@<project-name>/shared-utils": ["libs/shared/utils/src/index.ts"]
}
```

### Create `.env.example`

```bash
# Backend (if NestJS selected)
PORT=3000
NODE_ENV=development

# Frontend (if Next.js selected)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Mobile (if React Native selected)
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Verify `.gitignore`

Ensure it includes:
```
node_modules
dist
.env
.env.local
.nx/cache
```

### [IF GraphQL] Add codegen scripts to `package.json`

Add convenience scripts at the workspace root:

```json
{
  "scripts": {
    "codegen:web": "cd apps/web && npx graphql-codegen --config src/api/graphql/codegen.ts",
    "codegen:mobile": "cd apps/mobile && npx graphql-codegen --config src/api/graphql/codegen.ts"
  }
}
```

Only include scripts for the selected frontend stacks. The backend must be running first so `apps/backend/schema.graphql` exists.

---

## Step 14: Verify Setup

Run these commands to verify everything works:

```bash
# Check dependency graph
pnpm nx graph

# Build all projects
pnpm nx run-many --target=build

# Run tests
pnpm nx run-many --target=test
```

Print a summary of what was created:
- Apps generated
- Shared utils library
- CLAUDE.md files created
- Next steps for the developer

---

## Post-Setup Checklist

After the skill completes, display these next steps:

1. Copy `.env.example` to `.env` and fill in real values
2. Review CLAUDE.md files and customize for project-specific needs
3. Start dev servers:
   - `pnpm nx serve backend` (NestJS)
   - `pnpm nx dev web` (Next.js)
   - `pnpm nx start mobile` (React Native Expo)
4. Begin building your first feature in the scaffolded `<DOMAIN>` domain

---

## Edge Cases

### Only NestJS selected (no frontends)
- Root CLAUDE.md only lists backend
- `libs/shared/utils` is still created (useful for shared validation, formatting)

### Next.js without NestJS (frontend only)
- Skip API style question (no backend to dictate)
- `api/api.ts` configured as generic REST client for external APIs

### Only React Native selected
- Skip API style question
- Single app CLAUDE.md

### REST mode — structural changes
- NestJS: `controllers/` + `dto/` instead of `resolvers/` + `models/`. No `graphql/` or `dataloader/` in infra.
- Next.js: `api/rest/` instead of `api/graphql/documents/`
- React Native: `api/rest/` instead of `api/graphql/documents/`

### GraphQL mode — structural changes
- NestJS: `resolvers/` + `models/` (enums/, inputs/, outputs/) instead of `controllers/` + `dto/`. Includes `graphql/` and `dataloader/` in infra.
- Next.js: `api/graphql/` with client.tsx, codegen.ts, documents/ (queries/, mutations/, subscriptions/, fragments/)
- React Native: Same graphql structure as Next.js but with `client.ts` (not `.tsx`)
