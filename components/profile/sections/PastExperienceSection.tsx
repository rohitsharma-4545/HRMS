"use client";

import SectionContainer from "./SectionContainer";

export default function PastExperienceSection({ data }: any) {
  const past = data?.filter((e: any) => !e.isCurrent);

  return (
    <SectionContainer
      title="Past Experience"
      hasData={past?.length > 0}
      form={<PastExperienceForm />}
      isSelf
    >
      {!past?.length ? (
        <p className="text-gray-500">No past experience</p>
      ) : (
        <div className="space-y-6">
          {past.map((exp: any) => (
            <div key={exp.id} className="space-y-1">
              <p className="font-semibold">{exp.designation}</p>

              <p className="text-gray-700">{exp.company}</p>

              <p className="text-sm text-gray-500">
                {format(exp.startDate)} — {format(exp.endDate)}
              </p>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}

function PastExperienceForm() {
  return (
    <form className="space-y-4 max-w-md">
      <input placeholder="Company" className="input" />

      <input placeholder="Designation" className="input" />

      <input type="date" className="input" placeholder="Start Date" />

      <input type="date" className="input" placeholder="End Date" />

      <button className="btn-primary">Add Experience</button>
    </form>
  );
}

function format(date: any) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}
