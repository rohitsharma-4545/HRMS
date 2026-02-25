import { NextResponse } from "next/server";
import { hasPermission } from "@/app/modules/rbac/permission.guard";
import { getEmployeeById } from "@/app/modules/employee/employee.service";
import { updateEmployee } from "@/app/modules/employee/employee.service";
import { softDeleteEmployee } from "@/app/modules/employee/employee.service";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    await hasPermission(req, "EMPLOYEE_READ");

    const employee = await getEmployeeById(id);

    return NextResponse.json(employee);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    await hasPermission(req, "EMPLOYEE_UPDATE");

    const body = await req.json();

    const updated = await updateEmployee(id, body);

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await hasPermission(req, "EMPLOYEE_DELETE");

    const { id } = await context.params;

    await softDeleteEmployee(id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
