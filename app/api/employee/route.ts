import { NextResponse } from "next/server";
import { hasPermission } from "@/modules/rbac/permission.guard";
import { getAllEmployees } from "@/modules/employee/employee.service";

export async function GET(req: Request) {
  try {
    await hasPermission(req, "EMPLOYEE_READ");

    const employees = await getAllEmployees();

    return NextResponse.json(employees);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
