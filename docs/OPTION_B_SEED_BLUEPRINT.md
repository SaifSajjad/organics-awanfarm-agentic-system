# Option B Seed Blueprint

## Scope

This is a blueprint only. It does not modify `prisma/seed.ts`, does not create executable seed code, does not replace the active schema, does not touch API/auth/dashboard code, and does not run build, Prisma generate, migrations, `db push`, or database commands.

## Source Documents Reviewed

- `prisma/schema.option-b.draft.prisma`
- `docs/OPTION_B_IMPLEMENTATION_SEQUENCE.md`
- Current `prisma/seed.ts`

## Seed Goals

The Option B seed should create a realistic, self-contained demo dataset for Organics by Awan Farms:

- Users for admin, staff, rider, and customer access.
- Customer/rider profiles linked to users.
- Delivery addresses in Lahore.
- Products for dairy and farm goods.
- Active and custom subscriptions.
- Orders, order items, deliveries, routes, payments, expenses, complaints, production, inventory, and AI audit records.
- Enough data for admin, customer, rider, finance, inventory, and AI agent demos.

The seed must be development/demo-only and must not be run against production data.

## Required Password Hash Strategy

Option B `User` requires `passwordHash`.

Blueprint:

- Use the existing or future `hashPassword(password: string)` utility.
- Store only salted password hashes.
- Never store plaintext passwords in the database.
- Demo passwords may be documented for local demo only.
- Use uppercase Prisma enum values for roles:
  - `ADMIN`
  - `STAFF`
  - `RIDER`
  - `CUSTOMER`

Recommended demo credentials:

- Admin: `admin@organics.com` / `admin123`
- Staff: `staff@organics.com` / `staff123`
- Rider: `rider@organics.com` / `rider123`
- Customer: `customer@organics.com` / `customer123`

Security note:

- These credentials must be treated as local demo data only and must not be used in production.

## Decimal Handling

Option B uses `Decimal` for money and quantities:

- `Product.price`
- `Subscription.quantity`
- `Subscription.rate`
- `SubscriptionSchedule.quantityOverride`
- `Order.subtotal`
- `Order.discount`
- `Order.totalAmount`
- `OrderItem.quantity`
- `OrderItem.rate`
- `OrderItem.total`
- `Payment.amount`
- `Expense.amount`
- `InventoryLog.quantity`
- `MilkProduction.quantityLiters`

Seed values should be passed as strings or Prisma Decimal-compatible values to avoid floating point drift.

Recommended seed style:

```ts
price: "330.00"
quantity: "2.00"
totalAmount: "19800.00"
```

Do not rely on JavaScript float math for final money totals. Calculate simple demo totals carefully and store exact values.

## Relation-Based Execution Order

Use this order so foreign key dependencies are satisfied.

### Cleanup Order

When using a disposable development database, delete from child records to parent records:

1. `aiAgentAction`
2. `aiConversation`
3. `inventoryLog`
4. `milkProduction`
5. `complaint`
6. `payment`
7. `delivery`
8. `route`
9. `orderItem`
10. `order`
11. `subscriptionSchedule`
12. `subscription`
13. `address`
14. `expense`
15. `riderProfile`
16. `customerProfile`
17. `product`
18. `user`

Important:

- This cleanup must only run against a disposable/dev database.
- Do not include destructive cleanup in production seed logic.

### Creation Order

1. Users
2. Customer and rider profiles
3. Addresses
4. Products
5. Subscriptions
6. Subscription schedules
7. Orders
8. Order items
9. Routes
10. Deliveries
11. Payments
12. Expenses
13. Complaints
14. Milk production
15. Inventory logs
16. AI conversations
17. AI agent actions

## Seed Data Plan

### 1. Admin User Seed

Model:

- `User`

Recommended data:

- `id`: deterministic, for example `user-admin`
- `email`: `admin@organics.com`
- `name`: `Admin`
- `passwordHash`: hash of `admin123`
- `role`: `ADMIN`
- `phone`: `0339-5235323`
- `active`: `true`

