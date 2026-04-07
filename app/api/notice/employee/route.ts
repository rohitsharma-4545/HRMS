import { NextResponse } from "next/server";
import { hasPermission } from "@/modules/rbac/permission.guard";
import { getEmployeeNotices } from "@/modules/notice/notice.service";
import { getCurrentEmployee } from "@/modules/auth/auth-context.service";

export async function GET() {
  try {
    await hasPermission("EMPLOYEE_READ");

    const { employee } = await getCurrentEmployee();

    if (!employee?.id || !employee?.departmentId) {
      throw new Error("Invalid employee context");
    }

    const notices = await getEmployeeNotices(
      employee.id,
      employee.departmentId,
    );

    return NextResponse.json(
      notices.map((n) => ({
        ...n,
        currentEmployeeId: employee.id,
      })),
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
