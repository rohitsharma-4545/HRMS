"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";

import SectionContainer from "./SectionContainer";
import ImportantDatesForm from "./forms/ImportantDatesForm";

interface Props {
  data: any;
  isSelf?: boolean;
}

export default function ImportantDatesSection({ data, isSelf = true }: Props) {
  const [editing, setEditing] = useState(false);

  const hasData = Boolean(
    data?.birthDate || data?.partnerBirthDate || data?.anniversaryDate,
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
    <SectionContainer title="Important Dates" action={action}>
      {editing ? (
        <ImportantDatesForm
          defaultValues={data}
          onCancel={cancelEdit}
          onSubmit={() => setEditing(false)}
        />
      ) : hasData ? (
        <ImportantDatesView data={data} />
      ) : (
        <p className="text-gray-500 text-sm">No dates available</p>
      )}
    </SectionContainer>
  );
}

function ImportantDatesView({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <Field label="Birth Date" value={formatDate(data.birthDate)} />
      <Field
        label="Partner Birth Date"
        value={formatDate(data.partnerBirthDate)}
      />
      <Field
        label="Anniversary Date"
        value={formatDate(data.anniversaryDate)}
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

function formatDate(date?: string | Date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}
