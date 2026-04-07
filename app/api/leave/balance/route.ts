import { NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/auth.service";
import { getLeaveBalances } from "@/modules/leave/leave.service";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user.employeeId) throw new Error("Unauthorized");

    const data = await getLeaveBalances(user.employeeId);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
