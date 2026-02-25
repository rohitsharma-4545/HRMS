import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/modules/auth/auth.service";
import { applyLeave } from "@/app/modules/leave/leave.service";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user.employeeId) {
      throw new Error("Only employees can apply leave");
    }

    const body = await req.json();
    const { leaveType, startDate, endDate, reason } = body;

    const leave = await applyLeave(
      user.employeeId,
      leaveType,
      new Date(startDate),
      new Date(endDate),
      reason,
    );

    return NextResponse.json(leave);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
