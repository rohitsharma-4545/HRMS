"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";

import SectionContainer from "./SectionContainer";
import BiodataForm from "./forms/BiodataForm";

interface Props {
  data: any;
  isSelf?: boolean;
}

export default function BiodataSection({ data, isSelf = true }: Props) {
  const [editing, setEditing] = useState(false);

  const hasData = Boolean(
    data?.gender ||
    data?.bloodGroup ||
    data?.genderPronoun ||
    data?.maritalStatus ||
    data?.partnerName ||
    data?.challenged !== undefined,
  );

  function startEdit() {
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  const action =
    isSelf && !editing ? (
      <button
        onClick={startEdit}
        className="flex items-center gap-2 text-blue-600 text-sm"
      >
        {hasData ? <Pencil size={16} /> : <Plus size={16} />}
        {hasData ? "Edit" : "Add"}
      </button>
    ) : null;

  return (
    <SectionContainer title="Biodata" action={action}>
      {editing ? (
        <BiodataForm
          defaultValues={data}
          onCancel={cancelEdit}
          onSubmit={() => setEditing(false)}
        />
      ) : hasData ? (
        <BiodataView data={data} />
      ) : (
        <p className="text-gray-500 text-sm">No biodata available</p>
      )}
    </SectionContainer>
  );
}

function BiodataView({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <Field label="Gender" value={data.gender} />
      <Field label="Gender Pronoun" value={data.genderPronoun} />
      <Field label="Marital Status" value={data.maritalStatus} />
      <Field label="Partner Name" value={data.partnerName} />
      <Field label="Blood Group" value={data.bloodGroup} />
      <Field
        label="Differently Abled"
        value={
          data.challenged === undefined ? "-" : data.challenged ? "Yes" : "No"
        }
      />
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-blue-600 text-sm">{label}</p>
      <p className="text-gray-800 text-sm">{value || "-"}</p>
    </div>
  );
}
