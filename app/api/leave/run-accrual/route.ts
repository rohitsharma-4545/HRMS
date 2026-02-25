import { NextResponse } from "next/server";
import { hasPermission } from "@/app/modules/rbac/permission.guard";
import { runMonthlyAccrual } from "@/app/modules/leave/accrual.service";

export async function POST(req: Request) {
  try {
    await hasPermission(req, "LEAVE_APPROVE");

    const result = await runMonthlyAccrual();

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
