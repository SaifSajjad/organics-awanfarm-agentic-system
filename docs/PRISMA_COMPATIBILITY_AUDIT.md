# Prisma Compatibility Audit

## Scope

This is an audit-only document. No Prisma schema, seed, environment, API, auth, dashboard, database, or migration files were changed in this phase.

## Current Schema Models

The current `prisma/schema.prisma` defines these enums:

- `Role`: `ADMIN`, `RIDER`, `CUSTOMER`
- `LogStatus`: `PENDING`, `DELIVERED`, `ABSENT_ISSUE`
- `SubsStatus`: `ACTIVE`, `PAUSED`

The current schema defines these models:

- `User`
- `Subscription`
- `DeliveryLog`
- `ExpenseLedger`
- `Customer`
- `Rider`
- `Product`
- `Order`
- `Payment`
- `Expense`
- `Complaint`

Current model coverage is partial. Several legacy models exist only as placeholders with `id` or `id` plus `name`, while the application code expects full operational models.

## Prisma Usages By File

### `lib/auth.ts`

- `prisma.user.findUnique`
- Selects `id`, `email`, `name`, `role`, `passwordHash`
- Expects `User.passwordHash`

### `prisma/seed.ts`

- `prisma.user.upsert`
- `prisma.product.upsert`
- `prisma.payment.deleteMany`
- `prisma.delivery.deleteMany`
- `prisma.orderItem.deleteMany`
- `prisma.order.deleteMany`
- `prisma.subscription.deleteMany`
- `prisma.expense.deleteMany`
- `prisma.customer.deleteMany`
- `prisma.customer.create`
- `prisma.subscription.createMany`
- `prisma.order.create`
- `prisma.payment.create`
- `prisma.expense.createMany`
- `prisma.$disconnect`

### `app/api/agents/route.ts`

- `prisma.delivery.findMany`
- `prisma.order.findMany`
- `prisma.expense.findMany`
- Expects delivery/order includes for `order`, `customer`, `items`, and `product`
- Expects `createdAt` ordering on `delivery`, `order`, and `expense`

### `app/api/customers/route.ts`

- `prisma.customer.findMany`
- `prisma.product.findFirst`
- `prisma.customer.create`
- Expects `Customer.subscriptions`
- Expects `Subscription.product`
- Expects `Customer.createdAt`
- Expects `Product.name`
- Expects customer fields `phone`, `area`, and `address`

### `app/api/deliveries/route.ts`

- `prisma.delivery.findMany`
- `prisma.subscription.findMany`
- `prisma.order.create`
- Expects `Delivery.order`
- Expects `Order.customer`
- Expects `Order.items`
- Expects `OrderItem.product`
- Expects `Subscription.customer`
- Expects `Subscription.product`
- Expects order nested creates for `items` and `delivery`

### `app/api/deliveries/[id]/route.ts`

- `prisma.delivery.update`
- Expects `Delivery.status`
- Expects nested `Delivery.order.update`
- Expects include path `delivery.order.customer`
- Expects include path `delivery.order.items.product`

### `app/api/orders/route.ts`

- `prisma.order.findMany`
- `prisma.product.findFirst`
- `prisma.customer.findFirst`
- `prisma.order.create`
- Expects `Order.customer`
- Expects `Order.items`
- Expects `OrderItem.product`
- Expects `Product.name`
- Expects `Product.price`

### `app/api/orders/[id]/route.ts`

- `prisma.order.update`
- `prisma.delivery.updateMany`
- Expects `Order.paymentStatus`
- Expects `Order.status`
- Expects `Delivery.orderId`
- Expects `Delivery.status`
- Expects include path `order.customer`
- Expects include path `order.items.product`

### `app/api/payments/route.ts`

- `prisma.payment.findMany`
- `prisma.payment.create`
- `prisma.order.update`
- Expects `Payment.customer`
- Expects `Payment.order`
- Expects `Payment.paidAt`
- Expects payment fields `customerId`, `orderId`, `amount`, `status`, `method`, and `notes`
- Expects `Order.paymentStatus`

### `app/api/expenses/route.ts`

- `prisma.expense.findMany`
- `prisma.expense.create`
- Expects `Expense.createdAt`
- Expects expense fields `type`, `amount`, and `description`

### `app/api/subscriptions/route.ts`

- `prisma.subscription.findMany`
- `prisma.subscription.create`
- Expects `Subscription.customer`
- Expects `Subscription.product`
- Expects `Subscription.customerId`
- Expects `Subscription.productId`
- Expects subscription fields `type`, `quantity`, `rate`, and `days`

### `lib/db-formatters.ts`

This file does not call Prisma directly, but it documents the object shapes returned by Prisma queries:

- Orders need `customer`, `items`, `totalAmount`, `paymentStatus`, and `status`
- Deliveries need `area`, `status`, `order.customer`, and `order.items.product`
- Expenses need `type`, `amount`, and `description`
- Customers need `phone`, `area`, `address`, and `subscriptions.product`

## Missing Models

These models are used in code but are not currently defined in `schema.prisma`:

- `Delivery`
- `OrderItem`

These names are searched for but not currently used by Prisma client code:

- `AiConversation` / `aiConversation`

The schema has `DeliveryLog`, but code uses `prisma.delivery`, not `prisma.deliveryLog`.

## Missing Fields And Relations

### `User`

Current schema fields:

- `id`
- `email`
- `name`
- `role`
- `createdAt`
- `subscriptions`
- `deliveryLogs`

Code expects:

- `passwordHash`

Additional mismatch:

