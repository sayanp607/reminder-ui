"use client";
import React from "react";

export type ToastType = "success" | "error";

export default function Toast({ message, type }: { message: string; type: ToastType }) {
  if (!message) return null;
  return (
    <div
      className={`fixed top-20 sm:top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-white font-semibold text-base sm:text-lg max-w-xs sm:max-w-md w-full transition-all
        ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  );
}
