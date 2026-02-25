import { getHolidaysBetween } from "@/app/modules/holiday/holiday.service";

export async function calculateWorkingDays(startDate: Date, endDate: Date) {
  let count = 0;

  const holidays = await getHolidaysBetween(startDate, endDate);
  const holidayDates = holidays.map((h) => h.date.toDateString());

  const current = new Date(startDate);

  while (current <= endDate) {
    const day = current.getDay();

    const isWeekend = day === 0 || day === 6;
    const isHoliday = holidayDates.includes(current.toDateString());

    if (!isWeekend && !isHoliday) {
      count++;
    }

    current.setDate(current.getDate() + 1);
  }

  return count;
}
