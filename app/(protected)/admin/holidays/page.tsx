"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import HolidayRowActions from "@/components/admin/HolidayRowActions";
import HolidayFormDrawer from "@/components/admin/HolidayFormDrawer";

export default function AdminHolidaysPage() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/holiday");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHolidays(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/holiday/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setHolidays((prev) => prev.filter((h) => h.id !== id));
      toast.success("Deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Manage Holidays</h1>
        <button
          onClick={() => setCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Holiday
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {holidays.map((h) => (
                <tr key={h.id} className="border-t">
                  <td className="p-3">{h.name}</td>
                  <td className="p-3">
                    {new Date(h.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{h.type}</td>

                  <td className="p-3 text-right">
                    <HolidayRowActions
                      holiday={h}
                      activeId={activeId}
                      setActiveId={setActiveId}
                      onEdit={(h) => setEditing(h)}
                      onDelete={handleDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(editing || creating) && (
        <HolidayFormDrawer
          holiday={editing || undefined}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSuccess={(data) => {
            if (editing) {
              setHolidays((prev) =>
                prev.map((h) => (h.id === data.id ? data : h)),
              );
            } else {
              setHolidays((prev) => [data, ...prev]);
            }
          }}
        />
      )}
    </div>
  );
}