Purpose:

- Access admin dashboard.
- Create/manage products, subscriptions, deliveries, payments, expenses, and AI agent workflows.

### 2. Staff User Seed

Model:

- `User`

Recommended data:

- `id`: `user-staff`
- `email`: `staff@organics.com`
- `name`: `Operations Staff`
- `passwordHash`: hash of `staff123`
- `role`: `STAFF`
- `phone`: `0339-5235323`
- `active`: `true`

Purpose:

- Future staff-scoped operations testing.

### 3. Customer User And Profile Seed

Models:

- `User`
- `CustomerProfile`

Recommended user data:

- `id`: `user-customer-model-town`
- `email`: `customer@organics.com`
- `name`: `69 E Model Town`
- `passwordHash`: hash of `customer123`
- `role`: `CUSTOMER`
- `phone`: `0339-5235323`
- `active`: `true`

Recommended customer profile:

- `id`: `customer-model-town`
- `userId`: `user-customer-model-town`
- `displayName`: `69 E Model Town`
- `phone`: `0339-5235323`
- `whatsapp`: `923395235323`
- `notes`: `Daily cow milk household subscription`
- `active`: `true`

Additional phone-only customer profiles:

- `customer-bahria-sector-b`
  - `displayName`: `Bahria Sector B`
  - `phone`: `0339-5235323`
  - `notes`: `Buffalo milk family subscription`

- `customer-johar-town`
  - `displayName`: `91 H3 Johar Town`
  - `phone`: `0339-5235323`
  - `notes`: `Delivered paid demo customer`

Purpose:

- Cover logged-in customer dashboard and admin customer management.

### 4. Rider User And Profile Seed

Models:

- `User`
- `RiderProfile`

Recommended user data:

- `id`: `user-rider-primary`
- `email`: `rider@organics.com`
- `name`: `Primary Rider`
- `passwordHash`: hash of `rider123`
- `role`: `RIDER`
- `phone`: `0339-5235323`
- `active`: `true`

Recommended rider profile:

- `id`: `rider-primary`
- `userId`: `user-rider-primary`
- `displayName`: `Primary Rider`
- `phone`: `0339-5235323`
- `vehicleLabel`: `Milk Bike 1`
- `active`: `true`

Purpose:

- Cover rider dashboard and assigned route/delivery updates.

### 5. Address Seed

Model:

- `Address`

Recommended addresses:

- `address-model-town`
  - `customerId`: `customer-model-town`
  - `label`: `Home`
  - `line1`: `69 E Model Town`
  - `area`: `Model Town`
  - `city`: `Lahore`
  - `landmark`: `Near Model Town Park`
  - `isDefault`: `true`

- `address-bahria-sector-b`
  - `customerId`: `customer-bahria-sector-b`
  - `label`: `Home`
  - `line1`: `Bahria Sector B`
  - `area`: `Bahria`
  - `city`: `Lahore`
  - `landmark`: `Sector B`
  - `isDefault`: `true`

- `address-johar-town`
  - `customerId`: `customer-johar-town`
  - `label`: `Home`
  - `line1`: `91 H3 Johar Town`
  - `area`: `Johar Town`
  - `city`: `Lahore`
  - `landmark`: `Near main boulevard`
  - `isDefault`: `true`

Optional later areas:

- Askari 11
- Gulberg
- Iqbal Town
- State Life
- Harbanspura

### 6. Product Seed

Model:

- `Product`

Required products:

- Cow Milk
  - `id`: `product-cow-milk`
  - `name`: `Cow Milk`
  - `type`: `COW_MILK`
  - `unit`: `liter`
  - `price`: `330.00`
  - `active`: `true`

- Buffalo Milk
  - `id`: `product-buffalo-milk`
  - `name`: `Buffalo Milk`
  - `type`: `BUFFALO_MILK`
  - `unit`: `liter`
  - `price`: `430.00`
  - `active`: `true`

