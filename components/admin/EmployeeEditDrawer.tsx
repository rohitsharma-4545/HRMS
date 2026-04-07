"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import EmployeeForm from "@/components/admin/EmployeeForm";

export default function EmployeeEditDrawer({
  employee,
  onClose,
  onUpdated,
}: {
  employee: any;
  onClose: () => void;
  onUpdated: (emp: any) => void;
}) {
  const [form, setForm] = useState<any>(employee);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  const handleSave = async () => {
    const optimistic = { ...form };

    onUpdated(optimistic);
    try {
      setLoading(true);

      const res = await fetch(`/api/employee/${employee.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Updated");

      onUpdated(data);
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      const [d, r] = await Promise.all([
        fetch("/api/department").then((res) => res.json()),
        fetch("/api/role").then((res) => res.json()),
      ]);

      setDepartments(d);
      setRoles(r);
    };

    load();
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="w-[420px] h-full bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-right">
        <h2 className="text-lg font-semibold mb-4">Edit Employee</h2>

        <div className="space-y-4 overflow-y-auto flex-1">
          <EmployeeForm
            form={form}
            setForm={setForm}
            departments={departments}
            roles={roles}
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t flex gap-2">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2">
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
