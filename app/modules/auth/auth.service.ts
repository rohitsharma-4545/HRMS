import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function createUserByHR(data: {
  email?: string;
  phone?: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  departmentId?: string;
  roleName: string;
}) {
  const {
    email,
    phone,
    employeeCode,
    firstName,
    lastName,
    departmentId,
    roleName,
  } = data;

  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) throw new Error("Invalid role");

  const tempPassword = Math.random().toString(36).slice(-8);
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

    await tx.employee.create({
      data: {
        userId: user.id,
        employeeCode,
        firstName,
        lastName,
        departmentId,
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
          role: true,
        },
      },
    },
  });

  if (!user) throw new Error("Invalid credentials");
  if (!user.password) throw new Error("Password login not enabled");
  if (!user.isActive) throw new Error("Account disabled");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (user.forcePasswordChange) {
    const token = signToken({
      userId: user.id,
      roles: user.userRoles.map((r) => r.role.name),
      employeeId: user.employee?.id || null,
      passwordChangeRequired: true,
    });

    return {
      forcePasswordChange: true,
      token,
    };
  }

  const roles = user.userRoles.map((r) => r.role.name);

  const token = signToken({
    userId: user.id,
    roles,
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
      userRoles: { include: { role: true } },
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

  const token = signToken({
    userId: user.id,
    roles,
  });

  return { token };
}

export async function getCurrentUser(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    return decoded;
  } catch {
    throw new Error("Invalid token");
  }
}
