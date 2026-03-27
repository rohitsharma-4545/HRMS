import { getCalendarEvents } from "@/modules/calendar/calendar.service";
import { getCurrentEmployee } from "@/modules/auth/auth-context.service";
import CalendarClient from "./CalendarClient";

export default async function Page() {
  const { employee } = await getCurrentEmployee();

  const events = await getCalendarEvents(new Date(), employee.departmentId!);

  return (
    <CalendarClient
      initialEvents={events}
      departmentId={employee.departmentId!}
    />
  );
}
