# Option B Implementation Sequence

## Scope

This document defines the safe sequence for applying the Option B Prisma architecture. It is documentation only.

No code, active schema, seed, API route, auth file, dashboard file, component, database, migration, package file, stash, commit, or push was changed while creating this document.

## Current Clean Checkpoint State

- Current branch: `option-b-schema-refactor-safe`
- Active schema remains `prisma/schema.prisma`.
- Option B schema exists only as `prisma/schema.option-b.draft.prisma`.
- `lib/auth.ts` is not present in the current clean worktree.
- `app/api/auth/[...nextauth]/route.ts` is not present in the current clean worktree.
- Risky pre-existing auth/API/schema work remains in `stash@{0}` and should not be restored wholesale.

## What Will Break If Active Schema Is Replaced Now

Replacing `prisma/schema.prisma` with the Option B draft and regenerating Prisma Client will immediately break current code until rewrites are completed.

### Prisma Model Name Breaks

Current code uses:

- `prisma.customer`
- `prisma.rider`
- `prisma.subscription`
- `prisma.order`
- `prisma.orderItem`
- `prisma.delivery`
- `prisma.payment`
- `prisma.expense`
- `prisma.aiConversation`

Option B changes the customer and rider identity model names:

- `Customer` becomes `CustomerProfile`
- `Rider` becomes `RiderProfile`

Expected breakpoints:

- `app/api/customers/route.ts` will fail because `prisma.customer` no longer exists.
- `app/api/orders/route.ts` will fail because it queries `prisma.customer`.
- `lib/db-formatters.ts` will not match returned relation shapes because `customer.name`, `customer.area`, and `customer.address` no longer exist in the same place.
- Any future auth work must query `User.customerProfile` and `User.riderProfile`, not old `customer` or `rider` relations.

### Field Shape Breaks

Option B adds required fields that current create calls do not provide:

- `Order.subtotal`
- `Delivery.scheduledAt`
- `Subscription.addressId`
- `Subscription.startDate`
- `Product.price` becomes `Decimal`
- `Order.totalAmount` becomes `Decimal`
- `Payment.amount` becomes `Decimal`
- `Expense.amount` becomes `Decimal`

Expected breakpoints:

- `app/api/orders/route.ts` creates `Order` without `subtotal`.
- `app/api/deliveries/route.ts` creates `Order` without `subtotal` and creates `Delivery` without `scheduledAt`.
- `app/api/subscriptions/route.ts` creates `Subscription` without `addressId` or `startDate`.
- Current formatter and UI code assume number values, not Decimal objects or serialized Decimal strings.

### Relation Breaks

Current code expects:

- Customer `area` and `address` fields directly on `Customer`.
- `subscription.customer.area`.
- `order.customer.name` and `order.customer.area`.

Option B expects:

- Address data in `Address`.
- Subscription linked to `Address`.
- Delivery linked to `Address`.
- Order optionally linked to `Address`.
- Customer display name in `CustomerProfile.displayName`.

Expected breakpoints:

- Delivery generation cannot use `subscription.customer.area`.
- Customer API cannot create direct `area` and `address` fields on customer.
- Dashboard payloads must pull location data from address relations.

### Auth Breaks

Current clean worktree has no active auth implementation. Option B requires:

- `User.passwordHash`
- `User.active`
- `Role` enum with `ADMIN`, `CUSTOMER`, `RIDER`, `STAFF`
- Session profile IDs for customer/rider scoping

Expected breakpoints if auth is added prematurely:

- Route guards will need to be created or rewritten.
- Session shape must include `customerProfileId` and `riderProfileId`.
- Any lower-case role strings must be normalized from Prisma uppercase enum values.
- The stashed auth implementation is incomplete for Option B and should not be restored as-is.

### Seed Breaks

Current `prisma/seed.ts` targets the current operational schema:

- `Customer`
- direct customer `area` and `address`
- `Product.price Int`
- `Subscription.type`
- `Subscription.days`
- `Order.totalAmount Int`
- `Delivery.area`

