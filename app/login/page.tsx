import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";
import { getDashboardPathForRole } from "@/lib/dashboard-access";

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const dashboardPath = getDashboardPathForRole(session?.user?.role);
  const params = await searchParams;
  const callbackUrl = Array.isArray(params?.callbackUrl)
    ? params?.callbackUrl[0]
    : params?.callbackUrl;

  if (session?.user?.id && dashboardPath && !callbackUrl) {
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
            <h1 className="text-3xl font-semibold text-[#2d1a0f]">Account Login</h1>
            <p className="text-sm text-[#6f5a45]">Sign in to continue</p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
