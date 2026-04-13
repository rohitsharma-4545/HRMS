"use client";

import clsx from "clsx";

interface Props {
  title: string;
  description: string;
  count: number;
  onClean: () => void;
  loading: boolean;
}

export default function CleanupCard({
  title,
  description,
  count,
  onClean,
  loading,
}: Props) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>

        <div className="text-3xl font-bold text-red-500">{count}</div>
      </div>

      <button
        onClick={onClean}
        disabled={loading || count === 0}
        className={clsx(
          "mt-4 w-full py-2 rounded-lg text-sm font-medium transition",
          count === 0
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-red-500 text-white hover:bg-red-600",
          loading && "opacity-50 cursor-not-allowed",
        )}
      >
        {count === 0 ? "Nothing to clean" : "Clean Data"}
      </button>
    </div>
  );
}
