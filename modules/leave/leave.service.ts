import { prisma } from "@/lib/prisma";
import { calculateWorkingDays } from "./workingDays.util";

export async function applyLeave(
  employeeId: string,
  type: "ANNUAL" | "SICK" | "CASUAL",
  startDate: Date,
  endDate: Date,
  reason: string,
) {
  if (startDate > endDate) {
    throw new Error("Invalid date range");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate < today) {
    throw new Error("Cannot apply leave in past");
  }

  // Overlap check
  const overlap = await prisma.leave.findFirst({
    where: {
      employeeId,
      status: {
        in: ["PENDING", "APPROVED"],
      },
      OR: [
        {
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      ],
    },
  });

  if (overlap) {
    throw new Error("Leave already exists in selected range");
  }

  const days = await calculateWorkingDays(startDate, endDate);

  const year = startDate.getFullYear();

  console.log(employeeId, type, year);

  const balance = await prisma.leaveBalance.findUnique({
    where: {
      employeeId_type_year: {
        employeeId,
        type,
        year,
      },
    },
  });

  if (!balance) {
    throw new Error("Leave balance not initialized");
  }

  const remaining = balance.total - balance.used;

  if (remaining < days) {
    throw new Error("Insufficient leave balance");
  }

  return prisma.leave.create({
    data: {
      employeeId,
      type,
      startDate,
      endDate,
      reason,
      days,
    },
  });
}

export async function getLeaveHistory(employeeId: string) {
  return prisma.leave.findMany({
    where: { employeeId },
    orderBy: { appliedAt: "desc" },
  });
}

export async function approveLeave(id: string, reviewerId: string) {
  return prisma.$transaction(async (tx) => {
    const leave = await tx.leave.findUnique({ where: { id } });

    if (!leave) throw new Error("Leave not found");
    if (leave.status !== "PENDING")
      throw new Error("Only pending leave can be approved");

    const year = leave.startDate.getFullYear();

    const balance = await tx.leaveBalance.findUnique({
      where: {
        employeeId_type_year: {
          employeeId: leave.employeeId,
          type: leave.type,
          year,
        },
      },
    });

    if (!balance) throw new Error("Leave balance not found");

    const remaining = balance.total - balance.used;

    if (remaining < leave.days) {
      throw new Error("Insufficient leave balance");
    }

    await tx.leaveBalance.update({
      where: {
        employeeId_type_year: {
          employeeId: leave.employeeId,
          type: leave.type,
          year,
        },
      },
      data: {
        used: {
          increment: leave.days,
        },
      },
    });

    return tx.leave.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });
  });
}

export async function rejectLeave(id: string, reviewerId: string) {
  const leave = await prisma.leave.findUnique({ where: { id } });

  if (!leave) throw new Error("Leave not found");
  if (leave.status !== "PENDING")
    throw new Error("Only pending leave can be rejected");

  return prisma.leave.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    },
  });
}

export async function cancelLeave(id: string, employeeId: string) {
  const leave = await prisma.leave.findUnique({ where: { id } });

  if (!leave) throw new Error("Leave not found");
  if (leave.employeeId !== employeeId) throw new Error("Unauthorized");

  if (leave.status !== "PENDING")
    throw new Error("Only pending leave can be cancelled");

  return prisma.leave.update({
    where: { id },
    data: {
      status: "CANCELLED",
    },
  });
}