Option B seed must use:

- `CustomerProfile`
- `Address`
- `ProductType`
- `Decimal` money and quantities
- `SubscriptionFrequency`
- `SubscriptionSchedule`
- `Route`
- `Delivery.scheduledAt`
- `AiConversation`
- `AiAgentAction`

## Files That Must Be Rewritten After Schema Replacement

### Required For Build Compatibility

- `prisma/schema.prisma`
- `lib/db-formatters.ts`
- `app/api/customers/route.ts`
- `app/api/subscriptions/route.ts`
- `app/api/orders/route.ts`
- `app/api/orders/[id]/route.ts`
- `app/api/deliveries/route.ts`
- `app/api/deliveries/[id]/route.ts`
- `app/api/payments/route.ts`
- `app/api/expenses/route.ts`
- `app/api/agents/route.ts`
- `prisma/seed.ts`

### Required For Auth And Role Scoping

These do not currently exist in the clean worktree, so they should be introduced deliberately:

- `lib/auth.ts`
- `lib/api-guard.ts`
- `lib/route-guard.ts`
- `lib/password.ts`
- `lib/auth-provider.tsx`
- `app/api/auth/[...nextauth]/route.ts`
- `app/auth/signin/page.tsx`
- `app/auth/error/page.tsx`

Potentially update:

- `app/layout.tsx`
- `components/app-header.tsx`
- `app/dashboard/admin/page.tsx`
- `app/dashboard/customer/page.tsx`
- `app/dashboard/rider/page.tsx`
- `app/operations/page.tsx`
- `app/agents/page.tsx`

### Required For Dashboard Data Mapping

- `components/admin-dashboard-client.tsx`
- `components/operations-client.tsx`
- `components/rider-dashboard-client.tsx`
- `components/agents-client.tsx`
- `app/dashboard/customer/page.tsx`

These should be updated after API payloads stabilize.

## Exact Safe Order To Apply Option B

### Phase 3D: Prepare Seed Rewrite Draft

Risk level: medium.

Goal:

- Draft the new seed flow in documentation or a non-active draft file.
- Do not replace `prisma/seed.ts` yet.
- Do not run seed.

Plan:

1. Define deterministic seed IDs where helpful.
2. Draft seed order:
   - Delete dependent records from child to parent.
   - Create users.
   - Create customer/rider profiles.
   - Create addresses.
   - Create products.
   - Create subscriptions.
   - Create optional schedules.
   - Create orders and order items.
   - Create routes and deliveries.
   - Create payments.
   - Create expenses.
   - Create complaints.
   - Create inventory logs and milk production.
   - Create AI conversations/actions.
3. Decide demo credentials policy before adding visible passwords.

Why first:

- Seed shape proves whether the schema can create a full end-to-end demo.
- Drafting it before active schema replacement catches relation gaps.

### Phase 3E: Prepare Auth And Session Rewrite Plan

Risk level: medium to high.

Goal:

- Choose the final auth strategy before any guarded routes are restored or added.

Plan:

1. Use one auth system: NextAuth credentials.
2. Do not use a separate custom JWT middleware unless explicitly required later.
3. Define session user shape:

```ts
{
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer" | "rider" | "staff";
  customerProfileId?: string;
  riderProfileId?: string;
}
```

4. Normalize Prisma enum roles:
   - `ADMIN` -> `admin`
   - `CUSTOMER` -> `customer`
   - `RIDER` -> `rider`
   - `STAFF` -> `staff`
5. Require `User.active === true`.
6. Select profile IDs in auth.
7. Create owner-aware guards:
   - Admin/staff can access management data.
   - Customer can access only own `customerProfileId`.
   - Rider can access only own `riderProfileId`.

Why before API rewrites:

- API route scoping depends on session shape.
- Restoring old stashed guards would miss `staff` and profile ownership.

### Phase 3F: Prepare API Rewrite Route By Route

