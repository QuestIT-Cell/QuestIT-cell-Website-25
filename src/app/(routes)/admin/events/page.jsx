"use client";

import { useEffect, useMemo, useState } from "react";

const emptyForm = {
  title: "",
  date: "",
  image: "",
  description: "",
  speakersText: "",
};

const speakersToText = (speakers = []) =>
  (speakers || [])
    .filter((s) => s?.name && s?.designation && s?.image)
    .map((s) => `${s.name} | ${s.designation} | ${s.image}`)
    .join("\n");

const parseSpeakers = (text) => {
  if (!text.trim()) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const [name, designation, image] = line.split("|").map((part) => part.trim());
      if (!name || !designation || !image) {
        throw new Error(
          "Speakers format: Name | Designation | ImageURL (one per line)"
        );
      }
      return { id: idx + 1, name, designation, image };
    });
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [logoutMessage, setLogoutMessage] = useState("");

  const isEdit = useMemo(() => Boolean(editingId), [editingId]);

  const loadEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/events", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch events");
      setEvents(json.data || []);
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setSubmitting(true);
    setLogoutMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Logout failed");
      setLogoutMessage("Logged out. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 600);
    } catch (err) {
      setError(err.message || "Logout failed");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setForm({
      title: event.title || "",
      date: event.date || "",
      image: event.image || "",
      description: event.description || "",
      speakersText: speakersToText(event.speakers),
    });
    setMessage("");
    setError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const speakers = parseSpeakers(form.speakersText || "");
      const payload = {
        title: form.title.trim(),
        date: form.date.trim(),
        image: form.image.trim(),
        description: form.description.trim(),
        speakers,
      };

      const url = isEdit ? `/api/events/${editingId}` : "/api/events";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `Failed to ${method} event`);

      setMessage(isEdit ? "Event updated" : "Event created");
      resetForm();
      await loadEvents();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const proceed = window.confirm("Delete this event?");
    if (!proceed) return;

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete event");
      setMessage("Event deleted");
      if (editingId === id) resetForm();
      await loadEvents();
    } catch (err) {
      setError(err.message || "Failed to delete");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Manage Events</h1>
          <p className="text-neutral-400 text-sm">Create, update, and delete events.</p>
        </div>
        <div className="flex items-center gap-3">
          {isEdit && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm border border-neutral-700 px-3 py-1 rounded hover:bg-neutral-900"
            >
              Cancel edit
            </button>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={submitting}
            className="text-sm border border-neutral-700 px-3 py-1 rounded hover:bg-neutral-900 disabled:opacity-50"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form
          onSubmit={handleSubmit}
          className="border border-neutral-800 rounded p-4 space-y-4 bg-neutral-900/40"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">{isEdit ? "Edit Event" : "Create Event"}</h2>
            {submitting && <span className="text-xs text-neutral-400">Saving...</span>}
          </div>

          <label className="block text-sm space-y-1">
            <span className="text-neutral-300">Title</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
              required
            />
          </label>

          <label className="block text-sm space-y-1">
            <span className="text-neutral-300">Date</span>
            <input
              name="date"
              value={form.date}
              onChange={handleChange}
              placeholder="e.g., March 2025"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
              required
            />
          </label>

          <label className="block text-sm space-y-1">
            <span className="text-neutral-300">Image URL</span>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
              required
            />
          </label>

          <label className="block text-sm space-y-1">
            <span className="text-neutral-300">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 min-h-24"
              required
            />
          </label>

          <label className="block text-sm space-y-1">
            <span className="text-neutral-300">Speakers (one per line: Name | Designation | ImageURL)</span>
            <textarea
              name="speakersText"
              value={form.speakersText}
              onChange={handleChange}
              placeholder="Jane Doe | Lead Engineer | https://..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 min-h-24"
            />
          </label>

          {message && <p className="text-emerald-400 text-sm">{message}</p>}
          {logoutMessage && <p className="text-emerald-400 text-sm">{logoutMessage}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-black font-semibold py-2 rounded hover:opacity-90 disabled:opacity-50"
          >
            {isEdit ? "Update Event" : "Create Event"}
          </button>
        </form>

        <div className="border border-neutral-800 rounded p-4 bg-neutral-900/40">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Existing Events</h2>
            {loading && <span className="text-xs text-neutral-400">Loading...</span>}
          </div>
          {error && !submitting && (
            <p className="text-red-400 text-sm mb-3">{error}</p>
          )}
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {events.map((event) => (
              <div
                key={event._id}
                className="border border-neutral-800 rounded p-3 bg-neutral-950/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-neutral-400">{event.date}</p>
                    <h3 className="text-base font-semibold">{event.title}</h3>
                    <p className="text-sm text-neutral-400 line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[120px] text-right">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-sm border border-neutral-700 rounded px-3 py-1 hover:bg-neutral-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="text-sm border border-red-500 text-red-400 rounded px-3 py-1 hover:bg-red-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {!!(event.speakers && event.speakers.length) && (
                  <p className="text-xs text-neutral-500 mt-2">
                    Speakers: {event.speakers.map((s) => s.name).join(", ")}
                  </p>
                )}
              </div>
            ))}
            {!loading && events.length === 0 && (
              <p className="text-sm text-neutral-400">No events yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
