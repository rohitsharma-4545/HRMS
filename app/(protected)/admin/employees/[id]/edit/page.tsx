"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function EditEmployeePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      const res = await fetch(`/api/employee/${id}`);
      const data = await res.json();

      if (!res.ok) return toast.error(data.error);

      setForm({
        ...data,
        departmentId: data.departmentId || "",
        joiningDate: data.joiningDate?.split("T")[0] || "",
      });
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/employee/${id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Employee updated");

      router.push("/admin/employees");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Edit Employee</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <input
          className="input"
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
        />

        <input
          className="input"
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />

        <input
          className="input"
          value={form.designation || ""}
          onChange={(e) => handleChange("designation", e.target.value)}
        />

        <input
          type="date"
          className="input"
          value={form.joiningDate || ""}
          onChange={(e) => handleChange("joiningDate", e.target.value)}
        />

        <input
          className="input"
          value={form.salary || ""}
          onChange={(e) => handleChange("salary", e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}
