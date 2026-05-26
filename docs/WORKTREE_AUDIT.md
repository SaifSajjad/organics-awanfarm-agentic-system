# Worktree Audit

## Scope

This audit records the current modified and untracked files before continuing Phase 3C. No files were reverted, staged, committed, moved, deleted, or otherwise changed except for creating this audit document.

## Commands Run

### `git status --short`

```text
 M .env.example
 M app/agents/page.tsx
 M app/api/agents/route.ts
 M app/api/customers/route.ts
 M app/api/deliveries/[id]/route.ts
 M app/api/deliveries/route.ts
 M app/api/expenses/route.ts
 M app/api/orders/[id]/route.ts
 M app/api/orders/route.ts
 M app/api/payments/route.ts
 M app/api/subscriptions/route.ts
 M app/dashboard/admin/page.tsx
 M app/dashboard/customer/page.tsx
 M app/dashboard/rider/page.tsx
 M app/layout.tsx
 M app/operations/page.tsx
 M components/app-header.tsx
 M lib/prisma.ts
 M prisma/schema.prisma
 M prisma/seed.ts
?? app/api/auth/
?? app/auth/
?? components/agents/
?? components/layout/
?? components/maps/
?? components/ui/
?? countRows.js
?? countRows.sql
?? countRows.ts
?? countRows2.js
?? docs/API_REWRITE_MAP.md
?? docs/OPTION_B_IMPLEMENTATION_SEQUENCE.md
?? docs/OPTION_B_SCHEMA_ARCHITECTURE.md
?? docs/PRISMA_COMPATIBILITY_AUDIT.md
?? docs/STRUCTURE_PLAN.md
?? docs/VISUAL_DESIGN_CONCEPT.md
?? lib/api-guard.ts
?? lib/auth-provider.tsx
?? lib/auth.ts
?? lib/password.ts
?? lib/route-guard.ts
?? middleware.ts
?? prisma/schema.option-b.draft.prisma
?? scripts/
?? styles/
?? tests/
```

### `git diff --name-status`

```text
M	.env.example
M	app/agents/page.tsx
M	app/api/agents/route.ts
M	app/api/customers/route.ts
M	app/api/deliveries/[id]/route.ts
M	app/api/deliveries/route.ts
M	app/api/expenses/route.ts
M	app/api/orders/[id]/route.ts
M	app/api/orders/route.ts
M	app/api/payments/route.ts
M	app/api/subscriptions/route.ts
M	app/dashboard/admin/page.tsx
M	app/dashboard/customer/page.tsx
M	app/dashboard/rider/page.tsx
M	app/layout.tsx
M	app/operations/page.tsx
M	components/app-header.tsx
M	lib/prisma.ts
M	prisma/schema.prisma
M	prisma/seed.ts
```

### `git diff --stat`

```text
 .env.example                     |  26 +++++-
 app/agents/page.tsx              |   5 +-
 app/api/agents/route.ts          |   4 +
 app/api/customers/route.ts       |   7 ++
 app/api/deliveries/[id]/route.ts |   4 +
 app/api/deliveries/route.ts      |   7 ++
 app/api/expenses/route.ts        |   7 ++
 app/api/orders/[id]/route.ts     |   4 +
 app/api/orders/route.ts          |   7 ++
 app/api/payments/route.ts        |   7 ++
 app/api/subscriptions/route.ts   |   7 ++
 app/dashboard/admin/page.tsx     |   5 +-
 app/dashboard/customer/page.tsx  |   5 +-
 app/dashboard/rider/page.tsx     |   5 +-
 app/layout.tsx                   |   5 +-
 app/operations/page.tsx          |   5 +-
 components/app-header.tsx        |  75 +++++++++++++--
 lib/prisma.ts                    |  22 +++--
 prisma/schema.prisma             | 193 +++++++++++++++------------------------
 prisma/seed.ts                   |  46 ++++++++++
 20 files changed, 299 insertions(+), 147 deletions(-)
```

Git also reported line-ending warnings for tracked modified files: `LF will be replaced by CRLF the next time Git touches it`.

## Expected Safe Docs And Design Changes

These files match approved documentation-only or draft-only phases and should be kept unless their contents need editorial cleanup:

- `docs/STRUCTURE_PLAN.md`
- `docs/PRISMA_COMPATIBILITY_AUDIT.md`
- `docs/OPTION_B_SCHEMA_ARCHITECTURE.md`
- `docs/API_REWRITE_MAP.md`
- `docs/OPTION_B_IMPLEMENTATION_SEQUENCE.md`
- `docs/VISUAL_DESIGN_CONCEPT.md`
- `prisma/schema.option-b.draft.prisma`

