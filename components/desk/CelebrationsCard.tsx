"use client";

import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import EmployeeAvatarPopover from "@/components/desk/EmployeeAvatarPopover";
import { Employee } from "./RightPanel";

const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

type Tab = "birthday" | "work" | "marriage";

type Props = {
  data: {
    birthdays: { today: Employee[]; upcoming: Employee[] };
    workAnniversary: { today: Employee[]; upcoming: Employee[] };
    marriageAnniversary: { today: Employee[]; upcoming: Employee[] };
  };
};

export default function CelebrationsCard({ data }: Props) {
  const [tab, setTab] = useState<Tab>("birthday");
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(
    popoverRef,
    () => setActiveEmployeeId(null),
    !!activeEmployeeId,
  );

  const tabs = [
    { key: "birthday", label: "Birthdays" },
    { key: "work", label: "Work Anniversary" },
    { key: "marriage", label: "Marriage Anniversary" },
  ];

  const currentData =
    tab === "birthday"
      ? data.birthdays
      : tab === "work"
        ? data.workAnniversary
        : data.marriageAnniversary;

  const renderList = (list: Employee[]) => {
    if (!list.length) {
      return <p className="text-sm text-gray-500">No data</p>;
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
              className="relative flex flex-col items-center group"
            >
              {/* Avatar */}
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

              {/* Tooltip */}
              <div className="absolute -top-8 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                {name}
              </div>

              {/* Popover */}
              {activeEmployeeId === emp.id && (
                <EmployeeAvatarPopover
                  popoverRef={popoverRef}
                  name={name}
                  initials={initials}
                  empCode={emp.employeeCode}
                  colorClass={colorClass}
                  designation={emp.designation}
                  email={emp.user?.email}
                  phone={emp.user?.phone}
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
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex gap-6 border-b mb-5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`pb-2 text-sm font-medium transition ${
              tab === t.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-2 text-gray-700">Today</h4>
        {renderList(currentData.today)}
      </div>

      {/* Upcoming Section */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-700">Upcoming</h4>
        {renderList(currentData.upcoming)}
      </div>
    </div>
  );
}
