"use client";

import SectionContainer from "./SectionContainer";

export default function DependentsSection({ data, isSelf }: any) {
  const hasData = data?.length > 0;

  return (
    <SectionContainer
      title="Dependents"
      hasData={hasData}
      isSelf={isSelf}
      form={<DependentsForm />}
    >
      {!hasData ? (
        <p className="text-gray-500">No dependents added</p>
      ) : (
        <div className="space-y-4">
          {data.map((d: any) => (
            <div key={d.id}>
              <p className="font-medium">{d.name}</p>
              <p className="text-sm text-gray-500">{d.relation}</p>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}

function DependentsForm() {
  return (
    <form className="space-y-4">
      <input placeholder="Name" className="input" />
      <input placeholder="Relation" className="input" />

      <button className="btn-primary">Save</button>
    </form>
  );
}
