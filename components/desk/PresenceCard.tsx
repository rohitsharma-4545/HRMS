"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface PresenceCardProps {
  title: string;
  color: "red" | "blue" | "yellow" | "green";
  children: ReactNode;
}

const colorMap = {
  red: "border-l-4 border-red-500",
  blue: "border-l-4 border-blue-500",
  yellow: "border-l-4 border-yellow-500",
  green: "border-l-4 border-emerald-500",
};

export default function PresenceCard({
  title,
  color,
  children,
}: PresenceCardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl shadow-sm p-4 relative overflow-visible",
        colorMap[color],
      )}
    >
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  );
}
