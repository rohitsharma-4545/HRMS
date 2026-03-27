"use client";
import { CalendarEvent } from "@/modules/calendar/calendar.service";
import { format } from "date-fns";

export default function EventModal({
  date,
  events,
  onClose,
}: {
  date: Date;
  events: CalendarEvent[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-5 w-80 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">{format(date, "PPP")}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          {events.map((e, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span>
                {e.type === "birthday"
                  ? "🎁"
                  : e.type === "anniversary"
                    ? "💍"
                    : "🏖"}
              </span>
              <span>{e.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
