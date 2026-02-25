import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/modules/auth/auth.service";
import { punchOut } from "@/app/modules/attendance/attendance.service";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user.employeeId) {
      throw new Error("Only employees can punch out");
    }

    const result = await punchOut(user.employeeId);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
