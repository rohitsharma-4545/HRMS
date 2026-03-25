"use client";

interface Props {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export default function SectionContainer({ title, action, children }: Props) {
  return (
    <div className="max-w-xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>

      {children}
    </div>
  );
}
