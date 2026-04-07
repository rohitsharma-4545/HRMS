"use client";

import { useLeaveBalance } from "@/modules/leave/hooks/useLeaveBalance";

export default function LeaveBalanceCards() {
  const { data, loading } = useLeaveBalance();

  if (loading) return <p>Loading balances...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((b) => {
        const remaining = b.total - b.used;

        return (
          <div key={b.id} className="p-4 rounded-xl border shadow-sm bg-white">
            <h3 className="font-semibold">{b.type}</h3>
            <p className="text-sm text-gray-500">
              {remaining} / {b.total} remaining
            </p>
          </div>
        );
      })}
    </div>
  );
}
