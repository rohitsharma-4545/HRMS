"use client";

import Link from "next/link";
import { ExternalLink, Briefcase, Mail, Phone, Building2 } from "lucide-react";

type Props = {
  name: string;
  initials: string;
  empCode: string;
  colorClass: string;

  designation?: string | null;
  email?: string | null;
  phone?: string | null;
  department?: string | null;

  popoverRef: React.RefObject<HTMLDivElement | null>;
};

export default function EmployeeAvatarPopover({
  name,
  initials,
  empCode,
  colorClass,
  designation,
  email,
  phone,
  department,
  popoverRef,
}: Props) {
  return (
    <div
      ref={popoverRef}
      className="absolute top-12 left-0 ml-6 z-50 w-60 bg-white shadow-2xl rounded-2xl border overflow-hidden"
    >
      <div className="flex flex-col">
        <div className="relative h-32 bg-slate-100 flex items-start justify-center pt-3">
          <div
            className={`w-20 h-20 rounded-full text-white flex items-center justify-center text-xl font-semibold shadow-lg ${colorClass}`}
          >
            {initials}
          </div>

          <p className="absolute bottom-1 left-4 text-sm font-semibold text-slate-700 truncate max-w-[65%]">
            {name}
          </p>

          <Link
            href={`/profile/${empCode}`}
            className="absolute bottom-3 right-4 text-slate-700 hover:scale-110 transition"
          >
            <ExternalLink size={18} />
          </Link>
        </div>

        <div className="p-4 space-y-3 text-xs text-slate-700 border-t">
          {designation && (
            <div className="flex items-center gap-2">
              <Briefcase size={14} />
              {designation}
            </div>
          )}

          {phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} />
              {phone}
            </div>
          )}

          {email && (
            <div className="flex items-center gap-2">
              <Mail size={14} />
              {email}
            </div>
          )}

          {department && (
            <div className="flex items-center gap-2">
              <Building2 size={14} />
              {department}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
