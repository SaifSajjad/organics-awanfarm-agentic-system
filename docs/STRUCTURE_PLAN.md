# Structure Plan

## Current Structure Issues

- Shared components currently live directly in `components/`, which makes it harder to distinguish layout, UI primitives, agent views, and future map components.
- There is no dedicated `styles/` folder for future shared style assets beyond `app/globals.css`.
- There is no `tests/` structure for unit and end-to-end tests.
- There is no isolated `scripts/migrations/` folder for future migration helper scripts.
- Database, auth, and API work are currently interdependent, so structural cleanup should happen in small phases before moving files or changing imports.

## Target Structure

```text
components/
  agents/
  layout/
  maps/
  ui/
styles/
tests/
  e2e/
  unit/
scripts/
  migrations/
docs/
```

## Safe Future Migration Phases

1. Keep the newly created folders empty except for `.gitkeep` until the build blockers are resolved.
2. Fix build blockers in a dedicated Prisma/API compatibility phase.
3. Add tests around current behavior before moving working route or component files.
4. Move layout components into `components/layout/` and update imports in one focused change.
5. Move reusable visual primitives into `components/ui/` and update imports in one focused change.
6. Move agent-specific components into `components/agents/` after confirming the `/agents` route still behaves correctly.
7. Add map-related components to `components/maps/` only when the map feature is introduced.
8. Add migration helper scripts to `scripts/migrations/` only after the Prisma schema strategy is agreed.

## Files That Must Not Be Touched Yet

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `.env`
- Auth logic files
- API business logic files
- Existing working route files
- Existing imports

## Known Build Blockers From Antigravity

1. `lib/prisma.ts` currently has a Prisma client export mismatch: code imports a named `prisma` export, while the file exports a default client.
2. Prisma schema and application code are mismatched: API, seed, and formatter code expect fields and relations that are not present in the current schema.
3. The `User` model is missing `passwordHash`, while auth and seed code expect it.

## Current Scope

This phase only creates the professional folder structure and records the migration plan. It intentionally avoids Prisma, database, auth, API, import, route, and component movement changes.
