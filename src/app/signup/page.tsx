"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '../_components/Toast';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('https://reminder-kfwt.onrender.com/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setSuccess('Signup successful! Redirecting to login...');
      setForm({ name: '', email: '', phone: '', password: '' });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-200 via-fuchsia-200 to-blue-100 animate-gradient-x px-2">
      <Toast message={error} type="error" />
      <Toast message={success} type="success" />
      <form className="bg-white/80 backdrop-blur-xl p-6 sm:p-12 rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37),0_1.5px_6px_0_rgba(0,0,0,0.15)] w-full max-w-xs sm:max-w-md border border-cyan-200 border-opacity-60 transition-all duration-500 hover:shadow-[0_16px_48px_0_rgba(31,38,135,0.37),0_3px_12px_0_rgba(0,0,0,0.18)]" onSubmit={handleSubmit}>
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-10 text-center text-cyan-700 tracking-tight drop-shadow-lg">Sign Up</h2>
        <div className="mb-4 sm:mb-8 text-center text-gray-700 font-medium">
          <span>Already have an account? </span>
          <a href="/login" className="text-fuchsia-600 font-bold hover:underline">Login</a>
        </div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 sm:p-4 mb-4 sm:mb-6 border border-cyan-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-400 transition shadow-md text-base sm:text-lg text-gray-900 placeholder:text-gray-500"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 sm:p-4 mb-4 sm:mb-6 border border-fuchsia-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-fuchsia-400 transition shadow-md text-base sm:text-lg text-gray-900 placeholder:text-gray-500"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-md text-base sm:text-lg text-gray-900 placeholder:text-gray-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 sm:p-4 mb-6 sm:mb-10 border border-cyan-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-400 transition shadow-md text-base sm:text-lg text-gray-900 placeholder:text-gray-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-blue-400 text-white py-3 sm:py-4 rounded-xl font-extrabold shadow-lg hover:scale-105 hover:shadow-[0_24px_64px_0_rgba(31,38,135,0.37),0_6px_24px_0_rgba(0,0,0,0.22)] transition-transform duration-300 text-base sm:text-lg"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
