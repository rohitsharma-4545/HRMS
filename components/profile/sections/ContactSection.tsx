"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import SectionContainer from "./SectionContainer";
import ContactForm from "./forms/ContactForm";
import { updateProfileSection } from "../profile.api";
import { toast } from "sonner";

interface Props {
  data: any[];
  isSelf?: boolean;
}

export default function ContactSection({ data = [], isSelf = false }: Props) {
  const [contacts, setContacts] = useState(data);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  function startAdd() {
    setAdding(true);
    setEditingId(null);
  }

  function startEdit(id: string) {
    setEditingId(id);
    setAdding(false);
  }

  function closeForm() {
    setEditingId(null);
    setAdding(false);
  }

  async function handleDelete(id: string) {
    toast("Delete this contact?", {
      action: {
        label: "Delete",
        onClick: async () => {
          await updateProfileSection("DELETE_CONTACT", { id });

          setContacts((prev) => prev.filter((c) => c.id !== id));
          toast.success("Deleted");
        },
      },
    });
  }

  function handleLocalUpdate(updated: any) {
    setContacts((prev) => {
      const exists = prev.find((c) => c.id === updated.id);

      if (exists) {
        return prev.map((c) => (c.id === updated.id ? updated : c));
      }

      return [...prev, updated];
    });
  }

  const canAddMore = contacts.length < 2;

  const action =
    isSelf && !editingId && !adding && canAddMore ? (
      <button
        onClick={startAdd}
        className="flex items-center gap-2 text-blue-600 text-sm"
      >
        <Plus size={16} />
        Add
      </button>
    ) : null;

  return (
    <SectionContainer title="Contact" action={action}>
      {adding && (
        <ContactForm
          defaultValues={[]}
          onCancel={closeForm}
          onSubmit={(data) => {
            handleLocalUpdate(data);
            closeForm();
          }}
        />
      )}

      {!adding && (
        <ContactView
          contacts={contacts}
          isSelf={isSelf}
          onEdit={startEdit}
          onDelete={handleDelete}
          editingId={editingId}
          onClose={closeForm}
          onSubmit={handleLocalUpdate}
        />
      )}
    </SectionContainer>
  );
}

function ContactView({
  contacts,
  isSelf,
  onEdit,
  onDelete,
  editingId,
  onClose,
  onSubmit,
}: any) {
  return (
    <div className="space-y-4">
      {contacts.map((contact: any) =>
        editingId === contact.id ? (
          <ContactForm
            key={contact.id}
            defaultValues={[contact]}
            onCancel={onClose}
            onSubmit={(data: any) => {
              onSubmit({ ...contact, ...data });
              onClose();
            }}
          />
        ) : (
          <div key={contact.id} className="border rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-blue-600">
                  {contact.type} • {contact.tag}
                </p>
                <p className="text-gray-800 text-sm">{contact.value}</p>
              </div>

              {isSelf && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(contact.id)}
                    className="text-blue-600 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(contact.id)}
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ),
      )}
    </div>
  );
}
