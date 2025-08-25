"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Toast from "../_components/Toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("https://reminder-kfwt.onrender.com/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to reset password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-fuchsia-100 to-cyan-200 animate-gradient-x">
      <Toast message={error} type="error" />
      <Toast message={success} type="success" />
      <form className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37),0_1.5px_6px_0_rgba(0,0,0,0.15)] w-full max-w-md border border-blue-200 border-opacity-60 transition-all duration-500 hover:shadow-[0_16px_48px_0_rgba(31,38,135,0.37),0_3px_12px_0_rgba(0,0,0,0.18)]" onSubmit={handleSubmit}>
        <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-700 tracking-tight drop-shadow-lg">Reset Password</h2>
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full p-4 mb-10 border border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 via-fuchsia-500 to-cyan-400 text-white py-4 rounded-xl font-extrabold shadow-lg hover:scale-105 hover:shadow-[0_24px_64px_0_rgba(31,38,135,0.37),0_6px_24px_0_rgba(0,0,0,0.22)] transition-transform duration-300"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
