"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import SectionContainer from "./SectionContainer";
import WorkDetailsForm from "./forms/WorkDetailsForm";

export default function WorkDetailsSection({ data, isSelf = true }: any) {
  const [editing, setEditing] = useState(false);

  const hasData = !!data?.workProfile;

  const action =
    isSelf && !editing ? (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-2 text-blue-600 text-sm"
      >
        {hasData ? <Pencil size={16} /> : <Plus size={16} />}
        {hasData ? "Edit" : "Add"}
      </button>
    ) : null;

  return (
    <SectionContainer title="Work Details" action={action}>
      {editing ? (
        <WorkDetailsForm
          defaultValues={data.workProfile}
          onCancel={() => setEditing(false)}
          onSubmit={() => setEditing(false)}
        />
      ) : hasData ? (
        <View data={data.workProfile} />
      ) : (
        <p className="text-gray-500 text-sm">No work details available</p>
      )}
    </SectionContainer>
  );
}

function View({ data }: any) {
  console.log(data);
  return (
    <div className="space-y-4">
      <Field label="Employment Stage" value={data.employmentStage} />
      <Field label="Employment Type" value={data.employmentType} />
      <Field label="Employment Grade" value={data.employmentGrade} />
      <Field label="Self Service" value={data.selfService ? "Yes" : "No"} />
      <Field label="Probation End" value={format(data.probationEndDate)} />
      <Field label="Confirmation Date" value={format(data.confirmationDate)} />
      <Field label="Notice Start" value={format(data.noticeStartDate)} />
      <Field label="Exit Date" value={format(data.exitDate)} />
    </div>
  );
}

function Field({ label, value }: any) {
  return (
    <div>
      <p className="text-blue-600 text-sm">{label}</p>
      <p className="text-gray-800 text-sm">{value || "-"}</p>
    </div>
  );
}

function format(date: any) {
  if (!date) return null;
  return new Date(date).toLocaleDateString();
}
