"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import NoticeRowActions from "@/components/admin/NoticeRowActions";
import NoticeFormDrawer from "@/components/admin/NoticeFormDrawer";
import NoticeDetailsModal from "@/components/admin/NoticeDetailsModal";

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);

  const fetchNotices = async () => {
    try {
      const res = await fetch("/api/notice");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setNotices(data);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/notice/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotices((prev) => prev.filter((n) => n.id !== id));
        toast.success("Deleted");
      } else {
        toast.error("Failed to delete notice");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Notices</h1>
        <button
          onClick={() => setCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Notice
        </button>
      </div>

      <div className="bg-white rounded-xl shadow">
        {notices.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              No notices yet
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Create your first notice to communicate with employees.
            </p>

            <button
              onClick={() => setCreating(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Notice
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Notice</th>
                <th className="p-3 text-left">Created By</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Acknowledged</th>
                <th className="p-3 text-left">Expires</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Targets</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {notices.map((n) => (
                <tr
                  key={n.id}
                  className="border-t cursor-pointer hover:bg-gray-50 transition"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button")) return;
                    setSelectedNotice(n);
                  }}
                >
                  {/* Notice */}
                  <td className="p-3">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {n.content}
                    </p>
                  </td>

                  {/* Created By */}
                  <td className="p-3 text-sm">
                    {n.createdBy?.firstName} {n.createdBy?.lastName}
                  </td>

                  {/* Date */}
                  <td className="p-3 text-sm">
                    <div>{new Date(n.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleTimeString()}
                    </div>
                  </td>

                  {/* Acknowledged */}
                  <td className="p-3 text-sm">
                    <span className="flex items-center gap-1">
                      👀 {n.acknowledgements?.length || 0}
                    </span>
                  </td>

                  <td className="p-3 text-sm">
                    {n.expiresAt
                      ? new Date(n.expiresAt).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Priority */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        n.priority === "CRITICAL"
                          ? "bg-red-100 text-red-700"
                          : n.priority === "HIGH"
                            ? "bg-orange-100 text-orange-700"
                            : n.priority === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {n.priority}
                    </span>
                  </td>

                  <td className="p-3 text-sm">
                    {n.targets?.length === 0
                      ? "All"
                      : `${n.targets.length} Dept`}
                  </td>

                  {/* Actions */}
                  <td
                    className="p-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <NoticeRowActions
                      notice={n}
                      activeId={activeId}
                      setActiveId={setActiveId}
                      onEdit={setEditing}
                      onDelete={handleDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedNotice && (
        <NoticeDetailsModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}

      {(editing || creating) && (
        <NoticeFormDrawer
          notice={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSuccess={(data: any) => {
            if (editing) {
              setNotices((prev) =>
                prev.map((n) => (n.id === data.id ? data : n)),
              );
            } else {
              setNotices((prev) => [data, ...prev]);
            }
          }}
        />
      )}
    </div>
  );
}
