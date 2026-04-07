import { prisma } from "@/lib/prisma";

// export async function getAllEmployees() {
//   return prisma.employee.findMany({
//     include: {
//       user: true,
//       department: true,
//     },
//   });
// }

export async function getEmployees({
  query,
  departmentIds,
}: {
  query?: string;
  departmentIds?: string[];
}) {
  return prisma.employee.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { firstName: { contains: query, mode: "insensitive" } },
                { lastName: { contains: query, mode: "insensitive" } },
                { employeeCode: { contains: query, mode: "insensitive" } },
                { designation: { contains: query, mode: "insensitive" } },
                {
                  department: {
                    name: { contains: query, mode: "insensitive" },
                  },
                },
              ],
            }
          : {},

        departmentIds?.length
          ? {
              departmentId: { in: departmentIds },
            }
          : {},
      ],
    },
    include: {
      department: true,
      user: {
        select: { isActive: true },
      },
    },
    orderBy: { createdAt: "desc" },
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
  const {
    firstName,
    lastName,
    employeeCode,
    departmentId,
    designation,
    joiningDate,
    salary,
    email,
    phone,
    roleName,
  } = data;

  return prisma.$transaction(async (tx) => {
    const employee = await tx.employee.update({
      where: { id },
      data: {
        firstName,
        lastName,
        employeeCode,
        departmentId,
        designation,
        joiningDate: joiningDate ? new Date(joiningDate) : null,
        salary: salary ? Number(salary) : null,
      },
      include: {
        user: {
          select: { isActive: true },
        },
        department: true,
      },
    });

    if (email || phone) {
      await tx.user.update({
        where: { id: employee.userId },
        data: {
          email: email || undefined,
          phone: phone || undefined,
        },
      });
    }

    if (roleName) {
      const role = await tx.role.findUnique({
        where: { name: roleName },
      });

      if (!role) throw new Error("Invalid role");

      await tx.userRole.deleteMany({
        where: { userId: employee.userId },
      });

      await tx.userRole.create({
        data: {
          userId: employee.userId,
          roleId: role.id,
        },
      });
    }

    return employee;
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

export async function deleteEmployee(id: string) {
  return prisma.$transaction(async (tx) => {
    const employee = await tx.employee.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    // 1. Delete employee (all relations cascade automatically)
    await tx.employee.delete({
      where: { id },
    });

    // 2. Delete user (roles, otps auto cascade)
    await tx.user.delete({
      where: { id: employee.userId },
    });

    return { id };
  });
}

export async function searchEmployees(query: string) {
  return prisma.employee.findMany({
    where: {
      OR: [
        { firstName: { contains: query, mode: "insensitive" } },
        { lastName: { contains: query, mode: "insensitive" } },
        { employeeCode: { contains: query, mode: "insensitive" } },
        {
          user: {
            OR: [
              { email: { contains: query, mode: "insensitive" } },
              { phone: { contains: query, mode: "insensitive" } },
            ],
          },
        },
      ],
    },
    include: {
      department: {
        select: { name: true },
      },
      user: {
        select: { isActive: true },
      },
    },
    take: 15,
  });
}