Notes:

- `prisma/schema.option-b.draft.prisma` is safe because it is a draft file only and is not the active Prisma schema.
- This file, `docs/WORKTREE_AUDIT.md`, is also an approved documentation-only change from this phase.

## Structure Setup Changes

These files match the approved structure setup phase:

- `components/agents/.gitkeep`
- `components/layout/.gitkeep`
- `components/maps/.gitkeep`
- `components/ui/.gitkeep`
- `styles/.gitkeep`
- `tests/e2e/.gitkeep`
- `tests/unit/.gitkeep`
- `scripts/migrations/.gitkeep`

Recommendation: keep.

## Prisma And Schema Related Changes

### `prisma/schema.prisma`

- Risk: very high.
- Why risky: this is the active schema. The diff shows the fuller operational schema was reduced into a partial user/subscription/delivery-log schema plus placeholder legacy models. It removes or changes fields and models that API routes and seed code expect, including `Delivery`, `OrderItem`, rich `Customer`, rich `Order`, rich `Payment`, and `AiConversation`.
- Approved phase: not approved in the recent controlled phases. Later phases explicitly said not to modify this file.
- Recommendation: review carefully and likely replace only through the approved Option B active-schema phase. Do not keep blindly.

### `prisma/seed.ts`

- Risk: high.
- Why risky: seed now imports `hashPassword` and creates demo users with lowercase roles and `passwordHash`, but the current active schema does not support `passwordHash` and uses uppercase enum roles. It also still expects operational models/fields that the active schema no longer provides.
- Approved phase: not approved in the recent controlled phases.
- Recommendation: review and rewrite later only after the active schema strategy is approved. Do not run seed in the current state.

### `lib/prisma.ts`

- Risk: medium.
- Why risky: Prisma client singleton/export behavior affects all API/auth database access. The named export was approved, but the full diff includes a pre-existing singleton rewrite compared with `HEAD`.
- Approved phase: partially approved. Adding `export const prisma = client` was approved in Phase 1. Earlier surrounding changes should be reviewed.
- Recommendation: keep the named export compatibility fix, but review whether to preserve or restore the previous logging/global singleton style.

### `prisma/schema.option-b.draft.prisma`

- Risk: low.
- Why risky: low because it is not active and validation passed previously.
- Approved phase: approved Phase 3B.
- Recommendation: keep.

## API And Auth Related Changes

### `app/api/agents/route.ts`

- Risk: high.
- Why risky: adds `authorizeApi(["admin"])`. This depends on untracked auth files and may lock the agent route behind auth before auth/schema/seed are stable.
- Approved phase: not approved in the recent controlled phases.
- Recommendation: review with the auth implementation. Keep only if the full auth chain is intentionally adopted.

### `app/api/customers/route.ts`

- Risk: high.
- Why risky: adds auth guarding to customer CRUD while the Prisma schema and auth are currently mismatched. This can break demo/customer creation flows.
- Approved phase: not approved.
- Recommendation: review after schema/auth decisions.

### `app/api/deliveries/route.ts`

- Risk: high.
- Why risky: adds admin/rider guards to delivery listing and admin guard to generation. Delivery generation is already one of the highest-risk Option B rewrite areas.
- Approved phase: not approved.
- Recommendation: review later with rider/admin scoping.

### `app/api/deliveries/[id]/route.ts`

- Risk: high.
- Why risky: adds admin/rider guard to delivery status updates but does not enforce rider ownership. Auth depends on unstable session shape.
- Approved phase: not approved.
- Recommendation: review and replace with profile-aware authorization later.

### `app/api/orders/route.ts`

- Risk: high.
- Why risky: adds admin guard to order list/create. This changes API accessibility and depends on auth being usable.
- Approved phase: not approved.
- Recommendation: review during order API rewrite.

### `app/api/orders/[id]/route.ts`

- Risk: high.
- Why risky: adds admin guard to order updates. Payment/delivery status logic is still schema-mismatched and will need Option B rewrite.
- Approved phase: not approved.
- Recommendation: review during order/payment rewrite.

### `app/api/payments/route.ts`

- Risk: high.
- Why risky: adds admin guard to payments. The payment route also currently marks orders paid without full partial-payment reconciliation.
- Approved phase: not approved.
- Recommendation: review during payment rewrite.

### `app/api/expenses/route.ts`

- Risk: medium.
- Why risky: adds admin guard to the smallest API route. Less complex than orders/deliveries, but still depends on auth stability.
- Approved phase: not approved.
- Recommendation: review first if adopting auth route-by-route.

