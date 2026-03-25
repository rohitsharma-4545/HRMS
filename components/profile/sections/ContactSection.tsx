"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import SectionContainer from "./SectionContainer";
import ContactForm from "./forms/ContactForm";

interface Props {
  data: any[];
  isSelf?: boolean;
}

export default function ContactSection({ data = [], isSelf = false }: Props) {
  const [editing, setEditing] = useState(false);

  const hasData = data.length > 0;

  const action =
    isSelf && !editing ? (
      hasData ? (
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 text-blue-600 text-sm"
        >
          <Pencil size={16} />
          Edit
        </button>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 text-blue-600 text-sm"
        >
          <Plus size={16} />
          Add
        </button>
      )
    ) : null;

  function cancelEdit() {
    setEditing(false);
  }

  return (
    <SectionContainer title="Contact" action={action}>
      {editing ? (
        <ContactForm
          defaultValues={data}
          onCancel={cancelEdit}
          onSubmit={cancelEdit}
        />
      ) : hasData ? (
        <ContactView contacts={data} />
      ) : (
        <p className="text-gray-500 text-sm">No contact information</p>
      )}
    </SectionContainer>
  );
}

function ContactView({ contacts }: { contacts: any[] }) {
  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div key={contact.id} className="border rounded-lg p-4">
          <p className="text-sm text-blue-600">
            {contact.type} • {contact.tag}
          </p>

          <p className="text-gray-800 text-sm">{contact.value}</p>
        </div>
      ))}
    </div>
  );
}
