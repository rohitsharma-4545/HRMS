import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/modules/auth/auth.service";
import { getAttendanceHistory } from "@/app/modules/attendance/attendance.service";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user.employeeId) {
      throw new Error("Only employees allowed");
    }

    const history = await getAttendanceHistory(user.employeeId);

    return NextResponse.json(history);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
