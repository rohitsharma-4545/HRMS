import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/modules/rbac/permission.guard";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await hasPermission("EMPLOYEE_UPDATE");

    await prisma.bankDetail.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
