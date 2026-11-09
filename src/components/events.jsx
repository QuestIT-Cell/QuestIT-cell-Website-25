"use client";

// Next's Imports
import Link from "next/link";

// React's Imports
import { useId, useRef, useState, useEffect, useMemo } from "react";

// Confetti Import
import confetti from "canvas-confetti";

// Next's Imports
import Image from "next/image";

// App's Internal Imports
import { Button } from "@/components/ui/button";
import useOutsideClick from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";

const get_event_image = (image) => {
  if (image === "/images/workshop_thumbnails/vibeWquest.webp") {
    return "/images/workshop_thumbnails/vibeWquest-640.webp";
  }

  if (image === "/images/workshop_thumbnails/BridgeTheGap.webp") {
    return "/images/workshop_thumbnails/BridgeTheGap-384.webp";
  }

  return image;
};
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

// App's External Imports
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  ArrowRight,
  CalendarRange,
  ExternalLink,
  Trophy,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import events from "@/constants/events";

// Helper function to parse date and assign academic year
const parseEventDate = (dateString) => {
  if (!dateString) return new Date(0);
  const parts = dateString.split(/[\s–-]+/).filter(Boolean);
  const year = parseInt(parts[parts.length - 1], 10);
  const month = parts.length > 2 ? parts[parts.length - 2] : parts[0];
  const d = new Date(`${month} 1, ${year}`);
  return isNaN(d.getTime()) ? new Date(dateString) : d;
};

const getAcademicYear = (dateString) => {
  const months = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
  };
  
  const parts = dateString.split(/[\s–-]+/).filter(Boolean);
  const month = months[parts[0]] || 1;
  const year = parseInt(parts[parts.length - 1], 10);
  if (isNaN(year)) return "2025-26";
  
  // Academic year runs from June to May
  // June 2025 to May 2026 = 2025-26
  if (month >= 6) {
    return `${year}-${String(year + 1).slice(2)}`;
  } else {
    return `${year - 1}-${String(year).slice(2)}`;
  }
};

// Group events by academic year
const groupEventsByAcademicYear = (events) => {
  const grouped = {};
  
  events.forEach(event => {
    const academicYear = getAcademicYear(event.date);
    if (!grouped[academicYear]) {
      grouped[academicYear] = [];
    }
    grouped[academicYear].push(event);
  });
  
  // Sort events within each academic year by date (newest first)
  Object.keys(grouped).forEach(year => {
    grouped[year].sort((a, b) => {
      const dateA = parseEventDate(a.date);
      const dateB = parseEventDate(b.date);
      return dateB - dateA;
    });
  });
  
  return grouped;
};

// Helper checks for Genesis hackathon iterations and featured flagship events
const isGenesis1 = (title) => title === "GENESIS 2026" || title === "GENESIS 1.0" || title === "Genesis 1.0" || title?.toLowerCase()?.includes("genesis 1");
const isGenesis2 = (title) => title === "GENESIS 2.0" || title === "Genesis 2.0" || title?.toLowerCase()?.includes("genesis 2");
const isVibeWQuest = (title) => title === "Vibe W Quest" || title?.toLowerCase()?.includes("vibe");
const isGenesis = (title) => isGenesis1(title) || isGenesis2(title) || title?.toLowerCase()?.includes("genesis");

