import { getCurrentUser } from "@/app/modules/auth/auth.service";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user.passwordChangeRequired) {
    redirect("/change-password");
  }

  return <>{children}</>;
}
