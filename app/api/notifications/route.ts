import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();

  const [leaves, notices, newJoinees] = await Promise.all([
    prisma.leave.findMany({
      orderBy: { appliedAt: "desc" },
      take: 5,
      include: {
        employee: true,
      },
    }),

    prisma.notice.findMany({
      where: {
        isActive: true,
        OR: [{ publishAt: null }, { publishAt: { lte: today } }],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),

    prisma.employee.findMany({
      where: {
        joiningDate: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { joiningDate: "desc" },
      take: 5,
    }),
  ]);

  const notifications = [
    ...leaves.map((l) => ({
      id: l.id,
      type: "leave",
      message: `${l.employee.firstName} ${l.employee.lastName} applied for leave (${l.status})`,
      createdAt: l.appliedAt ?? new Date(),
    })),

    ...notices.map((n) => ({
      id: n.id,
      type: "notice",
      message: `📢 ${n.title}`,
      createdAt: n.createdAt ?? new Date(),
    })),

    ...newJoinees.map((e) => ({
      id: e.id,
      type: "employee",
      message: `${e.firstName} ${e.lastName} joined the company`,
      createdAt: e.joiningDate ?? new Date(),
    })),
  ];

  notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return NextResponse.json(notifications);
}
