"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import SectionContainer from "./SectionContainer";
import DependentsForm from "./forms/DependentsForm";
import { updateProfileSection } from "../profile.api";

interface Props {
  data: any[];
  isSelf?: boolean;
}

export default function DependentsSection({ data = [], isSelf = true }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [dependents, setDependents] = useState(data);

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
    toast("Delete this dependent?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          const prev = dependents;

          setDependents((d) => d.filter((item) => item.id !== id));

          try {
            await updateProfileSection("DELETE_DEPENDENT", { id });
            toast.success("Dependent deleted");
          } catch {
            setDependents(prev);
            toast.error("Failed to delete dependent");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  }

  const canAddMore = dependents.length <= 1;

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
    <SectionContainer title="Dependents" action={action}>
      {adding && (
        <DependentsForm
          defaultValues={[]}
          onCancel={closeForm}
          onSubmit={(res) => {
            setDependents((prev) => [...prev, res[0]]);
            closeForm();
          }}
        />
      )}

      {!adding && (
        <DependentsView
          data={dependents}
          isSelf={isSelf}
          onEdit={startEdit}
          onDelete={handleDelete}
          editingId={editingId}
          onClose={closeForm}
          setDependents={setDependents}
        />
      )}
    </SectionContainer>
  );
}

function DependentsView({
  data,
  isSelf,
  onEdit,
  onDelete,
  editingId,
  onClose,
  setDependents,
}: any) {
  return (
    <div className="space-y-4">
      {data.map((d: any) =>
        editingId === d.id ? (
          <DependentsForm
            key={d.id}
            defaultValues={[d]}
            onCancel={onClose}
            onSubmit={(updated) => {
              setDependents((prev: any[]) =>
                prev.map((item) =>
                  item.id === d.id ? { ...item, ...updated[0] } : item,
                ),
              );
              onClose();
            }}
          />
        ) : (
          <div key={d.id} className="border rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">
                  {d.firstName} {d.lastName || ""}
                </p>
                <p className="text-xs text-gray-500">{d.relation}</p>
                <p className="text-xs text-gray-500">{d.phone || "-"}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(d.birthDate)}
                </p>
              </div>

              {isSelf && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(d.id)}
                    className="text-blue-600 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(d.id)}
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

function formatDate(date?: string | Date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}
