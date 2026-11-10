"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, Code2, Terminal, Laptop, Database, Cpu, ExternalLink } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";
import developers from "@/constants/developers";

const DEVELOPER_WORK_TITLES = {
  "Shravanya Andhale": "Website Deployment & Domain Coordination",
  "Atharva Lotankar": "UI Redesign & Frontend Components",
  "Jay Kerkar": "Frontend Architecture & PWA",
  "Pranav Titambe": "Backend Optimization & Dynamic Workflows",
  "Shivam Mishra": "Genesis Microsite & Subpath Routing",
  "Karthik Kotian": "Gallery & Developer Section Redesign",
  "Avani Killekar": "Council 2026–27 Team Section Architecture",
  "Chaitali Rane": "Council 2026–27 Media Standardisation",
  "Manish Awari": "Event Campaign Integration & Metrics UI",
  "Sarra Khadse": "Data Analytics Visualization & Responsive Splits UI",
  "Sankalp Mane": "Cross-Device Layout Optimization & Event Modules",
};

const CATEGORIES = [
  { id: "all", label: "All Contributors", icon: Sparkles },
  { id: "frontend", label: "Frontend & UI", icon: Laptop },
  { id: "backend", label: "Backend & Systems", icon: Database },
  { id: "deployment", label: "DevOps & Media", icon: Cpu },
];

const getCategory = (dev) => {
  const role = (dev.role || "").toLowerCase();
  const desc = (dev.description || "").toLowerCase();
  const title = (DEVELOPER_WORK_TITLES[dev.name] || "").toLowerCase();

  if (role.includes("backend") || desc.includes("backend") || desc.includes("mongodb")) {
    return "backend";
  }
  if (
    role.includes("deployment") ||
    desc.includes("deployment") ||
    desc.includes("media") ||
    title.includes("media")
  ) {
    return "deployment";
  }
  return "frontend";
};

const NewDeveloperSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeDevModal, setActiveDevModal] = useState(null);

  const filteredDevelopers = useMemo(() => {
    if (selectedCategory === "all") return developers;
    return developers.filter((dev) => getCategory(dev) === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="relative w-full min-h-screen bg-[#030712] text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden">
      {/* ── Background Cyber Ambient Glow & Grid ── */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(0, 212, 255, 0.12) 0%, rgba(147, 51, 234, 0.06) 45%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ── Header Section ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            <Terminal size={14} />
            <span>Developer Section • Next-Gen Redesign</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            MEET THE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 drop-shadow-[0_0_25px_rgba(0,212,255,0.4)]">
              ARCHITECTS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3.5 text-sm sm:text-base md:text-lg text-neutral-400 font-light leading-relaxed"
          >
            The engineers, architects, and creators who crafted the digital frontier for Quest-IT.
          </motion.p>

          {/* ── Filter Tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-7"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_18px_rgba(0,212,255,0.4)] border border-cyan-300/40 scale-105"
                      : "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <Icon size={14} className={isSelected ? "text-white" : "text-cyan-400"} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* ── Modern Developer Cards Grid ── */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredDevelopers.map((dev, idx) => {
              const workTitle = DEVELOPER_WORK_TITLES[dev.name] || dev.role;
              return (
                <motion.div
                  key={dev.name}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 20 }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className="group relative flex flex-col justify-between bg-neutral-900/60 hover:bg-neutral-900/90 border border-neutral-800/80 hover:border-cyan-500/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.18)] hover:-translate-y-1 backdrop-blur-sm"
                >
                  {/* Subtle Card Ambient Glow */}
                  <div
                    aria-hidden="true"
                    className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none"
                  />

                  {/* Top: Avatar & Roles */}
                  <div>
                    <div className="relative flex items-center gap-4 mb-4">
                      {/* Avatar with Glow Ring */}
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-cyan-400/40 group-hover:border-cyan-400 transition-colors shadow-md shadow-black/60 bg-neutral-950">
                        <Image
                          src={dev.image}
                          alt={dev.name}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 72px, 80px"
                        />
                      </div>

                      {/* Name & Role */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {dev.name}
                        </h3>
                        <p className="text-xs text-neutral-400 truncate mt-0.5">
                          {dev.role}
                        </p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                          {getCategory(dev)}
                        </span>
                      </div>
                    </div>

                    {/* Work Title Pill */}
                    <div className="mb-3 px-3 py-1.5 rounded-lg bg-neutral-950/80 border border-neutral-800 text-xs text-cyan-300 font-medium line-clamp-1">
                      ⚡ {workTitle}
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-[13px] text-neutral-300/90 leading-relaxed font-light line-clamp-4">
                      {dev.description}
                    </p>
                  </div>

                  {/* Bottom: Social Actions */}
                  <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-500 group-hover:text-neutral-400 transition-colors">
                      CONNECT
                    </span>

                    <div className="flex items-center gap-2">
                      {dev.github && (
                        <a
                          href={dev.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${dev.name}'s GitHub`}
                          className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                        >
                          <Github size={15} />
                        </a>
                      )}
                      {dev.linkedin && (
                        <a
                          href={dev.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${dev.name}'s LinkedIn`}
                          className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-blue-600/30 text-neutral-300 hover:text-blue-400 flex items-center justify-center transition-all hover:scale-110 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-transparent hover:border-blue-500/40"
                        >
                          <Linkedin size={15} />
                        </a>
                      )}
                      {dev.email && (
                        <a
                          href={`mailto:${dev.email}?subject=${encodeURIComponent(
                            "Connecting via Quest-IT Website"
                          )}`}
                          aria-label={`Email ${dev.name}`}
                          className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-cyan-600/30 text-neutral-300 hover:text-cyan-400 flex items-center justify-center transition-all hover:scale-110 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] border border-transparent hover:border-cyan-500/40"
                        >
                          <Mail size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* ── Footer Tech Badge ── */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-400 text-xs font-mono">
            <Code2 size={15} className="text-cyan-400" />
            <span>Quest-IT Platform v2.0 • Designed & Built with Next.js & Tailwind</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDeveloperSection;

