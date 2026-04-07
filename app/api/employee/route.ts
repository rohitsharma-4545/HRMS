import { NextResponse } from "next/server";
import { hasPermission } from "@/modules/rbac/permission.guard";
import { getEmployees } from "@/modules/employee/employee.service";

export async function GET(req: Request) {
  try {
    await hasPermission("EMPLOYEE_READ");

    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q") || "";
    const departments = searchParams.get("departments");

    const departmentIds = departments ? departments.split(",") : [];

    const employees = await getEmployees({
      query,
      departmentIds,
    });

    return NextResponse.json(employees);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
