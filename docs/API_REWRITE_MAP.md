# API Rewrite Map

## Scope

This document maps the current API routes to the Option B schema architecture. It is a planning document only and does not modify API files, auth logic, Prisma schema, seed logic, or database state.

## Route Scope Terms

- `admin scoped`: only `ADMIN`; later may include selected `STAFF` permissions.
- `staff scoped`: `ADMIN` and `STAFF`.
- `rider scoped`: `ADMIN`, `STAFF`, or the assigned rider.
- `customer scoped`: `ADMIN`, `STAFF`, or the owning customer.
- `public auth`: NextAuth handler route.

## Current Route Map

### `app/api/auth/[...nextauth]/route.ts`

- Current Prisma models used: none directly; delegates to `lib/auth.ts`.
- Current indirect models: `User`.
- New Prisma models: `User`, optionally `CustomerProfile`, `RiderProfile`.
- Required query rewrite:
  - Keep route as a thin NextAuth handler.
  - Update `lib/auth.ts` later to select `User.passwordHash`, `User.active`, `User.role`, `CustomerProfile.id`, and `RiderProfile.id`.
  - Normalize `Role` enum values into the session role format.
- Risk level: medium.
- Scope: public auth.

### `app/api/agents/route.ts`

- Current Prisma models used:
  - `Delivery`
  - `Order`
  - `Expense`
- New Prisma models:
  - `AiConversation`
  - `AiAgentAction`
  - `Delivery`
  - `Order`
  - `OrderItem`
  - `Product`
  - `CustomerProfile`
  - `Payment`
  - `Expense`
  - `InventoryLog`
  - `MilkProduction`
- Required query rewrite:
  - Persist each agent prompt/response in `AiConversation`.
  - Persist suggested operational changes in `AiAgentAction`.
  - For delivery agent context, query `Delivery` with `order`, `order.items.product`, `order.customer`, `route`, and `rider`.
  - For finance agent context, query `Order`, `Payment`, and `Expense`.
  - For inventory agent context later, query `InventoryLog` and `MilkProduction`.
  - Keep deterministic fallback behavior until live AI integration is approved.
- Risk level: high.
- Scope: admin scoped initially; later split by `AiAgentRole`.

### `app/api/customers/route.ts`

- Current Prisma models used:
  - `Customer`
  - `Product`
  - `Subscription`
- New Prisma models:
  - `User`
  - `CustomerProfile`
  - `Address`
  - `Product`
  - `Subscription`
  - `SubscriptionSchedule`
- Required query rewrite:
  - Rename operational customer access from `Customer` to `CustomerProfile`.
  - `GET` should include default address, active subscriptions, and products.
  - `POST` should create `CustomerProfile`, default `Address`, and optional initial `Subscription`.
  - If login access is needed, create or link a `User` separately instead of overloading customer creation.
  - Replace direct `area/address` fields with `Address` records.
- Risk level: high.
- Scope: admin scoped for create/list; customer scoped for future self-profile routes.

### `app/api/subscriptions/route.ts`

- Current Prisma models used:
  - `Subscription`
- New Prisma models:
  - `Subscription`
  - `SubscriptionSchedule`
  - `CustomerProfile`
  - `Address`
  - `Product`
- Required query rewrite:
  - `GET` should include `customer`, `address`, `product`, and `schedules`.
  - `POST` should validate customer, address, product, frequency, quantity, and rate.
  - For `CUSTOM_DAYS`, create related `SubscriptionSchedule` records.
  - For `ONE_TIME`, consider whether to create an `Order` directly instead of a long-lived subscription.
  - Replace old `days` free-form usage with structured schedule records.
- Risk level: high.
- Scope: admin scoped for management; customer scoped for own subscription requests later.

### `app/api/deliveries/route.ts`

- Current Prisma models used:
  - `Delivery`
  - `Subscription`
  - `Order`
- New Prisma models:
  - `Delivery`
  - `Route`
  - `RiderProfile`
  - `Order`
  - `OrderItem`
  - `Subscription`
  - `SubscriptionSchedule`
  - `CustomerProfile`
  - `Address`
  - `Product`
- Required query rewrite:
  - `GET` should support role-aware filters:
    - Admin/staff: all deliveries.
    - Rider: assigned deliveries only.
  - Include `order.customer`, `order.items.product`, `address`, `route`, and `rider`.
  - `POST` should generate daily orders/deliveries from active subscriptions and schedules.
  - Decide whether route creation happens in this endpoint or in a future route-planning endpoint.
  - Use transactions when generating multiple orders and deliveries.
- Risk level: very high.
- Scope: admin/staff scoped for generation; rider scoped for assigned delivery list.

### `app/api/deliveries/[id]/route.ts`

- Current Prisma models used:
  - `Delivery`
  - `Order`
- New Prisma models:
  - `Delivery`
  - `Order`
  - `Route`
  - `RiderProfile`
  - `AiAgentAction`
- Required query rewrite:
  - Validate that a rider can update only assigned deliveries.
  - Update `Delivery.status`, timestamps such as `outForDeliveryAt` or `deliveredAt`, and `missedReason` when relevant.
  - Decide whether `Order.status` mirrors `Delivery.status` or is derived.
  - Return delivery with `order.customer`, `order.items.product`, `address`, and `route`.
  - Optionally log AI/rider assistant actions later in `AiAgentAction`.
