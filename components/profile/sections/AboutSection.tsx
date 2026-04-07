"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";

import SectionContainer from "./SectionContainer";
import AboutForm from "./forms/AboutForm";

interface Props {
  data: any;
  isSelf?: boolean;
}

export default function AboutSection({ data, isSelf = false }: Props) {
  const [editing, setEditing] = useState(false);

  const hasData = Boolean(data);

  function startEdit() {
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  const action =
    isSelf && !editing ? (
      hasData ? (
        <button
          onClick={startEdit}
          className="flex items-center gap-2 text-blue-600 text-sm"
        >
          <Pencil size={16} />
          Edit
        </button>
      ) : (
        <button
          onClick={startEdit}
          className="flex items-center gap-2 text-blue-600 text-sm"
        >
          <Plus size={16} />
          Add
        </button>
      )
    ) : null;

  return (
    <SectionContainer title="About" action={action}>
      {editing ? (
        <AboutForm
          defaultValues={data}
          onCancel={cancelEdit}
          onSubmit={() => setEditing(false)}
        />
      ) : hasData ? (
        <AboutView data={data} />
      ) : (
        <p className="text-gray-500 text-sm">No information available</p>
      )}
    </SectionContainer>
  );
}

function AboutView({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <Field label="Salutation" value={data.salutation} />
      <Field label="First Name" value={data.firstName} />
      <Field label="Middle Name" value={data.middleName} />
      <Field label="Last Name" value={data.lastName} />
      <Field label="Preferred Name" value={data.preferredName} />
      <Field label="About Yourself" value={data.about} />
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
