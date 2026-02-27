import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function hasPermission(req: Request, requiredPermission: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Unauthorized");

  const decoded: any = verifyToken(token);

  const userId = decoded.userId;

  // Fetch user permissions from DB
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  const permissions = user.userRoles.flatMap((ur) =>
    ur.role.permissions.map((rp) => rp.permission.name),
  );

  if (!permissions.includes(requiredPermission)) {
    throw new Error("Forbidden");
  }

  return user;
}