// Color schemes for each event - defines gradient borders and accent colors
const getEventColorScheme = (title) => {
  // Flagship events with custom colors
  if (isGenesis2(title)) {
    return {
      borderGradient: "from-orange-400 via-orange-500 to-amber-500",
      borderGradientHover: "from-orange-300 via-orange-400 to-amber-400",
      accentColor: "orange-400",
      glowColor: "rgba(249,115,22,0.5)",
      glowColorSecondary: "rgba(249,115,22,0.25)",
      ambientGlow: "from-orange-500/15",
      shadowGlow: "rgba(249,115,22,0.8)",
      insetShadow: "rgba(249,115,22,0.18)",
      textHover: "text-orange-200",
      textShadow: "rgba(249,115,22,0.3)",
    };
  }
  
  if (isVibeWQuest(title)) {
    return {
      borderGradient: "from-purple-400 via-fuchsia-500 to-violet-500",
      borderGradientHover: "from-purple-300 via-fuchsia-400 to-violet-400",
      accentColor: "purple-400",
      glowColor: "rgba(168,85,247,0.5)",
      glowColorSecondary: "rgba(168,85,247,0.25)",
      ambientGlow: "from-purple-500/15",
      shadowGlow: "rgba(168,85,247,0.8)",
      insetShadow: "rgba(168,85,247,0.18)",
      textHover: "text-purple-200",
      textShadow: "rgba(168,85,247,0.3)",
    };
  }
  
  if (isGenesis1(title)) {
    return {
      borderGradient: "from-cyan-400 via-cyan-500 to-teal-400",
      borderGradientHover: "from-cyan-300 via-cyan-400 to-teal-300",
      accentColor: "cyan-400",
      glowColor: "rgba(6,182,212,0.5)",
      glowColorSecondary: "rgba(6,182,212,0.25)",
      ambientGlow: "from-cyan-500/15",
      shadowGlow: "rgba(6,182,212,0.8)",
      insetShadow: "rgba(6,182,212,0.18)",
      textHover: "text-cyan-200",
      textShadow: "rgba(6,182,212,0.3)",
    };
  }
  
  // Other events with designated colors
  const eventColorMap = {
    "SIH Insider": {
      borderGradient: "from-blue-400 via-blue-500 to-indigo-500",
      borderGradientHover: "from-blue-300 via-blue-400 to-indigo-400",
      accentColor: "blue-400",
      glowColor: "rgba(59,130,246,0.5)",
      glowColorSecondary: "rgba(59,130,246,0.25)",
      ambientGlow: "from-blue-500/15",
      shadowGlow: "rgba(59,130,246,0.8)",
      insetShadow: "rgba(59,130,246,0.18)",
      textHover: "text-blue-200",
      textShadow: "rgba(59,130,246,0.3)",
    },
    "Bridge The Gap": {
      borderGradient: "from-green-400 via-emerald-500 to-teal-500",
      borderGradientHover: "from-green-300 via-emerald-400 to-teal-400",
      accentColor: "emerald-400",
      glowColor: "rgba(16,185,129,0.5)",
      glowColorSecondary: "rgba(16,185,129,0.25)",
      ambientGlow: "from-emerald-500/15",
      shadowGlow: "rgba(16,185,129,0.8)",
      insetShadow: "rgba(16,185,129,0.18)",
      textHover: "text-emerald-200",
      textShadow: "rgba(16,185,129,0.3)",
    },
    "Career Connect": {
      borderGradient: "from-rose-400 via-pink-500 to-fuchsia-500",
      borderGradientHover: "from-rose-300 via-pink-400 to-fuchsia-400",
      accentColor: "pink-400",
      glowColor: "rgba(236,72,153,0.5)",
      glowColorSecondary: "rgba(236,72,153,0.25)",
      ambientGlow: "from-pink-500/15",
      shadowGlow: "rgba(236,72,153,0.8)",
      insetShadow: "rgba(236,72,153,0.18)",
      textHover: "text-pink-200",
      textShadow: "rgba(236,72,153,0.3)",
    },
    "TestDrive - From Manual to Automation": {
      borderGradient: "from-yellow-400 via-amber-500 to-orange-400",
      borderGradientHover: "from-yellow-300 via-amber-400 to-orange-300",
      accentColor: "amber-400",
      glowColor: "rgba(251,191,36,0.5)",
      glowColorSecondary: "rgba(251,191,36,0.25)",
      ambientGlow: "from-amber-500/15",
      shadowGlow: "rgba(251,191,36,0.8)",
      insetShadow: "rgba(251,191,36,0.18)",
      textHover: "text-amber-200",
      textShadow: "rgba(251,191,36,0.3)",
    },
    "CodeFlix: ML Special": {
      borderGradient: "from-red-400 via-rose-500 to-pink-500",
      borderGradientHover: "from-red-300 via-rose-400 to-pink-400",
      accentColor: "rose-400",
      glowColor: "rgba(244,63,94,0.5)",
      glowColorSecondary: "rgba(244,63,94,0.25)",
      ambientGlow: "from-rose-500/15",
      shadowGlow: "rgba(244,63,94,0.8)",
      insetShadow: "rgba(244,63,94,0.18)",
      textHover: "text-rose-200",
      textShadow: "rgba(244,63,94,0.3)",
    },
    "Invictus 2025": {
      borderGradient: "from-violet-400 via-purple-500 to-indigo-500",
      borderGradientHover: "from-violet-300 via-purple-400 to-indigo-400",
      accentColor: "violet-400",
      glowColor: "rgba(139,92,246,0.5)",
      glowColorSecondary: "rgba(139,92,246,0.25)",
      ambientGlow: "from-violet-500/15",
      shadowGlow: "rgba(139,92,246,0.8)",
      insetShadow: "rgba(139,92,246,0.18)",
      textHover: "text-violet-200",
      textShadow: "rgba(139,92,246,0.3)",
    },
    "Code Crack": {
      borderGradient: "from-lime-400 via-green-500 to-emerald-500",
      borderGradientHover: "from-lime-300 via-green-400 to-emerald-400",
      accentColor: "lime-400",
      glowColor: "rgba(163,230,53,0.5)",
      glowColorSecondary: "rgba(163,230,53,0.25)",
      ambientGlow: "from-lime-500/15",
      shadowGlow: "rgba(163,230,53,0.8)",
      insetShadow: "rgba(163,230,53,0.18)",
      textHover: "text-lime-200",
      textShadow: "rgba(163,230,53,0.3)",
    },
    "Flutter Voyage": {
      borderGradient: "from-sky-400 via-blue-500 to-cyan-500",
      borderGradientHover: "from-sky-300 via-blue-400 to-cyan-400",
      accentColor: "sky-400",
      glowColor: "rgba(56,189,248,0.5)",
      glowColorSecondary: "rgba(56,189,248,0.25)",
      ambientGlow: "from-sky-500/15",
      shadowGlow: "rgba(56,189,248,0.8)",
      insetShadow: "rgba(56,189,248,0.18)",
      textHover: "text-sky-200",
      textShadow: "rgba(56,189,248,0.3)",
    },
    "Project Apex": {
      borderGradient: "from-indigo-400 via-blue-500 to-purple-500",
      borderGradientHover: "from-indigo-300 via-blue-400 to-purple-400",
      accentColor: "indigo-400",
      glowColor: "rgba(99,102,241,0.5)",
      glowColorSecondary: "rgba(99,102,241,0.25)",
      ambientGlow: "from-indigo-500/15",
      shadowGlow: "rgba(99,102,241,0.8)",
      insetShadow: "rgba(99,102,241,0.18)",
      textHover: "text-indigo-200",
      textShadow: "rgba(99,102,241,0.3)",
    },
    "WebDev Odyssey": {
      borderGradient: "from-teal-400 via-cyan-500 to-sky-500",
      borderGradientHover: "from-teal-300 via-cyan-400 to-sky-400",
      accentColor: "teal-400",
      glowColor: "rgba(20,184,166,0.5)",
      glowColorSecondary: "rgba(20,184,166,0.25)",
      ambientGlow: "from-teal-500/15",
      shadowGlow: "rgba(20,184,166,0.8)",
      insetShadow: "rgba(20,184,166,0.18)",
      textHover: "text-teal-200",
      textShadow: "rgba(20,184,166,0.3)",
    },
    "Intern Quest": {
      borderGradient: "from-fuchsia-400 via-purple-500 to-pink-500",
      borderGradientHover: "from-fuchsia-300 via-purple-400 to-pink-400",
      accentColor: "fuchsia-400",
      glowColor: "rgba(217,70,239,0.5)",
      glowColorSecondary: "rgba(217,70,239,0.25)",
      ambientGlow: "from-fuchsia-500/15",
      shadowGlow: "rgba(217,70,239,0.8)",
      insetShadow: "rgba(217,70,239,0.18)",
      textHover: "text-fuchsia-200",
      textShadow: "rgba(217,70,239,0.3)",
    },
    "Code Matrix": {
      borderGradient: "from-slate-400 via-gray-500 to-zinc-500",
      borderGradientHover: "from-slate-300 via-gray-400 to-zinc-400",
      accentColor: "slate-400",
      glowColor: "rgba(148,163,184,0.5)",
      glowColorSecondary: "rgba(148,163,184,0.25)",
      ambientGlow: "from-slate-500/15",
      shadowGlow: "rgba(148,163,184,0.8)",
      insetShadow: "rgba(148,163,184,0.18)",
      textHover: "text-slate-200",
      textShadow: "rgba(148,163,184,0.3)",
    },
    "Invictus 2024": {
      borderGradient: "from-violet-400 via-purple-500 to-indigo-500",
      borderGradientHover: "from-violet-300 via-purple-400 to-indigo-400",
      accentColor: "violet-400",
      glowColor: "rgba(139,92,246,0.5)",
      glowColorSecondary: "rgba(139,92,246,0.25)",
      ambientGlow: "from-violet-500/15",
      shadowGlow: "rgba(139,92,246,0.8)",
      insetShadow: "rgba(139,92,246,0.18)",
      textHover: "text-violet-200",
      textShadow: "rgba(139,92,246,0.3)",
    },
    "API Alchemy": {
      borderGradient: "from-emerald-400 via-teal-500 to-cyan-500",
      borderGradientHover: "from-emerald-300 via-teal-400 to-cyan-400",
      accentColor: "emerald-400",
      glowColor: "rgba(52,211,153,0.5)",
      glowColorSecondary: "rgba(52,211,153,0.25)",
      ambientGlow: "from-emerald-500/15",
      shadowGlow: "rgba(52,211,153,0.8)",
      insetShadow: "rgba(52,211,153,0.18)",
      textHover: "text-emerald-200",
      textShadow: "rgba(52,211,153,0.3)",
    },
  };
  
  // Return specific color scheme or default
  return eventColorMap[title] || {
    // Default color scheme (neutral/white)
    borderGradient: "from-neutral-400 via-neutral-500 to-gray-500",
    borderGradientHover: "from-neutral-300 via-neutral-400 to-gray-400",
    accentColor: "neutral-400",
    glowColor: "rgba(163,163,163,0.5)",
    glowColorSecondary: "rgba(163,163,163,0.25)",
    ambientGlow: "from-neutral-500/15",
    shadowGlow: "rgba(163,163,163,0.8)",
    insetShadow: "rgba(163,163,163,0.18)",
    textHover: "text-neutral-200",
    textShadow: "rgba(163,163,163,0.3)",
  };
};

