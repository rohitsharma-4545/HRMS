import { prisma } from "@/lib/prisma";
import { subDays, subMonths, subYears } from "date-fns";
import { DATA_RETENTION } from "@/config/constants";

export async function cleanupOldData() {
  const now = new Date();

  const results = {
    notices: 0,
    leaves: 0,
    holidays: 0,
    attendance: 0,
  };

  const noticeCutoff = subDays(now, DATA_RETENTION.NOTICES_DAYS);
  const expiredGrace = subDays(now, 1);

  const deletedNotices = await prisma.notice.deleteMany({
    where: {
      OR: [
        {
          createdAt: { lt: noticeCutoff },
        },
        {
          expiresAt: {
            not: null,
            lt: expiredGrace,
          },
        },
      ],
    },
  });

  results.notices = deletedNotices.count;

  const leaveCutoff = subDays(now, DATA_RETENTION.LEAVES_PENDING_DAYS);

  const deletedLeaves = await prisma.leave.deleteMany({
    where: {
      status: "PENDING",
      appliedAt: { lt: leaveCutoff },
    },
  });

  results.leaves = deletedLeaves.count;

  const holidayCutoff = subYears(now, DATA_RETENTION.HOLIDAYS_YEARS);

  const deletedHolidays = await prisma.holiday.deleteMany({
    where: {
      date: { lt: holidayCutoff },
    },
  });

  results.holidays = deletedHolidays.count;

  const attendanceCutoff = subMonths(now, DATA_RETENTION.ATTENDANCE_MONTHS);

  const deletedAttendance = await prisma.attendance.deleteMany({
    where: {
      date: { lt: attendanceCutoff },
    },
  });

  results.attendance = deletedAttendance.count;

  return results;
}
