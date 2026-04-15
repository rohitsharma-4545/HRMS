"use client";

import { useState } from "react";
import { updateProfileSection } from "../../profile.api";
import { toast } from "sonner";
import Field from "@/components/ui/form/Field";

export default function WorkDetailsForm({
  defaultValues,
  onCancel,
  onSubmit,
}: any) {
  const [form, setForm] = useState({
    employmentStage: defaultValues?.employmentStage ?? "",
    employmentType: defaultValues?.employmentType ?? "",
    employmentGrade: defaultValues?.employmentGrade ?? "",
    selfService: defaultValues?.selfService ?? true,
    probationEndDate: format(defaultValues?.probationEndDate),
    confirmationDate: format(defaultValues?.confirmationDate),
    noticeStartDate: format(defaultValues?.noticeStartDate),
    exitDate: format(defaultValues?.exitDate),
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      setLoading(true);

      await updateProfileSection("WORK_PROFILE", form);

      toast.success("Work details saved");
      onSubmit?.(form);
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <Input
        name="employmentStage"
        label="Employment Stage"
        value={form.employmentStage}
        onChange={handleChange}
      />

      <Input
        name="employmentType"
        label="Employment Type"
        value={form.employmentType}
        onChange={handleChange}
      />

      <Input
        name="employmentGrade"
        label="Employment Grade"
        value={form.employmentGrade}
        onChange={handleChange}
      />

      <Field label="Self Service">
        <input
          type="checkbox"
          name="selfService"
          checked={form.selfService}
          onChange={handleChange}
        />
      </Field>

      <DateField
        name="probationEndDate"
        label="Probation End"
        value={form.probationEndDate}
        onChange={handleChange}
      />
      <DateField
        name="confirmationDate"
        label="Confirmation Date"
        value={form.confirmationDate}
        onChange={handleChange}
      />
      <DateField
        name="noticeStartDate"
        label="Notice Start"
        value={form.noticeStartDate}
        onChange={handleChange}
      />
      <DateField
        name="exitDate"
        label="Exit Date"
        value={form.exitDate}
        onChange={handleChange}
      />

      <div className="flex gap-3">
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
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

function Input({ label, ...props }: any) {
  return (
    <Field label={label}>
      <input {...props} className="input" />
    </Field>
  );
}

function DateField({ label, ...props }: any) {
  return (
    <Field label={label}>
      <input type="date" {...props} className="input" />
    </Field>
  );
}

function format(date?: string | Date) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}
