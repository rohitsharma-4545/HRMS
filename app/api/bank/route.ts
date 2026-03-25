import { NextResponse } from "next/server";
import { upsertBankDetail } from "@/modules/bank/bank.service";
import { hasPermission } from "@/modules/rbac/permission.guard";

export async function POST(req: Request) {
  try {
    // await hasPermission(req, "EMPLOYEE_UPDATE");

    const body = await req.json();

    const result = await upsertBankDetail(body);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
