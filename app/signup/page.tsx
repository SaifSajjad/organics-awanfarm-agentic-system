import { redirect } from "next/navigation";

import { CustomerSignupForm } from "@/components/auth/customer-signup-form";
import { auth } from "@/lib/auth";
import { getDashboardPathForRole } from "@/lib/dashboard-access";

export default async function SignupPage() {
  const session = await auth();
  const dashboardPath = getDashboardPathForRole(session?.user?.role);

  if (session?.user?.id && dashboardPath) {
    redirect(dashboardPath);
  }

  return (
    <main className="min-h-screen bg-[#fbf9f4] px-4 py-8 text-[#2d1a0f] sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
        <div className="w-full rounded-lg border border-[#e3d8c3] bg-[#fffdf8] p-6 shadow-sm sm:p-8">
          <div className="mb-8 space-y-2">
            <p className="text-sm font-semibold text-[#8b5e34]">
              Organics by Awan Farms
            </p>
            <h1 className="text-3xl font-semibold text-[#2d1a0f]">
              Create Customer Account
            </h1>
            <p className="text-sm text-[#6f5a45]">Join Organics by Awan Farms</p>
          </div>
          <CustomerSignupForm />
        </div>
      </section>
    </main>
  );
}