### `app/api/subscriptions/route.ts`

- Risk: high.
- Why risky: adds admin guard while the subscription model shape is changing under Option B.
- Approved phase: not approved.
- Recommendation: review during subscription rewrite.

### `app/api/auth/[...nextauth]/route.ts`

- Risk: medium.
- Why risky: new NextAuth route delegates to untracked `lib/auth.ts`. It is required for the auth feature, but the current active schema does not support its selected fields.
- Approved phase: not approved in recent controlled phases.
- Recommendation: review and keep only with a coherent auth/schema/seed plan.

### `app/auth/signin/page.tsx`

- Risk: medium.
- Why risky: new login UI exposes demo credentials and depends on NextAuth/session behavior. It also introduces visible demo passwords.
- Approved phase: not approved.
- Recommendation: review. Keep for local demo only if demo credential policy is accepted.

### `app/auth/error/page.tsx`

- Risk: low to medium.
- Why risky: depends on auth route structure but is otherwise isolated.
- Approved phase: not approved.
- Recommendation: review with auth pages.

### `lib/auth.ts`

- Risk: high.
- Why risky: selects `passwordHash` from `User`, but active schema lacks `passwordHash`. It normalizes only admin/rider/customer and lacks Option B `staff` and profile IDs.
- Approved phase: not approved.
- Recommendation: review and rewrite during approved auth phase.

### `lib/api-guard.ts`

- Risk: high.
- Why risky: all guarded API routes depend on this. It supports only admin/rider/customer and does not support staff or ownership scoping.
- Approved phase: not approved.
- Recommendation: review during auth/guard rewrite.

### `lib/route-guard.ts`

- Risk: high.
- Why risky: dashboard pages now depend on it. It supports only admin/rider/customer and lacks profile scoping.
- Approved phase: not approved.
- Recommendation: review during auth/guard rewrite.

### `lib/auth-provider.tsx`

- Risk: medium.
- Why risky: wraps the app in `SessionProvider`, enabling client session use. Safe by itself but depends on auth route stability.
- Approved phase: not approved.
- Recommendation: keep only if auth feature is adopted.

### `lib/password.ts`

- Risk: medium.
- Why risky: implements credential hashing and verification. It is useful, but seed/auth rely on schema fields that are not active.
- Approved phase: not approved.
- Recommendation: review; likely keep for credentials auth after schema supports `passwordHash`.

### `middleware.ts`

- Risk: high.
- Why risky: introduces a separate JWT/Bearer-token protection path using `jose`, while the app also uses NextAuth session guards. It checks uppercase roles and different route prefixes, so it may conflict with NextAuth behavior and current lowercase session roles.
- Approved phase: not approved.
- Recommendation: review carefully. Likely replace or remove later in favor of one auth strategy.

## Dashboard, Layout, And Component Changes

### `app/agents/page.tsx`

- Risk: medium.
- Why risky: converts route to server component with admin guard. Depends on `lib/route-guard.ts` and auth stability.
- Approved phase: not approved.
- Recommendation: review with auth routing.

### `app/dashboard/admin/page.tsx`

- Risk: medium.
- Why risky: adds admin guard and can block dashboard demo if auth/seed/schema are not aligned.
- Approved phase: not approved.
- Recommendation: review with auth routing.

### `app/dashboard/customer/page.tsx`

- Risk: medium.
- Why risky: adds customer/admin guard. Current page is static, but auth dependency can break access before customer profile/session design is ready.
- Approved phase: not approved.
- Recommendation: review with auth routing.

### `app/dashboard/rider/page.tsx`

- Risk: medium.
- Why risky: adds rider/admin guard. Later Option B needs `riderProfileId`.
- Approved phase: not approved.
- Recommendation: review with auth routing.

### `app/layout.tsx`

- Risk: medium.
- Why risky: wraps the entire app in `AuthProvider`. This changes app-wide client/provider behavior and depends on untracked NextAuth setup.
- Approved phase: not approved.
- Recommendation: review with auth adoption.

### `app/operations/page.tsx`

- Risk: medium.
- Why risky: adds admin guard. Can block operations demo if auth is not seeded/working.
- Approved phase: not approved.
- Recommendation: review with auth routing.

### `components/app-header.tsx`

- Risk: medium to high.
- Why risky: converts header to client component, adds session-based navigation filtering and sign-out UI. It changes app-wide rendering behavior and depends on `SessionProvider`.
- Approved phase: not approved.
- Recommendation: review with auth UI. Keep if NextAuth path is adopted, but update for Option B `staff`.

## Environment And Configuration

