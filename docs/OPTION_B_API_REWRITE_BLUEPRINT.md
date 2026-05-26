# Option B API Rewrite Blueprint

## Scope

This is a documentation-only blueprint for rewriting API routes against the Option B schema. It does not modify `app/api/*`, active `prisma/schema.prisma`, `prisma/seed.ts`, `lib/auth.ts`, dashboards, database state, migrations, Prisma Client generation, build output, stash contents, commits, or pushes.

## Source Files Reviewed

- `prisma/schema.option-b.draft.prisma`
- `docs/API_REWRITE_MAP.md`
- `docs/OPTION_B_IMPLEMENTATION_SEQUENCE.md`
- `docs/OPTION_B_AUTH_SESSION_BLUEPRINT.md`
- Current `app/api/*`
- Current `prisma/seed.ts`

The current clean branch does not contain `lib/auth.ts` or `app/api/auth/[...nextauth]/route.ts`.

## Current API Route Inventory

Current active routes:

- `app/api/agents/route.ts`
- `app/api/customers/route.ts`
- `app/api/deliveries/route.ts`
- `app/api/deliveries/[id]/route.ts`
- `app/api/expenses/route.ts`
- `app/api/orders/route.ts`
- `app/api/orders/[id]/route.ts`
- `app/api/payments/route.ts`
- `app/api/subscriptions/route.ts`

Current clean branch missing auth route:

- `app/api/auth/[...nextauth]/route.ts`

## Shared Rewrite Standards

### Response Envelope

Use one response format for rewritten routes:

```ts
type ApiSuccess<T> = {
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
};

type ApiFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
};
```

Recommended status codes:

- `200` for successful reads and updates.
- `201` for successful creates.
- `400` for validation errors.
- `401` for unauthenticated.
- `403` for authenticated but unauthorized.
- `404` for missing resources or resources hidden by ownership scope.
- `409` for duplicate or invalid state transitions.
- `500` for unexpected server failures with a generic message.

### Decimal Serialization

Option B uses Prisma `Decimal` for money and quantities. The API should not leak inconsistent Decimal objects.

Recommended canonical JSON format:

- Serialize money and quantities as strings, for example `"330.00"` and `"2.00"`.
- Keep derived UI summaries explicit, for example `totalAmountLabel` only if needed by a client.
- Convert Decimal to number only in small dashboard snapshot adapters where precision is safe and intentional.

Recommended helper direction:

```ts
serializeDecimal(value): string
serializeDate(value): string
parseDecimalInput(value): string
```

Do not calculate final money totals with JavaScript floats. Use Decimal-compatible string arithmetic or Prisma Decimal utilities in the implementation phase.

### Validation Plan

Use Zod for every non-trivial request body and query filter.

Recommended shared validators:

- `idSchema`: non-empty string IDs.
- `dateStringSchema`: ISO date string, converted intentionally.
- `decimalStringSchema`: string or number input normalized to exact decimal string.
- `paginationSchema`: optional `limit`, `cursor`, `sort`.
- Enum schemas based on Option B enums:
  - `Role`
  - `ProductType`
  - `SubscriptionStatus`
  - `SubscriptionFrequency`
  - `DeliveryStatus`
  - `PaymentStatus`
  - `ExpenseType`
  - `ComplaintStatus`
  - `AiAgentRole`

Use request-specific schemas instead of reading arbitrary `body.*` values.

### Auth Guard Plan

API rewrites should use the auth/session blueprint once auth is approved.

Recommended guard helpers:

- `authorizeApi({ roles: ["admin", "staff"] })`
- `authorizeCustomerResource(customerProfileId)`
- `authorizeRiderResource(riderProfileId)`

Do not rely on role checks alone for customer or rider routes. Customer and rider APIs must also filter by `customerProfileId` or `riderProfileId`.

### Transaction Rules

Use Prisma transactions for workflows that write multiple related records:

- Customer profile plus address plus optional subscription.
- Order plus order items plus optional delivery.
- Payment plus order payment status recalculation.
- Delivery generation from subscriptions.
- AI conversation plus related action records.

## Route Rewrite Plans

### `app/api/expenses/route.ts`

Current Prisma models used:

- `Expense`

Current behavior:

