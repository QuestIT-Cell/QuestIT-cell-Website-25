"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminTeamsPage() {
  const [groups, setGroups] = useState([]);
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadGroups = async () => {
    const res = await fetch('/api/team/groups');
    const data = await res.json();
    if (res.ok && data.success) setGroups(data.data);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/team/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, title }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to create council');
      } else {
        setValue('');
        setTitle('');
        loadGroups();
      }
    } catch (err) {
      setError(err.message || 'Failed to create council');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-white mb-6">Councils (Teams)</h1>

      <form onSubmit={onCreate} className="border border-neutral-800 p-4 rounded mb-8">
        <h2 className="text-white text-lg mb-4">Create New Council</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Value (identifier)</label>
            <input className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white"
              placeholder="Quest IT Council 2026-27" value={value} onChange={e=>setValue(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Title</label>
            <input className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white"
              placeholder="Quest IT Council 2026-27" value={title} onChange={e=>setTitle(e.target.value)} required />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <button disabled={loading} className="mt-4 bg-white text-black px-4 py-2 rounded">
          {loading ? 'Creating...' : 'Create Council'}
        </button>
      </form>

      <div className="grid gap-3">
        {groups.map((g)=> (
          <Link key={g._id} href={`/admin/team/${g._id}`} className="border border-neutral-800 p-4 rounded hover:bg-neutral-900">
            <div className="text-white text-lg">{g.title}</div>
            <div className="text-neutral-400 text-sm">{g.value}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
