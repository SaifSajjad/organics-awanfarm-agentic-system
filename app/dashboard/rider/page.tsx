import { RiderDashboardClient } from "@/components/rider-dashboard-client";
import { normalizeRiderDemoState } from "@/components/rider/rider-demo-data";

type RiderDashboardPageProps = {
  searchParams?: Promise<{
    demoState?: string | string[];
  }>;
};

export default async function RiderDashboardPage({ searchParams }: RiderDashboardPageProps) {
  const params = await searchParams;
  const initialDemoState = normalizeRiderDemoState(params?.demoState);

  return (
    <main className="min-h-screen bg-[#fbf9f4]">
      <section className="mx-auto min-h-screen w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <RiderDashboardClient initialDemoState={initialDemoState} />
      </section>
    </main>
  );
}
