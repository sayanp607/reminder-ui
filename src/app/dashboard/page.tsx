"use client";
import React, { useEffect, useState, useRef } from "react";
import DateTimePicker from "../_components/DateTimePicker";
import { useRouter } from "next/navigation";
import Toast from "../_components/Toast";
import DeleteDialog from "../_components/DeleteDialog";

interface Reminder {
  id: number;
  title: string;
  description: string;
  remind_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    remind_at: "",
  });
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [creating, setCreating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const sadSoundRef = useRef<HTMLAudioElement | null>(null);
  const fulfillmentSoundRef = useRef<HTMLAudioElement | null>(null);

  // Play sound helpers
  const playSad = () => sadSoundRef.current?.play();
  const playFulfillment = () => fulfillmentSoundRef.current?.play();

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view / add reminders.");
      setLoading(false);
      return;
    }
    fetch("https://reminder-kfwt.onrender.com/reminders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReminders(data);
        } else if (data.error) {
          setError(data.error);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch reminders.");
        setLoading(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    setDateValue(date);
    setForm({ ...form, remind_at: date ? date.toISOString() : "" });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please register or login first.");
      setCreating(false);
      return;
    }
    try {
      const res = await fetch("https://reminder-kfwt.onrender.com/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create reminder");
      setSuccess("Reminder created successfully!");
      setForm({ title: "", description: "", remind_at: "" });
      fetchReminders();
      playFulfillment(); // Only play fulfillment sound on creation
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to delete reminders.");
      return;
    }
    try {
      const res = await fetch(`https://reminder-kfwt.onrender.com/reminders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete reminder");
      setSuccess("Reminder deleted successfully!");
      fetchReminders();
      playSad();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openDeleteDialog = (id: number) => {
    setReminderToDelete(id);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setReminderToDelete(null);
  };
  const confirmDelete = async () => {
    if (reminderToDelete !== null) {
      await handleDelete(reminderToDelete);
      closeDeleteDialog();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    const user = localStorage.getItem("user");
    if (user) {
      try {
        setUserName(JSON.parse(user).name);
      } catch {}
    }
  }, []);

  // Track fulfilled reminders to avoid repeated sound
  const [fulfilledIds, setFulfilledIds] = useState<number[]>([]);

  useEffect(() => {
    if (!loading && reminders.length > 0) {
      const now = Date.now();
      reminders.forEach((reminder) => {
        const remindTime = new Date(reminder.remind_at).getTime();
        // Only play fulfillment sound if not already played for this reminder
        if (
          Math.abs(remindTime - now) < 1000 * 60 &&
          !fulfilledIds.includes(reminder.id)
        ) {
          playFulfillment();
          setFulfilledIds((prev) => [...prev, reminder.id]);
        }
      });
    }
  }, [reminders, loading]);

  // Reset fulfilledIds when reminders change (e.g., after deletion)
  useEffect(() => {
    setFulfilledIds([]);
  }, [userName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-blue-100 to-cyan-100 animate-gradient-x p-8 flex flex-col items-center justify-center">
      {/* Sound elements */}
      <audio ref={sadSoundRef} src="/sounds/sad.mp3" preload="auto" />
      <audio ref={fulfillmentSoundRef} src="/sounds/fulfillment.mp3" preload="auto" />
      <div className="w-full flex flex-col items-center mb-8">
        {userName && (
          <div className="w-full max-w-2xl mx-auto py-6 px-8 rounded-2xl bg-gradient-to-r from-blue-200 via-fuchsia-100 to-cyan-100 shadow-lg border border-fuchsia-300 border-opacity-40 text-center">
            <span className="block text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-blue-600 to-cyan-500 drop-shadow-lg mb-2 animate-zoomInOut">
              👋 Welcome, {userName}!
            </span>
            <span className="block text-lg font-semibold text-blue-700 tracking-wide">
              Glad to see you back. Here are your reminders:
            </span>
          </div>
        )}
      </div>
      <Toast message={error} type="error" positionClass="top-20 sm:top-6" />
      <Toast message={success} type="success" positionClass="top-20 sm:top-6" />
      <h1 className="text-4xl font-extrabold mb-2 text-center text-fuchsia-700 tracking-tight drop-shadow-lg">
        Your Reminders
      </h1>
      <form
        className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37),0_1.5px_6px_0_rgba(0,0,0,0.15)] max-w-xl mx-auto mb-12 border border-fuchsia-200 border-opacity-60 transition-all duration-500 hover:shadow-[0_16px_48px_0_rgba(31,38,135,0.37),0_3px_12px_0_rgba(0,0,0,0.18)]"
        onSubmit={handleCreate}
      >
        <h2 className="text-2xl font-bold mb-8 text-fuchsia-700">Create Reminder</h2>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-4 mb-6 border border-fuchsia-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-fuchsia-400 transition shadow-md text-gray-900 placeholder:text-gray-500"
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-4 mb-6 border border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-md text-gray-900 placeholder:text-gray-500"
          placeholder="Description"
          required
        />
  <DateTimePicker value={dateValue} onChange={handleDateChange} />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-fuchsia-500 via-blue-500 to-cyan-400 text-white py-4 rounded-xl font-extrabold shadow-lg hover:scale-105 hover:shadow-[0_24px_64px_0_rgba(31,38,135,0.37),0_6px_24px_0_rgba(0,0,0,0.22)] transition-transform duration-300"
          disabled={creating}
        >
          {creating ? "Creating..." : "Create Reminder"}
        </button>
      </form>
      <div className="absolute top-6 right-8">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 hover:shadow-[0_24px_64px_0_rgba(31,38,135,0.37),0_6px_24px_0_rgba(0,0,0,0.22)] transition-transform duration-300"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/signup")}
            className="bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 hover:shadow-[0_24px_64px_0_rgba(31,38,135,0.37),0_6px_24px_0_rgba(0,0,0,0.22)] transition-transform duration-300"
          >
            Signup
          </button>
        )}
      </div>
      {loading ? (
        <div className="text-center text-lg text-fuchsia-700 font-bold">Loading...</div>
      ) : reminders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg font-semibold">No reminders found.</div>
      ) : (
        <div className="grid gap-8 max-w-2xl mx-auto">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37),0_1.5px_6px_0_rgba(0,0,0,0.15)] relative border border-blue-200 border-opacity-60 transition-all duration-500 hover:shadow-[0_16px_48px_0_rgba(31,38,135,0.37),0_3px_12px_0_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-center mb-4">
                <span className="inline-block mr-3 animate-shake text-3xl">⏰</span>
                <h2 className="text-xl font-bold text-fuchsia-700 drop-shadow">{reminder.title}</h2>
              </div>
              <p className="mb-2 text-gray-800 font-medium">{reminder.description}</p>
              <div className="text-sm text-blue-600 mb-2 font-semibold flex items-center">
                Remind at: {new Date(reminder.remind_at).toLocaleString()}
              </div>
              <button
                onClick={() => openDeleteDialog(reminder.id)}
                className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:scale-105 hover:shadow-[0_12px_32px_0_rgba(255,0,0,0.18)] transition-transform duration-300"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      <DeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={confirmDelete} />
    </div>
  );
}