- `GET` returns all expenses ordered by `createdAt desc`.
- `POST` creates an expense from unvalidated `body.type`, `body.amount`, and `body.note/body.description`.

New Option B models:

- `Expense`
- `User` through `Expense.createdBy`

Required query changes:

- Use `ExpenseType` enum values instead of free-form type strings.
- Use `spentAt` as the business expense date.
- Set `createdById` from session when available.
- Serialize `amount` as a Decimal string.
- Order by `spentAt desc`, then `createdAt desc`.

Required auth/role guard:

- `admin` and `staff` for `GET` and `POST`.
- No customer/rider access.

Request validation needed:

- `type`: `FUEL`, `RIDER`, `PACKAGING`, `MILK_PURCHASE`, `FARM_OPS`, `MISC`
- `amount`: required decimal greater than zero.
- `description`: optional string.
- `spentAt`: optional ISO date.

Response shape:

```ts
{
  ok: true,
  data: {
    id,
    type,
    amount,
    description,
    spentAt,
    createdById,
    createdAt,
    updatedAt
  }
}
```

Risk level: medium.

Safe rewrite order: 1.

### `app/api/customers/route.ts`

Current Prisma models used:

- `Customer`
- `Product`
- `Subscription`

Current behavior:

- `GET` reads `prisma.customer.findMany` and includes subscriptions/products.
- `POST` creates a customer with direct `name`, `phone`, `area`, and `address` fields, then creates one subscription.

New Option B models:

- `User` only if creating login access is explicitly requested.
- `CustomerProfile`
- `Address`
- `Product`
- `Subscription`
- `SubscriptionSchedule`

Required query changes:

- Replace `prisma.customer` with `prisma.customerProfile`.
- Move direct `area` and `address` values into `Address`.
- `GET` should include default address, subscriptions, products, and optionally latest order/payment summary.
- `POST` should create `CustomerProfile` and default `Address` in a transaction.
- Optional initial subscription should require `productId`, `addressId`, `frequency`, `quantity`, `rate`, and `startDate`.
- If customer login is needed, create/link `User` in a separate approved workflow instead of hiding auth creation inside this endpoint.

Required auth/role guard:

- `admin` and `staff` for list/create.
- Future self-profile should use a separate customer-scoped route.

Request validation needed:

- `displayName`: required string.
- `phone`: required string.
- `whatsapp`: optional string.
- `notes`: optional string.
- `address.line1`: required string.
- `address.area`: required string.
- `address.city`: optional string defaulting to `Lahore`.
- Optional subscription object with validated product, frequency, quantity, rate, and schedules.

Response shape:

```ts
{
  ok: true,
  data: {
    id,
    displayName,
    phone,
    whatsapp,
    active,
    defaultAddress,
    subscriptions,
    createdAt,
    updatedAt
  }
}
```

Risk level: high.

Safe rewrite order: 2.

### `app/api/subscriptions/route.ts`

Current Prisma models used:

- `Subscription`

Current behavior:

- `GET` reads subscriptions with customer/product.
- `POST` creates a subscription using old `type`, `status`, `quantity`, `rate`, and `days`.

New Option B models:

- `Subscription`
- `SubscriptionSchedule`
- `CustomerProfile`
- `Address`
- `Product`

Required query changes:

- Replace old `type` with `frequency`.
- Replace old `days` with structured `SubscriptionSchedule` rows.
- Require `addressId` and `startDate`.
- Ensure `address.customerId` matches `customerId`.
- Include customer, address, product, and schedules in reads.
- Use transactions for subscription plus schedules.

Required auth/role guard:

- `admin` and `staff` for list/create/update.
- Customer self-service changes should move to `app/api/customer/subscription/route.ts`.

Request validation needed:

- `customerId`: required.
- `productId`: required.
- `addressId`: required.
- `frequency`: `DAILY`, `WEEKLY`, `CUSTOM_DAYS`, `ONE_TIME`.
- `status`: optional `ACTIVE`, `PAUSED`, `CANCELLED`.
- `quantity`: required decimal greater than zero.
- `rate`: required decimal greater than or equal to zero.
- `startDate`: required ISO date.
- `endDate`: optional ISO date.
- `schedules`: required when `frequency` is `CUSTOM_DAYS`.

Response shape:

