"use client";

import { useLeaveHistory } from "@/modules/leave/hooks/useLeaveHistory";
import LeaveStatusBadge from "./LeaveStatusBadge";

export default function LeaveHistoryTable() {
  const { data, loading } = useLeaveHistory();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mt-4">
      <table className="w-full text-sm table-fixed">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left w-[120px]">Type</th>
            <th className="px-4 py-3 text-left">Dates</th>
            <th className="px-4 py-3 text-left w-[80px]">Days</th>
            <th className="px-4 py-3 text-left w-[160px]">Reason</th>
            <th className="px-4 py-3 text-left w-[120px]">Status</th>
            <th className="px-4 py-3 text-right w-[120px]"></th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.map((l) => (
            <tr key={l.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{l.type}</td>

              <td className="px-4 py-3 text-gray-600">
                {new Date(l.startDate).toLocaleDateString()} —{" "}
                {new Date(l.endDate).toLocaleDateString()}
              </td>

              <td className="px-4 py-3">{l.days}</td>

              <td className="px-4 py-3 text-gray-600 truncate" title={l.reason}>
                {l.reason || "-"}
              </td>

              <td className="px-4 py-3">
                <LeaveStatusBadge status={l.status} />
              </td>

              <td className="px-4 py-3 text-right">
                {l.status === "PENDING" && (
                  <button
                    onClick={async () => {
                      await fetch(`/api/leave/cancel/${l.id}`, {
                        method: "POST",
                      });
                      location.reload();
                    }}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
