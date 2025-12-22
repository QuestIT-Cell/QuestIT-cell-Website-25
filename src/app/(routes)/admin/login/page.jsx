"use client";
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const search = useSearchParams();
  const router = useRouter();

  const nextPath = search.get('next') || '/admin';

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Login failed');
      } else {
        router.replace(nextPath);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
        <h1 className="text-xl font-semibold text-white mb-4">Admin Sign In</h1>
        <label className="block text-sm text-neutral-300 mb-2">Admin Password</label>
        <input
          type="password"
          className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          required
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-white text-black font-medium py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
