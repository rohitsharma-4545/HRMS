import { NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/auth.service";
import { getAttendanceCalendarView } from "@/modules/attendance/attendance.service";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user.employeeId) throw new Error("Only employees allowed");

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month") ?? undefined;

    const result = await getAttendanceCalendarView(user.employeeId, month);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
