"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { updateProfileSection } from "../profile.api";

import SectionContainer from "./SectionContainer";
import AddressForm from "./forms/AddressForm";

interface Props {
  data: any[];
  isSelf?: boolean;
}

export default function AddressSection({ data = [], isSelf = false }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addresses, setAddresses] = useState(data);

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
    toast("Delete this address?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const prev = addresses;

          setAddresses((a) => a.filter((item) => item.id !== id));

          try {
            await updateProfileSection("DELETE_ADDRESS", { id });
            toast.success("Address deleted");
          } catch {
            setAddresses(prev);
            toast.error("Failed to delete address");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  }

  const canAddMore = addresses.length < 2;

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
    <SectionContainer title="Address" action={action}>
      {adding && (
        <AddressForm
          defaultValues={[]}
          onCancel={closeForm}
          onSubmit={(res) => {
            setAddresses((prev) => [...prev, res]);
            closeForm();
          }}
        />
      )}

      {!adding && (
        <AddressView
          data={addresses}
          isSelf={isSelf}
          editingId={editingId}
          onEdit={startEdit}
          onDelete={handleDelete}
          onClose={closeForm}
          setAddresses={setAddresses}
        />
      )}
    </SectionContainer>
  );
}

function AddressView({
  data,
  isSelf,
  editingId,
  onEdit,
  onDelete,
  onClose,
  setAddresses,
}: any) {
  return (
    <div className="space-y-6">
      {data.map((addr: any) =>
        editingId === addr.id ? (
          <AddressForm
            key={addr.id}
            defaultValues={[addr]}
            onCancel={onClose}
            onSubmit={(updated) => {
              setAddresses((prev: any[]) =>
                prev.map((item) =>
                  item.id === addr.id ? { ...item, ...updated } : item,
                ),
              );
              onClose();
            }}
          />
        ) : (
          <div key={addr.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
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

              {isSelf && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(addr.id)}
                    className="text-blue-600 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(addr.id)}
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
