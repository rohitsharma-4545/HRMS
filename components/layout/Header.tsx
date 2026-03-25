"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Inbox,
  Bell,
  Briefcase,
  Building2,
  User,
} from "lucide-react";
import clsx from "clsx";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import { useClickOutside } from "@/hooks/useClickOutside";
import { AppUser } from "@/types/user";

interface HeaderProps {
  user: AppUser;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const [activeDropdown, setActiveDropdown] = useState<
    "notification" | "user" | null
  >(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  useClickOutside(searchRef, () => setShowSearch(false), showSearch);

  const toggleDropdown = (type: "notification" | "user") => {
    setActiveDropdown((prev) => (prev === type ? null : type));
  };

  // 🔎 Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);

      const res = await fetch(`/api/employee/search?q=${query}`);
      const data = await res.json();

      setResults(data);
      setLoading(false);
      setShowSearch(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 relative z-40">
      {/* SEARCH */}
      <div className="w-1/2 relative" ref={searchRef}>
        <input
          placeholder="Search by name, code, mobile or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowSearch(true)}
          className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* SEARCH RESULTS */}
        <div
          className={clsx(
            "absolute mt-2 w-full bg-white border rounded-xl shadow-2xl max-h-96 overflow-y-auto transition-all duration-300 ease-in-out",
            showSearch && results.length > 0
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2",
          )}
        >
          {loading && <p className="p-4 text-sm text-gray-500">Searching...</p>}

          {!loading &&
            results.map((emp) => (
              <div
                key={emp.id}
                onClick={() => {
                  setShowSearch(false);
                  setQuery("");
                  router.push(`/profile/${emp.employeeCode}`);
                }}
                className="flex items-start gap-4 p-4 hover:bg-slate-50 cursor-pointer border-b last:border-none transition"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold shrink-0">
                  {emp.firstName?.[0]}
                  {emp.lastName?.[0]}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {emp.firstName} {emp.lastName}
                    </p>

                    <span
                      className={clsx(
                        "text-xs px-2 py-0.5 rounded-full",
                        emp.user?.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600",
                      )}
                    >
                      {emp.user?.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {emp.employeeCode}
                    </span>

                    {emp.designation && (
                      <span className="flex items-center gap-1">
                        <Briefcase size={12} />
                        {emp.designation}
                      </span>
                    )}

                    {emp.department && (
                      <span className="flex items-center gap-1">
                        <Building2 size={12} />
                        {emp.department.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {!loading && query && results.length === 0 && (
            <p className="p-4 text-sm text-gray-500 text-center">
              No employees found.
            </p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6 relative">
        <Calendar
          className="cursor-pointer"
          size={20}
          onClick={() => router.push("/calendar")}
        />

        <Inbox
          className="cursor-pointer"
          size={20}
          onClick={() => router.push("/request-center")}
        />

        <div className="relative">
          <Bell
            className="cursor-pointer"
            size={20}
            onClick={() => toggleDropdown("notification")}
          />

          <NotificationDropdown
            active={activeDropdown === "notification"}
            close={() => setActiveDropdown(null)}
          />
        </div>

        <div className="relative">
          <UserDropdown
            user={user}
            active={activeDropdown === "user"}
            toggle={() =>
              setActiveDropdown((prev) => (prev === "user" ? null : "user"))
            }
            close={() => setActiveDropdown(null)}
          />
        </div>
      </div>
    </header>
  );
}