```ts
{
  ok: true,
  data: {
    id,
    status,
    frequency,
    quantity,
    rate,
    startDate,
    endDate,
    customer,
    address,
    product,
    schedules
  }
}
```

Risk level: high.

Safe rewrite order: 3.

### `app/api/orders/route.ts`

Current Prisma models used:

- `Order`
- `Product`
- `Customer`

Current behavior:

- `GET` reads orders with customer and items/products.
- `POST` finds a customer and product, calculates total with `quantity * product.price`, and creates one order item.

New Option B models:

- `Order`
- `OrderItem`
- `Product`
- `CustomerProfile`
- `Address`
- `Subscription`
- `Delivery`
- `Payment`

Required query changes:

- Replace `Customer` with `CustomerProfile`.
- Require or infer `addressId` from the customer's default address.
- Use nested or transactional `OrderItem` creation.
- Set `subtotal`, `discount`, and `totalAmount`.
- Use Decimal-safe calculations.
- Include items/products, customer profile, address, delivery, and payment summary in reads.
- Do not auto-create `Payment`; payment stays explicit.
- Optionally create `Delivery` only when the request indicates a deliverable order.

Required auth/role guard:

- `admin` and `staff` for management list/create.
- Customer read/create should move to customer-scoped routes and filter by session `customerProfileId`.

Request validation needed:

- `customerId`: required for admin/staff.
- `addressId`: optional only if default address lookup is supported.
- `subscriptionId`: optional.
- `deliveryDate`: required ISO date or default to today by explicit rule.
- `items`: non-empty array of product/quantity/rate inputs.
- `discount`: optional decimal.
- `notes`: optional string.
- `createDelivery`: optional boolean.

Response shape:

```ts
{
  ok: true,
  data: {
    id,
    customer,
    address,
    subscriptionId,
    deliveryDate,
    status,
    paymentStatus,
    subtotal,
    discount,
    totalAmount,
    items,
    delivery,
    payments
  }
}
```

Risk level: high.

Safe rewrite order: 4.

### `app/api/payments/route.ts`

Current Prisma models used:

- `Payment`
- `Order`

Current behavior:

- `GET` returns raw payment records with customer and order.
- `POST` creates a payment, then marks the order `PAID` whenever `orderId` is present.

New Option B models:

- `Payment`
- `Order`
- `CustomerProfile`

Required query changes:

- Create payment and update order payment status in a transaction.
- Recalculate aggregate paid amount for the order.
- Set order `paymentStatus` to `UNPAID`, `PARTIAL`, or `PAID` based on actual totals.
- Ensure `Payment.customerId` matches `Order.customerId` when `orderId` is present.
- Serialize amounts as Decimal strings.
- Include customer and order summaries in reads.

Required auth/role guard:

- `admin` and `staff` for create/list.
- Customer payment history should move to a customer-scoped route.

Request validation needed:

- `customerId`: required.
- `orderId`: optional.
- `amount`: required decimal greater than zero.
- `status`: optional `PAID` or `PARTIAL` depending on workflow; avoid letting clients create arbitrary `UNPAID` payment rows.
- `method`: optional string defaulting to `Cash`.
- `reference`: optional string.
- `notes`: optional string.
- `paidAt`: optional ISO date.

Response shape:

```ts
{
  ok: true,
  data: {
    payment,
    orderPaymentStatus,
    orderPaidAmount,
    orderTotalAmount
  }
}
```

Risk level: high.

Safe rewrite order: 5.

### `app/api/orders/[id]/route.ts`

Current Prisma models used:

- `Order`
- `Delivery`

Current behavior:

- `PATCH` updates `paymentStatus` and/or delivery status from unvalidated body values.
- If order status changes, it updates matching deliveries with `updateMany`.

New Option B models:

- `Order`
- `OrderItem`
- `Delivery`
- `Payment`
- `CustomerProfile`

Required query changes:

- Load the order with customer, address, delivery, items, and payments before update.
- Validate allowed state transitions.
- Do not use this endpoint to mark an order paid unless payment totals support it.
- If delivery status changes, update `Delivery` fields and timestamps intentionally.
- Return full normalized order detail.

Required auth/role guard:

- `admin` and `staff` for operational updates.
- Customer access should be read-only or handled by a separate customer route.

