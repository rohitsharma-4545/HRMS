import { prisma } from "@/lib/prisma";

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
    // If record already exists
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
