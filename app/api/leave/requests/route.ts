import { NextResponse } from "next/server";
import { hasPermission } from "@/modules/rbac/permission.guard";
import { getLeaveRequests } from "@/modules/leave/leave.service";

export async function GET() {
  try {
    await hasPermission("LEAVE_APPROVE");

    const data = await getLeaveRequests();

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
