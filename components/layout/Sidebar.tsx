"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Menu, Clock } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { NAV_ITEMS } from "@/config/navigation";
import { toast } from "sonner";

export default function Sidebar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(true);
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null) {
      setOpen(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setOpen((prev) => {
      localStorage.setItem("sidebar-open", String(!prev));
      return !prev;
    });
  };

  const fetchTodayAttendance = useCallback(async () => {
    const res = await fetch("/api/attendance/today");
    const data = await res.json();
    setAttendance(data);
  }, []);

  useEffect(() => {
    fetchTodayAttendance();
  }, [fetchTodayAttendance]);

  const handlePunch = async () => {
    try {
      setLoading(true);

      const isPunchOut = !!attendance?.punchIn && !attendance?.punchOut;

      // Optimistic update
      const now = new Date().toISOString();

      if (!isPunchOut) {
        setAttendance((prev: any) => ({
          ...prev,
          punchIn: now,
        }));
      } else {
        setAttendance((prev: any) => ({
          ...prev,
          punchOut: now,
        }));
      }

      const endpoint = isPunchOut
        ? "/api/attendance/punch-out"
        : "/api/attendance/punch-in";

      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success(
        isPunchOut ? "Successfully clocked out" : "Successfully clocked in",
      );

      setAttendance(data);
    } catch (err: any) {
      toast.error(err.message);
      await fetchTodayAttendance(); // rollback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const timeout = midnight.getTime() - now.getTime();

    const timer = setTimeout(() => {
      fetchTodayAttendance();
    }, timeout);

    return () => clearTimeout(timer);
  }, [fetchTodayAttendance]);

  useEffect(() => {
    if (!attendance?.punchIn || attendance?.punchOut) {
      setRemainingSeconds(null);
      return;
    }

    const interval = setInterval(() => {
      const diff =
        60 * 60 -
        Math.floor(
          (Date.now() - new Date(attendance.punchIn).getTime()) / 1000,
        );

      setRemainingSeconds(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [attendance]);

  const hasPunchedIn = !!attendance?.punchIn;
  const hasPunchedOut = !!attendance?.punchOut;

  const disableClockOut =
    hasPunchedIn &&
    !hasPunchedOut &&
    remainingSeconds !== null &&
    remainingSeconds > 0;

  return (
    <div
      className={clsx(
        "bg-white border-r transition-all duration-300 flex flex-col",
        open ? "w-64" : "w-16",
      )}
    >
      <div className="flex items-center justify-between p-4">
        {open && (
          <Image
            src="/JES_Logo.png"
            alt="JES Electronic Systems Logo"
            width={140}
            height={36}
            className="object-contain h-10 w-auto"
            priority
          />
        )}
        <Menu
          aria-label="Toggle Sidebar"
          role="button"
          tabIndex={0}
          onClick={toggleSidebar}
        />
      </div>

      <nav className="mt-4 space-y-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-blue-50",
                )}
              >
                <Icon size={18} />
                {open && <span>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handlePunch}
          disabled={
            loading || hasPunchedOut || (hasPunchedIn && disableClockOut)
          }
          className={clsx(
            "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition",
            hasPunchedIn
              ? "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
              : "bg-green-500 text-white hover:bg-green-600",
            "disabled:cursor-not-allowed",
          )}
        >
          <Clock size={16} />

          {hasPunchedOut
            ? "Completed"
            : hasPunchedIn
              ? disableClockOut
                ? `Clock Out (${Math.floor(
                    remainingSeconds! / 60,
                  )}:${String(remainingSeconds! % 60).padStart(2, "0")})`
                : "Clock Out"
              : "Clock In"}
        </button>
      </div>
    </div>
  );
}
