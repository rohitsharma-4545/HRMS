import { NextResponse } from "next/server";
import { hasPermission } from "@/modules/rbac/permission.guard";
import {
  addHoliday,
  getHolidaysForYear,
} from "@/modules/holiday/holiday.service";

export async function GET(req: Request) {
  try {
    await hasPermission("ADMIN_ACCESS");

    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get("year")) || new Date().getFullYear();

    const holidays = await getHolidaysForYear(year);

    return NextResponse.json(holidays);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await hasPermission("ADMIN_ACCESS");

    const body = await req.json();

    const holiday = await addHoliday({
      name: body.name,
      date: new Date(body.date),
      type: body.type,
    });

    return NextResponse.json(holiday);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
