"use client";

import { useState } from "react";
import Select from "react-select";
import { updateProfileSection } from "@/components/profile/profile.api";
import { toast } from "sonner";
import Field from "@/components/ui/form/Field";

interface Props {
  defaultValues?: any[];
  onCancel: () => void;
  onSubmit?: (data: any) => void;
}

const typeOptions = [
  { label: "Phone", value: "PHONE" },
  { label: "Email", value: "EMAIL" },
  { label: "Emergency", value: "EMERGENCY" },
];

const tagOptions = [
  { label: "Personal", value: "PERSONAL" },
  { label: "Work", value: "WORK" },
  { label: "Family", value: "FAMILY" },
];

export default function ContactForm({
  defaultValues,
  onCancel,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    type: defaultValues?.[0]?.type ?? "PHONE",
    tag: defaultValues?.[0]?.tag ?? "PERSONAL",
    value: defaultValues?.[0]?.value ?? "9873911843",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await updateProfileSection("CONTACT", form);

      toast.success("Contact saved successfully");

      onSubmit?.([res]);
    } catch {
      toast.error("Failed to save contact");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Contact Type" required>
        <Select
          options={typeOptions}
          value={typeOptions.find((o) => o.value === form.type)}
          onChange={(opt) =>
            setForm((prev) => ({
              ...prev,
              type: opt?.value ?? "",
            }))
          }
        />
      </Field>

      <Field label="Tag">
        <Select
          options={tagOptions}
          value={tagOptions.find((o) => o.value === form.tag)}
          onChange={(opt) =>
            setForm((prev) => ({
              ...prev,
              tag: opt?.value ?? "",
            }))
          }
        />
      </Field>

      <Field label="Value" required>
        <input
          value={form.value}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              value: e.target.value,
            }))
          }
          className="input"
        />
      </Field>

      <div className="flex gap-3">
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Save
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
