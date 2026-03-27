"use client";

import { useState, useEffect } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import clsx from "clsx";
import { CalendarEvent } from "@/modules/calendar/calendar.service";
import EventModal from "@/components/calendar/EventModal";

const eventColors: Record<CalendarEvent["type"], string> = {
  birthday: "bg-pink-500",
  anniversary: "bg-blue-500",
  holiday: "bg-green-500",
};

export default function CalendarClient({
  initialEvents,
  departmentId,
}: {
  initialEvents: CalendarEvent[];
  departmentId: string;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/calendar?month=${currentMonth.toISOString()}&departmentId=${departmentId}`,
      );
      const data = await res.json();
      setEvents(data);
    }

    load();
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handleToday = () => setCurrentMonth(new Date());
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const openModal = (date: Date, events: CalendarEvent[]) => {
    setSelectedDate(date);
    setSelectedEvents(events);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>

          <button
            onClick={handleToday}
            className="px-3 py-1 text-sm rounded-lg bg-blue-100 text-blue-600 cursor-pointer"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="cursor-pointer" onClick={handlePrevMonth}>
            ◀
          </button>
          <h2 className="text-lg font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button className="cursor-pointer" onClick={handleNextMonth}>
            ▶
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-gray-600">
            {d}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow">
        {(() => {
          const rows = [];
          let days: any[] = [];
          let day = startDate;

          while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
              const currentDay = new Date(day);
              const dayEvents = events.filter((e) =>
                isSameDay(e.date, currentDay),
              );

              days.push(
                <div
                  key={currentDay.toString()}
                  className={clsx(
                    "border p-2 h-24 relative",
                    !isSameMonth(currentDay, currentMonth) &&
                      "bg-gray-50 text-gray-400",
                    isSameDay(currentDay, new Date()) &&
                      "border-2 border-blue-500",
                  )}
                >
                  <div className="text-sm font-semibold">
                    {format(currentDay, "d")}
                  </div>

                  {dayEvents.length > 0 && (
                    <div
                      onClick={() => openModal(currentDay, dayEvents)}
                      className="absolute bottom-2 left-2 flex items-center gap-1 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />

                      <span className="text-xs text-gray-600">Events</span>

                      <span className="text-xs px-2 py-0.5 rounded-full border border-gray-300 bg-white">
                        {dayEvents.length}
                      </span>
                    </div>
                  )}
                </div>,
              );

              day = addDays(day, 1);
            }

            rows.push(
              <div key={day.toString()} className="grid grid-cols-7">
                {days}
              </div>,
            );

            days = [];
          }

          return rows;
        })()}
      </div>
      {selectedDate && (
        <EventModal
          date={selectedDate}
          events={selectedEvents}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