- Blend Milk
  - `id`: `product-blend-milk`
  - `name`: `Cow + Buffalo Blend`
  - `type`: `BLEND`
  - `unit`: `liter`
  - `price`: `380.00`
  - `active`: `true`

- Rice
  - `id`: `product-rice`
  - `name`: `Farm Rice`
  - `type`: `RICE`
  - `unit`: `kg`
  - `price`: `450.00`
  - `active`: `true`

- Wheat
  - `id`: `product-wheat`
  - `name`: `Farm Wheat`
  - `type`: `WHEAT`
  - `unit`: `kg`
  - `price`: `220.00`
  - `active`: `true`

### 7. Subscription Seed

Model:

- `Subscription`

Recommended subscriptions:

- Model Town daily cow milk:
  - `id`: `sub-model-town-cow-daily`
  - `customerId`: `customer-model-town`
  - `productId`: `product-cow-milk`
  - `addressId`: `address-model-town`
  - `status`: `ACTIVE`
  - `frequency`: `DAILY`
  - `quantity`: `2.00`
  - `rate`: `330.00`
  - `startDate`: first day of current month
  - `notes`: `Daily morning cow milk delivery`

- Bahria daily buffalo milk:
  - `id`: `sub-bahria-buffalo-daily`
  - `customerId`: `customer-bahria-sector-b`
  - `productId`: `product-buffalo-milk`
  - `addressId`: `address-bahria-sector-b`
  - `status`: `ACTIVE`
  - `frequency`: `DAILY`
  - `quantity`: `4.00`
  - `rate`: `430.00`
  - `startDate`: first day of current month
  - `notes`: `Daily buffalo milk family subscription`

- Johar custom blend milk:
  - `id`: `sub-johar-blend-custom`
  - `customerId`: `customer-johar-town`
  - `productId`: `product-blend-milk`
  - `addressId`: `address-johar-town`
  - `status`: `ACTIVE`
  - `frequency`: `CUSTOM_DAYS`
  - `quantity`: `1.50`
  - `rate`: `380.00`
  - `startDate`: first day of current month
  - `notes`: `Monday, Wednesday, Friday blend milk`

### 8. SubscriptionSchedule Seed

Model:

- `SubscriptionSchedule`

Daily subscriptions:

- No schedule rows are required for simple `DAILY` subscriptions unless the app decides to materialize every day.

Custom-day subscription rows for Johar:

- `schedule-johar-mon`
  - `subscriptionId`: `sub-johar-blend-custom`
  - `dayOfWeek`: `1`
  - `active`: `true`

- `schedule-johar-wed`
  - `subscriptionId`: `sub-johar-blend-custom`
  - `dayOfWeek`: `3`
  - `active`: `true`

- `schedule-johar-fri`
  - `subscriptionId`: `sub-johar-blend-custom`
  - `dayOfWeek`: `5`
  - `active`: `true`

One-time schedule example:

- Optional `specificDate` row for an extra milk request after the API supports it.

### 9. Order Seed

Model:

- `Order`

Recommended orders:

- Pending Model Town order:
  - `id`: `order-model-town-pending`
  - `customerId`: `customer-model-town`
  - `addressId`: `address-model-town`
  - `subscriptionId`: `sub-model-town-cow-daily`
  - `deliveryDate`: today
  - `status`: `PENDING`
  - `paymentStatus`: `UNPAID`
  - `subtotal`: `660.00`
  - `discount`: `0.00`
  - `totalAmount`: `660.00`
  - `notes`: `Today pending cow milk delivery`

- Out-for-delivery Bahria order:
  - `id`: `order-bahria-out`
  - `customerId`: `customer-bahria-sector-b`
  - `addressId`: `address-bahria-sector-b`
  - `subscriptionId`: `sub-bahria-buffalo-daily`
  - `deliveryDate`: today
  - `status`: `OUT_FOR_DELIVERY`
  - `paymentStatus`: `UNPAID`
  - `subtotal`: `1720.00`
  - `discount`: `0.00`
  - `totalAmount`: `1720.00`

