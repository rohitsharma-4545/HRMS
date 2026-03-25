"use client";

import SectionContainer from "./SectionContainer";

export default function ReportingOfficeSection({ data, isSelf }: any) {
  const hasData = data?.length > 0;

  return (
    <SectionContainer
      title="Reporting Office"
      hasData={hasData}
      isSelf={isSelf}
      form={<ReportingOfficeForm />}
    >
      {!hasData ? (
        <p className="text-gray-500">No reporting office assigned</p>
      ) : (
        <div className="space-y-6">
          {data.map((office: any) => (
            <div key={office.id} className="space-y-2">
              <p className="font-medium">{office.officeName}</p>

              <p className="text-sm text-gray-600">{office.address}</p>

              <p className="text-sm text-gray-500">
                {office.city}, {office.state} {office.postalCode}
              </p>

              <p className="text-sm text-gray-500">{office.country}</p>

              {office.isCurrent && (
                <span className="text-xs text-green-600">Current</span>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}

function ReportingOfficeForm() {
  return (
    <form className="space-y-4 max-w-md">
      <input placeholder="Office Name" className="input" />

      <textarea placeholder="Address" className="input" />

      <input placeholder="City" className="input" />
      <input placeholder="State" className="input" />
      <input placeholder="Postal Code" className="input" />
      <input placeholder="Country" className="input" />

      <label className="flex items-center gap-2">
        <input type="checkbox" />
        Current Office
      </label>

      <button className="btn-primary">Save</button>
    </form>
  );
}
