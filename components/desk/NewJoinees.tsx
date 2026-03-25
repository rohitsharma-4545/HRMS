"use client";

export default function NewJoinees() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-6">
      <h3 className="font-semibold text-gray-800">New Joinees</h3>

      <div>
        <h4 className="text-sm font-semibold mb-2">Today's Joiners</h4>
        <div className="bg-gray-100 text-sm text-gray-500 p-3 rounded-lg">
          No new joiners today
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Recent Joiners</h4>
        <div className="bg-gray-100 text-sm text-gray-500 p-3 rounded-lg">
          No recent joiners
        </div>
      </div>
    </div>
  );
}
