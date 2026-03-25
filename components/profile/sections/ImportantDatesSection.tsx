"use client";

import SectionContainer from "./SectionContainer";

export default function ImportantDatesSection({ data, isSelf }: any) {
  const hasData = !!data?.birthDate;

  return (
    <SectionContainer
      title="Important Dates"
      hasData={hasData}
      isSelf={isSelf}
      form={<ImportantDatesForm />}
    >
      {!hasData ? (
        <p className="text-gray-500">No dates available</p>
      ) : (
        <div className="space-y-4">
          <Field label="Birth Date" value={data.birthDate} />
          <Field label="Marriage Date" value={data.marriageDate} />
        </div>
      )}
    </SectionContainer>
  );
}

function Field({ label, value }: any) {
  return (
    <div>
      <p className="text-blue-600 text-sm">{label}</p>
      <p>{value || "-"}</p>
    </div>
  );
}

function ImportantDatesForm() {
  return (
    <form className="space-y-4">
      <input type="date" className="input" />
      <input type="date" className="input" />

      <button className="btn-primary">Save</button>
    </form>
  );
}
