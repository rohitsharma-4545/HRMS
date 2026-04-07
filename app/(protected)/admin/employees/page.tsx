"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import RowActions from "@/components/admin/EmployeeRowActions";
import EmployeeEditDrawer from "@/components/admin/EmployeeEditDrawer";

export default function EmployeesPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);

  const fetchDepartments = async () => {
    const res = await fetch("/api/department");
    const data = await res.json();
    setDepartments(data);
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search) params.append("q", search);
      if (selectedDepartments.length) {
        params.append("departments", selectedDepartments.join(","));
      }

      const res = await fetch(`/api/employee?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setEmployees(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const delay = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(delay);
  }, [search, selectedDepartments]);

  const toggleDepartment = (id: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Employees</h1>
        <a
          href="/admin/employees/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Employee
        </a>
      </div>

      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <input
          placeholder="Search by name, code, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />

        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => {
            const active = selectedDepartments.includes(dept.id);

            return (
              <button
                key={dept.id}
                onClick={() => toggleDepartment(dept.id)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {dept.name}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-visible">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Designation</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => {
                return (
                  <tr
                    key={emp.id}
                    onClick={() => router.push(`/profile/${emp.employeeCode}`)}
                    className="group border-t cursor-pointer hover:bg-gray-50 transition-colors hover:shadow-sm"
                  >
                    <td className="p-3">{emp.employeeCode}</td>
                    <td className="p-3">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="p-3">{emp.department?.name || "-"}</td>
                    <td className="p-3">{emp.designation || "-"}</td>
                    <td className="p-3">
                      {emp.user?.isActive ? "Active" : "Inactive"}
                    </td>

                    <td
                      className="p-3 text-right opacity-70 group-hover:opacity-100 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <RowActions
                        employee={emp}
                        activeId={activeActionId}
                        setActiveId={setActiveActionId}
                        onEdit={(emp) => setEditingEmployee(emp)}
                        onDelete={(id) =>
                          setEmployees((prev) =>
                            prev.filter((e) => e.id !== id),
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editingEmployee && (
        <EmployeeEditDrawer
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onUpdated={(updated) => {
            setEmployees((prev) =>
              prev.map((e) =>
                e.id === updated.id
                  ? {
                      ...e,
                      ...updated,
                    }
                  : e,
              ),
            );
          }}
        />
      )}
    </div>
  );
}
