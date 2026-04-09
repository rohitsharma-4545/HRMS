import { NextResponse } from "next/server";
import { hasPermission } from "@/modules/rbac/permission.guard";
import { searchEmployees } from "@/modules/employee/employee.service";

export async function GET(req: Request) {
  try {
    // await hasPermission("EMPLOYEE_READ");

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const employees = await searchEmployees(query);

    return NextResponse.json(employees);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
