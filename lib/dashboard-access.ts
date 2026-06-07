import { redirect } from "next/navigation";

import { type DashboardRole, auth, normalizeUserRole } from "@/lib/auth";

const dashboardPaths: Record<DashboardRole, string> = {
  RIDER: "/dashboard/rider",
  ADMIN: "/dashboard/admin",
  CUSTOMER: "/dashboard/customer"
};

export function getDashboardPathForRole(role: string | null | undefined): string | null {
  const normalizedRole = normalizeUserRole(role);

  return normalizedRole ? dashboardPaths[normalizedRole] : null;
}

export async function requireDashboardRole(
  requiredRole: DashboardRole,
  dashboardPath: string
) {
  const session = await auth();
  const role = normalizeUserRole(session?.user?.role);

  if (!session?.user?.id || !role) {
    redirect(`/login?callbackUrl=${encodeURIComponent(dashboardPath)}`);
  }

  if (role !== requiredRole) {
    const allowedPath = getDashboardPathForRole(role);

    if (allowedPath) {
      redirect(allowedPath);
    }

    redirect("/login?error=AccessDenied");
  }
}
