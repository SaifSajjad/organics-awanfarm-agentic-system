# Option B Schema Architecture

## Purpose

This document proposes a clean production-ready Prisma schema direction for:

```text
Organics by Awan Farms - Agentic AI Dairy Farm Management System
```

This is a planning document only. It does not replace `prisma/schema.prisma`, does not change seed logic, and does not run any database command.

## Why Option B

The current active schema contains a mix of partial user/subscription/delivery-log models and placeholder operational models. The API and seed code expect a more complete customer/order/delivery/payment schema. Option B avoids blindly patching placeholders and instead defines a coherent domain model before any schema or API rewrite.

## Design Principles

- Use `User` for authentication and authorization.
- Keep business identity in profile tables: `CustomerProfile` and `RiderProfile`.
- Keep addresses separate so customers can have multiple delivery locations later.
- Model recurring demand with `Subscription` and `SubscriptionSchedule`.
- Model actual business transactions with `Order`, `OrderItem`, `Delivery`, and `Payment`.
- Keep route planning separate from delivery status using `Route`.
- Keep farm operations visible through `InventoryLog`, `MilkProduction`, and `Expense`.
- Store agent interactions separately from business records with `AiConversation` and `AiAgentAction`.
- Prefer explicit enums for operational states.
- Add `createdAt` and `updatedAt` to core mutable models.
- Avoid running migrations until the schema has been reviewed and approved.

## Proposed Enums

```prisma
enum Role {
  ADMIN
  CUSTOMER
  RIDER
  STAFF
}

enum ProductType {
  COW_MILK
  BUFFALO_MILK
  BLEND
  RICE
  WHEAT
}

enum SubscriptionStatus {
  ACTIVE
  PAUSED
  CANCELLED
}

enum SubscriptionFrequency {
  DAILY
  WEEKLY
  CUSTOM_DAYS
  ONE_TIME
}

enum DeliveryStatus {
  PENDING
  OUT_FOR_DELIVERY
  DELIVERED
  MISSED
  CANCELLED
}

enum PaymentStatus {
  UNPAID
  PARTIAL
  PAID
}

enum ExpenseType {
  FUEL
  RIDER
  PACKAGING
  MILK_PURCHASE
  FARM_OPS
  MISC
}

enum ComplaintStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum AiAgentRole {
  CUSTOMER_SUPPORT
  RIDER_ASSISTANT
  ADMIN_ANALYST
  FINANCE
  INVENTORY
  MARKETING
}
```

## Proposed Model Design

The following is an architecture-level schema draft. It should become a separate draft file in Phase 3B before replacing the active schema.

### `User`

Purpose: authentication, role, and session identity.

Recommended fields:

- `id String @id @default(cuid())`
- `email String @unique`
- `name String`
- `passwordHash String`
- `role Role @default(CUSTOMER)`
- `phone String?`
- `active Boolean @default(true)`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- One optional `CustomerProfile`
- One optional `RiderProfile`
- Many `AiConversation`
- Many `AiAgentAction`

### `CustomerProfile`

Purpose: business customer profile separate from login identity.

Recommended fields:

- `id String @id @default(cuid())`
- `userId String? @unique`
- `displayName String`
- `phone String`
- `whatsapp String?`
- `notes String?`
- `active Boolean @default(true)`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Optional `user`
- Many `Address`
- Many `Subscription`
- Many `Order`
- Many `Payment`
- Many `Complaint`

### `RiderProfile`

Purpose: rider identity, contact details, and delivery assignment.

Recommended fields:

- `id String @id @default(cuid())`
- `userId String @unique`
- `displayName String`
- `phone String`
- `vehicleLabel String?`
- `active Boolean @default(true)`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Required `user`
- Many `Route`
- Many `Delivery`

### `Address`

Purpose: reusable customer delivery address.

Recommended fields:

- `id String @id @default(cuid())`
- `customerId String`
- `label String?`
- `line1 String`
- `line2 String?`
- `area String`
- `city String @default("Lahore")`
- `landmark String?`
- `latitude Float?`
- `longitude Float?`
- `isDefault Boolean @default(false)`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Required `customer`
- Many `Subscription`
- Many `Order`
- Many `Delivery`

### `Product`

Purpose: sellable product catalog.

Recommended fields:

- `id String @id @default(cuid())`
- `name String`
- `type ProductType`
- `unit String @default("liter")`
- `price Decimal @db.Decimal(12, 2)`
- `active Boolean @default(true)`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Many `Subscription`
- Many `OrderItem`
- Many `InventoryLog`
- Many `MilkProduction`

