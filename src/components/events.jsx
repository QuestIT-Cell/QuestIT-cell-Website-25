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

// Helper checks for Genesis hackathon iterations
const isGenesis1 = (title) => title === "GENESIS 2026" || title === "GENESIS 1.0" || title === "Genesis 1.0";
const isGenesis2 = (title) => title === "GENESIS 2.0" || title === "Genesis 2.0";
const isGenesis = (title) => isGenesis1(title) || isGenesis2(title);

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
  id,
  modalRef,
}) => {
  if (!active || typeof active !== "object") return null;

  return (
    <>
      <motion.div
        key="event-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[11000] touch-none"
        onClick={() => set_active(null)}
        onTouchMove={(e) => e.preventDefault()}
      />

      <div className="fixed inset-0 grid place-items-center z-[11001] p-3 sm:p-6 pointer-events-none">
        <motion.div
          ref={modalRef}
          layoutId={`event-${active.title}-${id}`}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "pointer-events-auto w-[92%] sm:w-full max-w-[480px] max-h-[84vh] sm:max-h-[88vh] flex flex-col bg-neutral-900 rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_12px_45px_rgba(0,0,0,0.85)] overflow-hidden relative select-none",
            isGenesis1(active.title) && "bg-cyan-950/95 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.4)]",
            isGenesis2(active.title) && "bg-neutral-900 border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.4)]"
          )}
        >
          {/* Image & Floating Navigation Controls */}
          <div className="relative w-full h-44 sm:h-56 md:h-60 flex-shrink-0 bg-neutral-950 overflow-hidden">
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
          <div className="px-4 sm:px-5 pt-3.5 pb-1 flex-shrink-0">
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
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors text-xs sm:text-sm font-medium"
                >
                  <Trophy size={14} />
                  <span>Vibe W Quest Winners 🏆</span>
                </Link>
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
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-2.5 space-y-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
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
            {isGenesis2(active.title) && active.website && (
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Link href="/genesis-2-winners" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-600 hover:from-yellow-500 hover:to-amber-700 text-white font-semibold py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                    <Trophy size={16} />
                    Genesis 2.0 Winners 🏆
                  </Button>
                </Link>
                <Link href={active.website} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                    <ExternalLink size={16} />
                    Explore Genesis 2.0
                  </Button>
                </Link>
              </div>
            )}

            {isGenesis1(active.title) && active.website && (
              <div className="pt-2">
                <Link href={active.website} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                    <ExternalLink size={16} />
                    Explore Genesis 1.0
                  </Button>
                </Link>
              </div>
            )}

            {active.title === "Vibe W Quest" && (
              <div className="pt-2">
                <Link href="/vibe-w-quest-winners">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
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
  );
};

const Events = ({ featured = false }) => {
  const id = useId();
  const ref = useRef(null);
  const [active, set_active] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Memoize sorted featured events so we don't mutate imported events array or re-sort every render
  const sortedFeaturedEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => parseEventDate(b.date) - parseEventDate(a.date))
      .slice(0, 6);
  }, []);

  // Events list available for modal navigation
  const activeEventsList = useMemo(() => {
    return featured ? sortedFeaturedEvents : events;
  }, [featured, sortedFeaturedEvents]);

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
              active?.title === event.title ? (
                <motion.div
                  key={index}
                  layoutId={`event-${event.title}-${id}`}
                  className="h-60 w-full"
                />
              ) : (
                <motion.div
                  key={index}
                  onClick={() => set_active(event)}
                  layoutId={`event-${event.title}-${id}`}
                  className={cn(
                    "p-4 flex flex-col hover:bg-neutral-900 rounded-xl cursor-pointer",
                    isGenesis1(event.title) && "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)]",
                    isGenesis2(event.title) && "bg-orange-600 hover:bg-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                  )}
                >
                  <div className="flex gap-4 flex-col w-full">
                    <div>
                      <Image
                        width={100}
                        unoptimized
                        height={100}
                        src={get_event_image(event.image)}
                        alt={event.title}
                        className="h-60 w-full rounded-lg object-cover object-top"
                      />
                    </div>

                    <div className="flex justify-center items-center flex-col gap-1">
                      <h3
                        className={cn(
                          "font-medium text-neutral-200 text-center md:text-left text-xl",
                          isGenesis(event.title) && "text-white"
                        )}
                      >
                        {event.title}
                      </h3>

                      <p
                        className={cn(
                          "text-neutral-400 text-center md:text-left text-base flex gap-2 items-center",
                          isGenesis(event.title) && "text-white/90"
                        )}
                      >
                        <CalendarRange size={20} className={cn(isGenesis(event.title) && "text-white")} /> {event.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
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
                active?.title === event.title ? (
                  <motion.div
                    key={index}
                    layoutId={`event-${event.title}-${id}`}
                    className="h-48 sm:h-56 md:h-60 w-full"
                  />
                ) : (
                  <motion.div
                    key={index}
                    onClick={() => set_active(event)}
                    layoutId={`event-${event.title}-${id}`}
                    className={cn(
                      "p-3 sm:p-4 flex flex-col hover:bg-neutral-900 rounded-xl cursor-pointer transition-all",
                      isGenesis1(event.title) && "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)]",
                      isGenesis2(event.title) && "bg-orange-600 hover:bg-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                    )}
                  >
                    <div className="flex gap-3 sm:gap-4 flex-col w-full">
                      <div>
                        <Image
                          width={100}
                          unoptimized
                          height={100}
                          src={get_event_image(event.image)}
                          alt={event.title}
                          className="h-48 sm:h-56 md:h-60 w-full rounded-lg object-cover object-top"
                        />
                      </div>

                      <div className="flex justify-center items-center flex-col gap-1">
                        <h3
                          className={cn(
                            "font-medium text-neutral-200 text-center md:text-left text-lg sm:text-xl",
                            isGenesis(event.title) && "text-white"
                          )}
                        >
                          {event.title}
                        </h3>

                        <p
                          className={cn(
                            "text-neutral-400 text-center md:text-left text-sm sm:text-base flex gap-1.5 sm:gap-2 items-center",
                            isGenesis(event.title) && "text-white/90"
                          )}
                        >
                          <CalendarRange size={18} className={cn("sm:w-5 sm:h-5", isGenesis(event.title) && "text-white")} /> {event.date}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
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