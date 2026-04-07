import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import { AppUser } from "@/types/user";

export async function createUserByHR(data: {
  email?: string;
  phone?: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  departmentId?: string;
  roleName: string;
  designation: string;
  joiningDate: Date;
  salary: number;
}) {
  const {
    email,
    phone,
    employeeCode,
    firstName,
    lastName,
    departmentId,
    roleName,
    designation,
    joiningDate,
    salary,
  } = data;

  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) throw new Error("Invalid role");

  const tempPassword = `${firstName.toLowerCase()}123`;
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        forcePasswordChange: true,
      },
    });

    const employee = await tx.employee.create({
      data: {
        userId: user.id,
        employeeCode,
        firstName,
        lastName,
        departmentId: departmentId || null,
        designation: designation || null,
        joiningDate: joiningDate ? new Date(joiningDate) : null,
        salary: salary ? Number(salary) : null,
      },
    });

    await tx.personalProfile.create({
      data: {
        employeeId: employee.id,
        firstName,
        lastName,
      },
    });

    await tx.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });

    return user;
  });

  return {
    user: result,
    temporaryPassword: tempPassword,
  };
}

export async function loginWithPassword(identifier: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { phone: identifier },
        {
          employee: {
            employeeCode: identifier,
          },
        },
      ],
    },
    include: {
      employee: true,
      userRoles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) throw new Error("Invalid credentials");
  if (!user.password) throw new Error("Password login not enabled");
  if (!user.isActive) throw new Error("Account disabled");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const roles = user.userRoles.map((r) => r.role.name);

  const permissions = [
    ...new Set(
      user.userRoles.flatMap((ur) =>
        ur.role.permissions.map((rp) => rp.permission.name),
      ),
    ),
  ];

  if (user.forcePasswordChange) {
    const token = signToken({
      userId: user.id,
      roles,
      permissions,
      employeeId: user.employee?.id || null,
      passwordChangeRequired: true,
    });

    return {
      forcePasswordChange: true,
      token,
    };
  }

  const token = signToken({
    userId: user.id,
    roles,
    permissions,
    employeeId: user.employee?.id || null,
  });

  return { token, user };
}

export async function generateOtp(identifier: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
  });

  if (!user) throw new Error("User not found");

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.otp.create({
    data: {
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  // TODO: integrate email/SMS provider
  console.log("OTP:", code);

  return true;
}

export async function verifyOtp(identifier: string, code: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  const otp = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otp) throw new Error("Invalid or expired OTP");

  await prisma.otp.update({
    where: { id: otp.id },
    data: { used: true },
  });

  const roles = user.userRoles.map((r) => r.role.name);

  const permissions = [
    ...new Set(
      user.userRoles.flatMap((ur) =>
        ur.role.permissions.map((rp) => rp.permission.name),
      ),
    ),
  ];

  const token = signToken({
    userId: user.id,
    roles,
    permissions,
  });

  return { token };
}

export async function getCurrentUser(): Promise<AppUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Authentication required");

  try {
    const decoded = verifyToken(token) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return {
      userId: decoded.userId,
      roles: decoded.roles,
      permissions: decoded.permissions || [],
      employeeId: decoded.employeeId ?? null,
      passwordChangeRequired: decoded.passwordChangeRequired ?? false,
      firstName: user.employee?.firstName,
      lastName: user.employee?.lastName,
    };
  } catch {
    throw new Error("Invalid token");
  }
}
