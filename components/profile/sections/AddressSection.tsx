"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";

import SectionContainer from "./SectionContainer";
import AddressForm from "./forms/AddressForm";

interface Props {
  data: any[];
  isSelf?: boolean;
}

export default function AddressSection({ data = [], isSelf = false }: Props) {
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
    <SectionContainer title="Address" action={action}>
      {editing ? (
        <AddressForm
          defaultValues={data}
          onCancel={cancelEdit}
          onSubmit={cancelEdit}
        />
      ) : hasData ? (
        <AddressView data={data} />
      ) : (
        <p className="text-gray-500 text-sm">No address added</p>
      )}
    </SectionContainer>
  );
}

function AddressView({ data }: { data: any[] }) {
  return (
    <div className="space-y-6">
      {data.map((addr) => (
        <div key={addr.id} className="border rounded-lg p-4">
          <p className="font-medium mb-2 text-sm">{addr.type}</p>

          <p className="text-sm text-gray-700">
            {addr.address1} {addr.address2 && `, ${addr.address2}`}
          </p>

          <p className="text-sm text-gray-600">
            {addr.city}, {addr.state}
          </p>

          <p className="text-sm text-gray-500">
            {addr.country} {addr.postalCode}
          </p>
        </div>
      ))}
    </div>
  );
}