### `Subscription`

Purpose: ongoing or planned customer demand.

Recommended fields:

- `id String @id @default(cuid())`
- `customerId String`
- `productId String`
- `addressId String`
- `status SubscriptionStatus @default(ACTIVE)`
- `frequency SubscriptionFrequency @default(DAILY)`
- `quantity Decimal @db.Decimal(10, 2)`
- `rate Decimal @db.Decimal(12, 2)`
- `startDate DateTime`
- `endDate DateTime?`
- `pausedFrom DateTime?`
- `pausedTo DateTime?`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Required `customer`
- Required `product`
- Required `address`
- Many `SubscriptionSchedule`
- Many `Order`

### `SubscriptionSchedule`

Purpose: supports weekly or custom delivery days without overloading `Subscription`.

Recommended fields:

- `id String @id @default(cuid())`
- `subscriptionId String`
- `dayOfWeek Int?`
- `specificDate DateTime?`
- `quantityOverride Decimal? @db.Decimal(10, 2)`
- `active Boolean @default(true)`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Required `subscription`

Validation rule:

- Use `dayOfWeek` for weekly/custom recurring patterns.
- Use `specificDate` for one-off scheduled deliveries.

### `Order`

Purpose: billable customer order generated from a subscription or created manually.

Recommended fields:

- `id String @id @default(cuid())`
- `customerId String`
- `addressId String?`
- `subscriptionId String?`
- `deliveryDate DateTime`
- `status DeliveryStatus @default(PENDING)`
- `paymentStatus PaymentStatus @default(UNPAID)`
- `subtotal Decimal @db.Decimal(12, 2)`
- `discount Decimal @default(0) @db.Decimal(12, 2)`
- `totalAmount Decimal @db.Decimal(12, 2)`
- `notes String?`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Required `customer`
- Optional `address`
- Optional `subscription`
- Many `OrderItem`
- Optional `Delivery`
- Many `Payment`
- Many `Complaint`

### `OrderItem`

Purpose: line items for products and quantity/rate history.

Recommended fields:

- `id String @id @default(cuid())`
- `orderId String`
- `productId String`
- `quantity Decimal @db.Decimal(10, 2)`
- `rate Decimal @db.Decimal(12, 2)`
- `total Decimal @db.Decimal(12, 2)`
- `createdAt DateTime @default(now())`

Relations:

- Required `order`
- Required `product`

### `Delivery`

Purpose: delivery execution record for an order.

Recommended fields:

- `id String @id @default(cuid())`
- `orderId String @unique`
- `routeId String?`
- `riderId String?`
- `addressId String?`
- `status DeliveryStatus @default(PENDING)`
- `area String`
- `scheduledAt DateTime`
- `outForDeliveryAt DateTime?`
- `deliveredAt DateTime?`
- `missedReason String?`
- `proofNote String?`
- `urduTranscript String?`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Required `order`
- Optional `route`
- Optional `rider`
- Optional `address`

### `Route`

Purpose: delivery route grouping by date, rider, and area.

Recommended fields:

- `id String @id @default(cuid())`
- `riderId String?`
- `routeDate DateTime`
- `area String?`
- `status DeliveryStatus @default(PENDING)`
- `notes String?`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Optional `rider`
- Many `Delivery`

### `Payment`

Purpose: money received against customers and optionally orders.

Recommended fields:

- `id String @id @default(cuid())`
- `customerId String`
- `orderId String?`
- `amount Decimal @db.Decimal(12, 2)`
- `status PaymentStatus @default(PAID)`
- `method String @default("Cash")`
- `reference String?`
- `notes String?`
- `paidAt DateTime @default(now())`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Required `customer`
- Optional `order`

### `Expense`

Purpose: farm and delivery expenses.

Recommended fields:

- `id String @id @default(cuid())`
- `type ExpenseType`
- `amount Decimal @db.Decimal(12, 2)`
- `description String?`
- `spentAt DateTime @default(now())`
- `createdById String?`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Optional `createdBy User`

### `Complaint`

Purpose: customer support and service quality tracking.

Recommended fields:

- `id String @id @default(cuid())`
- `customerId String`
- `orderId String?`
- `title String`
- `message String`
- `status ComplaintStatus @default(OPEN)`
- `resolution String?`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Required `customer`
- Optional `order`

### `InventoryLog`

Purpose: stock movements for milk, packaging, rice, wheat, and related inventory.

Recommended fields:

