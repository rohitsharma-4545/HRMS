"use client";

import { useState } from "react";
import clsx from "clsx";

import PersonalDataTab from "./tabs/PersonalDataTab";
import WorkProfileTab from "./tabs/WorkProfileTab";
import DocumentsTab from "./tabs/DocumentTab";

interface Props {
  data: any;
  isSelf?: boolean;
}

export default function DataSection({ data, isSelf }: Props) {
  const [activeTab, setActiveTab] = useState("PERSONAL DATA");

  const tabs = isSelf
    ? ["PERSONAL DATA", "WORK PROFILE", "DOCUMENTS"]
    : ["PERSONAL DATA", "WORK PROFILE"];

  console.log(data);
  return (
    <div className="bg-white rounded-xl shadow border">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-6 py-4 text-sm font-medium tracking-wide",
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "PERSONAL DATA" && (
        <PersonalDataTab data={data} isSelf={isSelf} />
      )}

      {activeTab === "WORK PROFILE" && <WorkProfileTab data={data} />}

      {activeTab === "DOCUMENTS" && isSelf && <DocumentsTab data={data} />}
    </div>
  );
}
