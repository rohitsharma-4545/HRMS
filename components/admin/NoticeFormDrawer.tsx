"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function NoticeFormDrawer({ notice, onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    title: notice?.title || "",
    content: notice?.content || "",
    priority: notice?.priority || "MEDIUM",
    expiresAt: notice?.expiresAt || "",
    departmentIds: notice?.targets?.map((t: any) => t.departmentId) || [],
  });
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await fetch("/api/department");
      const data = await res.json();
      setDepartments(data);
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        notice ? `/api/notice/${notice.id}` : "/api/notice",
        {
          method: notice ? "PUT" : "POST",
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(notice ? "Updated" : "Created");
      onSuccess(data);
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const toggleDepartment = (id: string) => {
    setForm((prev) => ({
      ...prev,
      departmentIds: prev.departmentIds.includes(id)
        ? prev.departmentIds.filter((d: string) => d !== id)
        : [...prev.departmentIds, id],
    }));
  };

  const memoizedDepartments = useMemo(() => departments, [departments]);

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end">
      <div className="w-[420px] bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {notice ? "Edit Notice" : "Add Notice"}
        </h2>

        {/* Title */}
        <label className="block font-medium">Title</label>
        <input
          placeholder="Enter title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full border p-2 rounded"
        />

        {/* Content */}
        <label className="block font-medium">Content</label>
        <textarea
          placeholder="Enter content"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          className="w-full border p-2 rounded min-h-[120px]"
        />

        {/* Priority */}
        <label className="block font-medium">Priority</label>
        <select
          value={form.priority}
          onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
          className="w-full border p-2 rounded"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <div>
          <p className="text-sm font-medium mb-2">Target Departments</p>

          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border rounded p-2">
            {departments.map((dept) => {
              const active = form.departmentIds.includes(dept.id);

              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => toggleDepartment(dept.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition ${
                    active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {dept.name}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Leave empty → visible to all employees
          </p>
        </div>

        {/* Expires At */}
        <label className="block font-medium">Expires At</label>
        <input
          type="datetime-local"
          value={form.expiresAt}
          onChange={(e) =>
            setForm((f) => ({ ...f, expiresAt: e.target.value }))
          }
          className="w-full border p-2 rounded"
        />

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
