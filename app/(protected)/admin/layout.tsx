import { getCurrentUser } from "@/modules/auth/auth.service";
import { hasPermission } from "@/modules/rbac/permission.helper";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!hasPermission(user, "ADMIN_ACCESS")) {
    redirect("/");
  }

  return <>{children}</>;
}
