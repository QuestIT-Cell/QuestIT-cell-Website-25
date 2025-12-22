"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function AdminHome() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogout = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Logout failed');
      setMessage('Logged out. Redirecting...');
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 600);
    } catch (err) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="text-sm border border-neutral-700 px-3 py-1 rounded text-white hover:bg-neutral-900 disabled:opacity-50"
        >
          Logout
        </button>
      </div>
      {message && <p className="text-emerald-400 text-sm mb-3">{message}</p>}
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/admin/team" className="border border-neutral-800 rounded p-4 hover:bg-neutral-900">
          <h2 className="text-white text-lg">Manage Councils (Teams)</h2>
          <p className="text-neutral-400 text-sm">Create new council years, subgroups, and members.</p>
        </Link>
        <Link href="/admin/events" className="border border-neutral-800 rounded p-4 hover:bg-neutral-900">
          <h2 className="text-white text-lg">Manage Events</h2>
          <p className="text-neutral-400 text-sm">Create and edit events with speakers.</p>
        </Link>
      </div>
    </div>
  );
}
