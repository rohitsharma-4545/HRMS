"use client";

import { useState } from "react";

export default function ApplyLeaveDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    leaveType: "ANNUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleSubmit = async () => {
    await fetch("/api/leave/apply", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setOpen(false);
    location.reload();
  };

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition"
      >
        Apply Leave
      </button>
    );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Apply Leave</h2>

        <select
          className="w-full border rounded-lg px-3 py-2"
          value={form.leaveType}
          onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
        >
          <option value="ANNUAL">Annual</option>
          <option value="SICK">Sick</option>
          <option value="CASUAL">Casual</option>
        </select>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            className="border rounded-lg px-3 py-2"
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
          <input
            type="date"
            className="border rounded-lg px-3 py-2"
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>

        <textarea
          placeholder="Reason"
          className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-gray-500"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
