import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/modules/auth/auth.service";
import { punchIn } from "@/app/modules/attendance/attendance.service";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user.employeeId) {
      throw new Error("Only employees can punch in");
    }

    const result = await punchIn(user.employeeId);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
