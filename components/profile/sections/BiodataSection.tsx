"use client";

import SectionContainer from "./SectionContainer";

export default function BiodataSection({ data, isSelf }: any) {
  const hasData = !!data?.gender;

  return (
    <SectionContainer
      title="Biodata"
      hasData={hasData}
      isSelf={isSelf}
      form={<BiodataForm />}
    >
      {!hasData ? (
        <p className="text-gray-500">No biodata available</p>
      ) : (
        <div className="space-y-4">
          <Field label="Gender" value={data.gender} />
          <Field label="Marital Status" value={data.maritalStatus} />
          <Field label="Blood Group" value={data.bloodGroup} />
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

function BiodataForm() {
  return (
    <form className="space-y-4">
      <select className="input">
        <option>Male</option>
        <option>Female</option>
      </select>

      <button className="btn-primary">Save</button>
    </form>
  );
}
