"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import NoticeViewer from "./NoticeViewer";

export default function NoticeBoard() {
  const [notices, setNotices] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const fetchNotices = async () => {
    const res = await fetch("/api/notice/employee");
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error);
      return;
    }

    setNotices(data);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAcknowledge = async (id: string) => {
    const res = await fetch(`/api/notice/${id}/ack`, {
      method: "POST",
    });

    if (!res.ok) return;

    // ✅ Refetch correct data from backend
    fetchNotices();
  };

  const visible = showAll ? notices : notices.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Noticeboard</h2>

        {notices.length > 3 && (
          <button
            onClick={() => setShowAll((p) => !p)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showAll ? "View new notices" : "View old notices"}
          </button>
        )}
      </div>

      {/* Empty */}
      {notices.length === 0 ? (
        <div className="bg-slate-100 rounded-xl p-4 text-center text-slate-600">
          No new notices
        </div>
      ) : (
        <div className="space-y-2 max-h-[260px] overflow-y-auto">
          {visible.map((n) => {
            const acknowledged = n.acknowledgements?.some(
              (a: any) => a.employee?.id === n.currentEmployeeId,
            );

            return (
              <div
                key={n.id}
                onClick={() => setSelected(n)}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 border rounded-lg px-4 py-3 cursor-pointer transition"
              >
                {/* Left */}
                <div className="flex items-center gap-2 overflow-hidden">
                  <span>📌</span>

                  <p className="text-sm font-medium text-gray-800 truncate max-w-[420px]">
                    {n.title}
                  </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {n._count.acknowledgements}
                  </span>

                  {!acknowledged && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcknowledge(n.id);
                      }}
                      className="text-xs bg-white border px-2 py-1 rounded hover:bg-gray-100"
                    >
                      👍
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <NoticeViewer notice={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