- Delivered Johar order:
  - `id`: `order-johar-delivered`
  - `customerId`: `customer-johar-town`
  - `addressId`: `address-johar-town`
  - `subscriptionId`: `sub-johar-blend-custom`
  - `deliveryDate`: yesterday or today
  - `status`: `DELIVERED`
  - `paymentStatus`: `PAID`
  - `subtotal`: `570.00`
  - `discount`: `0.00`
  - `totalAmount`: `570.00`

- Partial payment example:
  - Optional extra order with `paymentStatus`: `PARTIAL`

### 10. OrderItem Seed

Model:

- `OrderItem`

Recommended items:

- `item-model-town-cow`
  - `orderId`: `order-model-town-pending`
  - `productId`: `product-cow-milk`
  - `quantity`: `2.00`
  - `rate`: `330.00`
  - `total`: `660.00`

- `item-bahria-buffalo`
  - `orderId`: `order-bahria-out`
  - `productId`: `product-buffalo-milk`
  - `quantity`: `4.00`
  - `rate`: `430.00`
  - `total`: `1720.00`

- `item-johar-blend`
  - `orderId`: `order-johar-delivered`
  - `productId`: `product-blend-milk`
  - `quantity`: `1.50`
  - `rate`: `380.00`
  - `total`: `570.00`

### 11. Route Seed

Model:

- `Route`

Recommended route:

- `id`: `route-today-primary`
- `riderId`: `rider-primary`
- `routeDate`: today
- `area`: `Model Town / Bahria / Johar Town`
- `status`: `OUT_FOR_DELIVERY`
- `notes`: `Primary demo route for Lahore deliveries`

Purpose:

- Gives rider dashboard route grouping and delivery assignment context.

### 12. Delivery Seed

Model:

- `Delivery`

Recommended deliveries:

- Model Town pending:
  - `id`: `delivery-model-town-pending`
  - `orderId`: `order-model-town-pending`
  - `routeId`: `route-today-primary`
  - `riderId`: `rider-primary`
  - `addressId`: `address-model-town`
  - `status`: `PENDING`
  - `area`: `Model Town`
  - `scheduledAt`: today at morning delivery time

- Bahria out for delivery:
  - `id`: `delivery-bahria-out`
  - `orderId`: `order-bahria-out`
  - `routeId`: `route-today-primary`
  - `riderId`: `rider-primary`
  - `addressId`: `address-bahria-sector-b`
  - `status`: `OUT_FOR_DELIVERY`
  - `area`: `Bahria`
  - `scheduledAt`: today
  - `outForDeliveryAt`: today

- Johar delivered:
  - `id`: `delivery-johar-delivered`
  - `orderId`: `order-johar-delivered`
  - `routeId`: `route-today-primary`
  - `riderId`: `rider-primary`
  - `addressId`: `address-johar-town`
  - `status`: `DELIVERED`
  - `area`: `Johar Town`
  - `scheduledAt`: today
  - `outForDeliveryAt`: today
  - `deliveredAt`: today
  - `proofNote`: `Cash collected at door`

### 13. Payment Seed

Model:

- `Payment`

Recommended payments:

- Paid Johar payment:
  - `id`: `payment-johar-cash`
  - `customerId`: `customer-johar-town`
  - `orderId`: `order-johar-delivered`
  - `amount`: `570.00`
  - `status`: `PAID`
  - `method`: `Cash`
  - `reference`: `CASH-JOHAR-001`
  - `notes`: `Paid at delivery`
  - `paidAt`: today

- Optional partial payment:
  - Use a separate order if testing partial finance flows.
  - `status`: `PARTIAL`
  - Ensure order `paymentStatus` matches aggregate payment status.

### 14. Expense Seed

Model:

- `Expense`

Recommended expenses:

- Fuel:
  - `id`: `expense-fuel-today`
  - `type`: `FUEL`
  - `amount`: `900.00`
  - `description`: `Fuel for Model Town and Bahria route`
  - `createdById`: `user-admin`

