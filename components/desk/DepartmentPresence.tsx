"use client";

import { useMemo, useRef, useState } from "react";
import PresenceCard from "./PresenceCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import EmployeeAvatarPopover from "@/components/desk/EmployeeAvatarPopover";

type Status = "in" | "out" | "not-clocked-in" | "leave";

interface Attendance {
  id: string;
  date: Date;
  createdAt: Date;
  employeeId: string;
  punchIn: Date | null;
  punchOut: Date | null;
  totalHours: number | null;
  status: string;
}

interface DepartmentEmployee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  userId: string;

  attendances: Attendance[];

  departmentId: string | null;
  designation: string | null;
  joiningDate: Date | null;
  salary: number | null;

  user?: {
    email: string | null;
    phone: string | null;
  };

  department?: {
    name: string;
  } | null;

  createdAt: Date;
  updatedAt: Date;
}

interface Leave {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

interface Props {
  data: DepartmentEmployee[];
  leaves: Leave[];
}

const statusOptions: { label: string; value: Status }[] = [
  { label: "In", value: "in" },
  { label: "Out", value: "out" },
  { label: "Not clocked in yet", value: "not-clocked-in" },
  { label: "Leave", value: "leave" },
];

const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

export default function DepartmentPresence({ data, leaves }: Props) {
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(
    popoverRef,
    () => setActiveEmployeeId(null),
    !!activeEmployeeId,
  );

  const filterRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(filterRef, () => setShowFilter(false), showFilter);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const toggleStatus = (status: Status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const leaveEmployeeIds = new Set(leaves.map((l) => l.employeeId));

  function deriveStatus(emp: DepartmentEmployee): Status {
    const isOnLeave = leaves?.some((l) => {
      if (l.employeeId !== emp.id) return false;
      if (l.status !== "APPROVED") return false;

      const start = new Date(l.startDate);
      const end = new Date(l.endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return start <= today && end >= today;
    });

    if (isOnLeave) return "leave";

    const attendance = emp.attendances[0];

    if (!attendance) return "not-clocked-in";

    if (attendance.punchIn && !attendance.punchOut) return "in";

    if (attendance.punchIn && attendance.punchOut) return "out";

    return "not-clocked-in";
  }

  const filteredEmployees = useMemo(() => {
    return data
      .map((emp) => {
        const status = deriveStatus(emp);

        return {
          id: emp.id,
          empCode: emp.employeeCode,
          name: `${emp.firstName} ${emp.lastName}`,
          initials: `${emp.firstName[0]}${emp.lastName[0]}`,
          status,
          designation: emp.designation,
          email: emp.user?.email ?? null,
          phone: emp.user?.phone ?? null,
          department: emp.department?.name ?? null,
          time:
            status === "in" && emp.attendances[0]?.punchIn
              ? new Date(emp.attendances[0].punchIn).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  },
                )
              : status === "out" && emp.attendances[0]?.punchOut
                ? new Date(emp.attendances[0].punchOut).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    },
                  )
                : undefined,
        };
      })
      .filter((emp) => {
        const matchesName = emp.name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesStatus =
          selectedStatuses.length === 0 ||
          selectedStatuses.includes(emp.status);

        return matchesName && matchesStatus;
      });
  }, [data, leaves, search, selectedStatuses]);

  const renderEmployees = (status: Status) => {
    const list = filteredEmployees.filter((e) => e.status === status);

    if (!list.length) return null;

    return (
      <div className="flex flex-wrap items-center gap-4">
        {list.map((emp, index) => {
          const colorClass = avatarColors[index % avatarColors.length];

          return (
            <div
              key={emp.id}
              className="flex flex-col items-center relative group"
            >
              <div
                onClick={() =>
                  setActiveEmployeeId((prev) =>
                    prev === emp.id ? null : emp.id,
                  )
                }
                className={`w-12 h-12 rounded-full text-white flex items-center justify-center text-sm font-semibold cursor-pointer ${colorClass}`}
              >
                {emp.initials}
              </div>

              <div className="absolute -top-8 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                {emp.name}
              </div>

              {emp.time && (
                <p className="text-xs text-gray-500 mt-1">{emp.time}</p>
              )}

              {activeEmployeeId === emp.id && (
                <EmployeeAvatarPopover
                  popoverRef={popoverRef}
                  name={emp.name}
                  initials={emp.initials}
                  empCode={emp.empCode}
                  colorClass={colorClass}
                  designation={emp.designation}
                  email={emp.email}
                  phone={emp.phone}
                  department={emp.department}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Who’s in today @ my department
        </h2>

        <div className="flex items-center gap-3 relative" ref={filterRef}>
          <div className="relative w-64">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg bg-white hover:bg-gray-50"
          >
            <SlidersHorizontal size={16} />
            Filter
          </button>

          {showFilter && (
            <div className="absolute right-0 top-12 w-56 bg-white border rounded-xl shadow-lg p-4 space-y-3 z-10">
              {statusOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(option.value)}
                    onChange={() => toggleStatus(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <PresenceCard title="Not clocked in yet" color="red">
        {renderEmployees("not-clocked-in")}
      </PresenceCard>

      <PresenceCard title="Clocked-in" color="blue">
        {renderEmployees("in")}
      </PresenceCard>

      <PresenceCard title="Clocked-out" color="yellow">
        {renderEmployees("out")}
      </PresenceCard>

      <PresenceCard title="On Leave" color="green">
        {renderEmployees("leave")}
      </PresenceCard>
    </div>
  );
}
