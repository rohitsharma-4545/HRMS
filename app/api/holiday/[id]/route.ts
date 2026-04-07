import { NextResponse } from "next/server";
import { hasPermission } from "@/modules/rbac/permission.guard";
import {
  updateHoliday,
  deleteHoliday,
} from "@/modules/holiday/holiday.service";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await hasPermission("ADMIN_ACCESS");

    const { id } = await context.params;

    const body = await req.json();

    const updated = await updateHoliday(id, {
      name: body.name,
      date: new Date(body.date),
      type: body.type,
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

    await deleteHoliday(id);

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
