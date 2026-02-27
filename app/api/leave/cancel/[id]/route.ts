import { NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/auth.service";
import { cancelLeave } from "@/modules/leave/leave.service";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    const { id } = await context.params;

    if (!user.employeeId) {
      throw new Error("Only employees allowed");
    }

    const result = await cancelLeave(id, user.employeeId);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
