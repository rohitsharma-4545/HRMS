import { NextResponse } from "next/server";
import { hasPermission } from "@/app/modules/rbac/permission.guard";
import { runYearRollover } from "@/app/modules/leave/rollover.service";

export async function POST(req: Request) {
  try {
    await hasPermission(req, "LEAVE_APPROVE");

    const result = await runYearRollover();

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