Risk level: high.

Goal:

- Define request/response shapes before active schema replacement.
- Do not modify active routes yet unless the phase explicitly approves route rewrites.

Recommended route rewrite order:

1. `app/api/expenses/route.ts`
   - Risk: medium.
   - Reason: smallest model surface.
   - Rewrite for `ExpenseType`, `Decimal`, `spentAt`, optional `createdById`.

2. `app/api/customers/route.ts`
   - Risk: high.
   - Rewrite `Customer` to `CustomerProfile`.
   - Create default `Address`.
   - Return default address and subscriptions.

3. `app/api/subscriptions/route.ts`
   - Risk: high.
   - Rewrite `type` to `frequency`.
   - Replace `days` with `SubscriptionSchedule`.
   - Require `addressId` and `startDate`.

4. `app/api/orders/route.ts`
   - Risk: high.
   - Use `CustomerProfile`, `Address`, `Order`, `OrderItem`.
   - Add `subtotal`, `discount`, `totalAmount`.
   - Use Decimal-safe calculations.

5. `app/api/payments/route.ts`
   - Risk: high.
   - Create payment in transaction.
   - Recalculate `Order.paymentStatus` as `UNPAID`, `PARTIAL`, or `PAID`.

6. `app/api/orders/[id]/route.ts`
   - Risk: high.
   - Avoid blindly marking paid.
   - Update order fields with clear ownership and state rules.

7. `app/api/deliveries/route.ts`
   - Risk: very high.
   - Generate deliveries from active subscriptions and schedules.
   - Create `Order`, `OrderItem`, `Delivery`, and optionally `Route` in transactions.
   - Require `scheduledAt`.

8. `app/api/deliveries/[id]/route.ts`
   - Risk: high.
   - Update delivery status.
   - Set `outForDeliveryAt`, `deliveredAt`, and missed reason fields.
   - Enforce rider ownership.

9. `app/api/agents/route.ts`
   - Risk: high.
   - Rewrite after operational payloads stabilize.
   - Load Option B context data.
   - Persist `AiConversation` and `AiAgentAction`.

Why this order:

- It starts with the smallest route and builds shared payload patterns before the delivery generator, which is the hardest workflow.

### Phase 3G: Replace Active Schema After Approval

Risk level: high.

Goal:

- Replace `prisma/schema.prisma` with the approved Option B schema.
- Do not run migrations.
- Do not run `prisma db push`.
- Do not touch the database.

Plan:

1. Confirm `prisma/schema.option-b.draft.prisma` is final.
2. Replace active schema in one focused change.
3. Run only:
   - `npx prisma validate`
4. If validation fails, fix schema only.
5. Do not edit seed/API/auth in the same commit unless explicitly approved.

Expected result:

- Active schema validates but app build may still fail because Prisma Client and routes have not been updated yet.

### Phase 3H: Update Seed, Auth, And API

Risk level: very high.

Goal:

- Bring application code into compatibility with Option B.

Recommended sub-order:

1. Regenerate Prisma Client for local type work:
   - `npx prisma generate`
   - This does not touch database state.

2. Update shared formatters:
   - Rewrite `lib/db-formatters.ts`.
   - Add Decimal serialization helpers.
   - Map `CustomerProfile.displayName` and `Address.area`.

3. Add auth foundations:
   - `lib/password.ts`
   - `lib/auth.ts`
   - `lib/api-guard.ts`
   - `lib/route-guard.ts`
   - NextAuth route/pages/provider only after auth design is approved.

4. Rewrite APIs in Phase 3F order.

5. Rewrite seed:
   - Use uppercase enum values.
   - Use `CustomerProfile`, `RiderProfile`, `Address`.
   - Use `Decimal` compatible values.
   - Create schedules, route, deliveries, payments, expenses, complaints, inventory, milk production, and AI demo data.

6. Update dashboards:
   - Admin dashboard consumes new customer/order/delivery/payment payloads.
   - Customer dashboard uses `customerProfileId`.
   - Rider dashboard uses `riderProfileId`.