Request validation needed:

- `paymentStatus`: optional enum, preferably derived rather than directly writable.
- `deliveryStatus`: optional enum.
- `notes`: optional string.
- `discount`: optional decimal only if recalculating totals is implemented.

Response shape:

```ts
{
  ok: true,
  data: {
    id,
    status,
    paymentStatus,
    totals,
    customer,
    address,
    items,
    delivery,
    payments
  }
}
```

Risk level: high.

Safe rewrite order: 6.

### `app/api/deliveries/route.ts`

Current Prisma models used:

- `Delivery`
- `Subscription`
- `Order`

Current behavior:

- `GET` reads deliveries with order, customer, and items/products.
- `POST` loops over active subscriptions, creates order/item/delivery records, and uses `subscription.customer.area` for the delivery area.

New Option B models:

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

Required query changes:

- `GET` should support filters for date, area, route, rider, and status.
- Include order, customer profile, address, route, rider, items, and products.
- For rider sessions, restrict to `riderProfileId`.
- `POST` should generate deliveries from active subscriptions and schedules.
- Use `Subscription.addressId` and `Address.area`, not customer direct area.
- Create `Order`, `OrderItem`, and `Delivery` in a transaction.
- Set required `Delivery.scheduledAt`.
- Decide whether this route creates/assigns `Route` records or only links to an existing route.
- Prevent duplicate delivery generation for the same subscription/date unless explicitly allowed.

Required auth/role guard:

- `admin` and `staff` for generation.
- `admin`, `staff`, and assigned `rider` for reads, with rider scoped to own deliveries.

Request validation needed:

- `deliveryDate`: required ISO date for generation.
- `routeId`: optional existing route.
- `riderId`: optional rider assignment.
- `area`: optional filter or route planning input.
- `subscriptionIds`: optional list for targeted generation.
- `dryRun`: optional boolean for preview-only future flow.

Response shape:

```ts
{
  ok: true,
  data: {
    deliveries: [],
    skipped: [],
    routeSummary
  },
  meta: {
    generatedCount,
    skippedCount
  }
}
```

Risk level: very high.

Safe rewrite order: 7. Split `GET` and `POST` into separate commits if possible.

### `app/api/deliveries/[id]/route.ts`

Current Prisma models used:

- `Delivery`
- `Order`

Current behavior:

- `PATCH` updates delivery status and mirrors that status to the order.

New Option B models:

- `Delivery`
- `Order`
- `Route`
- `RiderProfile`
- `AiAgentAction` later if rider assistant actions are logged.

Required query changes:

- Fetch delivery by ID with route, rider, order, customer, address, and items.
- Rider updates must filter by both `id` and session `riderProfileId`.
- Set status-specific fields:
  - `OUT_FOR_DELIVERY` sets `outForDeliveryAt`.
  - `DELIVERED` sets `deliveredAt`.
  - `MISSED` requires `missedReason`.
  - `CANCELLED` requires admin/staff or approved cancellation rule.
- Decide whether `Order.status` mirrors `Delivery.status` or becomes derived from delivery.
- Return full delivery detail after update.

Required auth/role guard:

- `admin` and `staff` can update any delivery.
- `rider` can update assigned deliveries only.
- Customers should not update delivery status.

Request validation needed:

- `status`: required `DeliveryStatus`.
- `missedReason`: required for `MISSED`.
- `proofNote`: optional for `DELIVERED`.
- `urduTranscript`: optional rider note.

Response shape:

```ts
{
  ok: true,
  data: {
    id,
    status,
    scheduledAt,
    outForDeliveryAt,
    deliveredAt,
    missedReason,
    proofNote,
    order,
    customer,
    address,
    route,
    rider
  }
}
```

Risk level: high.

Safe rewrite order: 8.

### `app/api/agents/route.ts`

Current Prisma models used:

- `Delivery`
- `Order`
- `Expense`

Current behavior:

- Validates `agent` as `support`, `delivery`, or `finance`.
- If demo data is not provided, reads deliveries/orders/expenses for context.
- Calls deterministic `runDemoAgent`.
- Does not persist conversations or actions.

New Option B models:

