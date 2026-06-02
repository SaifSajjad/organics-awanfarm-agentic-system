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
      <section className="mx-auto min-h-screen w-full max-w-[1320px] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 xl:px-10">
        <RiderDashboardClient initialDemoState={initialDemoState} />
      </section>
    </main>
  );
}
