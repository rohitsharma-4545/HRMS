import { prisma } from "@/lib/prisma";
import { leavePolicy } from "@/config/leavePolicy";

export async function runMonthlyAccrual() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const employees = await prisma.employee.findMany({
    select: { id: true },
  });

  for (const employee of employees) {
    for (const type of Object.keys(leavePolicy) as Array<
      keyof typeof leavePolicy
    >) {
      const policy = leavePolicy[type];

      const balance = await prisma.leaveBalance.findUnique({
        where: {
          employeeId_type_year: {
            employeeId: employee.id,
            type,
            year: currentYear,
          },
        },
      });

      if (!balance) {
        await prisma.leaveBalance.create({
          data: {
            employeeId: employee.id,
            type,
            total: policy.monthlyAccrual,
            year: currentYear,
            lastAccruedMonth: currentMonth,
          },
        });
        continue;
      }

      if (balance.lastAccruedMonth === currentMonth) {
        continue; // Already accrued this month
      }

      const newTotal = Math.min(
        balance.total + policy.monthlyAccrual,
        policy.maxPerYear,
      );

      await prisma.leaveBalance.update({
        where: {
          employeeId_type_year: {
            employeeId: employee.id,
            type,
            year: currentYear,
          },
        },
        data: {
          total: newTotal,
          lastAccruedMonth: currentMonth,
        },
      });
    }
  }

  return { success: true };
}
