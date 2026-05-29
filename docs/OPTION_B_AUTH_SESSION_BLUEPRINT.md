# Option B Auth Session Blueprint

## Scope

This is a documentation-only blueprint for the Option B auth and session strategy. It does not modify `lib/auth.ts`, the active `prisma/schema.prisma`, `prisma/seed.ts`, API routes, dashboards, database state, migrations, Prisma Client generation, build output, stash contents, commits, or pushes.

## Source Files Reviewed

- `prisma/schema.option-b.draft.prisma`
- `docs/OPTION_B_IMPLEMENTATION_SEQUENCE.md`
- `docs/OPTION_B_SEED_BLUEPRINT.md`
- Current dashboard routes:
  - `app/dashboard/admin/page.tsx`
  - `app/dashboard/customer/page.tsx`
  - `app/dashboard/rider/page.tsx`

The current clean branch does not contain these auth files:

- `lib/auth.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `app/auth/signin/page.tsx`

Any auth files in the safety stash should be reviewed as reference only and should not be restored wholesale.

## Current Auth State

- The clean branch currently has no active auth implementation.
- Dashboard routes are publicly reachable demo pages.
- There is no active NextAuth route in `app/api/auth/[...nextauth]/route.ts`.
- There is no active sign-in page at `app/auth/signin/page.tsx`.
- Option B requires auth to be introduced deliberately after the active schema is approved.

## Required User Fields For Option B Auth

Option B uses `User` as the main auth identity. The auth layer should depend on these fields:

| Field | Purpose |
| --- | --- |
| `id` | Stable session subject and ownership reference |
| `email` | Unique login identifier |
| `name` | Display name in session and UI |
| `passwordHash` | Credentials auth verification |
| `role` | Role enum for access control |
| `phone` | Optional operational contact field |
| `active` | Login eligibility flag |
| `customerProfile` | Optional customer ownership scope |
| `riderProfile` | Optional rider ownership scope |
| `createdAt` | Audit/reference field |
| `updatedAt` | Audit/reference field |

The login query should select only the fields needed for auth:

```ts
{
  id: true,
  email: true,
  name: true,
  passwordHash: true,
  role: true,
  active: true,
  customerProfile: { select: { id: true } },
  riderProfile: { select: { id: true } }
}
```

## PasswordHash Strategy

Required behavior:

- Store only salted password hashes in `User.passwordHash`.
- Never store or return plaintext passwords.
- Use one password utility, for example `hashPassword` and `verifyPassword`.
- Keep the hashing algorithm behind a small local helper so the algorithm can change without rewriting auth routes.
- Reject credentials login when `passwordHash` is missing, malformed, or verification fails.
- Keep demo passwords limited to local seed documentation.

Recommended algorithm direction:

- Prefer `bcrypt`, `argon2`, or Node `crypto.scrypt` through a dedicated helper.
- If a package is required, add it in a separate approved implementation phase.
- Do not introduce password hashing inside `prisma/seed.ts` until the seed rewrite phase is explicitly approved.

Seed dependency:

- Option B seed must create hashed demo passwords for admin, staff, rider, and customer users.
- Demo credentials must never be used in production.

## Credentials Login Flow

Recommended flow for a future NextAuth credentials provider:

1. Receive email and password from the sign-in form.
2. Normalize email by trimming and lowercasing.
3. Reject empty email or password before querying Prisma.
4. Query `prisma.user.findUnique` by email.
5. Select `passwordHash`, `active`, `role`, and profile IDs.
6. Reject inactive users.
7. Verify the submitted password against `passwordHash`.
8. Return a minimal auth user object to NextAuth.
9. Store role and profile IDs in the JWT callback.
10. Copy those fields into `session.user` in the session callback.

The auth result should not include `passwordHash`.

## Role Enum Mapping

Prisma should remain the source of truth using uppercase enum values:

| Prisma Role | Session Role | Primary Scope |
| --- | --- | --- |
| `ADMIN` | `admin` | Full administrative access |
| `CUSTOMER` | `customer` | Own customer profile, addresses, subscriptions, orders, payments, complaints |
| `RIDER` | `rider` | Own rider profile, assigned routes, assigned deliveries |
| `STAFF` | `staff` | Operational/admin-adjacent access as approved |

Recommended rule:

- Store uppercase role values in the database.
- Normalize to lowercase in session only.
- Use one helper for role normalization so route guards and API guards do not drift.

## NextAuth Session Shape

Recommended application session user shape:

```ts
type AppSessionUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer" | "rider" | "staff";
  customerProfileId?: string;
  riderProfileId?: string;
};
```

Recommended JWT payload fields:

```ts
type AppJwtFields = {
  sub: string;
  email: string;
  name: string;
  role: "admin" | "customer" | "rider" | "staff";
  customerProfileId?: string;
  riderProfileId?: string;
};
```

Session callback requirement:

- Copy `token.sub` to `session.user.id`.
- Copy `token.role` to `session.user.role`.
- Copy `token.customerProfileId` to `session.user.customerProfileId`.
- Copy `token.riderProfileId` to `session.user.riderProfileId`.

JWT callback requirement:

- On initial sign-in, place role and profile IDs into the token.
- Keep the token minimal.
- Do not store sensitive data in the token.

## Dashboard Routing Rules

The dashboard routes should become role protected after auth is implemented.

| Route | Allowed Roles | Required Scope |
| --- | --- | --- |
| `/dashboard/admin` | `admin`, `staff` | Admin/staff session |
| `/dashboard/customer` | `customer` | `customerProfileId` present |
| `/dashboard/rider` | `rider` | `riderProfileId` present |
| `/operations` | `admin`, `staff` | Admin/staff session |
| `/agents` | `admin`, `staff` initially | Admin/staff session |

Recommended redirect behavior:

- Unauthenticated users go to `/auth/signin?callbackUrl=<current path>`.
- Authenticated users with the wrong role go to their role home page.
- A customer without `customerProfileId` goes to a safe auth error page.
- A rider without `riderProfileId` goes to a safe auth error page.

Recommended role home mapping:

| Session Role | Home Route |
| --- | --- |
| `admin` | `/dashboard/admin` |
| `staff` | `/dashboard/admin` or `/operations` |
| `customer` | `/dashboard/customer` |
| `rider` | `/dashboard/rider` |

## Route Protection Strategy

Recommended first implementation:

- Add server-side route guards before middleware.
- Create a `requireSession` helper.
- Create a `requireRole(allowedRoles)` helper.
- Use guards inside server pages and route handlers.
- Add middleware only after NextAuth route behavior is stable.

Why this order:

- The current clean branch has no middleware auth contract.
- A stale middleware file exists in the safety stash and should not be restored without review.
- Server-side guards are easier to test route by route while the schema and API rewrite are still moving.

Potential future guard helpers:

```ts
requireSession()
requireRole(["admin", "staff"])
requireCustomerProfile()
requireRiderProfile()
```

## API Guard Strategy

API routes should enforce both role access and ownership.

Recommended helper shape:

```ts
authorizeApi({
  roles: ["admin", "staff"],
})
```

Customer ownership helper:

```ts
authorizeCustomerResource(customerProfileId)
```

Rider ownership helper:

```ts
authorizeRiderResource(riderProfileId)
```

Recommended API access rules:

| API Area | Admin | Staff | Customer | Rider |
| --- | --- | --- | --- | --- |
| Customers | Full | Full or limited | Own profile only | No |
| Subscriptions | Full | Full or limited | Own subscriptions only | No |
| Orders | Full | Full or limited | Own orders only | Assigned deliveries only through delivery APIs |
| Deliveries | Full | Full or limited | Own deliveries read-only | Assigned deliveries update |
| Payments | Full | Full or limited | Own payments read-only | No |
| Expenses | Full | Full or limited | No | No |
| Complaints | Full | Full or limited | Own complaints | No |
| AI agents | Full | Limited later | No initially | No initially |

All API guards should return consistent status codes:

- `401` for unauthenticated.
- `403` for authenticated but not allowed.
- `404` when hiding another user's resource is safer than revealing its existence.

## What Current Auth Code Must Change Later

The current clean branch has no active auth code. Later implementation should add auth cleanly instead of restoring old stashed files as-is.

Future files likely needed:

- `lib/auth.ts`
- `lib/password.ts`
- `lib/api-guard.ts`
- `lib/route-guard.ts`
- `lib/auth-provider.tsx`
- `app/api/auth/[...nextauth]/route.ts`
- `app/auth/signin/page.tsx`
- `app/auth/error/page.tsx`

Future dashboard changes:

- `app/dashboard/admin/page.tsx` should require `admin` or `staff`.
- `app/dashboard/customer/page.tsx` should require `customer` and `customerProfileId`.
- `app/dashboard/rider/page.tsx` should require `rider` and `riderProfileId`.
- `AppHeader` may need session-aware navigation and sign-out controls.
- Client dashboard components may need role-specific API calls instead of static/demo data.

Do not make these changes until active schema replacement and auth implementation are explicitly approved.

## Seed Data Required For Auth

Option B seed must include:

| Seed User | Role | Required Relation |
| --- | --- | --- |
| Admin user | `ADMIN` | None |
| Staff user | `STAFF` | None |
| Customer user | `CUSTOMER` | `CustomerProfile.userId` |
| Rider user | `RIDER` | `RiderProfile.userId` |

Each seeded user must have:

- Unique email.
- Display name.
- `passwordHash`.
- Correct uppercase `Role` enum value.
- `active: true`.

Customer seed must include:

- `CustomerProfile` linked to `User`.
- At least one `Address`.
- At least one subscription/order set for dashboard testing.

Rider seed must include:

- `RiderProfile` linked to `User`.
- At least one route.
- Assigned deliveries.

## Implementation Readiness Gates

Auth implementation should wait until these gates are complete:

1. Option B active schema is approved.
2. `User.passwordHash` exists in active schema.
3. `CustomerProfile` and `RiderProfile` are active Prisma models.
4. Prisma Client can be generated from the active schema.
5. Seed strategy is approved.
6. API ownership rules are agreed.
7. `.env` auth secrets are verified without exposing or changing them in this phase.

## Risks

### High Risk: Stale Stash Auth

The safety stash may contain auth files from earlier experiments.

Mitigation:

- Do not restore auth files wholesale.
- Review stashed files only when explicitly approved.
- Rebuild auth around Option B user/profile/session requirements.

### High Risk: Role Casing Drift

The database uses uppercase enum values while the UI/session may prefer lowercase roles.

Mitigation:

- Normalize roles in one helper.
- Keep Prisma writes uppercase.
- Keep session roles lowercase only if the app standardizes on that.

### High Risk: Missing Profile IDs

Customer and rider sessions require profile IDs for ownership checks.

Mitigation:

- Select profile IDs during login.
- Reject or route to an auth error page when a customer/rider user lacks the required profile.
- Seed customer/rider users with linked profiles.

### Medium Risk: Middleware Conflicts

Middleware can conflict with NextAuth routes, static assets, or callback URLs.

Mitigation:

- Start with server-side guards.
- Add middleware only after route guards and auth callbacks are stable.

### Medium Risk: Demo Credential Exposure

Demo passwords are useful for local testing but unsafe outside development.

Mitigation:

- Keep demo credentials in seed documentation only.
- Rotate or disable demo users before production.
- Never log passwords.

### High Risk: API Ownership Bugs

Role checks alone are not enough for customer and rider APIs.

Mitigation:

- Add ownership checks for every customer/rider scoped query.
- Prefer querying by both resource ID and profile ID.
- Add tests after API rewrite begins.

## Rollback Plan

Before schema replacement:

- Delete or revise this blueprint if the auth strategy changes.
- No database rollback is needed because this phase makes no database changes.

After future auth code is added but before migration:

1. Revert auth-related commits.
2. Remove auth route/page additions if needed.
3. Regenerate Prisma Client only if the schema changed in that later phase.
4. Re-run lint/build after rollback.

After future migration and seed:

1. Stop writes if production-like data is involved.
2. Restore from the approved backup or apply a reviewed rollback migration.
3. Revert app deployment to the matching schema/auth version.
4. Verify login, admin dashboard, customer dashboard, rider dashboard, and API ownership checks.

## Recommended Next Step

Proceed with a route-by-route API rewrite blueprint or draft auth implementation plan only. Do not implement auth until the active Option B schema replacement is approved and Prisma Client generation is part of the approved phase.