- The schema enum values are uppercase (`ADMIN`, `RIDER`, `CUSTOMER`), while `prisma/seed.ts` currently uses lowercase role strings (`admin`, `rider`, `customer`).

### `Customer`

Current schema fields:

- `id`
- `name`

Code expects fields:

- `phone`
- `area`
- `address`
- `notes`
- `createdAt`

Code expects relations:

- `subscriptions`
- `orders`
- `payments`

### `Product`

Current schema fields:

- `id`

Code expects fields:

- `name`
- `type`
- `price`
- `unit`
- `active`

Code expects relations:

- `subscriptions`
- `orderItems` or equivalent relation to order line items

### `Subscription`

Current schema fields:

- `id`
- `status`
- `dailyIntakeLiters`
- `pausedFrom`
- `pausedTo`
- `createdAt`
- `userId`
- `user`
- `deliveryLogs`

Code expects fields:

- `customerId`
- `productId`
- `type`
- `quantity`
- `rate`
- `days`

Code expects relations:

- `customer`
- `product`

Important mismatch:

- Current subscriptions relate to `User`; the application routes and seed relate subscriptions to `Customer`.

### `Order`

Current schema fields:

- `id`

Code expects fields:

- `customerId`
- `subscriptionId`
- `deliveryDate`
- `status`
- `totalAmount`
- `paymentStatus`
- `createdAt`

Code expects relations:

- `customer`
- `items`
- `delivery`
- `payments`

### `OrderItem`

Current schema status:

- Missing model

Code expects fields:

- `id`
- `orderId`
- `productId`
- `quantity`
- `rate`
- `total`

Code expects relations:

- `order`
- `product`

### `Delivery`

Current schema status:

- Missing model

Code expects fields:

- `id`
- `orderId`
- `area`
- `status`
- `createdAt`

Code expects relations:

- `order`

Related mismatch:

- Current schema has `DeliveryLog`, but that model is not compatible with current `prisma.delivery.*` code.

### `Payment`

Current schema fields:

- `id`

Code expects fields:

- `customerId`
- `orderId`
- `amount`
- `status`
- `method`
- `notes`
- `paidAt`

Code expects relations:

- `customer`
- `order`

### `Expense`

Current schema fields:

- `id`

Code expects fields:

- `type`
- `amount`
- `description`
- `createdAt`

### `Complaint`

Current schema fields:

- `id`

Current Prisma client usage:

- No `prisma.complaint` usage found in `app`, `lib`, `prisma`, or `components`.

### `ExpenseLedger`

Current schema fields:

- `id`
- `amountPKR`
- `purpose`
- `createdAt`

Current Prisma client usage:

- No `prisma.expenseLedger` usage found in `app`, `lib`, `prisma`, or `components`.

## Auth Compatibility Findings

`lib/auth.ts` expects:

- `User.email`
- `User.name`
- `User.role`
- `User.passwordHash`

Current blocker:

- `User.passwordHash` is missing from the schema.

Potential follow-up:

- Decide whether role values should remain Prisma enum values (`ADMIN`, `RIDER`, `CUSTOMER`) and normalize in application code, or whether the schema should switch to string roles. This should be decided before updating seed/auth behavior.

## Seed Compatibility Findings

`prisma/seed.ts` expects a fuller operational schema than currently exists. Major expected areas:

- User password hashes
- Lowercase seed roles
- Product catalog fields
- Customer contact and address fields
- Customer-based subscriptions
- Orders with order items
- Orders with delivery records
- Payments linked to customers and orders
- Expenses with type, amount, and description

Current blockers:

- `passwordHash` missing on `User`
- `Delivery` model missing
- `OrderItem` model missing
- Placeholder models missing most fields
- Current `Subscription` model relates to `User`, while seed expects `Customer`
- Role enum casing does not match seed values

## Risk Level

Risk level: high.

Reasons:

- The app now builds past the Prisma export issue and fails on schema/code mismatch.
- Multiple API routes depend on missing fields and relations.
- The seed script and application routes appear to target a different domain schema than the current `schema.prisma`.
- Running migrations or `prisma db push` before choosing the target schema could create destructive or confusing database changes.
- Auth depends on `passwordHash`, so partial fixes could produce a build that still fails at sign-in or seed time.

## Recommended Safest Fix Strategy

1. Keep this audit as the source of truth for the next schema phase.
2. Do not run migrations or `prisma db push` until the target schema is reviewed.
3. Choose one data model direction:
   - Customer-centric operational schema matching the current API and seed code.
   - User-centric subscription/delivery-log schema matching the current partial schema.
4. Prefer the customer-centric schema if the goal is to preserve current API route behavior and seed data.
5. Update `schema.prisma` in one focused schema compatibility phase.
6. Regenerate Prisma Client and run `npm run build` before changing database state.
7. Update `prisma/seed.ts` only after schema compatibility is confirmed, especially role enum casing.
8. Run migrations or `prisma db push` only after build-level compatibility is clean and the database target is confirmed.
9. Add minimal tests for key route contracts before moving folders or changing imports.

## Rollback Plan

For future schema/code fix phases:

1. Keep schema changes in a dedicated commit.
2. Before touching a real database, take a database backup or use a disposable development database.
3. If TypeScript/build compatibility gets worse, revert only the schema compatibility commit.
4. Regenerate Prisma Client after reverting schema changes.
5. If a database migration has already been applied, restore from backup or apply an explicit rollback migration after review.
6. Do not mix schema fixes with route moves, component moves, UI refactors, or auth behavior changes.
