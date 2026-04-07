import { prisma } from "@/lib/prisma";

type CelebrationBucket<T> = {
  today: T[];
  upcoming: T[];
};

type EmployeeWithRelations = Awaited<
  ReturnType<typeof prisma.employee.findMany>
>[number];

export function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function getMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  return { start, end };
}

export function getNextWeekEnd(date: Date) {
  const end = new Date(date);
  end.setDate(end.getDate() + 7);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function isSameDayMonth(date: Date, target: Date) {
  return (
    date.getDate() === target.getDate() && date.getMonth() === target.getMonth()
  );
}

export function isWithinNextWeek(date: Date, today: Date, nextWeekEnd: Date) {
  const normalized = new Date(
    today.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  return normalized >= today && normalized <= nextWeekEnd;
}

function getRecentRange(days: number) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  return { start, end };
}

export async function getDeskData(departmentId: string) {
  const { start: today, end: endOfDay } = getTodayRange();
  const { start: startOfMonth, end: endOfMonth } = getMonthRange(today);
  const { start: recentStart, end: recentEnd } = getRecentRange(7);
  const nextWeekEnd = getNextWeekEnd(today);

  const [departmentEmployees, allEmployees, holidays, leavesToday, newJoinees] =
    await Promise.all([
      prisma.employee.findMany({
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
            include: {
              sessions: true,
            },
          },
        },
      }),

      prisma.employee.findMany({
        include: {
          personalProfile: true,
          user: true,
          department: true,
        },
      }),

      prisma.holiday.findMany({
        where: {
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),

      prisma.leave.findMany({
        where: {
          status: "APPROVED",
          startDate: { lte: today },
          endDate: { gte: today },
          employee: { departmentId },
        },
        include: {
          employee: true,
        },
      }),

      prisma.employee.findMany({
        where: {
          joiningDate: {
            not: null,
            gte: recentStart,
            lte: recentEnd,
          },
        },
        include: {
          user: true,
          department: true,
        },
        orderBy: {
          joiningDate: "desc",
        },
      }),
    ]);

  const celebrations: {
    birthdays: CelebrationBucket<EmployeeWithRelations>;
    workAnniversary: CelebrationBucket<EmployeeWithRelations>;
    marriageAnniversary: CelebrationBucket<EmployeeWithRelations>;
  } = {
    birthdays: { today: [], upcoming: [] },
    workAnniversary: { today: [], upcoming: [] },
    marriageAnniversary: { today: [], upcoming: [] },
  };

  for (const emp of allEmployees) {
    const profile = emp.personalProfile;

    if (profile?.birthDate) {
      if (isSameDayMonth(profile.birthDate, today)) {
        celebrations.birthdays.today.push(emp);
      } else if (isWithinNextWeek(profile.birthDate, today, nextWeekEnd)) {
        celebrations.birthdays.upcoming.push(emp);
      }
    }

    if (emp.joiningDate) {
      if (isSameDayMonth(emp.joiningDate, today)) {
        celebrations.workAnniversary.today.push(emp);
      } else if (isWithinNextWeek(emp.joiningDate, today, nextWeekEnd)) {
        celebrations.workAnniversary.upcoming.push(emp);
      }
    }

    if (profile?.anniversaryDate) {
      if (isSameDayMonth(profile.anniversaryDate, today)) {
        celebrations.marriageAnniversary.today.push(emp);
      } else if (
        isWithinNextWeek(profile.anniversaryDate, today, nextWeekEnd)
      ) {
        celebrations.marriageAnniversary.upcoming.push(emp);
      }
    }
  }

  const newJoineesData = {
    today: [] as typeof newJoinees,
    recent: [] as typeof newJoinees,
  };

  for (const emp of newJoinees) {
    if (!emp.joiningDate) continue;

    if (isSameDayMonth(emp.joiningDate, today)) {
      newJoineesData.today.push(emp);
    } else {
      newJoineesData.recent.push(emp);
    }
  }

  return {
    departmentEmployees,
    holidays,
    leavesToday,
    celebrations,
    newJoinees: newJoineesData,
  };
}
