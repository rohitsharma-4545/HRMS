import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Seeding roles and permissions...");

  /*
   |--------------------------------------------------------------------------
   | 1️⃣ Default Permissions
   |--------------------------------------------------------------------------
   */

  const permissions = [
    // User Management
    "USER_CREATE",
    "USER_READ",
    "USER_UPDATE",
    "USER_DELETE",

    // Employee Management
    "EMPLOYEE_CREATE",
    "EMPLOYEE_READ",
    "EMPLOYEE_UPDATE",
    "EMPLOYEE_DELETE",

    // Department
    "DEPARTMENT_CREATE",
    "DEPARTMENT_READ",
    "DEPARTMENT_UPDATE",
    "DEPARTMENT_DELETE",

    // Attendance
    "ATTENDANCE_CREATE",
    "ATTENDANCE_READ",
    "ATTENDANCE_UPDATE",

    // Leave
    "LEAVE_CREATE",
    "LEAVE_READ",
    "LEAVE_APPROVE",
    "LEAVE_REJECT",

    // Payroll
    "PAYROLL_CREATE",
    "PAYROLL_READ",
    "PAYROLL_UPDATE",

    // Document
    "DOCUMENT_UPLOAD",
    "DOCUMENT_READ",
    "DOCUMENT_DELETE",

    // Audit
    "AUDIT_READ",
  ];

  const permissionRecords = await Promise.all(
    permissions.map((name) =>
      prisma.permission.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const permissionMap = Object.fromEntries(
    permissionRecords.map((p) => [p.name, p.id]),
  );

  /*
   |--------------------------------------------------------------------------
   | 2️⃣ Roles
   |--------------------------------------------------------------------------
   */

  const roles = ["SUPER_ADMIN", "HR", "MANAGER", "EMPLOYEE"];

  const roleRecords = await Promise.all(
    roles.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const roleMap = Object.fromEntries(roleRecords.map((r) => [r.name, r.id]));

  /*
   |--------------------------------------------------------------------------
   | 3️⃣ Assign Permissions to Roles
   |--------------------------------------------------------------------------
   */

  const rolePermissions: Record<string, string[]> = {
    SUPER_ADMIN: permissions, // All permissions

    HR: [
      "EMPLOYEE_CREATE",
      "EMPLOYEE_READ",
      "EMPLOYEE_UPDATE",
      "DEPARTMENT_READ",
      "DEPARTMENT_UPDATE",
      "LEAVE_READ",
      "LEAVE_APPROVE",
      "LEAVE_REJECT",
      "PAYROLL_CREATE",
      "PAYROLL_READ",
      "PAYROLL_UPDATE",
      "DOCUMENT_UPLOAD",
      "DOCUMENT_READ",
    ],

    MANAGER: [
      "EMPLOYEE_READ",
      "ATTENDANCE_READ",
      "LEAVE_READ",
      "LEAVE_APPROVE",
      "LEAVE_REJECT",
      "DOCUMENT_READ",
    ],

    EMPLOYEE: [
      "ATTENDANCE_CREATE",
      "ATTENDANCE_READ",
      "LEAVE_CREATE",
      "LEAVE_READ",
      "DOCUMENT_UPLOAD",
      "DOCUMENT_READ",
    ],
  };

  for (const roleName of Object.keys(rolePermissions)) {
    const roleId = roleMap[roleName];
    const perms = rolePermissions[roleName];

    for (const permName of perms) {
      const permissionId = permissionMap[permName];

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId,
          permissionId,
        },
      });
    }
  }
  const superAdminEmail = "admin@company.com";
  const superAdminPassword = await bcrypt.hash("Admin@123", 10); //Jes@123

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      email: superAdminEmail,
      password: superAdminPassword,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdmin.id,
        roleId: roleMap["SUPER_ADMIN"],
      },
    },
    update: {},
    create: {
      userId: superAdmin.id,
      roleId: roleMap["SUPER_ADMIN"],
    },
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