// Universal styled EventCard with custom color scheme for each event
const StyledEventCard = ({ event, onClick, isCompact = false }) => {
  const colors = getEventColorScheme(event.title);
  
  // Generate ID from title
  const eventId = event.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  
  return (
    <div
      id={eventId}
      onClick={onClick}
      style={{
        filter: `drop-shadow(0 0 14px ${colors.glowColor}) drop-shadow(0 0 28px ${colors.glowColorSecondary})`,
      }}
      className="relative flex flex-col cursor-pointer scroll-mt-28 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.99]"
    >
      {/* Additional IDs for backward compatibility */}
      {isGenesis1(event.title) && (
        <>
          <span id="genesis-1.0" className="sr-only -top-28 relative" />
          <span id="genesis-2026" className="sr-only -top-28 relative" />
        </>
      )}
      {isGenesis2(event.title) && <span id="genesis-2.0" className="sr-only -top-28 relative" />}
      {isVibeWQuest(event.title) && <span id="vibewquest" className="sr-only -top-28 relative" />}

      {/* Clipped Outer Border with Gradient Glow */}
      <div
        className={`w-full h-full p-[1.5px] bg-gradient-to-br ${colors.borderGradient} transition-all duration-300 group-hover:${colors.borderGradientHover}`}
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))",
        }}
      >
        {/* Inner Card Background & Content */}
        <div
          className="w-full h-full bg-[#050505] flex flex-col justify-between overflow-hidden relative"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 23px) 0, 100% 23px, 100% 100%, 23px 100%, 0 calc(100% - 23px))",
            boxShadow: `inset 0 0 20px ${colors.insetShadow}`,
          }}
        >
          {/* Subtle Ambient Edge Glow Accents */}
          <div className={`absolute top-0 left-0 right-0 h-10 bg-gradient-to-b ${colors.ambientGlow} to-transparent pointer-events-none z-10`} />
          <div className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t ${colors.ambientGlow} to-transparent pointer-events-none z-10`} />

          {/* Corner Brackets - Using inline styles for dynamic border colors */}
          {/* Top-left L-bracket ┌ */}
          <div 
            className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 pointer-events-none z-20"
            style={{ 
              borderColor: colors.accentColor.includes('-') 
                ? `rgb(var(--color-${colors.accentColor}))` 
                : colors.glowColor.replace('0.5', '1'),
              boxShadow: `0 0 10px ${colors.shadowGlow}` 
            }}
          />

          {/* Bottom-right L-bracket ┘ */}
          <div 
            className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 pointer-events-none z-20"
            style={{ 
              borderColor: colors.accentColor.includes('-') 
                ? `rgb(var(--color-${colors.accentColor}))` 
                : colors.glowColor.replace('0.5', '1'),
              boxShadow: `0 0 10px ${colors.shadowGlow}` 
            }}
          />

          {/* Artwork Banner */}
          <div
            className={cn(
              "relative w-full overflow-hidden bg-black flex-shrink-0",
              isCompact ? "h-48 sm:h-56 md:h-60" : "h-60"
            )}
          >
            <Image
              width={600}
              unoptimized
              height={380}
              src={get_event_image(event.image)}
              alt={event.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Card Typography Footer */}
          <div className="px-4 pt-2.5 pb-4 sm:pb-5 flex flex-col items-center justify-center gap-1 z-10 bg-[#050505]">
            <h3 
              className={`font-medium text-white text-center text-lg sm:text-xl tracking-wide group-hover:${colors.textHover} transition-colors`}
              style={{ textShadow: `0 0 8px ${colors.textShadow}` }}
            >
              {event.title}
            </h3>
            <p className="text-neutral-400 text-center text-xs sm:text-sm flex gap-1.5 items-center justify-center font-normal">
              <CalendarRange 
                size={16} 
                className="opacity-80"
                style={{ color: colors.glowColor.replace('0.5', '0.8') }}
              /> 
              {event.date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable responsive Event Modal with swipe & arrow navigation
const EventModal = ({
  active,
  set_active,
  activeEventsList,
  activeIndex,
  handlePrevEvent,
  handleNextEvent,
  handleTouchStart,
  handleTouchEnd,
  modalRef,
}) => {
  return (
    <AnimatePresence>
      {active && typeof active === "object" && (
        <>
          <motion.div
            key="event-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[11000] touch-none"
            onClick={() => set_active(null)}
            onTouchMove={(e) => e.preventDefault()}
          />

          <div className="fixed inset-0 grid place-items-center z-[11001] p-3 sm:p-6 pointer-events-none">
            <motion.div
              ref={modalRef}
              key="event-modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className={cn(
                "pointer-events-auto w-[92%] sm:w-full max-w-[480px] h-[84vh] sm:h-[88vh] max-h-[720px] flex flex-col bg-neutral-900 rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_12px_45px_rgba(0,0,0,0.85)] overflow-hidden relative select-none",
                isGenesis1(active.title) && "bg-cyan-950/95 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.4)]",
                isGenesis2(active.title) && "bg-neutral-900 border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.4)]",
                isVibeWQuest(active.title) && "bg-neutral-950 border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.4)]"
              )}
            >
              {/* Image & Floating Navigation Controls */}
              <div className="relative w-full h-40 sm:h-48 md:h-52 flex-shrink-0 bg-neutral-950 overflow-hidden">
                <Image
                  priority
                  unoptimized
                  width={600}
                  height={380}
                  src={get_event_image(active.image)}
                  alt={active.title}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40 pointer-events-none" />

                {/* Event Counter Pill */}
                <div className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-mono backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>
                    {activeIndex !== -1 ? `${activeIndex + 1} / ${activeEventsList.length}` : "Event"}
                  </span>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => set_active(null)}
                  aria-label="Close modal"
                  className="absolute top-3 right-3 z-30 p-1.5 sm:p-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                >
                  <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>

                {/* Left Navigation Arrow */}
                <button
                  onClick={handlePrevEvent}
                  aria-label="Previous event"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/65 hover:bg-black/90 text-white border border-white/20 shadow-lg backdrop-blur-md transition-all active:scale-90 hover:scale-105 cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Right Navigation Arrow */}
                <button
                  onClick={handleNextEvent}
                  aria-label="Next event"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/65 hover:bg-black/90 text-white border border-white/20 shadow-lg backdrop-blur-md transition-all active:scale-90 hover:scale-105 cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Title & Metadata */}
              <div className="px-4 sm:px-5 pt-3.5 pb-2 flex-shrink-0">
                <h3
                  className={cn(
                    "font-bold text-neutral-100 text-lg sm:text-xl tracking-tight leading-snug",
                    isGenesis(active.title) && "text-white"
                  )}
                >
                  {active.title}
                </h3>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full mt-1.5">
                  <p
                    className={cn(
                      "text-neutral-400 text-xs sm:text-sm flex gap-1.5 items-center",
                      isGenesis(active.title) && "text-white/90"
                    )}
                  >
                    <CalendarRange size={15} className={cn("text-cyan-400", isGenesis(active.title) && "text-white")} />{" "}
                    {active.date}
                  </p>

                  {active.title === "Vibe W Quest" ? (
                    <Link
                      href="/vibe-w-quest-winners"
                      className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors text-xs sm:text-sm font-medium"
                    >
                      <Trophy size={14} />
                      <span>Vibe W Quest Winners 🏆</span>
                    </Link>
                  ) : active.title === "SIH Insider" && active.date?.includes("2026") ? (
                    <span className="flex items-center gap-1.5 text-cyan-400 text-xs sm:text-sm font-medium">
                      <Trophy size={14} />
                      <span>SIH 2026 Preparation</span>
                    </span>
                  ) : active.website ? (
                    <Link
                      href={active.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors text-xs sm:text-sm font-medium",
                        isGenesis(active.title) && "text-white hover:text-white/80 underline decoration-white/30"
                      )}
                    >
                      <ExternalLink size={14} />
                      <span>
                        {isGenesis2(active.title)
                          ? "Genesis 2.0 Website"
                          : isGenesis1(active.title)
                          ? "Genesis Website"
                          : "Event Website"}
                      </span>
                    </Link>
                  ) : null}
                </div>
              </div>

              {/* Scrollable Description & Speakers */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-5 py-2.5 space-y-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                <p className={cn("text-neutral-300", isGenesis(active.title) && "text-white/90")}>
                  {active.description}
                </p>

                {active.speakers && active.speakers.length > 0 && (
                  <div className="pt-2">
                    <h4
                      className={cn(
                        "font-semibold text-neutral-200 text-sm mb-2",
                        isGenesis(active.title) && "text-white"
                      )}
                    >
                      Speakers
                    </h4>
                    <div className="flex flex-row items-center gap-2 w-full">
                      <div className="flex flex-row -space-x-3">
                        <AnimatedTooltip items={active.speakers} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons inside scrollable content */}
                {isGenesis2(active.title) && (
                  <div className="pt-2 pb-2">
                    <Link href="/genesis-2-winners" className="w-full block">
                      <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-600 hover:from-yellow-500 hover:to-amber-700 text-white font-semibold py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                        <Trophy size={16} />
                        Genesis 2.0 Winners 🏆
                      </Button>
                    </Link>
                  </div>
                )}

                {isGenesis1(active.title) && active.website && (
                  <div className="pt-2 pb-2">
                    <Link href={active.website} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                        <ExternalLink size={16} />
                        Explore Genesis 1.0
                      </Button>
                    </Link>
                  </div>
                )}

                {active.title === "Vibe W Quest" && (
                  <div className="pt-2 pb-2">
                    <Link href="/vibe-w-quest-winners">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                        <Trophy size={16} />
                        Vibe W Quest Winners 🏆
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Bottom Navigation & Swipe Indicator Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950/90 border-t border-neutral-800/80 text-xs text-neutral-400 flex-shrink-0">
                <button
                  onClick={handlePrevEvent}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 hover:text-white transition-all text-xs font-medium cursor-pointer active:scale-95"
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>

                <span className="text-[11px] text-neutral-500 font-mono flex items-center gap-1">
                  <span className="hidden sm:inline">Swipe or use arrows</span>
                  <span className="sm:hidden">Swipe left / right</span>
                </span>

                <button
                  onClick={handleNextEvent}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 hover:text-white transition-all text-xs font-medium cursor-pointer active:scale-95"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const Events = ({ featured = false }) => {
  const id = useId();
  const ref = useRef(null);
  const [active, set_active] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Memoize all events sorted chronologically (newest first, October 2026 is 1st)
  const allSortedEvents = useMemo(() => {
    return [...events].sort((a, b) => parseEventDate(b.date) - parseEventDate(a.date));
  }, []);

  // Top 6 featured events for homepage
  const sortedFeaturedEvents = useMemo(() => {
    return allSortedEvents.slice(0, 6);
  }, [allSortedEvents]);

  // Events list available for modal navigation - always follows chronological date order (October 2026 is 1st)
  const activeEventsList = useMemo(() => {
    return allSortedEvents;
  }, [allSortedEvents]);

  const activeIndex = useMemo(() => {
    if (!active || typeof active !== "object") return -1;
    return activeEventsList.findIndex(
      (e) => e.title === active.title && e.date === active.date
    );
  }, [active, activeEventsList]);

  const handlePrevEvent = (e) => {
    e?.stopPropagation?.();
    if (activeEventsList.length === 0) return;
    const prevIndex = activeIndex > 0 ? activeIndex - 1 : activeEventsList.length - 1;
    set_active(activeEventsList[prevIndex]);
  };

  const handleNextEvent = (e) => {
    e?.stopPropagation?.();
    if (activeEventsList.length === 0) return;
    const nextIndex = activeIndex < activeEventsList.length - 1 ? activeIndex + 1 : 0;
    set_active(activeEventsList[nextIndex]);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && Math.abs(deltaX) > 40 && deltaTime < 600) {
        if (deltaX < 0) {
          handleNextEvent();
        } else {
          handlePrevEvent();
        }
      }
    }
  };

  // Party celebration animation function
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 12000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      
      // Confetti from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const words = [
    {
      text: "Featured",
    },
    {
      text: "Events",
    },
    {
      text: "You",
    },
    {
      text: "Love",
      className: "!text-cyan-300",
    },
  ];

  useOutsideClick(ref, () => set_active(null));

  useEffect(() => {
    function on_key_down(event) {
      if (event.key === "Escape") {
        set_active(null);
      } else if (event.key === "ArrowLeft") {
        handlePrevEvent();
      } else if (event.key === "ArrowRight") {
        handleNextEvent();
      }
    }

    if (active && typeof active === "object") {
      const scrollY = window.scrollY;
      document.body.dataset.modalScrollY = scrollY.toString();
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // Trigger confetti for GENESIS editions
      if (isGenesis(active.title)) {
        triggerConfetti();
      }
    } else {
      const savedScrollY = document.body.dataset.modalScrollY;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (savedScrollY) {
        window.scrollTo(0, parseInt(savedScrollY, 10));
        delete document.body.dataset.modalScrollY;
      }
    }

    window.addEventListener("keydown", on_key_down);
    return () => {
      window.removeEventListener("keydown", on_key_down);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [active, activeIndex]);

  // Handle smooth scroll to Genesis 2.0 or Genesis 1.0 if URL hash matches
  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== "undefined") {
        const hash = window.location.hash;
        if (hash === "#genesis-2-0" || hash === "#genesis-2.0") {
          const el = document.getElementById("genesis-2-0") || document.getElementById("genesis-2.0");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else if (
          hash === "#genesis-1-0" ||
          hash === "#genesis-1.0" ||
          hash === "#genesis-2026" ||
          hash === "#genesis"
        ) {
          const el =
            document.getElementById("genesis-1-0") ||
            document.getElementById("genesis-1.0") ||
            document.getElementById("genesis-2026");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else if (
          hash === "#vibe-w-quest" ||
          hash === "#vibewquest" ||
          hash === "#vibe"
        ) {
          const el =
            document.getElementById("vibe-w-quest") ||
            document.getElementById("vibewquest");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Render featured events (for home page)
  if (featured) {
    return (
      <LayoutGroup>
      <div id="events">
        <TypewriterEffect words={words} className="pt-5 md:pt-10 pb-16" />

        <EventModal
          active={active}
          set_active={set_active}
          activeEventsList={activeEventsList}
          activeIndex={activeIndex}
          handlePrevEvent={handlePrevEvent}
          handleNextEvent={handleNextEvent}
          handleTouchStart={handleTouchStart}
          handleTouchEnd={handleTouchEnd}
          id={id}
          modalRef={ref}
        />

        <ul className="w-full max-w-none px-4 md:px-10 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-4">
          {sortedFeaturedEvents.map((event, index) => (
            <StyledEventCard
              key={index}
              event={event}
              onClick={() => set_active(event)}
              isCompact={false}
            />
          ))}
        </ul>

        <div className="flex justify-center items-center mt-8 md:mt-12 mb-12 md:mb-16">
          <Link href="/events">
            <Button className="px-8 py-4 text-lg bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition duration-200 shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
              Explore More Events <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      </LayoutGroup>
    );
  }

  // Render events grouped by academic year (for events page)
  const groupedEvents = useMemo(() => groupEventsByAcademicYear(events), []);
  const academicYears = useMemo(() => {
    return Object.keys(groupedEvents).sort((a, b) => {
      const yearA = parseInt(a.split('-')[0]);
      const yearB = parseInt(b.split('-')[0]);
      return yearB - yearA; // Sort in descending order (newest first)
    });
  }, [groupedEvents]);

  // Track which sections are in view for animation
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const observers = [];
    
    academicYears.forEach((year) => {
      const element = document.getElementById(`section-${year}`);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setVisibleSections((prev) => ({ ...prev, [year]: true }));
              }
            });
          },
          { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [academicYears]);

  return (
    <LayoutGroup>
    <div id="events">
      <EventModal
        active={active}
        set_active={set_active}
        activeEventsList={activeEventsList}
        activeIndex={activeIndex}
        handlePrevEvent={handlePrevEvent}
        handleNextEvent={handleNextEvent}
        handleTouchStart={handleTouchStart}
        handleTouchEnd={handleTouchEnd}
        id={id}
        modalRef={ref}
      />

      {/* Events grouped by academic year */}
      <div className="w-full space-y-12 sm:space-y-14 md:space-y-16">
        {academicYears.map((academicYear, yearIndex) => (
          <div 
            key={academicYear} 
            id={`section-${academicYear}`}
            className="space-y-6 sm:space-y-7 md:space-y-8"
          >
            {/* Academic Year Header */}
            <motion.div 
              className="relative px-4 sm:px-6 md:px-10"
              initial={{ opacity: 0, x: -50 }}
              animate={visibleSections[academicYear] ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-xl font-medium text-white py-4">
                {academicYear}
              </h2>
              <motion.div 
                className="h-[1px] w-full bg-cyan-300"
                initial={{ scaleX: 0 }}
                animate={visibleSections[academicYear] ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              ></motion.div>
            </motion.div>

            {/* Events Grid */}
            <ul className="w-full max-w-none px-4 sm:px-6 md:px-10 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-3 sm:gap-4">
              {groupedEvents[academicYear].map((event, index) => (
                <StyledEventCard
                  key={index}
                  event={event}
                  onClick={() => set_active(event)}
                  isCompact={true}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    </LayoutGroup>
  );
};

export { Events };