- `id String @id @default(cuid())`
- `productId String?`
- `quantity Decimal @db.Decimal(12, 2)`
- `unit String`
- `direction String`
- `reason String`
- `notes String?`
- `loggedAt DateTime @default(now())`
- `createdAt DateTime @default(now())`

Relations:

- Optional `product`

Recommended follow-up:

- In Phase 3B, consider replacing `direction String` with an enum such as `IN`, `OUT`, `ADJUSTMENT`.

### `MilkProduction`

Purpose: farm production tracking for daily cow/buffalo milk.

Recommended fields:

- `id String @id @default(cuid())`
- `productId String?`
- `productionDate DateTime`
- `quantityLiters Decimal @db.Decimal(12, 2)`
- `source String?`
- `notes String?`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Optional `product`

### `AiConversation`

Purpose: persisted chat history for agentic AI workflows.

Recommended fields:

- `id String @id @default(cuid())`
- `userId String?`
- `agentRole AiAgentRole`
- `prompt String`
- `response String`
- `metadata Json?`
- `createdAt DateTime @default(now())`

Relations:

- Optional `user`
- Many `AiAgentAction`

### `AiAgentAction`

Purpose: audit trail of AI-suggested or AI-triggered business actions.

Recommended fields:

- `id String @id @default(cuid())`
- `conversationId String?`
- `userId String?`
- `agentRole AiAgentRole`
- `actionType String`
- `targetType String?`
- `targetId String?`
- `status String @default("PENDING")`
- `payload Json?`
- `result Json?`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- Optional `conversation`
- Optional `user`

Recommended follow-up:

- In Phase 3B, consider enums for `actionType`, `targetType`, and action status once product requirements are stable.

## Relationship Summary

- `User` owns authentication and role.
- `CustomerProfile` belongs to one optional `User`.
- `RiderProfile` belongs to one required `User`.
- `Address` belongs to `CustomerProfile`.
- `Subscription` belongs to `CustomerProfile`, `Product`, and `Address`.
- `SubscriptionSchedule` belongs to `Subscription`.
- `Order` belongs to `CustomerProfile`, optionally `Address`, and optionally `Subscription`.
- `OrderItem` belongs to `Order` and `Product`.
- `Delivery` belongs to `Order`, optionally `Route`, optionally `RiderProfile`, and optionally `Address`.
- `Route` belongs to optional `RiderProfile` and has many `Delivery` records.
- `Payment` belongs to `CustomerProfile` and optionally `Order`.
- `Complaint` belongs to `CustomerProfile` and optionally `Order`.
- `InventoryLog` and `MilkProduction` can optionally reference `Product`.
- `AiConversation` and `AiAgentAction` optionally reference `User`.

## Auth Strategy

### Required `User` Fields

- `id`
- `email`
- `name`
- `passwordHash`
- `role`
- `phone`
- `active`
- `createdAt`
- `updatedAt`

### Password Hash Strategy

- Continue storing only a password hash, never raw passwords.
- Keep hashing in `lib/password.ts`.
- Store the resulting hash in `User.passwordHash`.
- Seed demo passwords only for development/demo data.
- Production should force secure secret rotation and real credential setup.

### Role-Based Routing

Recommended role access:

- `ADMIN`: all dashboards and all management APIs.
- `STAFF`: operational admin APIs except destructive/admin-only settings.
- `RIDER`: rider dashboard and rider-scoped deliveries/routes.
- `CUSTOMER`: customer dashboard, own subscriptions, own orders, own complaints, own payments.

Current role utilities use lowercase strings. Later auth work should normalize Prisma enum values to lowercase session roles or update guards to use uppercase enum values consistently.

### Session Shape

Recommended session user:

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

### Later `lib/auth.ts` Changes

When schema work is approved, `lib/auth.ts` will need to:

- Select `passwordHash`.
- Select `active`.
- Select `CustomerProfile.id` when role is `CUSTOMER`.
- Select `RiderProfile.id` when role is `RIDER`.
- Normalize enum roles to the session role format.
- Reject inactive users.
- Keep credential verification separate from route authorization.

## Seed Strategy

The seed should prove the system works end to end without becoming production data.

Recommended seed data:

- Admin user:
  - Email: `admin@organics.com`
  - Role: `ADMIN`
  - Password: development-only demo password
- Rider user and profile:
  - Email: `rider@organics.com`
  - Role: `RIDER`
  - Rider profile with phone and vehicle label
- Customer user and profile:
  - Email: `customer@organics.com`
  - Role: `CUSTOMER`
  - Customer profile with phone/WhatsApp
- Customer addresses:
  - Model Town
  - Bahria
  - Johar Town
