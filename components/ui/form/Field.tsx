"use client";

interface Props {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function Field({ label, required, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}
    </div>
  );
}
