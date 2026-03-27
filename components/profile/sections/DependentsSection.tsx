"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";

import SectionContainer from "./SectionContainer";
import DependentsForm from "./forms/DependentsForm";

interface Props {
  data: any[];
  isSelf?: boolean;
}

export default function DependentsSection({ data = [], isSelf = true }: Props) {
  const [editing, setEditing] = useState(false);

  const hasData = data.length > 0;

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
    <SectionContainer title="Dependents" action={action}>
      {editing ? (
        <DependentsForm
          defaultValues={data}
          onCancel={cancelEdit}
          onSubmit={() => setEditing(false)}
        />
      ) : hasData ? (
        <DependentsView data={data} />
      ) : (
        <p className="text-gray-500 text-sm">
          No data available. Click "Add" to get started.
        </p>
      )}
    </SectionContainer>
  );
}

function DependentsView({ data }: { data: any[] }) {
  return (
    <div className="space-y-4">
      {data.map((d) => (
        <div key={d.id} className="border rounded-lg p-3">
          <p className="font-medium text-sm">
            {d.firstName} {d.lastName || ""}
          </p>
          <p className="text-xs text-gray-500">{d.relation}</p>
          <p className="text-xs text-gray-500">{d.phone || "-"}</p>
          <p className="text-xs text-gray-500">{formatDate(d.birthDate)}</p>
        </div>
      ))}
    </div>
  );
}

function formatDate(date?: string | Date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}
