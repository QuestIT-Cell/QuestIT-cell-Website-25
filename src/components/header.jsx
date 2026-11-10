"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, ExternalLink } from "lucide-react";
import menu from "@/constants/menu";

/* ─── Sliding-pill indicator helper ──────────────────────────────────────── */
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

/* ─── Header ─────────────────────────────────────────────────────────────── */
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

  /* ─── Recalculate on font ready or window resize ──────────────────────── */
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

  /* ─── Lock scroll when mobile sheet is open ───────────────────────────── */
  useEffect(() => {
    if (sheetOpen) {
      const y = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.body.style.cssText = `overflow:hidden;position:fixed;top:-${y}px;width:100%;touch-action:none`;
      document.body.dataset.scrollY = String(y);
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
  const sheetLinks = menu;

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes questSparkAnim{
          0%{transform:translate(0,0) scale(1);opacity:1}
          100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}
        }
        @keyframes questNavSpin{to{--quest-a:360deg}}
        @property --quest-a{syntax:'<angle>';inherits:false;initial-value:0deg}
      `}</style>

      {/* ── 1. Top-Left Corner: Quest IT Logo & Text (Pushed to the corner) ── */}
      <div
        className="fixed top-0 left-0 z-[10001] pointer-events-none"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)",
          paddingLeft: "clamp(10px, 1.5vw, 24px)",
          transition: isHidden
            ? "transform .55s cubic-bezier(.65,0,.35,1), opacity .35s .1s, filter .45s"
            : "transform .7s cubic-bezier(.34,1.5,.64,1), opacity .4s, filter .5s",
          transform: isHidden ? "translateY(-140%) scale(.9)" : "translateY(0) scale(1)",
          opacity: isHidden ? 0 : 1,
          filter: isHidden ? "blur(10px)" : "none",
        }}
      >
        <Link
          href="/"
          aria-label="Quest IT Home"
          className="pointer-events-auto block transition-transform duration-200 hover:scale-[1.03] active:scale-95"
        >
          <Image
            priority
            src="/images/logo-460.webp"
            alt="Quest IT Logo"
            width={240}
            height={126}
            unoptimized
            className="w-[150px] sm:w-[175px] md:w-[200px] lg:w-[230px] h-auto object-contain filter drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]"
          />
        </Link>
      </div>

      {/* ── 2. Top-Right Corner: Mobile Menu Button (Pushed to the corner) ── */}
      <div
        className="md:hidden fixed top-0 right-0 z-[10001] pointer-events-none"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)",
          paddingRight: "clamp(10px, 1.5vw, 20px)",
          transition: isHidden
            ? "transform .55s cubic-bezier(.65,0,.35,1), opacity .35s .1s, filter .45s"
            : "transform .7s cubic-bezier(.34,1.5,.64,1), opacity .4s, filter .5s",
          transform: isHidden ? "translateY(-140%) scale(.9)" : "translateY(0) scale(1)",
          opacity: isHidden ? 0 : 1,
          filter: isHidden ? "blur(10px)" : "none",
        }}
      >
        <button
          className="pointer-events-auto relative w-11 h-11 rounded-full border border-white/20 bg-black/75 backdrop-blur-xl cursor-pointer text-white flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.7)] transition-all active:scale-90 hover:border-cyan-400/50"
          aria-label="Menu"
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen((o) => !o)}
        >
          <span
            className="absolute left-3 right-3 h-0.5 bg-current rounded-sm transition-all duration-300"
            style={{
              top: sheetOpen ? "21px" : "15px",
              transform: sheetOpen ? "rotate(45deg)" : "none",
            }}
          />
          <span
            className="absolute left-3 right-3 h-0.5 bg-current rounded-sm transition-all duration-300"
            style={{
              top: "21px",
              opacity: sheetOpen ? 0 : 1,
            }}
          />
          <span
            className="absolute left-3 right-3 h-0.5 bg-current rounded-sm transition-all duration-300"
            style={{
              top: sheetOpen ? "21px" : "27px",
              transform: sheetOpen ? "rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* ── 3. Desktop Floating Pill Navbar (Increased Length & Grand Appearance) ─ */}
      <header
        ref={wrapRef}
        className="hidden md:flex fixed top-0 left-0 right-0 z-[10000] justify-center pointer-events-none"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)",
          paddingInline: "16px",
          transition: isHidden
            ? "transform .55s cubic-bezier(.65,0,.35,1), opacity .35s .1s, filter .45s"
            : "transform .7s cubic-bezier(.34,1.5,.64,1), opacity .4s, filter .5s",
          transform: isHidden ? "translateY(-140%) scale(.9)" : "translateY(0) scale(1)",
          opacity: isHidden ? 0 : 1,
          filter: isHidden ? "blur(10px)" : "none",
        }}
      >
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
          {/* Animated conic cyan hairline */}
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

          {/* Inner top-gloss sheen */}
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
      </header>

      {/* ── 4. Mobile Full-Screen Sheet (No Duplicate Logo) ──────────────── */}
      <div
        className="fixed inset-0 z-[9999] md:hidden flex flex-col justify-center items-center gap-3 px-6"
        style={{
          background: "rgba(10,14,22,.96)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          clipPath: sheetOpen
            ? "circle(150% at calc(100% - 35px) 35px)"
            : "circle(0 at calc(100% - 35px) 35px)",
          visibility: sheetOpen ? "visible" : "hidden",
          transition: sheetOpen
            ? "clip-path .8s cubic-bezier(.77,0,.18,1), visibility 0s"
            : "clip-path .75s cubic-bezier(.77,0,.18,1), visibility 0s .75s",
        }}
      >
        {sheetLinks.map((item, i) => {
          const active = isItemActive(item);
          return (
            <Link
              key={i}
              href={item.path}
              onClick={() => setSheetOpen(false)}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={`text-[1.8rem] font-semibold px-5 py-2 transition-colors flex items-center gap-3 ${
                active ? "text-cyan-400" : "text-white hover:text-cyan-400"
              }`}
              style={{
                transform: sheetOpen ? "none" : "translateY(36px) scale(.92)",
                opacity: sheetOpen ? 1 : 0,
                filter: sheetOpen ? "none" : "blur(6px)",
                transition: sheetOpen
                  ? `transform .7s cubic-bezier(.22,1,.36,1) ${
                      0.25 + i * 0.05
                    }s, opacity .5s ${0.25 + i * 0.05}s, filter .5s ${
                      0.25 + i * 0.05
                    }s, color .2s`
                  : "transform .3s, opacity .25s, filter .25s, color .2s",
              }}
            >
              {item.name}
              {active && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              )}
              {item.external && (
                <ExternalLink className="inline w-4 h-4 ml-1 opacity-50" />
              )}
            </Link>
          );
        })}

        <p className="absolute bottom-6 text-neutral-500 text-xs tracking-wider">
          © {new Date().getFullYear()} QUEST IT
        </p>
      </div>
    </>
  );
};

export default Header;
