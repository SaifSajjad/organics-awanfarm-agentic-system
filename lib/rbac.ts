import { type DashboardRole, auth, normalizeUserRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AuthenticatedUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: DashboardRole;
};

export type AuthenticatedRider = AuthenticatedUser & {
  riderId: string;
};

export class AuthzError extends Error {
  constructor(
    readonly code: "UNAUTHENTICATED" | "FORBIDDEN",
    message: string,
    readonly status: 401 | 403
  ) {
    super(message);
    this.name = "AuthzError";
  }
}

export async function requireAuthenticatedUser(): Promise<AuthenticatedUser> {
  const session = await auth();
  const user = session?.user;

  const role = normalizeUserRole(user?.role);

  if (!user?.id || !role) {
    throw new AuthzError("UNAUTHENTICATED", "Authentication is required.", 401);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role
  };
}

export async function requireRole(role: string | string[]): Promise<AuthenticatedUser> {
  const user = await requireAuthenticatedUser();
  const allowedRoles = (Array.isArray(role) ? role : [role])
    .map((allowedRole) => normalizeUserRole(allowedRole))
    .filter((allowedRole): allowedRole is NonNullable<typeof allowedRole> =>
      Boolean(allowedRole)
    );

  if (!allowedRoles.includes(user.role)) {
    throw new AuthzError("FORBIDDEN", "The signed-in user is not allowed here.", 403);
  }

  return user;
}

export async function requireRider(): Promise<AuthenticatedRider> {
  const user = await requireRole("RIDER");
  const rider = await prisma.rider.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      active: true
    }
  });

  if (!rider?.active) {
    throw new AuthzError("FORBIDDEN", "A linked active rider account is required.", 403);
  }

  return {
    ...user,
    riderId: rider.id
  };
}
