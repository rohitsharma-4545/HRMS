"use client";

type Props = {
  form: any;
  setForm: (data: any) => void;
  departments: any[];
  roles: any[];
};

export default function EmployeeForm({
  form,
  setForm,
  departments,
  roles,
}: Props) {
  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* BASIC */}
      <div className="grid grid-cols-2 gap-4">
        <input
          className="input"
          placeholder="First Name *"
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
        />
        <input
          className="input"
          placeholder="Last Name *"
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />
        <input
          className="input"
          placeholder="Employee Code *"
          value={form.employeeCode}
          onChange={(e) => handleChange("employeeCode", e.target.value)}
        />
        <input
          className="input"
          placeholder="Designation"
          value={form.designation || ""}
          onChange={(e) => handleChange("designation", e.target.value)}
        />
      </div>

      {/* CONTACT */}
      <div className="grid grid-cols-2 gap-4">
        <input
          className="input"
          placeholder="Email"
          value={form.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <input
          className="input"
          placeholder="Phone"
          value={form.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>

      {/* ORG */}
      <div className="grid grid-cols-2 gap-4">
        <select
          className="input"
          value={form.departmentId || ""}
          onChange={(e) => handleChange("departmentId", e.target.value)}
        >
          <option value="">Select Department *</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={form.roleName || ""}
          onChange={(e) => handleChange("roleName", e.target.value)}
        >
          <option value="">Select Role *</option>
          {roles.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* EXTRA */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Joining Date
          </label>
          <input
            type="date"
            className="input"
            value={
              form.joiningDate
                ? new Date(form.joiningDate).toISOString().slice(0, 10)
                : ""
            }
            onChange={(e) => handleChange("joiningDate", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Salary (Optional)
          </label>
          <input
            type="number"
            className="input"
            value={form.salary || ""}
            onChange={(e) => handleChange("salary", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
