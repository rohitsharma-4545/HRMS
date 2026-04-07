import { prisma } from "@/lib/prisma";

export async function addHoliday(data: {
  name: string;
  date: Date;
  type: "GOVERNMENT" | "COMPANY";
}) {
  return prisma.holiday.create({ data });
}

export async function getHolidaysBetween(start: Date, end: Date) {
  return prisma.holiday.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
  });
}

export async function getHolidaysForYear(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59, 999);

  return prisma.holiday.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { date: "asc" },
  });
}

export async function updateHoliday(
  id: string,
  data: { name: string; date: Date; type: "GOVERNMENT" | "COMPANY" },
) {
  return prisma.holiday.update({
    where: { id },
    data,
  });
}

export async function deleteHoliday(id: string) {
  return prisma.holiday.delete({
    where: { id },
  });
}
