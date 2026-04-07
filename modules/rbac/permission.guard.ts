import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function hasPermission(requiredPermission: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Unauthorized");

  const decoded: any = verifyToken(token);

  const permissions: string[] = decoded.permissions || [];

  if (!permissions.includes(requiredPermission)) {
    throw new Error("Forbidden");
  }

  return decoded;
}
