---
name: drizzle-migration
description: Generate Drizzle ORM database migrations after schema changes. Use when schema files have been modified and need a migration.
---

# Drizzle Migration Generation

## Project Configuration

Before using this skill, fill in the project-specific values:

| Placeholder | Description | Example |
|---|---|---|
| `<SCHEMA_DIR>` | Path to Drizzle schema files | `apps/api/src/libs/drizzle/db/schemas/` |
| `<MIGRATIONS_DIR>` | Path to generated migrations | `apps/api/src/libs/drizzle/db/migrations/` |
| `<GENERATE_COMMAND>` | Command to generate a migration | `cd apps/api && pnpm drizzle:generate` |
| `<MIGRATE_COMMAND>` | Command to run migrations | `pnpm --filter @myapp/api drizzle:migrate` |

## When to Use

After modifying any Drizzle schema file in `<SCHEMA_DIR>`, run the migration generator to create the SQL migration, schema snapshot, and journal entry.

## Command

```bash
<GENERATE_COMMAND> <migration_name>
```

**Migration naming**: Use `snake_case` descriptive names (e.g., `add_change_in_alarm`, `add_user_preferences_table`).

## What It Generates

For a migration named `add_foo`:
1. **SQL file**: `<MIGRATIONS_DIR>/NNNN_add_foo.sql` — the migration DDL
2. **Snapshot**: `<MIGRATIONS_DIR>/meta/NNNN_snapshot.json` — full schema state after migration
3. **Journal entry**: `<MIGRATIONS_DIR>/meta/_journal.json` — tracks migration order and timestamps

`NNNN` is a zero-padded sequential number assigned automatically by drizzle-kit.

## After Generating

1. **Read the generated SQL** — verify it matches your schema changes
2. **Check for enum additions** — `ALTER TYPE ... ADD VALUE` cannot run inside a PostgreSQL transaction. If the migration adds an enum value, prepend `-- drizzle:non-transactional` as the first line of the SQL file. Then make **every statement idempotent** (since non-transactional migrations can fail mid-way and need to be re-runnable):
   - `ALTER TYPE ... ADD VALUE IF NOT EXISTS '...'`
   - `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...`
   - `CREATE TYPE` → wrap in `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '...') THEN CREATE TYPE ...; END IF; END $$;`
   - `CREATE INDEX CONCURRENTLY IF NOT EXISTS ...`
3. **Verify journal** — `tail <MIGRATIONS_DIR>/meta/_journal.json` to confirm the new entry was added
4. **Verify snapshot** — confirm the snapshot file exists in `<MIGRATIONS_DIR>/meta/`

## Rules

- **Never hand-write migration SQL** — always use `drizzle-kit generate` so snapshots and journal stay in sync
- **One migration per logical change** — if you have multiple schema changes for the same feature, generate them together in one migration
- **Do not modify snapshots or journal manually** — they are managed by drizzle-kit

## Running Migrations

```bash
<MIGRATE_COMMAND>
```
