"use client";

import { useState } from "react";

import WorkDetailsSection from "../sections/WorkDetailsSection";
import ReportingOfficeSection from "../sections/ReportingOfficeSection";
import CurrentExperienceSection from "../sections/CurrentExperienceSection";
import PastExperienceSection from "../sections/PastExperienceSection";

const SECTIONS = [
  "Work Details",
  "Reporting Office",
  "Current Experience",
  "Past Experience",
];

export default function WorkProfileTab({ data }: any) {
  const [active, setActive] = useState("Work Details");

  return (
    <div className="flex">
      <div className="w-64 border-r p-4 space-y-2">
        {SECTIONS.map((section) => (
          <button
            key={section}
            onClick={() => setActive(section)}
            className={`block w-full text-left px-3 py-2 rounded-lg ${
              active === section
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-50"
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
        {active === "Work Details" && <WorkDetailsSection data={data} />}

        {active === "Reporting Office" && (
          <ReportingOfficeSection data={data.reportingOffice} />
        )}

        {active === "Current Experience" && (
          <CurrentExperienceSection data={data.experiences} />
        )}

        {active === "Past Experience" && (
          <PastExperienceSection data={data.experiences} />
        )}
      </div>
    </div>
  );
}
