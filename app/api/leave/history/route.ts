import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/modules/auth/auth.service";
import { getLeaveHistory } from "@/app/modules/leave/leave.service";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);

    if (!user.employeeId) {
      throw new Error("Only employees allowed");
    }

    const leaves = await getLeaveHistory(user.employeeId);

    return NextResponse.json(leaves);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
