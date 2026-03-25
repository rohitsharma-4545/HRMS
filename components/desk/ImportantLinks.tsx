"use client";

import Link from "next/link";
import { Calendar, FileText, LayoutDashboard } from "lucide-react";

interface Props {
  empCode: string;
}

export default function ImportantLinks({ empCode }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
      <h3 className="font-semibold text-gray-800">Important links</h3>

      <Link
        href="/request-center"
        className="flex items-center justify-between text-sm hover:text-blue-600"
      >
        <div className="flex items-center gap-2">
          <LayoutDashboard size={16} />
          Request center
        </div>
      </Link>

      <Link
        href="/calendar"
        className="flex items-center justify-between text-sm hover:text-blue-600"
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          My shift plan
        </div>
      </Link>

      <Link
        href="/calendar"
        className="flex items-center justify-between text-sm hover:text-blue-600"
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          sumHR calendar
        </div>
      </Link>

      <Link
        href={`/profile/${empCode}/#policies`}
        className="flex items-center justify-between text-sm hover:text-blue-600"
      >
        <div className="flex items-center gap-2">
          <FileText size={16} />
          My policies
        </div>
      </Link>
    </div>
  );
}
