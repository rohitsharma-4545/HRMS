import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  const lastYear = now.getFullYear() - 1;

  const expiredGrace = new Date();
  expiredGrace.setDate(now.getDate() - 1);

  const [notices, leaves, holidays, attendance] = await Promise.all([
    prisma.notice.count({
      where: {
        OR: [
          { createdAt: { lt: threeMonthsAgo } },
          {
            expiresAt: {
              not: null,
              lt: expiredGrace,
            },
          },
        ],
      },
    }),

    prisma.leave.count({
      where: {
        status: "PENDING",
        appliedAt: { lt: threeMonthsAgo },
      },
    }),

    prisma.holiday.count({
      where: {
        date: {
          lt: new Date(`${lastYear}-12-31`),
        },
      },
    }),

    prisma.attendance.count({
      where: {
        date: { lt: threeMonthsAgo },
      },
    }),
  ]);

  return NextResponse.json({
    notices,
    leaves,
    holidays,
    attendance,
  });
}
