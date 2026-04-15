"use client";

import { useState } from "react";
import { updateProfileSection } from "../../profile.api";
import { toast } from "sonner";
import Field from "@/components/ui/form/Field";

interface Props {
  defaultValues?: any[];
  onCancel: () => void;
  onSubmit?: (data: any[]) => void;
}

export default function DependentsForm({
  defaultValues = [],
  onCancel,
  onSubmit,
}: Props) {
  const [list, setList] = useState(
    defaultValues.length ? [mapToForm(defaultValues[0])] : [emptyDependent()],
  );

  const [loading, setLoading] = useState(false);

  function handleChange(index: number, field: string, value: string) {
    setList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await updateProfileSection("DEPENDENTS", list[0]);

      toast.success("Dependents saved successfully");

      onSubmit?.([res]);
    } catch {
      toast.error("Failed to save dependents");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {list.map((dep, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          <InputField
            label="First Name"
            value={dep.firstName}
            onChange={(v: string) => handleChange(index, "firstName", v)}
          />

          <InputField
            label="Last Name"
            value={dep.lastName}
            onChange={(v: string) => handleChange(index, "lastName", v)}
          />

          <InputField
            label="Relation"
            value={dep.relation}
            onChange={(v: string) => handleChange(index, "relation", v)}
          />

          <InputField
            label="Phone"
            value={dep.phone}
            onChange={(v: string) => handleChange(index, "phone", v)}
          />

          <DateField
            label="Birth Date"
            value={dep.birthDate}
            onChange={(v: string) => handleChange(index, "birthDate", v)}
          />
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="border px-4 py-2 rounded-lg text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function emptyDependent() {
  return {
    firstName: "",
    lastName: "",
    relation: "",
    phone: "",
    birthDate: "",
  };
}

function mapToForm(d: any) {
  return {
    ...d,
    birthDate: formatForInput(d.birthDate),
  };
}

function formatForInput(date?: string | Date) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

function InputField({ label, value, onChange }: any) {
  return (
    <Field label={label}>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      />
    </Field>
  );
}

function DateField({ label, value, onChange }: any) {
  return (
    <Field label={label}>
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      />
    </Field>
  );
}
