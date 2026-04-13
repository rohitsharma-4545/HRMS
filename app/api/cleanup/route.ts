import { NextResponse } from "next/server";
import { cleanupOldData } from "@/modules/admin/admin.service";
import { getCurrentUser } from "@/modules/auth/auth.service";
import { hasPermission } from "@/modules/rbac/permission.helper";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!hasPermission(user, "ADMIN_CLEANUP")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const result = await cleanupOldData();

    return NextResponse.json({
      success: true,
      message: "Cleanup completed",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
