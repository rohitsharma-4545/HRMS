"use client";

import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface Props {
  active: boolean;
  close: () => void;
}

export default function NotificationDropdown({ active, close }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useClickOutside(ref, close, active);

  useEffect(() => {
    if (!active) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-3 w-80 bg-white border rounded-lg shadow-lg p-4 z-50"
    >
      <h3 className="font-semibold mb-3">Notifications</h3>

      <div className="space-y-3 text-sm max-h-64 overflow-y-auto">
        {loading && <p>Loading...</p>}

        {!loading && notifications.length === 0 && (
          <p className="text-gray-500">No notifications</p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <p>{n.message}</p>
            <p className="text-xs text-gray-400">
              {n.createdAt ? new Date(n.createdAt).toLocaleString() : "No date"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
