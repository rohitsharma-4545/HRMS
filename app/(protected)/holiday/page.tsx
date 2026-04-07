import { format } from "date-fns";
import { getHolidaysForYear } from "@/modules/holiday/holiday.service";
import { Holiday } from "@prisma/client";

async function fetchHolidaysThisYear(): Promise<Holiday[]> {
  try {
    const now = new Date();
    return await getHolidaysForYear(now.getFullYear());
  } catch (error) {
    console.error("Failed to fetch holidays:", error);
    return [];
  }
}

export default async function HolidaysPage() {
  const holidays = await fetchHolidaysThisYear();

  // Group holidays by month
  const holidaysByMonth: Record<string, Holiday[]> = {};
  holidays.forEach((holiday) => {
    const month = format(holiday.date, "MMMM");
    if (!holidaysByMonth[month]) holidaysByMonth[month] = [];
    holidaysByMonth[month].push(holiday);
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Holidays Calendar</h1>

      {Object.keys(holidaysByMonth).length === 0 ? (
        <p className="text-gray-500">No holidays found for this year.</p>
      ) : (
        Object.entries(holidaysByMonth).map(([month, holidays]) => (
          <section key={month} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{month}</h2>
            <ul className="list-disc list-inside space-y-1">
              {holidays.map((holiday) => (
                <li key={holiday.id}>
                  {format(holiday.date, "dd MMM yyyy")} - {holiday.name}{" "}
                  <span className="text-sm text-gray-500">
                    ({holiday.type})
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}