Important:

- Do not run seed until database migration is approved and completed in a disposable/dev database.

### Phase 3I: Run Prisma Generate And Build

Risk level: medium to high.

Goal:

- Prove source code compiles against the Option B schema before touching any real database.

Verification order:

1. `npx prisma validate`
2. `npx prisma generate`
3. `npm run lint`
4. `npm run build`

Expected build issue categories:

- Prisma relation/query mismatches.
- Decimal type serialization.
- Missing auth/session fields.
- Dashboard payload mismatches.
- Route handler type mismatches.

Build must pass before any database migration phase.

### Phase 3J: Database Migration Only After Backup And Explicit Approval

Risk level: very high.

Goal:

- Apply schema to database only after code compatibility and backup readiness.

Required gate:

1. Confirm target database.
2. Confirm current backup exists.
3. Confirm restore procedure.
4. Prefer disposable local/dev database first.
5. Get explicit approval.

Allowed only after approval:

- `prisma migrate dev` for disposable/dev database.
- `prisma migrate deploy` only for reviewed deployment environments.

Still avoid:

- Blind `prisma db push` against a real shared database.
- Any destructive reset unless the user explicitly approves a disposable database reset.

## Seed Rewrite Plan

Target seed should create:

- Admin user:
  - `Role.ADMIN`
  - `passwordHash`
  - active true
- Staff user:
  - `Role.STAFF`
  - optional, useful for staff-scoped route testing
- Rider user and `RiderProfile`
- Customer user and `CustomerProfile`
- Additional phone-only `CustomerProfile` records if needed
- Addresses:
  - Model Town
  - Bahria
  - Johar Town
- Products:
  - Cow Milk, `COW_MILK`, 330/liter
  - Buffalo Milk, `BUFFALO_MILK`, 430/liter
  - Rice, `RICE`
  - Wheat, `WHEAT`
- Subscriptions:
  - Daily cow milk
  - Daily buffalo milk
  - Optional custom-days example
- Subscription schedules:
  - Only for `CUSTOM_DAYS` or one-off examples
- Orders:
  - Pending
  - Out for delivery
  - Delivered
- Order items:
  - Quantity, rate, total as Decimal-compatible values
- Route:
  - Today's route assigned to rider
- Deliveries:
  - Pending
  - Out for delivery
  - Delivered
- Payments:
  - Paid example
  - Partial example
  - Unpaid order with no payment
- Expenses:
  - Fuel
  - Packaging
  - Rider
  - Farm ops
- Complaint:
  - Open missed-delivery issue
- Inventory logs:
  - Milk stock in/out
  - Packaging usage
- Milk production:
  - Cow and buffalo milk daily production
- AI:
  - Customer support conversation
  - Finance action suggestion

Seed must be idempotent enough for development but should not be run against production data.

## Auth And Session Rewrite Plan

Current clean worktree has no auth implementation. Do not restore the old stashed auth files as-is.

Create auth cleanly around Option B:

1. Add password hashing utility.
2. Add NextAuth credentials config.
3. Select `User` with:
   - `id`
   - `email`
   - `name`
   - `role`
   - `passwordHash`
   - `active`
   - `customerProfile.id`
   - `riderProfile.id`
4. Verify password hash.
5. Reject inactive users.
6. Normalize role into session.
7. Add profile IDs to JWT/session callbacks.
8. Add guards:
   - `requireRole`
   - `authorizeApi`
   - ownership helpers for customer and rider scoped data
9. Add UI/session provider only after server auth compiles.
10. Avoid custom middleware until NextAuth route guards are stable.

## Dashboard Data Mapping Plan

### Admin Dashboard

Needs API payloads for:

- Customer name: `CustomerProfile.displayName`
- Customer phone: `CustomerProfile.phone`
- Area/address: default `Address.area`, `Address.line1`
- Subscription: `Subscription.quantity`, `rate`, `frequency`, `status`
- Orders: `Order.totalAmount`, `paymentStatus`, `status`
- Deliveries: `Delivery.status`, `scheduledAt`, `route`, `rider`
- Finance: `Payment`, `Expense`, derived pending amount

### Customer Dashboard

Needs:

- Session `customerProfileId`
- Active subscriptions for that customer
- Default address
- Recent orders
- Payment summary
- Complaint actions
- Pause/resume/extra milk actions

### Rider Dashboard

Needs:

- Session `riderProfileId`
- Today's assigned `Route`
- Assigned `Delivery` records
- Customer display name, phone, and address
- Delivery status update action
- Missed delivery reason capture

### Decimal Mapping

Before data reaches client components, decide one standard:

- Convert Decimal to number for UI-only values when safe.
- Or serialize Decimal to string and format in UI helpers.

Do not mix both randomly across routes.

## AI Agents Database Integration Order

Do AI persistence after operational routes are stable.

1. Keep deterministic agent fallback working.
2. Rewrite agent context queries for Option B:
   - Deliveries with order, customer profile, address, route, rider, items, product
   - Orders with items, payments, customer profile
   - Expenses by type/date
   - Inventory and milk production later
3. Create `AiConversation` record for every prompt/response.
4. Create `AiAgentAction` for suggested actions.
5. Keep actions as audit records first, not automatic database mutations.
6. Add approval workflow before any AI action mutates business records.

Risk level: high, because AI context touches many tables and should not mutate core operations without review.

## Build Verification Steps

Use this order after active schema and code rewrites:

1. `npx prisma validate`
2. `npx prisma generate`
3. `npm run lint`
4. `npm run build`

Do not run build before active schema/code compatibility work unless the purpose is explicitly to expose expected failures.

Do not use build success as permission to migrate. Build only proves source compatibility.

## Migration Safety Steps

Before any migration:

1. Confirm target database.
2. Confirm no production data is at risk.
3. Create backup.
4. Verify restore path.
5. Prefer disposable local/dev database first.
6. Review generated migration SQL.
7. Get explicit approval.

Recommended first migration target:

- Disposable development database, not the current live/shared database.

Avoid:

- `prisma db push` against real database.
- `prisma migrate dev` against production-like database.
- Destructive reset/drop commands without explicit disposable database approval.

## Rollback Plan

### Before Migration

Rollback is Git-only:

1. Revert active schema replacement commit.
2. Revert API/auth/seed/dashboard rewrite commits in reverse order.
3. Run `npx prisma generate` against the restored schema.
4. Run lint/build checks if needed.

### After Development Migration

Only acceptable for disposable/dev database:

1. Revert code commits.
2. Reset disposable database if approved.
3. Reapply previous schema.
4. Regenerate Prisma Client.
5. Reseed only the disposable database.

### After Production Migration

Only after approval and backup:

1. Stop writes if possible.
2. Restore from backup or apply reviewed rollback migration.
3. Revert app deployment to matching schema version.
4. Verify auth, orders, deliveries, and payments.

## Phase Risk Table

| Phase | Description | Risk |
| --- | --- | --- |
| 3D | Prepare seed rewrite draft | Medium |
| 3E | Prepare auth/session rewrite plan | Medium to high |
| 3F | Prepare API rewrite route-by-route | High |
| 3G | Replace active schema after approval | High |
| 3H | Update seed/auth/API/dashboard code | Very high |
| 3I | Prisma generate and build verification | Medium to high |
| 3J | Database migration after backup/approval | Very high |

## Highest Risk Step

Phase 3H is the highest code risk because seed, auth, API routes, formatters, and dashboards must all align with the new schema. Phase 3J is the highest data risk because it changes database state.

## Safest Next Implementation Step

Proceed with Phase 3D as a draft-only step: create a non-active seed rewrite plan or draft seed file for Option B. Do not replace active schema, do not restore stashed auth work, and do not run migrations or database commands.
