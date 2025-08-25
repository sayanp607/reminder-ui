"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '../_components/Toast';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('https://reminder-kfwt.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setSuccess('Login successful! Redirecting...');
      // Store JWT token and user info in localStorage
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');
    try {
      const res = await fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reset link');
      setForgotSuccess('Password reset link sent! Check your email.');
    } catch (err: any) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-400 via-blue-300 to-cyan-200 animate-gradient-x px-2">
      <Toast message={error} type="error" />
      <Toast message={success} type="success" />
      <form className="bg-white/80 backdrop-blur-xl p-6 sm:p-12 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-md border border-fuchsia-200 border-opacity-60 transition-all duration-500 hover:shadow-[0_16px_48px_0_rgba(31,38,135,0.37),0_3px_12px_0_rgba(0,0,0,0.18)]" onSubmit={handleSubmit}>
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-10 text-center text-fuchsia-700 tracking-tight drop-shadow-lg">Sign In</h2>
        <div className="mb-4 sm:mb-8 text-center text-gray-700 font-medium">
          <span>Don&apos;t have an account? </span>
          <a href="/signup" className="text-fuchsia-600 font-bold hover:underline">Sign Up</a>
        </div>
        <div className="mb-4 sm:mb-8 text-center">
          <button type="button" className="text-blue-600 font-bold hover:underline" onClick={() => setShowForgot(true)}>
            Forgot password?
          </button>
        </div>
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
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 sm:p-4 mb-6 sm:mb-10 border border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-md text-base sm:text-lg text-gray-900 placeholder:text-gray-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-fuchsia-500 via-blue-500 to-cyan-400 text-white py-3 sm:py-4 rounded-xl font-extrabold shadow-lg hover:scale-105 hover:shadow-[0_24px_64px_0_rgba(31,38,135,0.37),0_6px_24px_0_rgba(0,0,0,0.22)] transition-transform duration-300 text-base sm:text-lg"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {showForgot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
          <form className="bg-white/90 backdrop-blur-xl p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37),0_1.5px_6px_0_rgba(0,0,0,0.15)] w-full max-w-xs sm:max-w-md border border-blue-200 border-opacity-60 transition-all duration-500 hover:shadow-[0_16px_48px_0_rgba(31,38,135,0.37),0_3px_12px_0_rgba(0,0,0,0.18)]" onSubmit={handleForgotSubmit}>
            <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-blue-700 drop-shadow-lg">Forgot Password</h2>
            <input
              type="email"
              name="forgotEmail"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              className="w-full p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-md text-base sm:text-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-fuchsia-500 to-cyan-400 text-white py-3 sm:py-4 rounded-xl font-extrabold shadow-lg hover:scale-105 hover:shadow-[0_24px_64px_0_rgba(31,38,135,0.37),0_6px_24px_0_rgba(0,0,0,0.22)] transition-transform duration-300 text-base sm:text-lg"
              disabled={forgotLoading}
            >
              {forgotLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            {forgotError && <div className="text-red-500 mt-4 sm:mt-6 text-center font-bold drop-shadow text-base sm:text-lg">{forgotError}</div>}
            {forgotSuccess && <div className="text-green-500 mt-4 sm:mt-6 text-center font-bold drop-shadow text-base sm:text-lg">{forgotSuccess}</div>}
            <button type="button" className="mt-4 sm:mt-8 text-gray-600 font-bold hover:underline w-full text-base sm:text-lg" onClick={() => setShowForgot(false)}>
              Back to Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
