"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function AdminTeamDetail() {
  const params = useParams();
  const id = params?.id;

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add subgroup form
  const [subValue, setSubValue] = useState('');
  const [subTitle, setSubTitle] = useState('');

  // Add member form
  const [memberSubValue, setMemberSubValue] = useState('BE Members');
  const [member, setMember] = useState({ name: '', designation: '', email: '', github: '', linkedin: '', image: '' });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/team/groups/${id}`);
    const data = await res.json();
    if (res.ok && data.success) setGroup(data.data);
    setLoading(false);
  };

  useEffect(() => { if (id) load(); }, [id]);

  const addSubgroup = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/team/groups/${id}/subgroups`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: subValue, title: subTitle }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) setError(data.message || 'Failed to add subgroup');
      else { setSubValue(''); setSubTitle(''); load(); }
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const addMember = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/team/groups/${id}/subgroups/${encodeURIComponent(memberSubValue)}/members`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: [member] }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) setError(data.message || 'Failed to add member');
      else {
        setMember({ name: '', designation: '', email: '', github: '', linkedin: '', image: '' });
        load();
      }
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  if (loading) return <div className="p-6 text-neutral-300">Loading...</div>;
  if (!group) return <div className="p-6 text-neutral-300">Not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-white mb-2">{group.title}</h1>
      <div className="text-neutral-400 mb-6">{group.value}</div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={addSubgroup} className="border border-neutral-800 p-4 rounded">
          <h2 className="text-white text-lg mb-3">Add Subgroup</h2>
          <label className="block text-sm text-neutral-300 mb-1">Subgroup Value</label>
          <input className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white mb-3" value={subValue} onChange={e=>setSubValue(e.target.value)} placeholder="Alumni" required />
          <label className="block text-sm text-neutral-300 mb-1">Title</label>
          <input className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" value={subTitle} onChange={e=>setSubTitle(e.target.value)} placeholder="Alumni" required />
          <button disabled={busy} className="mt-4 bg-white text-black px-4 py-2 rounded">{busy ? 'Saving...' : 'Add Subgroup'}</button>
        </form>

        <form onSubmit={addMember} className="border border-neutral-800 p-4 rounded">
          <h2 className="text-white text-lg mb-3">Add Member</h2>
          <label className="block text-sm text-neutral-300 mb-1">Subgroup</label>
          <select className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white mb-3" value={memberSubValue} onChange={e=>setMemberSubValue(e.target.value)}>
            {(group.subGroups||[]).map((sg)=> (<option key={sg.value} value={sg.value}>{sg.title}</option>))}
          </select>
          {['name','designation','email','github','linkedin','image'].map((key)=> (
            <div key={key} className="mb-3">
              <label className="block text-sm text-neutral-300 mb-1 capitalize">{key}</label>
              <input className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" value={member[key]} onChange={e=>setMember({ ...member, [key]: e.target.value })} placeholder={key==='image' ? 'https://...' : ''} required={key==='name' || key==='designation' || key==='image'} />
            </div>
          ))}
          <button disabled={busy} className="mt-2 bg-white text-black px-4 py-2 rounded">{busy ? 'Saving...' : 'Add Member'}</button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-white text-lg mb-3">Subgroups & Members</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {(group.subGroups||[]).map((sg)=> (
            <div key={sg.value} className="border border-neutral-800 rounded p-4">
              <div className="text-white font-medium mb-2">{sg.title}</div>
              <div className="text-neutral-400 text-sm mb-3">{sg.value}</div>
              <ul className="text-neutral-300 text-sm space-y-2 max-h-72 overflow-auto">
                {(sg.members||[]).map((m,i)=> (
                  <li key={i} className="border border-neutral-800 rounded p-2">
                    <div className="text-white">{m.name} <span className="text-xs text-neutral-400">({m.designation})</span></div>
                    {m.email && <div className="text-neutral-400 text-xs">{m.email}</div>}
                  </li>
                ))}
                {(!sg.members || sg.members.length===0) && (
                  <li className="text-neutral-500">No members yet</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
