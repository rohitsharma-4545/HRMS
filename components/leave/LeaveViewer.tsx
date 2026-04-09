"use client";

import { useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function LeaveViewer({ leave, onClose }: any) {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onClose, true);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        ref={ref}
        className="bg-white w-[600px] max-h-[80vh] overflow-y-auto rounded-xl p-6 space-y-4"
      >
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Leave Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="text-sm space-y-2">
          <p>
            <b>Type:</b> {leave.type}
          </p>
          <p>
            <b>Dates:</b> {new Date(leave.startDate).toLocaleDateString()} —{" "}
            {new Date(leave.endDate).toLocaleDateString()}
          </p>
          <p>
            <b>Days:</b> {leave.days}
          </p>
          <p>
            <b>Status:</b> {leave.status}
          </p>

          <div>
            <b>Reason:</b>
            <p className="mt-1 text-gray-700 whitespace-pre-wrap">
              {leave.reason || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
