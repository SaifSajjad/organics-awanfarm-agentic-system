import { SignOutButton } from "@/components/auth/sign-out-button";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { normalizeAdminAgent, normalizeAdminAgentState } from "@/components/admin/admin-agent-types";
import { requireDashboardRole } from "@/lib/dashboard-access";

type AdminDashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  await requireDashboardRole("ADMIN", "/dashboard/admin");

  const params = searchParams ? await searchParams : {};
  const initialAgent = normalizeAdminAgent(params.agent);
  const initialAgentState = normalizeAdminAgentState(params.agentState);

  return (
    <>
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-5">
        <SignOutButton />
      </div>
      <AdminDashboardClient initialAgent={initialAgent} initialAgentState={initialAgentState} />
    </>
  );
}
