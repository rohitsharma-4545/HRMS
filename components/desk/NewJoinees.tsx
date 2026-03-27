"use client";

import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import EmployeeAvatarPopover from "@/components/desk/EmployeeAvatarPopover";

const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

type Employee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  designation?: string | null;
  user?: {
    email?: string | null;
  };
  department?: {
    name: string;
  } | null;
};

export default function NewJoinees({
  data,
}: {
  data: {
    today: Employee[];
    recent: Employee[];
  };
}) {
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(
    popoverRef,
    () => setActiveEmployeeId(null),
    !!activeEmployeeId,
  );

  const renderList = (list: Employee[]) => {
    if (!list.length) {
      return (
        <div className="bg-gray-100 text-sm text-gray-500 p-3 rounded-lg">
          No data
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-4">
        {list.map((emp, index) => {
          const initials = `${emp.firstName[0]}${emp.lastName[0]}`;
          const name = `${emp.firstName} ${emp.lastName}`;
          const colorClass = avatarColors[index % avatarColors.length];

          return (
            <div
              key={emp.id}
              className="relative group flex flex-col items-center"
            >
              <div
                onClick={() =>
                  setActiveEmployeeId((prev) =>
                    prev === emp.id ? null : emp.id,
                  )
                }
                className={`w-12 h-12 rounded-full text-white flex items-center justify-center text-sm font-semibold cursor-pointer ${colorClass}`}
              >
                {initials}
              </div>

              <div className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                {name}
              </div>

              {activeEmployeeId === emp.id && (
                <EmployeeAvatarPopover
                  popoverRef={popoverRef}
                  name={name}
                  initials={initials}
                  empCode={emp.employeeCode}
                  colorClass={colorClass}
                  designation={emp.designation}
                  email={emp.user?.email}
                  department={emp.department?.name}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-6">
      <h3 className="font-semibold text-gray-800">New Joinees</h3>

      <div>
        <h4 className="text-sm font-semibold mb-2">Today's Joiners</h4>
        {renderList(data.today)}
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Last 7 Days</h4>
        {renderList(data.recent)}
      </div>
    </div>
  );
}
