// prisma/seed.ts
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { LeaveType } from "@prisma/client";
import { randomUUID } from "crypto";

async function main() {
  console.log("🌱 Starting JES database seeding...");

  // -------------------------------
  // 1️⃣ Roles
  // -------------------------------
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

  // -------------------------------
  // 2️⃣ Permissions
  // -------------------------------
  const permissions = [
    "USER_CREATE",
    "USER_READ",
    "USER_UPDATE",
    "USER_DELETE",
    "EMPLOYEE_CREATE",
    "EMPLOYEE_READ",
    "EMPLOYEE_UPDATE",
    "EMPLOYEE_DELETE",
    "DEPARTMENT_CREATE",
    "DEPARTMENT_READ",
    "DEPARTMENT_UPDATE",
    "DEPARTMENT_DELETE",
    "ATTENDANCE_CREATE",
    "ATTENDANCE_READ",
    "ATTENDANCE_UPDATE",
    "LEAVE_CREATE",
    "LEAVE_READ",
    "LEAVE_APPROVE",
    "LEAVE_REJECT",
    "PAYROLL_CREATE",
    "PAYROLL_READ",
    "PAYROLL_UPDATE",
    "DOCUMENT_UPLOAD",
    "DOCUMENT_READ",
    "DOCUMENT_DELETE",
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

  // -------------------------------
  // 3️⃣ Assign Permissions to Roles
  // -------------------------------
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
        where: { roleId_permissionId: { roleId, permissionId } },
        update: {},
        create: { roleId, permissionId },
      });
    }
  }

  // -------------------------------
  // 4️⃣ Departments
  // -------------------------------
  const departments = ["Assembly", "Testing", "RND", "Accounts", "HR"];
  const deptRecords = [];
  for (const name of departments) {
    const dept = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    deptRecords.push(dept);
  }
  const deptMap = Object.fromEntries(deptRecords.map((d) => [d.name, d.id]));

  // -------------------------------
  // 5️⃣ Employees
  // -------------------------------
  const employees = [
    // RND
    {
      firstName: "Uttkarsh",
      lastName: "Chaurasiya",
      department: "RND",
      employeeCode: "RND001",
      role: "EMPLOYEE",
    },
    {
      firstName: "Kartik",
      lastName: "Vats",
      department: "RND",
      employeeCode: "RND002",
      role: "EMPLOYEE",
    },
    {
      firstName: "Kamal",
      lastName: "Nayan Pandey",
      department: "RND",
      employeeCode: "RND003",
      role: "EMPLOYEE",
    },
    {
      firstName: "Nitesh",
      lastName: "Malhotra",
      department: "RND",
      employeeCode: "RND004",
      role: "MANAGER",
    },

    // Testing
    {
      firstName: "Lalit",
      lastName: "Nagar",
      department: "Testing",
      employeeCode: "TST001",
      role: "EMPLOYEE",
    },
    {
      firstName: "Sonu",
      lastName: "Baisla",
      department: "Testing",
      employeeCode: "TST002",
      role: "EMPLOYEE",
    },

    // Assembly
    {
      firstName: "Jitender",
      lastName: "",
      department: "Assembly",
      employeeCode: "ASM001",
      role: "EMPLOYEE",
    },

    // HR
    {
      firstName: "Pardeep",
      lastName: "Chauhan",
      department: "HR",
      employeeCode: "HR001",
      role: "HR",
    },

    // Accounts
    {
      firstName: "Akhilesh",
      lastName: "Yadav",
      department: "Accounts",
      employeeCode: "ACC001",
      role: "EMPLOYEE",
    },
  ];

  const currentYear = new Date().getFullYear();

  for (const emp of employees) {
    const password = `${emp.firstName.toLowerCase()}123`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email: `${emp.firstName.toLowerCase()}@jes.com` },
      update: {},
      create: {
        email: `${emp.firstName.toLowerCase()}@jes.com`,
        password: hashedPassword,
        isActive: true,
      },
    });

    const employee = await prisma.employee.upsert({
      where: { employeeCode: emp.employeeCode },
      update: {},
      create: {
        userId: user.id,
        employeeCode: emp.employeeCode,
        firstName: emp.firstName,
        lastName: emp.lastName,
        departmentId: deptMap[emp.department],
        designation: emp.role === "MANAGER" ? "Manager" : emp.role,
        joiningDate: new Date(),
      },
    });

    // Assign role
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: roleMap[emp.role],
        },
      },
      create: {
        userId: user.id,
        roleId: roleMap[emp.role],
      },
      update: {}, // optional, some versions may allow skipping
    });

    // Leave balances
    const leaveTypes: LeaveType[] = [
      LeaveType.ANNUAL,
      LeaveType.SICK,
      LeaveType.CASUAL,
    ];

    for (const type of leaveTypes) {
      await prisma.leaveBalance.upsert({
        where: {
          employeeId_type_year: {
            employeeId: employee.id,
            type,
            year: currentYear,
          },
        },
        create: {
          employeeId: employee.id,
          type,
          total: type === LeaveType.ANNUAL ? 18 : 12,
          used: 0,
          year: currentYear,
        },
        update: {},
      });
    }
  }

  // -------------------------------
  // 6️⃣ Holidays
  const holidays = [
    { name: "New Year", date: new Date("2026-01-01"), type: "GOVERNMENT" },
    { name: "Republic Day", date: new Date("2026-01-26"), type: "GOVERNMENT" },
    // add more holidays here
  ];

  for (const h of holidays) {
    const holidayId = randomUUID(); // generate a unique id
    await prisma.holiday.upsert({
      where: { id: holidayId }, // use id instead of name
      create: { ...h, id: holidayId },
      update: {}, // nothing to update for seed
    });
  }

  console.log("✅ JES seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
