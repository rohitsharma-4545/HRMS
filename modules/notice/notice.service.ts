import { prisma } from "@/lib/prisma";
import { NoticePriority } from "@prisma/client";

export async function getNotices() {
  return prisma.notice.findMany({
    include: {
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeCode: true,
        },
      },
      acknowledgements: {
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeCode: true,
            },
          },
        },
      },
      targets: {
        include: {
          department: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createNotice(data: {
  title: string;
  content: string;
  createdById: string;
  priority?: NoticePriority;
  departmentIds?: string[];
  expiresAt?: Date;
}) {
  if (!data.createdById) {
    throw new Error("createdById is required");
  }

  return prisma.notice.create({
    data: {
      title: data.title,
      content: data.content,
      priority: data.priority || NoticePriority.MEDIUM,
      expiresAt: data.expiresAt,

      // ✅ FIX: use relation connect instead of raw FK
      createdBy: {
        connect: { id: data.createdById },
      },

      targets: data.departmentIds?.length
        ? {
            create: data.departmentIds.map((id) => ({
              departmentId: id,
            })),
          }
        : undefined,
    },
    include: {
      targets: true,
    },
  });
}

export async function updateNotice(
  id: string,
  data: {
    title: string;
    content: string;
    priority?: string;
    departmentIds?: string[];
    expiresAt?: Date;
  },
) {
  return prisma.$transaction(async (tx) => {
    await tx.noticeTarget.deleteMany({ where: { noticeId: id } });

    return tx.notice.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        priority: data.priority as any,
        expiresAt: data.expiresAt,
        targets: data.departmentIds?.length
          ? {
              create: data.departmentIds.map((id) => ({
                departmentId: id,
              })),
            }
          : undefined,
      },
    });
  });
}

export async function deleteNotice(id: string) {
  return prisma.notice.delete({
    where: { id },
  });
}

export async function getEmployeeNotices(
  employeeId: string,
  departmentId: string,
) {
  return prisma.notice.findMany({
    where: {
      isActive: true,

      AND: [
        {
          OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
        },
        {
          OR: [
            { targets: { none: {} } }, // global
            {
              targets: {
                some: { departmentId },
              },
            },
          ],
        },
      ],
    },

    include: {
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },

      acknowledgements: {
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },

      _count: {
        select: {
          acknowledgements: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}
