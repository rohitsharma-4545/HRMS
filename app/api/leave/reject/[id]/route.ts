import { NextResponse } from "next/server";
import { hasPermission } from "@/modules/rbac/permission.guard";
import { rejectLeave } from "@/modules/leave/leave.service";
import { getCurrentUser } from "@/modules/auth/auth.service";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await hasPermission("LEAVE_APPROVE");

    const user = await getCurrentUser();
    const { id } = await context.params;

    if (!user.employeeId) {
      throw new Error("Only employees can reject leave");
    }

    const result = await rejectLeave(id, user.employeeId);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
