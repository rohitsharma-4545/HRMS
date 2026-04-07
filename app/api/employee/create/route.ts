import { NextResponse } from "next/server";
import { hasPermission } from "@/modules/rbac/permission.guard";
import { createUserByHR } from "@/modules/auth/auth.service";

export async function POST(req: Request) {
  try {
    await hasPermission("EMPLOYEE_CREATE");

    const body = await req.json();

    if (!body.firstName || !body.lastName || !body.employeeCode) {
      throw new Error("Missing required employee fields");
    }

    if (!body.roleName) {
      throw new Error("Role is required");
    }

    if (!body.departmentId) {
      throw new Error("Department is required");
    }

    const result = await createUserByHR(body);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
