"use client";
import * as Dialog from "@radix-ui/react-dialog";
import React from "react";

export default function DeleteDialog({ open, onOpenChange, onConfirm }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 animate-fadeIn" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-xs sm:max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center">
          <span className="text-4xl mb-2 animate-shake">⏰</span>
          <Dialog.Title className="font-bold text-lg mb-2 text-fuchsia-700">Delete Reminder?</Dialog.Title>
          <Dialog.Description className="mb-4 text-gray-700 text-center">Are you sure you want to delete this reminder? This action cannot be undone.</Dialog.Description>
          <div className="flex gap-4 mt-2">
            <button
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow hover:scale-105 transition"
              onClick={onConfirm}
            >
              Yes, Delete
            </button>
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold shadow hover:scale-105 transition">
                Cancel
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