- `AiConversation`
- `AiAgentAction`
- `Delivery`
- `Order`
- `OrderItem`
- `Product`
- `CustomerProfile`
- `Address`
- `Route`
- `RiderProfile`
- `Payment`
- `Expense`
- `InventoryLog`
- `MilkProduction`

Required query changes:

- Map UI agent names to `AiAgentRole`:
  - `support` -> `CUSTOMER_SUPPORT`
  - `delivery` -> `RIDER_ASSISTANT` or `ADMIN_ANALYST` depending on caller role
  - `finance` -> `FINANCE`
- Load Option B context through customer profile, address, route, rider, items, products, payments, expenses, inventory, and production records.
- Persist each prompt/response in `AiConversation`.
- Persist suggested actions as `AiAgentAction` records with `PENDING` status.
- Keep suggested AI actions as audit records until an approval workflow exists.
- Do not let this route mutate core orders, deliveries, payments, or subscriptions directly.

Required auth/role guard:

- `admin` and `staff` initially.
- Future customer/rider agents should move to scoped routes.

Request validation needed:

- `agent`: supported agent key.
- `prompt`: required non-empty string with max length.
- `contextDate`: optional ISO date.
- `targetType`: optional.
- `targetId`: optional.
- `demoData`: optional only for local/demo mode.

Response shape:

```ts
{
  ok: true,
  data: {
    conversationId,
    agentRole,
    title,
    response,
    actions: [
      {
        id,
        actionType,
        targetType,
        targetId,
        status,
        payload
      }
    ]
  }
}
```

Risk level: high.

Safe rewrite order: 9, after operational routes have stable response shapes.

### `app/api/auth/[...nextauth]/route.ts`

Current Prisma models used:

- Not present in the clean branch.

Current behavior:

- No active route.

New Option B models:

- `User`
- `CustomerProfile`
- `RiderProfile`

Required query changes:

- Keep the route handler thin and delegate to `lib/auth.ts`.
- Query `User` by normalized email.
- Select `passwordHash`, `active`, `role`, `customerProfile.id`, and `riderProfile.id`.
- Verify password through a dedicated password helper.
- Normalize role into the session.
- Store profile IDs in JWT/session callbacks.

Required auth/role guard:

- Public auth route.
- Must not expose whether a specific email exists.

Request validation needed:

- Email required.
- Password required.
- Generic error for failed login.

Response shape:

- NextAuth-managed responses.
- Application session shape must follow `docs/OPTION_B_AUTH_SESSION_BLUEPRINT.md`.

Risk level: medium to high.

Safe rewrite order: auth phase only, not mixed into API business route rewrites.

## Recommended New Role-Scoped Future Routes

### `app/api/admin/metrics/route.ts`

Purpose:

- Provide admin dashboard aggregates without overloading every list endpoint.

Models:

- `CustomerProfile`
- `Subscription`
- `Order`
- `Delivery`
- `Payment`
- `Expense`
- `MilkProduction`
- `InventoryLog`

Guard:

- `admin`, `staff`.

Response:

- Revenue totals, unpaid totals, delivery counts, subscription counts, expense totals, production and inventory summaries.

Risk level: medium.

### `app/api/admin/agent/route.ts`

Purpose:

- Admin/staff AI assistant for operations, finance, inventory, marketing, and customer support.

Models:

- `AiConversation`
- `AiAgentAction`
- Operational context models as needed.

Guard:

- `admin`, `staff`.

Response:

- Persisted conversation plus pending action suggestions.

Risk level: high.

### `app/api/customer/subscription/route.ts`

Purpose:

- Customer self-service subscription view and requests.

Models:

- `CustomerProfile`
- `Address`
- `Subscription`
- `SubscriptionSchedule`
- `Order`
- `Payment`
- `Complaint`

Guard:

- `customer` with `customerProfileId`.

Response:

- Own subscriptions, default address, recent orders, payment summary, and allowed requested changes.

Risk level: high because ownership checks are mandatory.

### `app/api/customer/agent/route.ts`

Purpose:

- Customer support assistant for subscription questions, missed delivery reports, and extra milk requests.

Models:

- `AiConversation`
- `AiAgentAction`
- `CustomerProfile`
- `Subscription`
- `Order`
- `Delivery`
- `Complaint`

Guard:

- `customer` with `customerProfileId`.

Response:

