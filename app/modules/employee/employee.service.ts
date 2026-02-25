import { prisma } from "@/lib/prisma";

export async function getAllEmployees() {
  return prisma.employee.findMany({
    include: {
      user: true,
      department: true,
    },
  });
}

export async function getEmployeeById(id: string) {
  return prisma.employee.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
    },
  });
}

export async function updateEmployee(id: string, data: any) {
  return prisma.employee.update({
    where: { id },
    data,
  });
}

export async function softDeleteEmployee(id: string) {
  return prisma.$transaction(async (tx) => {
    const employee = await tx.employee.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    return tx.user.update({
      where: { id: employee.userId },
      data: {
        isActive: false,
        isDeleted: true,
      },
    });
  });
}
