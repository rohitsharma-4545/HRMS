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
    where: {
      employeeId,
      date: today,
    },
  });

  if (!attendance || !attendance.punchIn) {
    throw new Error("Punch in first");
  }

  if (attendance.punchOut) {
    throw new Error("Already punched out");
  }

  const punchOutTime = new Date();

  const totalHours =
    (punchOutTime.getTime() - attendance.punchIn.getTime()) / (1000 * 60 * 60);

  return prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      punchOut: punchOutTime,
      totalHours,
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
