import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { normalizeAdminAgent, normalizeAdminAgentState } from "@/components/admin/admin-agent-types";

type AdminDashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialAgent = normalizeAdminAgent(params.agent);
  const initialAgentState = normalizeAdminAgentState(params.agentState);

  return <AdminDashboardClient initialAgent={initialAgent} initialAgentState={initialAgentState} />;
}
