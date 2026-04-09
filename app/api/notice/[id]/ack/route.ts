import { NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/auth.service";
import { hasPermission } from "@/modules/rbac/permission.guard";
import { acknowledgeNotice } from "@/modules/notice/notice.service";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // await hasPermission("EMPLOYEE_READ");

    const { id } = await context.params;
    const user = await getCurrentUser();

    if (!user?.employeeId) {
      throw new Error("Unauthorized");
    }

    await acknowledgeNotice(id, user.employeeId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
