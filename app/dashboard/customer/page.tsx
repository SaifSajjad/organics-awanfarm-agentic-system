import { SignOutButton } from "@/components/auth/sign-out-button";
import { CustomerDashboardClient } from "@/components/customer/customer-dashboard-client";
import { requireDashboardRole } from "@/lib/dashboard-access";

export default async function CustomerDashboardPage() {
  await requireDashboardRole("CUSTOMER", "/dashboard/customer");

  return (
    <>
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-5">
        <SignOutButton />
      </div>
      <CustomerDashboardClient />
    </>
  );
}
