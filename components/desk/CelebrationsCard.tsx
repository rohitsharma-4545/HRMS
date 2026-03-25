"use client";

import { useState } from "react";

type Tab = "birthday" | "work" | "marriage";

export default function CelebrationsCard() {
  const [tab, setTab] = useState<Tab>("birthday");

  const tabs: { key: Tab; label: string }[] = [
    { key: "birthday", label: "Birthday" },
    { key: "work", label: "Work anniversary" },
    { key: "marriage", label: "Marriage anniversary" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex gap-6 border-b mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-2 text-sm ${
              tab === t.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-sm">
          {tab === "birthday" && "Birthdays today"}
          {tab === "work" && "Work anniversaries today"}
          {tab === "marriage" && "Marriage anniversaries today"}
        </h4>

        <div className="text-sm text-gray-500">No {tab} today</div>

        <h4 className="font-semibold text-sm">Upcoming {tab}s</h4>

        <div className="text-sm text-gray-500">No upcoming {tab}s</div>
      </div>
    </div>
  );
}
