import { AdminCreateRiderForm } from "@/components/admin/admin-create-rider-form";
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
      <div className="fixed bottom-4 left-4 z-40 w-[calc(100vw-2rem)] max-w-sm sm:bottom-6 sm:left-6">
        <AdminCreateRiderForm />
      </div>
      <AdminDashboardClient initialAgent={initialAgent} initialAgentState={initialAgentState} />
    </>
  );
}