- Packaging:
  - `id`: `expense-packaging-bottles`
  - `type`: `PACKAGING`
  - `amount`: `2000.00`
  - `description`: `Milk bottles and seals`
  - `createdById`: `user-admin`

- Rider:
  - `id`: `expense-rider-allowance`
  - `type`: `RIDER`
  - `amount`: `1220.00`
  - `description`: `Rider allowance and route expense`
  - `createdById`: `user-admin`

- Farm operations:
  - `id`: `expense-farm-ops-feed`
  - `type`: `FARM_OPS`
  - `amount`: `3500.00`
  - `description`: `Animal feed and farm maintenance`
  - `createdById`: `user-admin`

### 15. Complaint Seed

Model:

- `Complaint`

Recommended complaint:

- `id`: `complaint-model-town-delay`
- `customerId`: `customer-model-town`
- `orderId`: `order-model-town-pending`
- `title`: `Delivery delay`
- `message`: `Customer asked for confirmation on today's delivery timing.`
- `status`: `OPEN`

Optional resolved complaint:

- Add later to test complaint lifecycle.

### 16. MilkProduction Seed

Model:

- `MilkProduction`

Recommended records:

- Cow milk:
  - `id`: `production-cow-today`
  - `productId`: `product-cow-milk`
  - `productionDate`: today
  - `quantityLiters`: `85.00`
  - `source`: `Awan Farms morning milking`
  - `notes`: `Fresh cow milk collected for Lahore delivery`

- Buffalo milk:
  - `id`: `production-buffalo-today`
  - `productId`: `product-buffalo-milk`
  - `productionDate`: today
  - `quantityLiters`: `60.00`
  - `source`: `Awan Farms morning milking`
  - `notes`: `Premium buffalo milk batch`

### 17. InventoryLog Seed

Model:

- `InventoryLog`

Recommended records:

- Cow milk stock in:
  - `id`: `inventory-cow-in-today`
  - `productId`: `product-cow-milk`
  - `quantity`: `85.00`
  - `unit`: `liter`
  - `direction`: `IN`
  - `reason`: `Morning production`

- Buffalo milk stock in:
  - `id`: `inventory-buffalo-in-today`
  - `productId`: `product-buffalo-milk`
  - `quantity`: `60.00`
  - `unit`: `liter`
  - `direction`: `IN`
  - `reason`: `Morning production`

- Milk delivery stock out:
  - `id`: `inventory-milk-out-route`
  - `productId`: `product-buffalo-milk`
  - `quantity`: `4.00`
  - `unit`: `liter`
  - `direction`: `OUT`
  - `reason`: `Bahria subscription delivery`

- Packaging usage:
  - `id`: `inventory-packaging-out`
  - `productId`: `null`
  - `quantity`: `12.00`
  - `unit`: `bottle`
  - `direction`: `OUT`
  - `reason`: `Daily packaging usage`

Note:

- Option B currently keeps `direction` as a string. If an enum is added later, update the seed values accordingly.

### 18. AiConversation Seed

Model:

- `AiConversation`

Recommended records:

- Customer support:
  - `id`: `ai-conversation-support-demo`
  - `userId`: `user-admin`
  - `agentRole`: `CUSTOMER_SUPPORT`
  - `prompt`: `Model Town customer wants to know today's cow milk delivery status.`
  - `response`: `Delivery is pending and assigned to the primary route. Share expected delivery timing with the customer.`
  - `metadata`: route/order/customer IDs

- Finance:
  - `id`: `ai-conversation-finance-demo`
  - `userId`: `user-admin`
  - `agentRole`: `FINANCE`
  - `prompt`: `Summarize today's paid, unpaid, and expense position.`
  - `response`: `Johar Town is paid, Model Town and Bahria remain unpaid, and today's logged expenses include fuel, packaging, rider allowance, and farm operations.`
  - `metadata`: payment/order/expense IDs

### 19. AiAgentAction Seed

Model:

- `AiAgentAction`

Recommended records:

