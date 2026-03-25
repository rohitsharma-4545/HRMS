"use client";

import { useState } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { updateProfileSection } from "../../profile.api";
import { toast } from "sonner";
import Field from "@/components/ui/form/Field";

interface Props {
  defaultValues?: any[];
  onCancel: () => void;
  onSubmit?: (data: any) => void;
}

const addressTypeOptions = [
  { label: "Present", value: "PRESENT" },
  { label: "Permanent", value: "PERMANENT" },
];

const inputStyle =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export default function AddressForm({
  defaultValues,
  onCancel,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    type: defaultValues?.[0]?.type ?? "PRESENT",
    line1: defaultValues?.[0]?.address1 ?? "",
    line2: defaultValues?.[0]?.address2 ?? "",
    city: defaultValues?.[0]?.city ?? "",
    state: defaultValues?.[0]?.state ?? "",
    country: defaultValues?.[0]?.country ?? "",
    postalCode: defaultValues?.[0]?.postalCode ?? "",
  });

  const [loading, setLoading] = useState(false);

  const countryOptions = Country.getAllCountries().map((c) => ({
    label: c.name,
    value: c.isoCode,
  }));

  const stateOptions = form.country
    ? State.getStatesOfCountry(form.country).map((s) => ({
        label: s.name,
        value: s.isoCode,
      }))
    : [];

  const cityOptions =
    form.country && form.state
      ? City.getCitiesOfState(form.country, form.state).map((c) => ({
          label: c.name,
          value: c.name,
        }))
      : [];

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

      await updateProfileSection("ADDRESS", form);

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
      <Field label="Address Type">
        <Select
          options={addressTypeOptions}
          value={addressTypeOptions.find((o) => o.value === form.type)}
          onChange={(opt) =>
            setForm((prev) => ({
              ...prev,
              type: opt?.value ?? "",
            }))
          }
        />
      </Field>

      <InputField
        label="Address Line 1"
        name="line1"
        value={form.line1}
        onChange={handleChange}
        required
      />

      <InputField
        label="Address Line 2"
        name="line2"
        value={form.line2}
        onChange={handleChange}
      />
      <Field label="Country" required>
        <Select
          options={countryOptions}
          value={countryOptions.find((o) => o.value === form.country)}
          onChange={(opt) =>
            setForm((prev) => ({
              ...prev,
              country: opt?.value ?? "",
              state: "",
              city: "",
            }))
          }
          isSearchable
        />
      </Field>

      <Field label="State" required>
        <Select
          options={stateOptions}
          value={stateOptions.find((o) => o.value === form.state)}
          onChange={(opt) =>
            setForm((prev) => ({
              ...prev,
              state: opt?.value ?? "",
              city: "",
            }))
          }
          isSearchable
          isDisabled={!form.country}
        />
      </Field>

      <Field label="City" required>
        <Select
          options={cityOptions}
          value={cityOptions.find((o) => o.value === form.city)}
          onChange={(opt) =>
            setForm((prev) => ({
              ...prev,
              city: opt?.value ?? "",
            }))
          }
          isSearchable
          isDisabled={!form.state}
        />
      </Field>

      <InputField
        label="Postal Code"
        name="postalCode"
        value={form.postalCode}
        onChange={handleChange}
        required
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