- Products:
  - Cow Milk, `COW_MILK`, PKR 330/liter
  - Buffalo Milk, `BUFFALO_MILK`, PKR 430/liter
  - Optional Rice, Wheat products for catalog completeness
- Subscriptions:
  - Daily cow milk subscription
  - Daily buffalo milk subscription
- Subscription schedules:
  - Daily schedule records or custom day records where needed
- Orders:
  - Pending order
  - Out-for-delivery order
  - Delivered paid order
- Order items:
  - Each order should include product, quantity, rate, and total
- Routes:
  - One route for today's deliveries
- Deliveries:
  - One pending delivery
  - One out-for-delivery delivery
  - One delivered delivery
- Payments:
  - Paid cash payment for a delivered order
  - Optional partial or unpaid scenario for finance testing
- Expenses:
  - Fuel
  - Packaging
  - Rider expense
- Complaints:
  - One open missed-delivery complaint
- Inventory logs:
  - Milk stock in/out
  - Packaging stock out
- Milk production:
  - Cow milk and buffalo milk daily production records
- AI records:
  - One customer support conversation
  - One finance action suggestion

## Migration Safety

### Backup Requirement

Before any real migration:

- Confirm target database.
- Export a database backup.
- Verify backup restore instructions.
- Use a development or staging database first.

### Why Not Run `db push` Blindly

`prisma db push` can alter the database shape without a reviewed migration history. With the current mismatch, a blind push could:

- Drop or reshape fields unexpectedly.
- Make placeholder models look authoritative.
- Hide destructive schema changes until runtime.
- Break auth if `User` changes are incomplete.
- Break seeded data assumptions.

### Recommended Dev-Only Migration Process

1. Create a draft schema file in Phase 3B.
2. Review the draft against API requirements.
3. Replace active `schema.prisma` only after approval.
4. Run `npx prisma validate`.
5. Run `npx prisma generate`.
6. Run `npm run build`.
7. Use a disposable local/dev database.
8. Run a named migration only after build compatibility is clean.
9. Seed only the disposable/dev database first.
10. Test dashboards and API routes before production database work.

### Rollback Plan

- Keep schema, seed, API rewrites, auth changes, and migrations in separate commits.
- If build compatibility regresses, revert the schema commit before touching database state.
- If a dev migration fails, reset only the disposable/dev database.
- If a production migration is approved later, take a backup first and prepare a reviewed rollback migration.
- Never combine schema replacement with component moves or UI refactors.

## Implementation Phases

### Phase 3A: Docs Only

- Create this architecture plan.
- Create the API rewrite map.
- Do not change code or database state.

### Phase 3B: Schema Draft File Only

- Create a separate draft file, for example `docs/schema-option-b.prisma` or `prisma/schema.option-b.prisma`.
- Do not replace active `prisma/schema.prisma`.
- Review model names, fields, indexes, and relations.

### Phase 3C: Update Active Schema After Approval

- Replace or rewrite `prisma/schema.prisma`.
- Do not run migrations yet.
- Run validation and generate/build checks only.

### Phase 3D: Update Seed

- Update `prisma/seed.ts` to match the approved schema.
- Keep demo credentials clearly development-only.
- Seed only after schema/client compatibility is clean.

### Phase 3E: Rewrite API Routes One By One

- Start with read-only routes where possible.
- Rewrite one API route at a time.
- Run lint/build after each meaningful group.
- Keep route scopes explicit.

### Phase 3F: Update Auth

- Update role normalization.
- Include profile ids in session.
- Reject inactive users.
- Update API and route guards for `STAFF`.

### Phase 3G: Run Prisma Generate And Build

- Run `npx prisma validate`.
- Run `npx prisma generate`.
- Run `npm run lint`.
- Run `npm run build`.

### Phase 3H: Migration Only After Backup And Explicit Approval

- Confirm backup.
- Confirm database target.
- Run migration only after explicit approval.
- Seed and smoke test after migration.

## Highest Risk Areas

- Replacing the active schema while existing API routes still use old model names.
- Auth role casing and session shape changes.
- Mapping `Customer` to `CustomerProfile` without breaking dashboard expectations.
- Payment state synchronization between `Order.paymentStatus` and `Payment` records.
- Delivery status synchronization between `Order.status`, `Delivery.status`, and `Route.status`.
- Decimal handling in API responses and UI formatters.
- Running migrations against the current live database without a backup.

## Recommended First Implementation Step

The safest next step is Phase 3B: create a draft Prisma schema file only, based on this document, without replacing the active schema and without running migrations.
