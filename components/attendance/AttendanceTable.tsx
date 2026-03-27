import { format } from "date-fns";
import clsx from "clsx";

export default function AttendanceTable({ records }: { records: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Punch In</th>
            <th className="p-3 text-left">Punch Out</th>
            <th className="p-3 text-left">Total Hours</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id ?? new Date(r.date).getTime()} className="border-b">
              <td className="p-3">
                {format(r.date, "dd MMM yyyy")} ({format(r.date, "EEE")})
              </td>
              <td className="p-3">
                {r.punchIn ? format(r.punchIn, "hh:mm a") : "-"}
              </td>
              <td className="p-3">
                {r.punchOut ? format(r.punchOut, "hh:mm a") : "-"}
              </td>
              <td className="p-3">{r.totalHours?.toFixed(2) ?? "-"}</td>
              <td
                className={clsx(
                  "p-3 font-semibold",
                  r.statusType === "present" && "text-green-600",
                  r.statusType === "absent" && "text-red-500",
                  r.statusType === "holiday" && "text-blue-500",
                  r.statusType === "weekoff" && "text-gray-500",
                )}
              >
                {r.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
