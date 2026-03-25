"use client";

import { useState } from "react";
import DepartmentEmployeesDrawer from "./DepartmentEmployeesDrawer";
import { Mail, Phone, Briefcase, Building2 } from "lucide-react";
import Link from "next/link";

export default function ProfileHeaderSection({ data, isSelf }: any) {
  const [open, setOpen] = useState(false);

  const deptEmployees = data.department?.employees || [];
  const visible = deptEmployees.slice(0, 2);
  const remaining = deptEmployees.length - 2;

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-6 flex justify-between">
        <div className="flex gap-6">
          <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-semibold">
            {data.firstName?.[0]}
            {data.lastName?.[0]}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">
                {data.firstName} {data.lastName}
              </h2>

              {isSelf && (
                <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Current employee
                </span>
              )}
            </div>

            <p className="flex items-center gap-2 text-sm">
              <Briefcase size={14} /> {data.designation}
            </p>

            <div className="flex items-center gap-4 text-sm">
              {data.user?.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={14} />
                  {data.user.phone}
                </p>
              )}

              {data.user?.email && (
                <p className="flex items-center gap-2">
                  <Mail size={14} />
                  {data.user.email}
                </p>
              )}
            </div>

            {data.department?.name && (
              <p className="flex items-center gap-2 text-sm">
                <Building2 size={14} />
                {data.department.name}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-medium">Department</h3>
          <div className="flex gap-2 mt-2">
            {visible.map((emp: any) => (
              <Link
                key={emp.id}
                href={`/profile/${emp.employeeCode}`}
                className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-sm"
              >
                {emp.firstName[0]}
              </Link>
            ))}

            {remaining > 0 && (
              <button
                onClick={() => setOpen(true)}
                className="w-10 h-10 rounded-full bg-slate-200 text-sm"
              >
                +{remaining}
              </button>
            )}
          </div>
        </div>
      </div>

      <DepartmentEmployeesDrawer
        open={open}
        onClose={() => setOpen(false)}
        employees={deptEmployees}
      />
    </>
  );
}
