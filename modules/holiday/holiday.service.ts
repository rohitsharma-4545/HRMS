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
