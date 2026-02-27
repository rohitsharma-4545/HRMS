import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { getCurrentUser } from "@/modules/auth/auth.service";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  if (user.passwordChangeRequired) {
    redirect("/change-password");
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header user={user} />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
