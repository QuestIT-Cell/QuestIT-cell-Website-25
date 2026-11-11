"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ExternalLink } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import menu from "@/constants/menu";
import "@/styles/hamburger-menu.css";

/* ─── Mobile Navigation Items with Uniform Theme & Lucide SVG Icons ───────── */
const MOBILE_NAV_ITEMS = [
  {
    name: "Home",
    path: "/#home",
    iconSvg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    name: "About",
    path: "/#about",
    iconSvg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
  {
    name: "Events",
    path: "/events",
    iconSvg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    name: "Gallery",
    path: "/gallery",
    iconSvg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
  },
  {
    name: "Team",
    path: "/team",
    iconSvg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    name: "Developers",
    path: "/developers",
    iconSvg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </svg>
    ),
  },
  {
    name: "Contact Us",
    path: "/contact",
    isGlow: true,
    iconSvg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
        <rect x="2" y="4" width="20" height="16" rx="2" />
      </svg>
    ),
  },
];

const TOTAL_MOBILE_ITEMS = MOBILE_NAV_ITEMS.length + 1;

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

/* ─── Spark burst on click (desktop & mobile) ────────────────────────────── */
function spawnSparks(e, container) {
  if (!container) return;
  const r = container.getBoundingClientRect();
  const clientX =
    e?.clientX ||
    (e?.touches && e.touches[0]?.clientX) ||
    r.left + r.width / 2;
  const clientY =
    e?.clientY ||
    (e?.touches && e.touches[0]?.clientY) ||
    r.top + r.height / 2;
  const x = clientX - r.left;
  const y = clientY - r.top;

  for (let i = 0; i < 12; i++) {
    const p = document.createElement("span");
    const ang = (i / 12) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 28 + Math.random() * 26;
    p.style.cssText = `
      position:absolute;width:5px;height:5px;margin:-2.5px;border-radius:50%;
      background:#22d3ee;box-shadow:0 0 8px #22d3ee, 0 0 16px rgba(34,211,238,0.85);
      pointer-events:none;z-index:25;
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
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  // Mobile menu exit animation state
  const [clickedIndex, setClickedIndex] = useState(null);
  const [isItemExiting, setIsItemExiting] = useState(false);

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

  /* ─── Route & Hash synchronization on page navigation ────────────────── */
  useEffect(() => {
    if (pathname === "/" || pathname === "") {
      const hash = (typeof window !== "undefined" ? window.location.hash : "").replace("#", "");
      if (hash === "about") {
        setActiveId("about");
        setTimeout(() => {
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }, 80);
      } else if (hash === "contact") {
        setActiveId("contact");
        setTimeout(() => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }, 80);
      } else {
        setActiveId("home");
        if (typeof window !== "undefined" && window.scrollY > 0 && (hash === "home" || !hash)) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
  }, [pathname]);

  /* ─── Scroll behaviour: hide on down, show on up, precise section spy ─── */
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

      // Precise Section spy: only mark the section currently present in viewport
      if (pathname === "/" || pathname === "") {
        // If near the top of the home page, it is strictly "home"
        if (y < 120) {
          setActiveId("home");
          return;
        }

        // If scrolled to the bottom of the page, it is "contact"
        const scrollBottom = window.innerHeight + y;
        const docHeight = document.documentElement.scrollHeight;
        if (docHeight - scrollBottom < 80) {
          const contactEl = document.getElementById("contact");
          if (contactEl) {
            setActiveId("contact");
            return;
          }
        }

        // Check which section is actively occupying the focal viewport
        const focalY = window.innerHeight * 0.35;
        const sections = [
          { id: "contact", el: document.getElementById("contact") },
          { id: "about", el: document.getElementById("about") },
          { id: "home", el: document.getElementById("home") },
        ];

        let matchedId = null;
        for (const sec of sections) {
          if (!sec.el) continue;
          const rect = sec.el.getBoundingClientRect();
          if (rect.top <= focalY && rect.bottom > focalY) {
            matchedId = sec.id;
            break;
          }
        }

        if (matchedId) {
          setActiveId(matchedId);
        } else if (y < window.innerHeight * 0.8) {
          setActiveId("home");
        }
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

  /* ─── Sync html.qm-open class, Esc key, and resize listener ──────────── */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("qm-open", sheetOpen);

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && sheetOpen) {
        setSheetOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 769 && sheetOpen) {
        setSheetOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      root.classList.remove("qm-open");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [sheetOpen]);

  /* ─── Hamburger click: toggle mobile menu ──────────────────────────────── */
  const handleBurgerClick = () => {
    if (isItemExiting) return;
    setClickedIndex(null);
    setIsItemExiting(false);
    setSheetOpen((prev) => !prev);
  };

  /* ─── Desktop navigation link click handler ───────────────────────────── */
  const handleDesktopNavClick = (e, item) => {
    if (item.path.startsWith("/#")) {
      const hash = item.path.split("#")[1];
      setActiveId(hash);

      if (pathname === "/" || pathname === "") {
        e.preventDefault();
        if (hash === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          window.history.pushState(null, "", "/#home");
        } else {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", `/#${hash}`);
          }
        }
      }
    }
  };

  /* ─── Mobile menu link click: first clicked button moves outside, then all others follow ─ */
  const handleMobileNavClick = (e, item, index) => {
    e.preventDefault();
    if (isItemExiting) return;

    spawnSparks(e, e.currentTarget);
    setClickedIndex(index);
    setIsItemExiting(true);

    setTimeout(() => {
      setSheetOpen(false);
      setIsItemExiting(false);
      setClickedIndex(null);

      if (item.path.startsWith("/#")) {
        const hash = item.path.split("#")[1];
        setActiveId(hash);

        if (pathname === "/" || pathname === "") {
          if (hash === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.pushState(null, "", "/#home");
          } else {
            const el = document.getElementById(hash);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              window.history.pushState(null, "", `/#${hash}`);
            } else {
              window.location.hash = hash;
            }
          }
        } else {
          router.push(item.path);
        }
      } else {
        router.push(item.path);
      }
    }, 460);
  };

  /* ─── Mobile social link click: first social pill moves outside, then rest follow ─ */
  const handleSocialClick = (e, href) => {
    e.preventDefault();
    if (isItemExiting) return;

    spawnSparks(e, e.currentTarget);
    setClickedIndex(MOBILE_NAV_ITEMS.length);
    setIsItemExiting(true);

    setTimeout(() => {
      setSheetOpen(false);
      setIsItemExiting(false);
      setClickedIndex(null);
      window.open(href, "_blank", "noopener,noreferrer");
    }, 460);
  };

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
        className="fixed top-0 left-0 right-0 z-[10010] pointer-events-none px-4 sm:px-6 md:px-8 lg:px-12"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
          transition: isHidden
            ? "transform .55s cubic-bezier(.65,0,.35,1), opacity .35s .1s, filter .45s"
            : "transform .7s cubic-bezier(.34,1.5,.64,1), opacity .4s, filter .5s",
          transform: isHidden && !sheetOpen ? "translateY(-140%) scale(.9)" : "translateY(0) scale(1)",
          opacity: isHidden && !sheetOpen ? 0 : 1,
          filter: isHidden && !sheetOpen ? "blur(10px)" : "none",
        }}
      >
        <div className="relative w-full flex items-center justify-between min-h-[50px] md:min-h-[54px]">
          {/* 1. Left Corner: Quest IT Logo (Sole logo in both desktop & mobile) */}
          <div className="flex items-center flex-shrink-0 z-20">
            <Link
              href="/"
              aria-label="Quest IT Home"
              onClick={() => {
                setActiveId("home");
                setSheetOpen(false);
                if (pathname === "/" || pathname === "") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
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

          {/* 2. Center: Desktop Floating Pill Navbar (Perfect horizontal alignment & concentric capsule curvature) */}
          <div className="hidden md:flex absolute inset-x-0 justify-center items-center pointer-events-none z-10">
            <nav
              className="pointer-events-auto relative flex items-center gap-1.5 md:gap-2 lg:gap-2.5 max-w-[96vw]"
              style={{
                width: "fit-content",
                padding: "6px 8px",
                borderRadius: "9999px",
                background:
                  "linear-gradient(135deg,rgba(255,255,255,.14),rgba(255,255,255,.03) 50%,rgba(255,255,255,.14)),rgba(12,16,24,.8)",
                border: "1px solid rgba(255,255,255,.2)",
                backdropFilter: "blur(30px) saturate(120%) brightness(1.04)",
                WebkitBackdropFilter: "blur(30px) saturate(120%) brightness(1.04)",
                boxShadow:
                  "0 16px 48px -14px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.35), inset 0 -1px 0 rgba(255,255,255,.08), inset 0 0 22px rgba(255,255,255,.05)",
                transition: "padding .3s",
              }}
            >
              {/* Very thin, sleek luminous glowing line moving on navbar boundary */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "-1px",
                  borderRadius: "inherit",
                  pointerEvents: "none",
                  background:
                    "conic-gradient(from var(--quest-a,0deg), transparent 0 55%, rgba(34,211,238,0.25) 70%, #22d3ee 85%, #67e8f9 92%, #38bdf8 97%, transparent 100%)",
                  WebkitMask:
                    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "1px",
                  opacity: 0.9,
                  filter:
                    "drop-shadow(0 0 4px rgba(34,211,238,0.95)) drop-shadow(0 0 8px rgba(34,211,238,0.5))",
                  animation: "questNavSpin 5.5s linear infinite",
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
                className="relative flex items-center list-none p-0 gap-1 md:gap-1.5 lg:gap-2"
                onMouseLeave={() => {
                  const activeEl = listRef.current?.querySelector(".quest-active");
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
                    background: "rgba(34,211,238,.08)",
                    border: "1px solid rgba(34,211,238,.20)",
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
                            className={`${
                              active ? "quest-active " : ""
                            }relative z-10 flex items-center gap-1.5 px-4 md:px-5 lg:px-6 py-2 md:py-2.5 rounded-full text-sm lg:text-[0.94rem] font-medium transition-colors whitespace-nowrap overflow-hidden ${
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
                          }relative z-10 flex items-center gap-1.5 px-4 md:px-5 lg:px-6 py-2 md:py-2.5 rounded-full text-sm lg:text-[0.94rem] font-medium transition-colors whitespace-nowrap overflow-hidden ${
                            active
                              ? "text-white font-semibold"
                              : "text-[#9aa6b5] hover:text-white"
                          }`}
                          onMouseEnter={(e) => moveTo(e.currentTarget)}
                          onFocus={(e) => moveTo(e.currentTarget)}
                          onClick={(e) => {
                            spawnSparks(e, e.currentTarget);
                            moveTo(e.currentTarget);
                            handleDesktopNavClick(e, item);
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
                  className={`${
                    isItemActive(ctaItem) ? "quest-active " : ""
                  }relative inline-flex items-center gap-2 px-5 lg:px-6 py-2 md:py-2.5 rounded-full text-sm lg:text-[0.94rem] font-semibold whitespace-nowrap ml-2 transition-all duration-200 overflow-hidden ${
                    isItemActive(ctaItem)
                      ? "bg-cyan-400/10 text-white border border-cyan-400/25 shadow-none"
                      : "bg-cyan-400 text-[#021018] shadow-[0_4px_14px_-6px_rgba(34,211,238,.4)] hover:-translate-y-px hover:shadow-[0_6px_18px_-6px_rgba(34,211,238,.5)] active:scale-[.94]"
                  }`}
                  onClick={(e) => {
                    spawnSparks(e, e.currentTarget);
                    handleDesktopNavClick(e, ctaItem);
                  }}
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

          {/* ── 3. Right Corner: Human-Made Minimal 3-Line Morphing Button ───── */}
          <div className="md:hidden flex items-center flex-shrink-0 z-30">
            <button
              id="qmBurger"
              type="button"
              className="qm-burger pointer-events-auto"
              aria-label={sheetOpen ? "Close menu" : "Open menu"}
              aria-expanded={sheetOpen}
              aria-controls="qmMenu"
              onClick={handleBurgerClick}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-Screen Frosted Glass Backdrop (Blurs the Page Behind) ── */}
      <div
        className="qm-backdrop"
        aria-hidden="true"
        onClick={() => setSheetOpen(false)}
      />

      {/* ── 4. Mobile Cascading Glass Pills Navigation Menu ────────────── */}
      <nav
        id="qmMenu"
        className={`qm-menu ${isItemExiting ? "qm-exit-mode" : ""}`}
        aria-label="Mobile menu"
        onClick={(e) => {
          if (e.target.id === "qmMenu" && !isItemExiting) {
            setSheetOpen(false);
          }
        }}
      >
        {MOBILE_NAV_ITEMS.map((item, i) => {
          const active = isItemActive(item);
          const isGlow = item.isGlow;
          const isClicked = isItemExiting && clickedIndex === i;
          const isRest = isItemExiting && clickedIndex !== i;
          const dist = clickedIndex !== null ? Math.abs(i - clickedIndex) : i;

          return (
            <Link
              key={item.name}
              href={item.path}
              aria-current={active ? "true" : undefined}
              className={`qm-nav-link ${isGlow ? "qm-glow" : ""} ${
                isClicked ? "qm-first-exit" : isRest ? "qm-rest-exit" : ""
              }`}
              style={{
                "--i": i,
                "--n": TOTAL_MOBILE_ITEMS,
                "--dist": dist,
              }}
              onClick={(e) => handleMobileNavClick(e, item, i)}
            >
              <i>{item.iconSvg}</i>
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Social media glass pill */}
        <div
          className={`qm-social-pill ${
            isItemExiting && clickedIndex === MOBILE_NAV_ITEMS.length
              ? "qm-first-exit"
              : isItemExiting && clickedIndex !== MOBILE_NAV_ITEMS.length
              ? "qm-rest-exit"
              : ""
          }`}
          style={{
            "--i": MOBILE_NAV_ITEMS.length,
            "--n": TOTAL_MOBILE_ITEMS,
            "--dist":
              clickedIndex !== null
                ? Math.abs(MOBILE_NAV_ITEMS.length - clickedIndex)
                : MOBILE_NAV_ITEMS.length,
          }}
        >
          <i>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </i>
          <div className="qm-social-items">
            <a
              href="https://github.com/QuestIT-Cell"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="qm-social-btn"
              onClick={(e) => handleSocialClick(e, "https://github.com/QuestIT-Cell")}
            >
              <FaGithub className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/questit-vesit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="qm-social-btn"
              onClick={(e) =>
                handleSocialClick(
                  e,
                  "https://www.linkedin.com/company/questit-vesit"
                )
              }
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/questit_cell?igsh=MWgzNGdzYnUxanF5Yg=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="qm-social-btn"
              onClick={(e) =>
                handleSocialClick(
                  e,
                  "https://www.instagram.com/questit_cell?igsh=MWgzNGdzYnUxanF5Yg=="
                )
              }
            >
              <FaInstagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
