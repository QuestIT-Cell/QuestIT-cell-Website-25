"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  X,
  Sparkles,
  ArrowUpRight,
  Home,
  HelpCircle,
  Calendar,
  Images,
  Users,
  Mail,
  Laptop,
} from "lucide-react";
import {
  FaGithub as Github,
  FaLinkedin as Linkedin,
  FaInstagram as Instagram,
} from "react-icons/fa";
import menu from "@/constants/menu";

/* ─── Map menu names to dedicated sleek icons ────────────────────────────── */
const MENU_ICONS = {
  Home: Home,
  About: HelpCircle,
  Events: Calendar,
  Gallery: Images,
  Team: Users,
  Developers: Laptop,
  Contact: Mail,
};

/* ─── Sliding-pill indicator helper for desktop ──────────────────────────── */
function useIndicator() {
  const indRef = useRef(null);

  const moveTo = useCallback((el) => {
    const ind = indRef.current;
    if (!ind) return;
    if (!el) {
      ind.style.opacity = "0";
      return;
    }
    const parent = el.parentElement;
    if (!parent) return;
    ind.style.opacity = "1";
    ind.style.width = el.offsetWidth + "px";
    ind.style.transform = `translateX(${parent.offsetLeft}px)`;
  }, []);

  return { indRef, moveTo };
}

