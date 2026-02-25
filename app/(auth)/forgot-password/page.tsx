"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="mb-8 flex justify-center">
        <Image
          src="/JES_Logo.png"
          alt="JES Electronic Systems Logo"
          width={200}
          height={60}
          priority
        />
      </div>

      <h1 className="text-3xl font-semibold text-slate-800 mb-4">
        Oops! It's OK.
      </h1>

      <p className="text-slate-600 mb-8">
        Let us set a rememberable password or{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>{" "}
        instead.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {success && (
          <div className="text-green-600 text-sm">
            If an account exists with this email, a reset link has been sent.
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Work E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kuber@abacus.company"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
