import { NextRequest, NextResponse } from "next/server";
import { getCalendarEvents } from "@/modules/calendar/calendar.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const departmentId = searchParams.get("departmentId");

  if (!departmentId) {
    return NextResponse.json(
      { error: "departmentId is required" },
      { status: 400 },
    );
  }

  const date = month ? new Date(month) : new Date();

  const events = await getCalendarEvents(date, departmentId);

  return NextResponse.json(events);
}
