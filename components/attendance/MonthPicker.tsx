"use client";

export default function MonthPicker({
  month,
  onChange,
}: {
  month: Date;
  onChange: (d: Date) => void;
}) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear];
  const months = Array.from({ length: 12 }, (_, i) => i);

  const handleChange = (e: any) => {
    const newDate = new Date(month);
    if (e.target.name === "month") newDate.setMonth(Number(e.target.value));
    if (e.target.name === "year") newDate.setFullYear(Number(e.target.value));
    onChange(newDate);
  };

  return (
    <div className="flex items-center gap-3">
      <select
        name="month"
        value={month.getMonth()}
        onChange={handleChange}
        className="border rounded p-2"
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {new Date(2000, m).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select>

      <select
        name="year"
        value={month.getFullYear()}
        onChange={handleChange}
        className="border rounded p-2"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
