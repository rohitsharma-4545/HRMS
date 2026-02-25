import { hasPermission } from "@/app/modules/rbac/permission.guard";
import { NextResponse } from "next/server";
import { createUserByHR } from "@/app/modules/auth/auth.service";

export async function POST(req: Request) {
  try {
    await hasPermission(req, "USER_CREATE");

    const body = await req.json();
    const result = await createUserByHR(body);

    return NextResponse.json({
      success: true,
      temporaryPassword: result.temporaryPassword,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
