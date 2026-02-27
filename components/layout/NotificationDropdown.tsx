"use client";

import { useEffect, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface Props {
  active: boolean;
  close: () => void;
}

export default function NotificationDropdown({ active, close }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, close, active);

  if (!active) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-3 w-80 bg-white border rounded-lg shadow-lg p-4 z-50"
    >
      <h3 className="font-semibold mb-3">Notifications</h3>

      <div className="space-y-3 text-sm max-h-64 overflow-y-auto">
        <p>Utkarsh applied for leave (Approved)</p>
        <p>Zeeshan applied for leave</p>
        <p>New employee joined</p>
        <p>Payroll processed for September</p>
      </div>
    </div>
  );
}
