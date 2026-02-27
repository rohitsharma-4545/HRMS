"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { NAV_ITEMS } from "@/config/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(true);

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

  return (
    <div
      className={clsx(
        "bg-white border-r transition-all duration-300",
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

      <nav className="mt-4 space-y-1">
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
    </div>
  );
}
