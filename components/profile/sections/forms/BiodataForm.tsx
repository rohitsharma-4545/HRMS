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

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const maritalStatusOptions = [
  { label: "Single", value: "Single" },
  { label: "Married", value: "Married" },
];

const bloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "B+", value: "B+" },
  { label: "O+", value: "O+" },
  { label: "AB+", value: "AB+" },
];

const pronounOptions = [
  { label: "He/Him", value: "He/Him" },
  { label: "She/Her", value: "She/Her" },
  { label: "They/Them", value: "They/Them" },
];

const challengedOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export default function BiodataForm({
  defaultValues,
  onCancel,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    gender: defaultValues?.gender ?? "",
    genderPronoun: defaultValues?.genderPronoun ?? "",
    maritalStatus: defaultValues?.maritalStatus ?? "",
    partnerName: defaultValues?.partnerName ?? "",
    bloodGroup: defaultValues?.bloodGroup ?? "",
    challenged: defaultValues?.challenged ?? null,
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await updateProfileSection("BIODATA", form);

      toast.success("Biodata saved successfully");

      onSubmit?.(form);
    } catch {
      toast.error("Failed to save biodata");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Gender">
        <Select
          options={genderOptions}
          value={genderOptions.find((o) => o.value === form.gender)}
          onChange={(opt) =>
            setForm((prev) => ({
              ...prev,
              gender: opt?.value ?? "",
            }))
          }
        />
      </Field>

      <Field label="Marital Status">
        <Select
          options={maritalStatusOptions}
          value={maritalStatusOptions.find(
            (o) => o.value === form.maritalStatus,
          )}
          onChange={(opt) =>
            setForm((prev) => ({
              ...prev,
              maritalStatus: opt?.value ?? "",
            }))
          }
        />
      </Field>

      <Field label="Blood Group">
        <Select
          options={bloodGroupOptions}
          value={bloodGroupOptions.find((o) => o.value === form.bloodGroup)}
          onChange={(opt) =>
            setForm((prev) => ({
              ...prev,
              bloodGroup: opt?.value ?? "",
            }))
          }
        />
      </Field>

      <Field label="Gender Pronoun">
        <Select
          options={pronounOptions}
          value={pronounOptions.find((o) => o.value === form.genderPronoun)}
          onChange={(opt) =>
            setForm((prev) => ({
              ...prev,
              genderPronoun: opt?.value ?? "",
            }))
          }
        />
      </Field>

      <Field label="Partner Name">
        <input
          value={form.partnerName}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              partnerName: e.target.value,
            }))
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Differently Abled">
        <Select
          options={challengedOptions}
          value={challengedOptions.find((o) => o.value === form.challenged)}
          onChange={(opt) =>
            setForm((prev) => ({
              ...prev,
              challenged: opt?.value ?? null,
            }))
          }
        />
      </Field>

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
