"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Inbox, Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

import { AppUser } from "@/types/user";

interface HeaderProps {
  user: AppUser;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const [activeDropdown, setActiveDropdown] = useState<
    "notification" | "user" | null
  >(null);

  const toggleDropdown = (type: "notification" | "user") => {
    setActiveDropdown((prev) => (prev === type ? null : type));
  };

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 relative">
      <div className="w-1/2">
        <input
          placeholder="Search by employee name, employee code, mobile number or email id..."
          className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

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
