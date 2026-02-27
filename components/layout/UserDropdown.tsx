"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UserCircle,
  Lock,
  Bell,
  HelpCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { AppUser } from "@/types/user";
import { useClickOutside } from "@/hooks/useClickOutside";

interface Props {
  user: AppUser;
  active: boolean;
  toggle: () => void;
  close: () => void;
}

export default function UserDropdown({ user, active, toggle, close }: Props) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, close, active);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const role = user.roles.length ? user.roles[0] : "User";

  return (
    <div ref={ref}>
      <UserCircle size={24} className="cursor-pointer" onClick={toggle} />

      {active && (
        <div className="absolute right-0 mt-3 w-60 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-2 border-b bg-gray-50">
            <div className="flex items-start gap-3">
              <UserCircle size={36} className="text-blue-500 mt-1" />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 text-sm md:text-base">
                  NItesh Malhotra
                </span>
                <span className="font-medium text-gray-500 text-xs md:text-sm">
                  {role}
                </span>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push("/profile-privacy")}
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm"
          >
            <ShieldCheck size={16} />
            <span>Profile Privacy</span>
          </div>

          <div
            onClick={() => router.push("/change-password")}
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm"
          >
            <Lock size={16} />
            <span>Change Password</span>
          </div>

          <div
            onClick={() => router.push("/notification-preferences")}
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm"
          >
            <Bell size={16} />
            <span>Notification Preferences</span>
          </div>

          <div
            onClick={() => router.push("/help")}
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm"
          >
            <HelpCircle size={16} />
            <span>Help</span>
          </div>

          <div
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm"
          >
            <RefreshCw size={16} />
            <span>Sync App</span>
          </div>

          <div
            onClick={logout}
            className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 cursor-pointer text-sm"
          >
            <UserCircle size={16} />
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
}
