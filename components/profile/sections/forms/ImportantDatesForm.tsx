"use client";

import { useState } from "react";
import { updateProfileSection } from "../../profile.api";
import { toast } from "sonner";
import Field from "@/components/ui/form/Field";

interface Props {
  defaultValues?: any;
  onCancel: () => void;
  onSubmit?: (data: any) => void;
}

export default function ImportantDatesForm({
  defaultValues,
  onCancel,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    birthDate: formatForInput(defaultValues?.birthDate),
    partnerBirthDate: formatForInput(defaultValues?.partnerBirthDate),
    anniversaryDate: formatForInput(defaultValues?.anniversaryDate),
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await updateProfileSection("IMPORTANT_DATES", form);

      toast.success("Dates saved successfully");

      onSubmit?.(form);
    } catch {
      toast.error("Failed to save dates");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <InputField
        label="Birth Date"
        name="birthDate"
        value={form.birthDate}
        onChange={handleChange}
      />

      <InputField
        label="Partner Birth Date"
        name="partnerBirthDate"
        value={form.partnerBirthDate}
        onChange={handleChange}
      />

      <InputField
        label="Anniversary Date"
        name="anniversaryDate"
        value={form.anniversaryDate}
        onChange={handleChange}
      />

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

function InputField({ label, name, value, onChange }: any) {
  return (
    <Field label={label}>
      <input
        type="date"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      />
    </Field>
  );
}

function formatForInput(date?: string | Date) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}
