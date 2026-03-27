import { prisma } from "@/lib/prisma";
import { isSameDayMonth } from "@/modules/desk/desk.service";

export type CalendarEvent = {
  date: Date;
  type: "birthday" | "anniversary" | "holiday";
  title: string;
};

export async function getCalendarEvents(month: Date, departmentId: string) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  const [employees, holidays] = await Promise.all([
    prisma.employee.findMany({
      where: {
        departmentId,
      },
      include: {
        personalProfile: true,
      },
    }),

    prisma.holiday.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    }),
  ]);

  const events: CalendarEvent[] = [];

  for (const emp of employees) {
    const profile = emp.personalProfile;
    const name = `${emp.firstName} ${emp.lastName}`;

    if (profile?.birthDate) {
      const eventDate = new Date(
        month.getFullYear(),
        profile.birthDate.getMonth(),
        profile.birthDate.getDate(),
      );

      if (eventDate >= start && eventDate <= end) {
        events.push({
          date: eventDate,
          type: "birthday",
          title: `${name}'s Birthday`,
        });
      }
    }

    if (emp.joiningDate) {
      const eventDate = new Date(
        month.getFullYear(),
        emp.joiningDate.getMonth(),
        emp.joiningDate.getDate(),
      );

      if (eventDate >= start && eventDate <= end) {
        events.push({
          date: eventDate,
          type: "anniversary",
          title: `${name}'s Work Anniversary`,
        });
      }
    }

    if (profile?.anniversaryDate) {
      const eventDate = new Date(
        month.getFullYear(),
        profile.anniversaryDate.getMonth(),
        profile.anniversaryDate.getDate(),
      );

      if (eventDate >= start && eventDate <= end) {
        events.push({
          date: eventDate,
          type: "anniversary",
          title: `${name}'s Marriage Anniversary`,
        });
      }
    }
  }

  for (const holiday of holidays) {
    events.push({
      date: holiday.date,
      type: "holiday",
      title: holiday.name,
    });
  }

  return events;
}
