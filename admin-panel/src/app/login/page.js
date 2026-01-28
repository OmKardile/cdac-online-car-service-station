"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await loginUser(email, password);

    if (result.status) {
      const { token, role } = result.data;
      const uid = result.data.uid || "";

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", result.data.email);
      if (uid) localStorage.setItem("uid", uid);

      const dashboard = role === "admin" ? "/admin/dashboard" : "/super-admin/dashboard";
      router.push(dashboard);
    } else {
      setError(result.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Demo: admin@example.com / password
        </p>
      </div>
    </div>
  );
}