### `.env.example`

- Risk: medium.
- Why risky: changes documented env names from `AUTH_SECRET` to `NEXTAUTH_SECRET` and adds `NEXT_PUBLIC_JWT_SECRET` and speech key examples. This may drift from actual code, which currently references `AUTH_SECRET` in middleware and NextAuth may expect compatible secret configuration.
- Approved phase: not approved.
- Recommendation: review and align with the final auth strategy. Keep only one clear set of env variables.

## Risky Unexpected Utility Files

### `countRows.js`

- Risk: medium.
- Why risky: ad hoc database utility file at repo root. Unknown target database and purpose.
- Approved phase: not approved.
- Recommendation: review and likely remove or move into a controlled scripts folder later.

### `countRows.sql`

- Risk: medium.
- Why risky: ad hoc SQL at repo root. Could expose assumptions about database tables or be run accidentally.
- Approved phase: not approved.
- Recommendation: review and likely remove or archive later.

### `countRows.ts`

- Risk: medium.
- Why risky: ad hoc TypeScript database utility at repo root.
- Approved phase: not approved.
- Recommendation: review and likely remove or move later.

### `countRows2.js`

- Risk: medium.
- Why risky: duplicate or exploratory row-count utility at repo root.
- Approved phase: not approved.
- Recommendation: review and likely remove or consolidate later.

### `scripts/smoke-test.mjs`

- Risk: low to medium.
- Why risky: untracked script. It may be useful, but it points to a deployed URL and is outside the requested structure setup except for the `scripts/migrations/.gitkeep` folder.
- Approved phase: not part of approved structure setup.
- Recommendation: review. Keep if remote smoke testing is intended, otherwise document or remove later.

## Untracked Files

Expected docs/design:

- `docs/API_REWRITE_MAP.md`
- `docs/OPTION_B_IMPLEMENTATION_SEQUENCE.md`
- `docs/OPTION_B_SCHEMA_ARCHITECTURE.md`
- `docs/PRISMA_COMPATIBILITY_AUDIT.md`
- `docs/STRUCTURE_PLAN.md`
- `docs/VISUAL_DESIGN_CONCEPT.md`
- `docs/WORKTREE_AUDIT.md`

Expected structure:

- `components/agents/.gitkeep`
- `components/layout/.gitkeep`
- `components/maps/.gitkeep`
- `components/ui/.gitkeep`
- `scripts/migrations/.gitkeep`
- `styles/.gitkeep`
- `tests/e2e/.gitkeep`
- `tests/unit/.gitkeep`

Expected draft schema:

- `prisma/schema.option-b.draft.prisma`

Auth/API related, needs review:

- `app/api/auth/[...nextauth]/route.ts`
- `app/auth/error/page.tsx`
- `app/auth/signin/page.tsx`
- `lib/api-guard.ts`
- `lib/auth-provider.tsx`
- `lib/auth.ts`
- `lib/password.ts`
- `lib/route-guard.ts`
- `middleware.ts`

Unexpected utilities, needs review:

- `countRows.js`
- `countRows.sql`
- `countRows.ts`
- `countRows2.js`
- `scripts/smoke-test.mjs`

## Recommended Cleanup And Checkpoint Plan

1. Stop schema/API implementation until this dirty tree is sorted.
   - Reason: active schema, seed, auth, API guards, and dashboards are all modified at once.

2. Keep a documentation/structure checkpoint separate.
   - Include docs/design files, `.gitkeep` structure files, and the draft Option B schema.
   - Do not mix these with active schema/auth/API rewrites.

3. Decide the fate of active schema and seed changes before Phase 3C implementation.
   - Preferred path: do not patch the current active schema further. Replace it only through the approved Option B schema implementation phase.

4. Review auth as a separate checkpoint.
   - Decide whether to keep NextAuth route/pages/guards/provider/header changes.
   - Decide whether to remove `middleware.ts` or consolidate it into the same auth strategy.
   - Update for Option B `STAFF`, `customerProfileId`, and `riderProfileId` only in the auth phase.

5. Review API route guard additions separately.
   - They are not schema-compatible enough to rely on yet.
   - Do not continue route rewrites until the active schema and auth strategy are settled.

6. Review root `countRows*` files.
   - They look like temporary database utilities.
   - Either document and move them into a scripts folder later or remove them after approval.

7. After cleanup decisions, create clean phases:
   - Docs/structure checkpoint.
   - Active schema replacement checkpoint.
   - Auth/session checkpoint.
   - API rewrite checkpoint.
   - Seed rewrite checkpoint.
   - Migration checkpoint only after backup and explicit approval.
