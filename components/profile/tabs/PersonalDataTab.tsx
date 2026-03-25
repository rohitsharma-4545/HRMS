"use client";

import { useState } from "react";

import AboutSection from "../sections/AboutSection";
import AddressSection from "../sections/AddressSection";
import ContactSection from "../sections/ContactSection";
import BiodataSection from "../sections/BiodataSection";
import ImportantDatesSection from "../sections/ImportantDatesSection";
import DependentsSection from "../sections/DependentsSection";

const SECTIONS = [
  "About",
  "Address",
  "Contact",
  "Biodata",
  "Important Dates",
  "Dependents",
];

export default function PersonalDataTab({ data, isSelf }: any) {
  console.log(data);
  const [active, setActive] = useState("About");

  const visibleSections = isSelf ? SECTIONS : ["About", "Address", "Contact"];

  return (
    <div className="flex">
      <div className="w-64 border-r p-4 space-y-2">
        {visibleSections.map((section) => (
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
        {active === "About" && (
          <AboutSection data={data.personalProfile} isSelf={isSelf} />
        )}

        {active === "Address" && (
          <AddressSection data={data.addresses} isSelf={isSelf} />
        )}

        {active === "Contact" && (
          <ContactSection data={data.contacts} isSelf={isSelf} />
        )}

        {active === "Biodata" && isSelf && (
          <BiodataSection data={data.personalProfile} />
        )}

        {active === "Important Dates" && isSelf && (
          <ImportantDatesSection data={data.personalProfile} />
        )}

        {active === "Dependents" && isSelf && (
          <DependentsSection data={data.dependents} />
        )}
      </div>
    </div>
  );
}
