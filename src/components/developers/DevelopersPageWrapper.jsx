"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Sparkles, Layers } from "lucide-react";
import NewDeveloperSection from "./NewDeveloperSection";

// Dynamically import the classic/editorial section so it only loads heavy 3D stack assets when requested
const DeveloperEditorialSection = dynamic(
  () => import("./DeveloperEditorialSection"),
  { ssr: false }
);

const STORAGE_KEY = "questit_developer_section_view";

const DevelopersPageWrapper = () => {
  const [viewMode, setViewMode] = useState("new");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 1. Check URL param ?view=new or ?view=old
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get("view");
      if (viewParam === "old" || viewParam === "new") {
        setViewMode(viewParam);
        return;
      }

      // 2. Fall back to localStorage if saved
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "old" || saved === "new") {
        setViewMode(saved);
      }
    }
  }, []);

  const handleToggle = (mode) => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, mode);
        // Optional: update URL query param without full page reload
        const url = new URL(window.location.href);
        url.searchParams.set("view", mode);
        window.history.replaceState({}, "", url.toString());
      } catch (e) {
        // Ignore storage errors in private browsing
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* ── Floating Version Toggle Switcher ── */}
      <div
        className="fixed top-20 sm:top-24 right-3 sm:right-6 md:right-8 z-50 flex items-center p-1 rounded-full bg-neutral-950/85 backdrop-blur-md border border-neutral-800 shadow-[0_4px_24px_rgba(0,0,0,0.7)] select-none transition-all duration-300 hover:border-cyan-500/40"
        role="region"
        aria-label="Developer section view switcher"
      >
        <button
          onClick={() => handleToggle("new")}
          aria-pressed={viewMode === "new"}
          title="Switch to New Developer Section"
          className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-medium transition-all duration-300 cursor-pointer ${
            viewMode === "new"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,212,255,0.45)] border border-cyan-300/40"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Sparkles size={13} className={viewMode === "new" ? "text-white" : "text-cyan-400"} />
          <span>New Dev Sec</span>
        </button>

        <button
          onClick={() => handleToggle("old")}
          aria-pressed={viewMode === "old"}
          title="Switch to Old Classic Developer Section"
          className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-medium transition-all duration-300 cursor-pointer ${
            viewMode === "old"
              ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.45)] border border-purple-300/40"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Layers size={13} className={viewMode === "old" ? "text-white" : "text-purple-400"} />
          <span>Old Dev Sec</span>
        </button>
      </div>

      {/* ── Conditional Section Rendering ── */}
      {viewMode === "new" ? (
        <NewDeveloperSection />
      ) : (
        <DeveloperEditorialSection />
      )}
    </div>
  );
};

export default DevelopersPageWrapper;

