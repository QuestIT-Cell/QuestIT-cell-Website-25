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

const STORAGE_KEY = "questit_dev_view_v3";

const DevelopersPageWrapper = () => {
  const [viewMode, setViewMode] = useState("new");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      // 1. Remove stale key from earlier testing if present
      try {
        localStorage.removeItem("questit_developer_section_view");
      } catch (e) {
        // Ignore storage exceptions
      }

      // 2. Check URL param ?view=new or ?view=old
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get("view");
      if (viewParam === "old" || viewParam === "new") {
        setViewMode(viewParam);
        return;
      }

      // 3. Fall back to current localStorage if saved
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "old" || saved === "new") {
          setViewMode(saved);
          return;
        }
      } catch (e) {
        // Ignore storage exceptions
      }

      // 4. Default explicitly to new
      setViewMode("new");
    }
  }, []);

  const handleToggle = (mode) => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, mode);
        const url = new URL(window.location.href);
        url.searchParams.set("view", mode);
        window.history.replaceState({}, "", url.toString());
      } catch (e) {
        // Ignore storage errors in private browsing
      }
    }
  };

  return (
    <div
      className="relative w-full min-h-screen bg-[#060814] pt-20"
      style={{
        backgroundImage: "url('/images/developer_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ── Prominent Floating Version Toggle Dock ── */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10002] flex items-center p-1.5 rounded-full bg-neutral-950/95 backdrop-blur-xl border border-neutral-700/80 shadow-[0_8px_32px_rgba(0,0,0,0.85)] select-none transition-all duration-300 hover:border-cyan-400/80 hover:shadow-[0_8px_32px_rgba(6,182,212,0.25)]"
        role="region"
        aria-label="Developer section view switcher"
      >
        <button
          onClick={() => handleToggle("new")}
          aria-pressed={viewMode === "new"}
          title="Switch to New Collectible Developer Section"
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
            viewMode === "new"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(0,212,255,0.5)] border border-cyan-300/50 scale-105"
              : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
          }`}
        >
          <Sparkles size={14} className={viewMode === "new" ? "text-white" : "text-cyan-400"} />
          <span>New Dev Sec</span>
        </button>

        <button
          onClick={() => handleToggle("old")}
          aria-pressed={viewMode === "old"}
          title="Switch to Classic Editorial Developer Section"
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
            viewMode === "old"
              ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-300/50 scale-105"
              : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
          }`}
        >
          <Layers size={14} className={viewMode === "old" ? "text-white" : "text-purple-400"} />
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
