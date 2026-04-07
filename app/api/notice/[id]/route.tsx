import { NextResponse } from "next/server";
import { hasPermission } from "@/modules/rbac/permission.guard";
import { updateNotice, deleteNotice } from "@/modules/notice/notice.service";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await hasPermission("ADMIN_ACCESS");

    const { id } = await context.params;
    const body = await req.json();

    const updated = await updateNotice(id, {
      ...body,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });

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
    await hasPermission("ADMIN_ACCESS");

    const { id } = await context.params;

    await deleteNotice(id);

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
