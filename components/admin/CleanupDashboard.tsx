"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import CleanupCard from "./CleanupCard";

type Stats = {
  notices: number;
  leaves: number;
  holidays: number;
  attendance: number;
};

export default function CleanupDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmType, setConfirmType] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/cleanup/stats");
      const data = await res.json();
      setStats(data);
    } catch {
      toast.error("Failed to load stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCleanup = async (type: string) => {
    setConfirmType(type);
  };

  const executeCleanup = async () => {
    if (!confirmType) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/cleanup`, {
        method: "POST",
      });

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) throw new Error(data?.message || "Cleanup failed");

      toast.success(data.message || "Cleanup completed");
      fetchStats();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setConfirmType(null);
    }
  };

  if (!stats) {
    return <p className="text-gray-500">Loading cleanup data...</p>;
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
      <CleanupCard
        title="Old Notices"
        count={stats.notices}
        description="Older than 3 months"
        onClean={() => handleCleanup("notices")}
        loading={loading}
      />

      <CleanupCard
        title="Unapproved Leaves"
        count={stats.leaves}
        description="Pending older than 30 days"
        onClean={() => handleCleanup("leaves")}
        loading={loading}
      />

      <CleanupCard
        title="Old Holidays"
        count={stats.holidays}
        description="Previous year records"
        onClean={() => handleCleanup("holidays")}
        loading={loading}
      />

      <CleanupCard
        title="Attendance Logs"
        count={stats.attendance}
        description="Older than 3 months"
        onClean={() => handleCleanup("attendance")}
        loading={loading}
      />

      {confirmType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in">
            <h3 className="text-lg font-semibold">Confirm Cleanup</h3>

            <p className="text-sm text-gray-600">
              This will permanently delete <b>{confirmType}</b> data. This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setConfirmType(null)}
                className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={executeCleanup}
                className="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
