import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth.service";

export async function getCurrentEmployee() {
  const user = await getCurrentUser();

  if (!user.employeeId) {
    throw new Error("Employee context not found");
  }

  const employee = await prisma.employee.findUnique({
    where: { id: user.employeeId },
    include: {
      department: true,
      user: true,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  return {
    user,
    employee,
  };
}
