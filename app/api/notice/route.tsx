import { NextResponse } from "next/server";
import { hasPermission } from "@/modules/rbac/permission.guard";
import { getNotices, createNotice } from "@/modules/notice/notice.service";
import { getCurrentUser } from "@/modules/auth/auth.service";

export async function GET() {
  try {
    await hasPermission("EMPLOYEE_READ");
    const notices = await getNotices();
    return NextResponse.json(notices);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await hasPermission("ADMIN_ACCESS");

    const body = await req.json();

    const user = await getCurrentUser(); // 👈 YOU MUST HAVE THIS

    if (!user?.employeeId) {
      throw new Error("Invalid user");
    }

    const notice = await createNotice({
      ...body,
      createdById: user.employeeId, // ✅ FIX
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });

    return NextResponse.json(notice);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
