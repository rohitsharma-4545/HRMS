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

  const now = new Date();

  let attendance = await prisma.attendance.findFirst({
    where: { employeeId, date: today },
    include: { sessions: true },
  });

  if (!attendance) {
    attendance = await prisma.attendance.create({
      data: {
        employeeId,
        date: today,
        firstPunchIn: now,
      },
      include: { sessions: true },
    });
  }

  const activeSession = attendance.sessions.find((s) => !s.punchOut);

  if (activeSession) {
    throw new Error("Already clocked in");
  }

  return prisma.attendanceSession.create({
    data: {
      attendanceId: attendance.id,
      punchIn: now,
    },
  });
}

export async function punchOut(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const now = new Date();

  const attendance = await prisma.attendance.findFirst({
    where: { employeeId, date: today },
    include: { sessions: true },
  });

  if (!attendance) throw new Error("Punch in first");

  const activeSession = attendance.sessions.find((s) => !s.punchOut);

  if (!activeSession) throw new Error("No active session");

  const diffMinutes =
    (now.getTime() - activeSession.punchIn.getTime()) / (1000 * 60);

  if (diffMinutes < 10) {
    throw new Error("Minimum 10 minutes required before clocking out");
  }

  const sessionHours =
    (now.getTime() - activeSession.punchIn.getTime()) / (1000 * 60 * 60);

  const updatedSession = await prisma.attendanceSession.update({
    where: { id: activeSession.id },
    data: { punchOut: now },
  });

  const totalWorked = (attendance.totalHours || 0) + sessionHours;

  await prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      totalHours: totalWorked,
      lastPunchOut: now,
    },
  });

  return updatedSession;
}

export async function getTodayAttendance(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.attendance.findFirst({
    where: {
      employeeId,
      date: today,
    },
    include: {
      sessions: true,
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

  if (!attendance || attendance.lastPunchOut) {
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
          firstPunchIn: null,
          lastPunchOut: null,
          totalHours: null,
        };

      if (isWeekend(day))
        return {
          date: day,
          status: "WEEKLY OFF",
          statusType: "weekoff",
          firstPunchIn: null,
          lastPunchOut: null,
          totalHours: null,
        };

      return {
        date: day,
        status: "ABSENT",
        statusType: "absent",

        firstPunchIn: null,
        lastPunchOut: null,
        totalHours: null,
      };
    })
    .filter((d) => d.date <= today)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