- Payment reminder suggestion:
  - `id`: `ai-action-payment-reminder-bahria`
  - `conversationId`: `ai-conversation-finance-demo`
  - `userId`: `user-admin`
  - `agentRole`: `FINANCE`
  - `actionType`: `SUGGEST_PAYMENT_REMINDER`
  - `targetType`: `ORDER`
  - `targetId`: `order-bahria-out`
  - `status`: `PENDING`
  - `payload`: suggested WhatsApp reminder text

- Delivery follow-up:
  - `id`: `ai-action-delivery-followup-model-town`
  - `conversationId`: `ai-conversation-support-demo`
  - `userId`: `user-admin`
  - `agentRole`: `CUSTOMER_SUPPORT`
  - `actionType`: `SUGGEST_DELIVERY_UPDATE`
  - `targetType`: `DELIVERY`
  - `targetId`: `delivery-model-town-pending`
  - `status`: `PENDING`
  - `payload`: customer update text

Important:

- Seeded AI actions should be suggestions only.
- Do not seed actions that imply automatic mutation without an approval workflow.

## Old Seed Logic To Remove Later

When `prisma/seed.ts` is rewritten for Option B, remove these old assumptions:

- `prisma.customer` should become `prisma.customerProfile`.
- Direct customer `area` and `address` fields should move to `Address`.
- `Rider` model usage should become `RiderProfile`.
- `Product.price` should no longer be `Int`.
- `Subscription.type` should become `frequency`.
- `Subscription.days` should become `SubscriptionSchedule`.
- `Order.totalAmount` should be Decimal-compatible.
- `Order` should include `subtotal` and `discount`.
- `Delivery` should include `scheduledAt`.
- Payment status should not be blindly treated as paid; support `UNPAID`, `PARTIAL`, `PAID`.
- Seed should include `User.passwordHash` with uppercase `Role` enum values.
- Seed should include `Route`, `MilkProduction`, `InventoryLog`, `AiConversation`, and `AiAgentAction`.

Also remove old cleanup order if it references deleted/renamed models.

## Risks

### High Risk: Destructive Cleanup

Deleting records can destroy real data.

Mitigation:

- Only run cleanup against disposable/dev databases.
- Require explicit approval before any database seed run.

### High Risk: Role/Auth Drift

Seeded users must match the final auth/session strategy.

Mitigation:

- Use uppercase Prisma enum values in the seed.
- Normalize to lowercase only inside auth/session code.

### Medium Risk: Decimal Serialization

Seed can create values correctly, but API/UI may serialize Decimal inconsistently.

Mitigation:

- Decide on route-level Decimal serialization before API rewrites.

### High Risk: Payment State Mismatch

`Order.paymentStatus` can drift from actual `Payment` records.

Mitigation:

- Seed payment totals that match order status.
- Implement payment status recalculation in API later.

### Very High Risk: Delivery Generation Assumptions

Subscriptions, schedules, orders, routes, and deliveries are tightly connected.

Mitigation:

- Seed a small but complete set.
- Keep delivery generation API rewrite separate from seed rewrite.

### Medium Risk: AI Actions Look Executable

Seeded AI actions could be interpreted as completed automation.

Mitigation:

- Use `PENDING` status.
- Store suggested actions only.
- Require approval workflow before mutation.

## Rollback Plan

Before any database action:

- Rollback is Git-only: discard or revise the seed draft.

After applying a future seed to a disposable/dev database:

1. Reset the disposable database only after explicit approval.
2. Re-run migration and seed from the matching branch.
3. Do not attempt to repair production data with demo seed cleanup.

After accidental production seed:

1. Stop writes immediately if possible.
2. Restore from verified backup.
3. Audit inserted demo records by deterministic IDs.
4. Remove demo records only through a reviewed cleanup script.

## Recommended Next Step

Create a non-executable draft seed file only after approval, for example:

```text
docs/seed-option-b-flow.md
```

or, if code review is desired without execution:

```text
prisma/seed.option-b.draft.ts
```

Do not replace `prisma/seed.ts`, do not run seed, and do not touch any database until Option B active schema and migration safety are approved.
