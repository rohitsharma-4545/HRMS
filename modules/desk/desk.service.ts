import { prisma } from "@/lib/prisma";

export async function getDeskData(departmentId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  const departmentEmployees = await prisma.employee.findMany({
    where: { departmentId },
    include: {
      department: true,
      user: true,
      attendances: {
        where: {
          date: {
            gte: today,
            lte: endOfDay,
          },
        },
      },
    },
  });

  const birthdaysToday = await prisma.employee.findMany({
    where: {
      joiningDate: {
        not: null,
      },
    },
  });

  const holidays = await prisma.holiday.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  const leavesToday = await prisma.leave.findMany({
    where: {
      status: "APPROVED",
      startDate: { lte: today },
      endDate: { gte: today },
      employee: {
        departmentId,
      },
    },
    include: {
      employee: true,
    },
  });

  return {
    departmentEmployees,
    birthdaysToday,
    holidays,
    leavesToday,
  };
}
