import { NextResponse } from "next/server";
import { hasPermission } from "@/app/modules/rbac/permission.guard";
import { rejectLeave } from "@/app/modules/leave/leave.service";
import { getCurrentUser } from "@/app/modules/auth/auth.service";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await hasPermission(req, "LEAVE_APPROVE");

    const user = await getCurrentUser(req);
    const { id } = await context.params;

    const result = await rejectLeave(id, user.userId);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
