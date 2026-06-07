import { SignOutButton } from "@/components/auth/sign-out-button";
import { RiderDashboardClient } from "@/components/rider-dashboard-client";
import { normalizeRiderDemoState } from "@/components/rider/rider-demo-data";
import { requireDashboardRole } from "@/lib/dashboard-access";

type RiderDashboardPageProps = {
  searchParams?: Promise<{
    demoState?: string | string[];
  }>;
};

export default async function RiderDashboardPage({ searchParams }: RiderDashboardPageProps) {
  await requireDashboardRole("RIDER", "/dashboard/rider");

  const params = await searchParams;
  const initialDemoState = normalizeRiderDemoState(params?.demoState);

  return (
    <main className="min-h-screen bg-[#fbf9f4]">
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-5">
        <SignOutButton />
      </div>
      <section className="mx-auto min-h-screen w-full max-w-[1320px] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 xl:px-10">
        <RiderDashboardClient initialDemoState={initialDemoState} />
      </section>
    </main>
  );
}