- Risk level: high.
- Scope: rider scoped and admin/staff scoped.

### `app/api/orders/route.ts`

- Current Prisma models used:
  - `Order`
  - `Product`
  - `Customer`
- New Prisma models:
  - `Order`
  - `OrderItem`
  - `Product`
  - `CustomerProfile`
  - `Address`
  - `Subscription`
  - `Delivery`
- Required query rewrite:
  - `GET` should include `customer`, `address`, `items.product`, optional `delivery`, and payments summary.
  - `POST` should validate customer, address, products, quantity, rate, and total.
  - Create `Order` and nested `OrderItem` records in a transaction.
  - Optionally create a `Delivery` if the order is deliverable.
  - Use Decimal-safe totals instead of JavaScript float assumptions.
- Risk level: high.
- Scope: admin/staff scoped for management; customer scoped for own order history later.

### `app/api/orders/[id]/route.ts`

- Current Prisma models used:
  - `Order`
  - `Delivery`
- New Prisma models:
  - `Order`
  - `OrderItem`
  - `Delivery`
  - `Payment`
  - `CustomerProfile`
- Required query rewrite:
  - Validate route scope before update.
  - Support controlled updates to `paymentStatus`, order notes, and delivery status.
  - Avoid silently setting an order to `PAID` unless payment totals support it.
  - If delivery status changes, update `Delivery` with status-specific timestamps.
  - Return normalized order detail with items, customer, delivery, and payment summary.
- Risk level: high.
- Scope: admin/staff scoped; customer read/update requests should be separate and limited.

### `app/api/payments/route.ts`

- Current Prisma models used:
  - `Payment`
  - `Order`
- New Prisma models:
  - `Payment`
  - `Order`
  - `CustomerProfile`
- Required query rewrite:
  - `GET` should include customer and optional order.
  - `POST` should create payment records using Decimal amounts.
  - Recalculate `Order.paymentStatus` from total paid vs `Order.totalAmount`.
  - Support partial payments with `PaymentStatus.PARTIAL`.
  - Use a transaction when creating payment and updating order status.
- Risk level: high.
- Scope: admin/staff scoped for create/list; customer scoped for own payment history later.

### `app/api/expenses/route.ts`

- Current Prisma models used:
  - `Expense`
- New Prisma models:
  - `Expense`
  - `User`
- Required query rewrite:
  - Replace free-form type strings with `ExpenseType`.
  - Store `createdById` from session when available.
  - Use `spentAt` for the business expense date and `createdAt` for audit time.
  - Keep amount Decimal-safe.
- Risk level: medium.
- Scope: admin/staff scoped.

## Dashboard Route Consumers

### `app/dashboard/admin/page.tsx`

- Current behavior:
  - Requires admin role.
  - Renders `AdminDashboardClient`.
- New API needs:
  - Admin-scoped customer, subscription, order, delivery, payment, expense, and agent endpoints.
  - Dashboard summaries should eventually come from dedicated aggregate endpoints or server actions.
- Risk level: medium.

### `app/dashboard/customer/page.tsx`

- Current behavior:
  - Requires customer or admin role.
  - Renders static subscription information.
- New API needs:
  - Customer-scoped profile/subscription/orders/payments/complaints endpoints.
  - Session should include `customerProfileId`.
- Risk level: medium.

### `app/dashboard/rider/page.tsx`

- Current behavior:
  - Requires rider or admin role.
  - Renders `RiderDashboardClient`.
- New API needs:
  - Rider-scoped route and delivery endpoints.
  - Session should include `riderProfileId`.
- Risk level: medium.

## Recommended Rewrite Order

1. Keep current routes in place until the approved schema builds.
2. Rewrite `app/api/expenses/route.ts` first because it has the smallest model surface.
3. Rewrite read side of `app/api/customers/route.ts` after `CustomerProfile` and `Address` exist.
4. Rewrite `app/api/subscriptions/route.ts` with schedules.
5. Rewrite `app/api/orders/route.ts` with `OrderItem` transactions.
6. Rewrite `app/api/payments/route.ts` with payment-status recalculation.
7. Rewrite `app/api/deliveries/route.ts` and `app/api/deliveries/[id]/route.ts` after route/rider assignment rules are clear.
8. Rewrite `app/api/agents/route.ts` after the operational models are stable.
9. Update `app/api/auth/[...nextauth]/route.ts` only through `lib/auth.ts` changes in the auth phase.

## API-Level Risk Summary

- Very high risk:
  - `app/api/deliveries/route.ts`
- High risk:
  - `app/api/agents/route.ts`
  - `app/api/customers/route.ts`
  - `app/api/subscriptions/route.ts`
  - `app/api/deliveries/[id]/route.ts`
  - `app/api/orders/route.ts`
  - `app/api/orders/[id]/route.ts`
  - `app/api/payments/route.ts`
- Medium risk:
  - `app/api/auth/[...nextauth]/route.ts`
  - `app/api/expenses/route.ts`

## Guardrails For Rewrite

- Do not rewrite multiple high-risk routes in one change.
- Use Prisma transactions for order/payment/delivery generation.
- Keep auth/session changes separate from schema replacement.
- Keep dashboard UI changes separate from API rewrites.
- Run lint and build after each route group.
- Do not run migrations until after backup and explicit approval.
