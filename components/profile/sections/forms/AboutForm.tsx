"use client";

import { useState } from "react";
import Select from "react-select";
import { updateProfileSection } from "../../profile.api";
import { toast } from "sonner";
import Field from "@/components/ui/form/Field";

interface Props {
  defaultValues?: any;
  onCancel: () => void;
  onSubmit?: (data: any) => void;
}

const salutationOptions = [
  { label: "Mr.", value: "Mr." },
  { label: "Ms.", value: "Ms." },
  { label: "Mrs.", value: "Mrs." },
  { label: "Dr.", value: "Dr." },
];

const inputStyle =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export default function AboutForm({
  defaultValues,
  onCancel,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    salutation: defaultValues?.salutation ?? "",
    firstName: defaultValues?.firstName ?? "",
    middleName: defaultValues?.middleName ?? "",
    lastName: defaultValues?.lastName ?? "",
    preferredName: defaultValues?.preferredName ?? "",
    about: defaultValues?.about ?? "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
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

      await updateProfileSection("ABOUT", form);

      toast.success("Address saved successfully");

      onSubmit?.(form);
    } catch (err) {
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Salutation">
        <Select
          options={salutationOptions}
          value={salutationOptions.find((opt) => opt.value === form.salutation)}
          onChange={(opt) =>
            setForm((prev) => ({
              ...prev,
              salutation: opt?.value ?? "",
            }))
          }
          isSearchable
        />
      </Field>

      <InputField
        label="First Name"
        name="firstName"
        required
        value={form.firstName}
        onChange={handleChange}
      />

      <InputField
        label="Middle Name (Optional)"
        name="middleName"
        value={form.middleName}
        onChange={handleChange}
      />

      <InputField
        label="Last Name"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
      />

      <InputField
        label="Preferred Name (Optional)"
        name="preferredName"
        value={form.preferredName}
        onChange={handleChange}
      />

      <TextareaField
        label="About Yourself (Optional)"
        name="about"
        value={form.about}
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

function InputField({ label, name, value, required, onChange }: any) {
  return (
    <Field label={label} required={required}>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={inputStyle}
      />
    </Field>
  );
}

function TextareaField({ label, name, value, onChange }: any) {
  return (
    <Field label={label}>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className={inputStyle}
      />
    </Field>
  );
}
