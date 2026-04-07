"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function HolidayFormDrawer({
  holiday,
  onClose,
  onSuccess,
}: {
  holiday?: any;
  onClose: () => void;
  onSuccess: (data: any) => void;
}) {
  const [form, setForm] = useState({
    name: holiday?.name || "",
    date: holiday?.date?.slice(0, 10) || "",
    type: holiday?.type || "COMPANY",
  });

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        holiday ? `/api/holiday/${holiday.id}` : "/api/holiday",
        {
          method: holiday ? "PUT" : "POST",
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(holiday ? "Updated" : "Created");
      onSuccess(data);
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end">
      <div className="w-[400px] bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {holiday ? "Edit Holiday" : "Add Holiday"}
        </h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className="w-full border p-2 rounded"
        />

        <select
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          className="w-full border p-2 rounded"
        >
          <option value="COMPANY">Company</option>
          <option value="GOVERNMENT">Government</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
