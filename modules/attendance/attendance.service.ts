import { prisma } from "@/lib/prisma";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isWeekend,
  isSameDay,
} from "date-fns";

export async function punchIn(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    return await prisma.attendance.create({
      data: {
        employeeId,
        date: today,
        punchIn: new Date(),
      },
    });
  } catch (error: any) {
    const existing = await prisma.attendance.findFirst({
      where: { employeeId, date: today },
    });

    if (existing?.punchIn) {
      throw new Error("Already punched in today");
    }

    return prisma.attendance.update({
      where: { id: existing!.id },
      data: { punchIn: new Date() },
    });
  }
}

export async function punchOut(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findFirst({
    where: { employeeId, date: today },
  });

  if (!attendance || !attendance.punchIn) {
    throw new Error("Punch in first");
  }

  if (attendance.punchOut) {
    throw new Error("Already punched out");
  }

  const now = new Date();
  const hoursWorked =
    (now.getTime() - attendance.punchIn.getTime()) / (1000 * 60 * 60);

  if (hoursWorked < 1) {
    throw new Error("You can punch out only after 1 hour");
  }

  return prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      punchOut: now,
      totalHours: hoursWorked,
    },
  });
}

export async function getTodayAttendance(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.attendance.findFirst({
    where: {
      employeeId,
      date: today,
    },
  });
}

export async function getAttendanceHistory(employeeId: string) {
  return prisma.attendance.findMany({
    where: { employeeId },
    orderBy: { date: "desc" },
  });
}

export async function startBreak(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findFirst({
    where: { employeeId, date: today },
  });

  if (!attendance || attendance.punchOut) {
    throw new Error("Cannot start break");
  }

  return prisma.break.create({
    data: {
      attendanceId: attendance.id,
      start: new Date(),
    },
  });
}

export async function endBreak(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findFirst({
    where: { employeeId, date: today },
    include: { breaks: true },
  });

  const activeBreak = attendance?.breaks.find((b) => !b.end);

  if (!activeBreak) {
    throw new Error("No active break");
  }

  return prisma.break.update({
    where: { id: activeBreak.id },
    data: { end: new Date() },
  });
}

export async function getAttendanceCalendarView(
  employeeId: string,
  month?: string,
) {
  const target = month ? new Date(month + "-01") : new Date();
  const start = startOfMonth(target);
  const end = endOfMonth(target);

  const raw = await prisma.attendance.findMany({
    where: {
      employeeId,
      date: { gte: start, lte: end },
    },
  });

  const holidays = await prisma.holiday.findMany({
    where: { date: { gte: start, lte: end } },
  });

  const allDays = eachDayOfInterval({ start, end });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return allDays
    .map((day) => {
      const record = raw.find((r) => r.date.getTime() === day.getTime());
      const holiday = holidays.find((h) => isSameDay(h.date, day));

      if (record)
        return { ...record, status: "PRESENT", statusType: "present" };

      if (holiday)
        return {
          date: day,
          status: `HOLIDAY: ${holiday.name}`,
          statusType: "holiday",
          punchIn: null,
          punchOut: null,
          totalHours: null,
        };

      if (isWeekend(day))
        return {
          date: day,
          status: "WEEKLY OFF",
          statusType: "weekoff",
          punchIn: null,
          punchOut: null,
          totalHours: null,
        };

      return {
        date: day,
        status: "ABSENT",
        statusType: "absent",

        punchIn: null,
        punchOut: null,
        totalHours: null,
      };
    })
    .filter((d) => d.date <= today)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
