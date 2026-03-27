"use client";

import { useEffect, useState } from "react";
import MonthPicker from "@/components/attendance/MonthPicker";
import AttendanceTable from "@/components/attendance/AttendanceTable";

export default function AttendancePage() {
  const [month, setMonth] = useState(new Date());
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const load = async () => {
      const param = month.toISOString().slice(0, 7);
      const res = await fetch(`/api/attendance/history?month=${param}`);
      const data = await res.json();
      setRecords(data);
    };

    load();
  }, [month]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Clock In Request
        </button>
        <button className="px-4 py-2 bg-gray-800 text-white rounded-lg">
          Attendance Update
        </button>
        <button className="px-4 py-2 bg-gray-400 text-white rounded-lg">
          Advanced Options
        </button>
      </div>

      <MonthPicker month={month} onChange={setMonth} />

      <AttendanceTable records={records} />
    </div>
  );
}