- Customer-scoped response and pending support actions.

Risk level: high because AI context must be strictly customer-owned.

### `app/api/rider/deliveries/route.ts`

Purpose:

- Rider mobile delivery list and status updates.

Models:

- `RiderProfile`
- `Route`
- `Delivery`
- `Order`
- `OrderItem`
- `Product`
- `CustomerProfile`
- `Address`

Guard:

- `rider` with `riderProfileId`.

Response:

- Today's assigned route and assigned deliveries only.

Risk level: high because assignment scope is safety-critical.

### `app/api/rider/agent/route.ts`

Purpose:

- Rider assistant for route order, missed delivery notes, and customer call scripts.

Models:

- `AiConversation`
- `AiAgentAction`
- `RiderProfile`
- `Route`
- `Delivery`

Guard:

- `rider` with `riderProfileId`.

Response:

- Rider-scoped AI answer and pending action suggestions.

Risk level: high because rider context must not include unassigned customers.

## Safe Rewrite Order

Recommended sequence after active Option B schema approval:

1. Add shared non-route utilities:
   - API error helper.
   - Decimal serializer.
   - Zod schemas.
   - Role/ownership guard helpers after auth is approved.
2. Rewrite `app/api/expenses/route.ts`.
3. Rewrite `app/api/customers/route.ts`.
4. Rewrite `app/api/subscriptions/route.ts`.
5. Rewrite `app/api/orders/route.ts`.
6. Rewrite `app/api/payments/route.ts`.
7. Rewrite `app/api/orders/[id]/route.ts`.
8. Rewrite `app/api/deliveries/route.ts` read side.
9. Rewrite `app/api/deliveries/route.ts` generation side.
10. Rewrite `app/api/deliveries/[id]/route.ts`.
11. Rewrite `app/api/agents/route.ts`.
12. Add role-scoped future routes only after existing route compatibility is stable.
13. Add `app/api/auth/[...nextauth]/route.ts` in the auth implementation phase, not as part of business API rewrite.

## Highest Risk API Routes

### `app/api/deliveries/route.ts`

Risk: very high.

Why:

- It generates orders, items, and deliveries from subscriptions.
- Option B adds schedules, addresses, routes, riders, required `scheduledAt`, and duplicate prevention concerns.
- Bugs here can create duplicate customer charges or delivery rows.

### `app/api/payments/route.ts`

Risk: high.

Why:

- Current behavior marks any order paid after any payment.
- Option B needs partial payment support and aggregate status recalculation.
- Bugs here directly affect finance reporting.

### `app/api/customers/route.ts`

Risk: high.

Why:

- Current direct customer fields move into `CustomerProfile` and `Address`.
- Customer creation may be confused with user/login creation unless separated.

### `app/api/agents/route.ts`

Risk: high.

Why:

- It touches broad operational context.
- It should persist AI audit records without mutating core business records.
- Role-scoped customer/rider AI contexts must not leak data.

## Build Verification Plan

Do not run these commands in this blueprint phase. After active schema and route rewrites are approved, verify in this order:

1. `npx prisma validate`
2. `npx prisma generate`
3. `npm run lint`
4. `npm run build`

Recommended verification cadence:

- Run lint/build after each route group if possible.
- Prioritize TypeScript errors from Prisma relation names and Decimal serialization.
- Treat build success as source compatibility only, not as migration approval.

## Rollback Plan

### During This Blueprint Phase

- Rollback is Git-only: delete or revise this document.
- No database rollback is needed.

### During Future Route Rewrite Before Migration

1. Revert the route-specific commit.
2. Revert shared formatter/validator changes only if they are unused by other completed routes.
3. Regenerate Prisma Client only if that future phase changed schema or generated client state.
4. Run lint/build after rollback.

### After Future Migration

1. Stop writes if production-like data is involved.
2. Restore from the approved database backup or apply a reviewed rollback migration.
3. Revert app deployment to the matching schema/API version.
4. Verify auth, customers, orders, deliveries, payments, and dashboard reads.

## Recommended Next Step

Commit this blueprint after review. The next doc-only planning step should be a route implementation checklist or validator/response-shape draft. Do not rewrite API files until active Option B schema replacement, Prisma Client generation, auth strategy, and migration safety gates are explicitly approved.
