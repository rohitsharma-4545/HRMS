"use client";

import SectionContainer from "./SectionContainer";

export default function CurrentExperienceSection({ data }: any) {
  const current = data?.find((e: any) => e.isCurrent);

  return (
    <SectionContainer
      title="Current Experience"
      hasData={!!current}
      form={<ExperienceForm />}
      isSelf
    >
      {!current ? (
        <p className="text-gray-500">No current experience</p>
      ) : (
        <div className="space-y-2">
          <p className="font-semibold">{current.designation}</p>

          <p className="text-gray-700">{current.company}</p>

          <p className="text-sm text-gray-500">
            {format(current.startDate)} to Present
          </p>
        </div>
      )}
    </SectionContainer>
  );
}

function ExperienceForm() {
  return (
    <form className="space-y-4 max-w-md">
      <input placeholder="Company" className="input" />

      <input placeholder="Designation" className="input" />

      <input type="date" className="input" />

      <button className="btn-primary">Save</button>
    </form>
  );
}

function format(date: any) {
  return new Date(date).toLocaleDateString();
}