/* ─── Spark burst on click ───────────────────────────────────────────────── */
function spawnSparks(e, container) {
  if (!container) return;
  const r = container.getBoundingClientRect();
  const x = e.clientX ? e.clientX - r.left : r.width / 2;
  const y = e.clientY ? e.clientY - r.top : r.height / 2;
  for (let i = 0; i < 10; i++) {
    const p = document.createElement("span");
    const ang = (i / 10) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 28 + Math.random() * 24;
    p.style.cssText = `
      position:absolute;width:5px;height:5px;margin:-2.5px;border-radius:50%;
      background:#22d3ee;box-shadow:0 0 6px #22d3ee;pointer-events:none;z-index:3;
      left:${x}px;top:${y}px;
      --dx:${Math.cos(ang) * dist}px;--dy:${Math.sin(ang) * dist}px;
      animation:questSparkAnim .65s cubic-bezier(.2,.8,.3,1) forwards;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

/* ─── Header Component ───────────────────────────────────────────────────── */
const Header = () => {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const { indRef, moveTo } = useIndicator();

  /* ─── Check which navigation item is active ───────────────────────────── */
  const isItemActive = useCallback(
    (item) => {
      if (!pathname) return false;

      // Standalone page routes (/events, /gallery, /team, /developers)
      if (!item.path.includes("#")) {
        if (item.path === "/") {
          return pathname === "/";
        }
        return pathname === item.path || pathname.startsWith(item.path + "/");
      }

      // Hash links (/#home, /#about, /#contact) — only active when on the root page "/"
      if (pathname === "/" || pathname === "") {
        const hash = item.path.split("#")[1];
        return activeId === hash;
      }

      return false;
    },
    [pathname, activeId]
  );

  /* ─── Scroll behaviour: hide on down, show on up, section spy ─────────── */
  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 40);
      setIsHidden((prev) => {
        if (sheetOpen) return false;
        if (y > last + 4 && y > 200) return true;
        if (y < last - 4 || y <= 30) return false;
        return prev;
      });
      last = y;

      // Section spy: only evaluate section headings when browsing the home page
      if (pathname === "/" || pathname === "") {
        const ids = ["home", "about", "contact"];
        let cur = "home";
        ids.forEach((id) => {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
            cur = id;
          }
        });
        setActiveId(cur);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, sheetOpen]);

  /* ─── Sync sliding indicator with the active link ─────────────────────── */
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector("a.quest-active");
    moveTo(activeEl || null);
  }, [pathname, activeId, moveTo]);

  /* ─── Recalculate indicator on font ready or window resize ───────────── */
  useEffect(() => {
    const update = () => {
      if (!listRef.current) return;
      const activeEl = listRef.current.querySelector("a.quest-active");
      moveTo(activeEl || null);
    };

    window.addEventListener("resize", update);

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(update);
    }

    const t = setTimeout(update, 50);

    return () => {
      window.removeEventListener("resize", update);
      clearTimeout(t);
    };
  }, [pathname, moveTo]);

  /* ─── Lock scroll & listen for ESC key when mobile sheet is open ──────── */
  useEffect(() => {
    if (sheetOpen) {
      const y = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.body.style.cssText = `overflow:hidden;position:fixed;top:-${y}px;width:100%;touch-action:none`;
      document.body.dataset.scrollY = String(y);

      const handleKeyDown = (e) => {
        if (e.key === "Escape") setSheetOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    } else {
      const saved = document.body.dataset.scrollY;
      document.documentElement.style.overflow = "";
      document.body.style.cssText = "";
      if (saved) {
        window.scrollTo(0, +saved);
        delete document.body.dataset.scrollY;
      }
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.cssText = "";
    };
  }, [sheetOpen]);

  const desktopLinks = menu.filter((m) => m.name !== "Contact");
  const ctaItem = menu.find((m) => m.name === "Contact");

  return (
    <>
      {/* Dynamic keyframe styles */}
      <style>{`
        @keyframes questSparkAnim{
          0%{transform:translate(0,0) scale(1);opacity:1}
          100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}
        }
        @keyframes questNavSpin{to{--quest-a:360deg}}
        @property --quest-a{syntax:'<angle>';inherits:false;initial-value:0deg}
      `}</style>

      {/* ── Fixed Top Bar: Logo & Floating Navbar in Perfect Horizontal Row ── */}
      <header
        ref={wrapRef}
        className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none px-4 sm:px-6 md:px-8 lg:px-12"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
          transition: isHidden
            ? "transform .55s cubic-bezier(.65,0,.35,1), opacity .35s .1s, filter .45s"
            : "transform .7s cubic-bezier(.34,1.5,.64,1), opacity .4s, filter .5s",
          transform: isHidden ? "translateY(-140%) scale(.9)" : "translateY(0) scale(1)",
          opacity: isHidden ? 0 : 1,
          filter: isHidden ? "blur(10px)" : "none",
        }}
      >
        <div className="relative w-full flex items-center justify-between min-h-[50px] md:min-h-[54px]">
          {/* 1. Left Corner: Quest IT Logo */}
          <div className="flex items-center flex-shrink-0 z-20">
            <Link
              href="/"
              aria-label="Quest IT Home"
              className="pointer-events-auto block transition-transform duration-200 hover:scale-[1.03] active:scale-95"
            >
              <Image
                priority
                src="/images/logo-navbar.webp"
                alt="Quest IT Logo"
                width={398}
                height={138}
                unoptimized
                className="h-10 sm:h-11 md:h-11 lg:h-12 w-auto object-contain filter drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]"
              />
            </Link>
          </div>

          {/* 2. Center: Desktop Floating Pill Navbar (Perfect horizontal alignment) */}
          <div className="hidden md:flex absolute inset-x-0 justify-center items-center pointer-events-none z-10">
            <nav
              className="pointer-events-auto relative flex items-center justify-between gap-2 md:gap-3 lg:gap-4 max-w-[94vw] md:min-w-[660px] lg:min-w-[800px] xl:min-w-[900px] 2xl:min-w-[980px]"
              style={{
                width: "fit-content",
                padding: isScrolled
                  ? "6px 14px 6px 18px"
                  : "8px 16px 8px 22px",
                borderRadius: "999px",
                background:
                  "linear-gradient(135deg,rgba(255,255,255,.14),rgba(255,255,255,.03) 50%,rgba(255,255,255,.14)),rgba(12,16,24,.8)",
                border: "1px solid rgba(255,255,255,.2)",
                backdropFilter: "blur(30px) saturate(120%) brightness(1.04)",
                WebkitBackdropFilter: "blur(30px) saturate(120%) brightness(1.04)",
                boxShadow:
                  "0 16px 48px -14px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.35), inset 0 -1px 0 rgba(255,255,255,.08), inset 0 0 22px rgba(255,255,255,.05)",
                transition: "padding .3s, min-width .3s",
              }}
            >
              {/* Conic glowing accent border */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "-1px",
                  borderRadius: "inherit",
                  pointerEvents: "none",
                  background:
                    "conic-gradient(from var(--quest-a,0deg), transparent 0 70%, #22d3ee 85%, transparent 100%)",
                  WebkitMask:
                    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "1px",
                  opacity: 0.75,
                  animation: "questNavSpin 6s linear infinite",
                }}
              />

              {/* Inner top sheen */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "inherit",
                  pointerEvents: "none",
                  background:
                    "linear-gradient(180deg,rgba(255,255,255,.18),transparent 45%)",
                  opacity: 0.55,
                }}
              />

              {/* Desktop links + sliding indicator */}
              <ul
                ref={listRef}
                className="relative flex items-center list-none p-0 gap-1 md:gap-1.5 lg:gap-2.5 flex-1 justify-center"
                onMouseLeave={() => {
                  const activeEl = listRef.current?.querySelector("a.quest-active");
                  moveTo(activeEl || null);
                }}
              >
                {/* Sliding pill indicator */}
                <span
                  ref={indRef}
                  style={{
                    position: "absolute",
                    zIndex: 0,
                    top: 0,
                    left: 0,
                    height: "100%",
                    borderRadius: "999px",
                    background: "rgba(34,211,238,.12)",
                    border: "1px solid rgba(34,211,238,.25)",
                    opacity: 0,
                    pointerEvents: "none",
                    transition:
                      "transform .35s cubic-bezier(.2,.9,.3,1.1), width .35s cubic-bezier(.2,.9,.3,1.1), opacity .2s",
                  }}
                />

                {desktopLinks.map((item, i) => {
                  const active = isItemActive(item);
                  const hasDropdown = Boolean(item.dropdown);

                  return (
                    <li key={i} className="relative group">
                      {hasDropdown ? (
                        <>
                          <button
                            className={`relative z-10 flex items-center gap-1.5 px-4 md:px-5 lg:px-6 py-2 md:py-2.5 rounded-full text-sm lg:text-[0.94rem] font-medium transition-colors whitespace-nowrap ${
                              active
                                ? "text-white font-semibold"
                                : "text-[#9aa6b5] hover:text-white"
                            }`}
                            onMouseEnter={(e) => moveTo(e.currentTarget)}
                            onFocus={(e) => moveTo(e.currentTarget)}
                          >
                            {item.name}
                            <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                            {active && (
                              <span className="absolute left-1/2 bottom-[3px] w-1.5 h-1.5 -ml-[3px] rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                            )}
                          </button>
                          <ul className="absolute left-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                            <div className="bg-black/90 border border-neutral-800 rounded-xl overflow-hidden shadow-xl backdrop-blur-xl">
                              {item.dropdown.map((sub, si) => (
                                <li
                                  key={si}
                                  className="border-b border-neutral-800 last:border-none"
                                >
                                  <Link
                                    href={sub.path}
                                    className="block px-4 py-3 text-sm text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </div>
                          </ul>
                        </>
                      ) : (
                        <Link
                          href={item.path}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className={`${
                            active ? "quest-active " : ""
                          }relative z-10 flex items-center gap-1.5 px-4 md:px-5 lg:px-6 py-2 md:py-2.5 rounded-full text-sm lg:text-[0.94rem] font-medium transition-colors whitespace-nowrap ${
                            active
                              ? "text-white font-semibold"
                              : "text-[#9aa6b5] hover:text-white"
                          }`}
                          onMouseEnter={(e) => moveTo(e.currentTarget)}
                          onFocus={(e) => moveTo(e.currentTarget)}
                          onClick={(e) => {
                            spawnSparks(e, e.currentTarget);
                            moveTo(e.currentTarget);
                          }}
                        >
                          {item.name}
                          {active && (
                            <span className="absolute left-1/2 bottom-[3px] w-1.5 h-1.5 -ml-[3px] rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                          )}
                          {item.external && (
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          )}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* CTA "Contact Us" button */}
              {ctaItem && (
                <Link
                  href={ctaItem.path}
                  className={`relative inline-flex items-center gap-2 px-5 lg:px-6 py-2 md:py-2.5 rounded-full text-sm lg:text-[0.94rem] font-semibold whitespace-nowrap ml-2 transition-all duration-200 overflow-hidden ${
                    isItemActive(ctaItem)
                      ? "bg-cyan-400/10 text-white border border-cyan-400/25 shadow-none"
                      : "bg-cyan-400 text-[#021018] shadow-[0_4px_14px_-6px_rgba(34,211,238,.4)] hover:-translate-y-px hover:shadow-[0_6px_18px_-6px_rgba(34,211,238,.5)] active:scale-[.94]"
                  }`}
                  onClick={(e) => spawnSparks(e, e.currentTarget)}
                >
                  Contact Us
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              )}
            </nav>
          </div>

          {/* ── 3. Right Corner: High-Tech Frosted Glass Hamburger Button ── */}
          <div className="md:hidden flex items-center flex-shrink-0 z-20">
            <button
              className="pointer-events-auto group relative w-12 h-12 rounded-full border border-cyan-400/30 bg-black/75 backdrop-blur-2xl cursor-pointer text-white flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all duration-300 active:scale-90"
              aria-label={sheetOpen ? "Close menu" : "Open menu"}
              aria-expanded={sheetOpen}
              onClick={() => setSheetOpen((o) => !o)}
            >
              {/* Outer subtle glow ring */}
              <span className="absolute inset-0 rounded-full bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* 3 Morphing lines */}
              <span
                className="absolute left-3.5 right-3.5 h-[2px] bg-white group-hover:bg-cyan-300 rounded-full transition-all duration-300"
                style={{
                  top: sheetOpen ? "23px" : "16px",
                  transform: sheetOpen ? "rotate(45deg)" : "none",
                }}
              />
              <span
                className="absolute left-3.5 right-3.5 h-[2px] bg-cyan-400 rounded-full transition-all duration-300"
                style={{
                  top: "23px",
                  opacity: sheetOpen ? 0 : 1,
                  transform: sheetOpen ? "scaleX(0.2)" : "scaleX(1)",
                }}
              />
              <span
                className="absolute left-3.5 right-3.5 h-[2px] bg-white group-hover:bg-cyan-300 rounded-full transition-all duration-300"
                style={{
                  top: sheetOpen ? "23px" : "30px",
                  transform: sheetOpen ? "rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── 4. Next-Gen Full-Screen Cyber-Glass Mobile Navigation Menu ──────── */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-[10005] md:hidden flex flex-col justify-between overflow-hidden bg-[#040711]/95 backdrop-blur-3xl text-white select-none"
          >
            {/* Ambient background glows */}
            <div
              aria-hidden="true"
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(34,211,238,0.20) 0%, rgba(14,165,233,0.06) 50%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(34,211,238,0.14) 0%, rgba(6,182,212,0.04) 50%, transparent 70%)",
                filter: "blur(70px)",
              }}
            />

            {/* Subtle background tech grid */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* ── Menu Header Bar ─────────────────────────────────────────── */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-4 border-b border-white/10">
              <Link
                href="/"
                onClick={() => setSheetOpen(false)}
                className="flex items-center gap-3 group"
              >
                <Image
                  src="/images/logo-navbar.webp"
                  width={398}
                  height={138}
                  alt="Quest IT"
                  unoptimized
                  className="h-9 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                />
              </Link>

              <div className="flex items-center gap-3">
                {/* Live cell status pill */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-300 font-mono text-[11px] tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  QUEST-IT // 2026
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSheetOpen(false)}
                  className="p-2.5 rounded-full border border-white/15 bg-white/5 hover:border-cyan-400 hover:text-cyan-400 text-white transition-all active:scale-90"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── Main Navigation List with Staggered Slide-In ─────────────── */}
            <nav className="relative z-10 flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-center">
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.045, delayChildren: 0.1 },
                  },
                }}
                className="space-y-1.5 max-w-lg mx-auto w-full"
              >
                {menu.map((item, i) => {
                  const active = isItemActive(item);
                  const Icon = MENU_ICONS[item.name] || Sparkles;

                  return (
                    <motion.li
                      key={item.name}
                      variants={{
                        hidden: { opacity: 0, x: -30, filter: "blur(8px)" },
                        visible: {
                          opacity: 1,
                          x: 0,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.45,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                    >
                      <Link
                        href={item.path}
                        onClick={() => setSheetOpen(false)}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className={`group relative flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
                          active
                            ? "bg-cyan-500/15 border border-cyan-400/40 text-white shadow-[0_0_24px_rgba(34,211,238,0.2)]"
                            : "hover:bg-white/[0.06] border border-transparent hover:border-white/10 text-neutral-300 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Number index */}
                          <span className="font-mono text-xs text-cyan-400/70 font-semibold w-5">
                            {String(i + 1).padStart(2, "0")}
                          </span>

                          {/* Frosted icon square */}
                          <div
                            className={`p-2 rounded-xl transition-all duration-300 ${
                              active
                                ? "bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                                : "bg-white/5 text-neutral-400 group-hover:text-cyan-400 group-hover:bg-cyan-400/10 group-hover:border group-hover:border-cyan-400/30"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          {/* Item Name */}
                          <span className="text-xl sm:text-2xl font-semibold tracking-tight">
                            {item.name}
                          </span>
                        </div>

                        {/* Right indicator */}
                        <div className="flex items-center gap-2">
                          {active && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                              Active
                            </span>
                          )}
                          <ChevronRight
                            className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${
                              active
                                ? "text-cyan-400"
                                : "text-neutral-500 group-hover:text-cyan-400"
                            }`}
                          />
                        </div>
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>

            {/* ── Menu Footer Section (CTA + Social Links) ────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
              className="relative z-10 px-6 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] border-t border-white/10 bg-black/40 backdrop-blur-xl"
            >
              <div className="max-w-lg mx-auto w-full flex flex-col gap-3">
                {/* Contact CTA Card */}
                <Link
                  href="/#contact"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-transparent border border-cyan-400/30 hover:border-cyan-400 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-cyan-400/20 text-cyan-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        Have a Question or Idea?
                      </div>
                      <div className="text-[11px] text-cyan-400/80">
                        Get in touch with the QuestIT team &rarr;
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>

                {/* Social icons row + footer branding */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <a
                      href="https://github.com/QuestIT-Cell"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-400/10 text-neutral-300 hover:text-cyan-400 transition-all"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/questit-vesit"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-400/10 text-neutral-300 hover:text-cyan-400 transition-all"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href="https://www.instagram.com/questit_cell?igsh=MWgzNGdzYnUxanF5Yg=="
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-400/10 text-neutral-300 hover:text-cyan-400 transition-all"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>

                  <p className="font-mono text-[10px] text-neutral-500 tracking-wider">
                    QUEST IT CELL © {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
