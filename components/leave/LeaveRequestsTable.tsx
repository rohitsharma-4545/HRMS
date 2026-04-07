"use client";

import { useLeaveRequests } from "@/modules/leave/hooks/useLeaveRequests";
import LeaveStatusBadge from "./LeaveStatusBadge";

export default function LeaveRequestsTable() {
  const { data, loading, refetch } = useLeaveRequests();

  if (loading) return <p>Loading...</p>;

  const action = async (id: string, type: "approve" | "reject") => {
    await fetch(`/api/leave/${type}/${id}`, {
      method: "POST",
    });
    refetch();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full text-sm table-fixed">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Employee</th>
            <th className="px-4 py-3 text-left">Department</th>
            <th className="px-4 py-3 text-left">Dates</th>
            <th className="px-4 py-3 text-left w-[80px]">Days</th>
            <th className="px-4 py-3 text-left w-[120px]">Status</th>
            <th className="px-4 py-3 text-right w-[160px]">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.map((l) => (
            <tr key={l.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">
                {l.employee.firstName} {l.employee.lastName}
              </td>

              <td className="px-4 py-3 text-gray-600">
                {l.employee.department?.name}
              </td>

              <td className="px-4 py-3 text-gray-600">
                {new Date(l.startDate).toLocaleDateString()} —{" "}
                {new Date(l.endDate).toLocaleDateString()}
              </td>

              <td className="px-4 py-3">{l.days}</td>

              <td className="px-4 py-3">
                <LeaveStatusBadge status={l.status} />
              </td>

              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => action(l.id, "approve")}
                    className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded hover:bg-green-100"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => action(l.id, "reject")}
                    className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded hover:bg-red-100"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
