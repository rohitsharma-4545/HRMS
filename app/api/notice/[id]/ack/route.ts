import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/modules/auth/auth.service";
import { hasPermission } from "@/modules/rbac/permission.guard";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await hasPermission("EMPLOYEE_READ");

    const { id } = await context.params;

    const user = await getCurrentUser();

    if (!user?.employeeId) {
      throw new Error("Unauthorized");
    }

    await prisma.noticeAcknowledgement.upsert({
      where: {
        noticeId_employeeId: {
          noticeId: id,
          employeeId: user.employeeId,
        },
      },
      update: {},
      create: {
        noticeId: id,
        employeeId: user.employeeId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
