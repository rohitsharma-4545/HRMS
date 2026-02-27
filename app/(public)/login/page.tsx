"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.forcePasswordChange) {
        router.push("/change-password");
      } else {
        router.push("/desk");
      }

      router.refresh();
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

      <h1 className="text-2xl font-semibold text-slate-800 mb-2">
        JES Electronic Systems Private Limited's
      </h1>
      <p className="text-slate-600 mb-8">All-in-one HR platform</p>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 shadow rounded"
      >
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email / Mobile Number / Employee Code
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your work email or employee code"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            The password you used during signup goes here 🔐
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 text-sm text-slate-600">
        <p>
          By logging in, you agree to our{" "}
          <a
            href="https://jatayues.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Terms of Use
          </a>{" "}
          and{" "}
          <a
            href="https://jatayues.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Privacy Policy
          </a>
        </p>

        <p className="mt-4">
          Forgot password?{" "}
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Click here
          </Link>
        </p>

        <p className="text-xs text-slate-400 mt-6">Version 1.0</p>
      </div>
    </div>
  );
}
