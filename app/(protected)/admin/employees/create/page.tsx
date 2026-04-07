"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import EmployeeForm from "@/components/admin/EmployeeForm";

type Department = { id: string; name: string };
type Role = { id: string; name: string };

export default function CreateEmployeePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    employeeCode: "",
    departmentId: "",
    designation: "",
    roleName: "",
    joiningDate: "",
    salary: "",
  });

  // ✅ Fetch dropdown data
  useEffect(() => {
    const loadData = async () => {
      const [deptRes, roleRes] = await Promise.all([
        fetch("/api/department"),
        fetch("/api/role"),
      ]);

      setDepartments(await deptRes.json());
      setRoles(await roleRes.json());
    };

    loadData();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.firstName) return "First name required";
    if (!form.lastName) return "Last name required";
    if (!form.employeeCode) return "Employee code required";
    if (!form.departmentId) return "Department required";
    if (!form.roleName) return "Role required";

    if (!form.email && !form.phone) {
      return "Email or phone required";
    }

    if (form.salary && isNaN(Number(form.salary))) {
      return "Salary must be a number";
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) return toast.error(error);

    try {
      setLoading(true);

      const res = await fetch("/api/employee/create", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Employee created");

      router.push("/admin/employees");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Create Employee</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <EmployeeForm
          form={form}
          setForm={setForm}
          departments={departments}
          roles={roles}
        />

        {/* PASSWORD INFO */}
        <div className="text-sm text-gray-500">
          Default password:{" "}
          <span className="font-medium">
            {form.firstName
              ? `${form.firstName.toLowerCase()}123`
              : "firstName123"}
          </span>
        </div>

        {/* ACTION */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Create Employee"}
        </button>
      </div>
    </div>
  );
}
