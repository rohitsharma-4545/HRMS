"use client";

import SectionContainer from "./SectionContainer";

interface Props {
  data: any;
  isSelf?: boolean;
}

export default function WorkDetailsSection({ data, isSelf }: Props) {
  const hasData = !!data;

  return (
    <SectionContainer
      title="Work Details"
      hasData={hasData}
      isSelf={isSelf}
      form={<WorkDetailsForm defaultValues={data} />}
    >
      {!hasData ? (
        <p className="text-gray-500">No work details available</p>
      ) : (
        <div className="space-y-4">
          <Field
            label="Date of Joining"
            value={format(data.employee?.joiningDate)}
          />
          <Field label="Employment Stage" value={data.employmentStage} />
          <Field label="Employment Type" value={data.employmentType} />
          <Field label="Employment Grade" value={data.employmentGrade} />
          <Field label="Self Service" value={data.selfService ? "On" : "Off"} />
          <Field
            label="Probation End Date"
            value={format(data.probationEndDate)}
          />
          <Field
            label="Date of Confirmation"
            value={format(data.confirmationDate)}
          />
          <Field
            label="Notice Period Start"
            value={format(data.noticeStartDate)}
          />
          <Field label="Exit Date" value={format(data.exitDate)} />
        </div>
      )}
    </SectionContainer>
  );
}

function Field({ label, value }: any) {
  return (
    <div>
      <p className="text-blue-600 text-sm">{label}</p>
      <p className="text-gray-800">{value || "-"}</p>
    </div>
  );
}

function WorkDetailsForm({ defaultValues }: any) {
  return (
    <form className="space-y-4 max-w-md">
      <input
        type="date"
        defaultValue={defaultValues?.probationEndDate}
        className="input"
      />

      <select defaultValue={defaultValues?.employmentStage} className="input">
        <option>Probation</option>
        <option>Confirmed</option>
        <option>Contract</option>
      </select>

      <select defaultValue={defaultValues?.employmentType} className="input">
        <option>Full Time</option>
        <option>Part Time</option>
        <option>Intern</option>
      </select>

      <input
        placeholder="Employment Grade"
        defaultValue={defaultValues?.employmentGrade}
        className="input"
      />

      <label className="flex items-center gap-2">
        <input type="checkbox" defaultChecked={defaultValues?.selfService} />
        Self Service
      </label>

      <button className="btn-primary">Save</button>
    </form>
  );
}

function format(date: any) {
  if (!date) return null;
  return new Date(date).toLocaleDateString();
}
