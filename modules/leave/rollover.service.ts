import { prisma } from "@/lib/prisma";
import { leavePolicy } from "@/config/leavePolicy";

export async function runYearRollover() {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const balances = await prisma.leaveBalance.findMany({
    where: { year: currentYear },
  });

  for (const balance of balances) {
    const policy = leavePolicy[balance.type];

    let carryForward = 0;

    if (policy.allowCarryForward) {
      const remaining = balance.total - balance.used;

      carryForward = Math.min(remaining, policy.carryForwardCap);
    }

    await prisma.leaveBalance.upsert({
      where: {
        employeeId_type_year: {
          employeeId: balance.employeeId,
          type: balance.type,
          year: nextYear,
        },
      },
      update: {},
      create: {
        employeeId: balance.employeeId,
        type: balance.type,
        year: nextYear,
        total: carryForward,
        used: 0,
      },
    });
  }

  return { success: true };
}
