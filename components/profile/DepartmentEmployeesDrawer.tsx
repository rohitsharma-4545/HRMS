"use client";

import { useState, useMemo, useRef } from "react";
import clsx from "clsx";
import Link from "next/link";
import { X, Phone } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function DepartmentEmployeesDrawer({
  open,
  onClose,
  employees,
}: any) {
  const [search, setSearch] = useState("");

  const drawerRef = useRef<HTMLDivElement>(null);
  useClickOutside(drawerRef, onClose, open);

  const filtered = useMemo(() => {
    return employees.filter((e: any) =>
      `${e.firstName} ${e.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, employees]);

  return (
    <div
      className={clsx(
        "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-all duration-300 ease-in-out",
        open ? "opacity-100 visible" : "opacity-0 invisible",
      )}
    >
      <div
        ref={drawerRef}
        className={clsx(
          "absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-all duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-3">
          <button onClick={onClose}>
            <X />
          </button>

          <input
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          />
        </div>

        {/* Employee List */}
        <div className="p-4 overflow-y-auto space-y-4">
          {filtered.map((emp: any) => (
            <Link
              key={emp.id}
              href={`/profile/${emp.employeeCode}`}
              onClick={onClose}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition border"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold shrink-0">
                {emp.firstName?.[0]}
                {emp.lastName?.[0]}
              </div>

              {/* Details */}
              <div className="flex-1">
                <p className="font-medium">
                  {emp.firstName} {emp.lastName}
                </p>

                {emp.designation && (
                  <p className="text-sm text-gray-500">{emp.designation}</p>
                )}

                {emp.user?.phone && (
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <Phone size={14} />
                    {emp.user.phone}
                  </p>
                )}
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-6">
              No employees found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
