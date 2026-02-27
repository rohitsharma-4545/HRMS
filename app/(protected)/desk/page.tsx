"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Welcome to Dashboard</h1>
      </div>
      <p>Dashboard content goes here...</p>
    </div>
  );
}
