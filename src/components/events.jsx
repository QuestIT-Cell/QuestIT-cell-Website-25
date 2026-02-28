"use client";

// Next's Imports
import Link from "next/link";

// React's Imports
import { useId, useRef, useState, useEffect } from "react";

// Confetti Import
import confetti from "canvas-confetti";

// Next's Imports
import Image from "next/image";

// App's Internal Imports
import { Button } from "@/components/ui/button";
import useOutsideClick from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

// App's External Imports
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CalendarRange, ExternalLink } from "lucide-react";
import events from "@/constants/events";

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      width="24"
      fill="none"
      height="24"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      stroke="currentColor"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const Events = ({ featured = false }) => {
  const id = useId();
  const ref = useRef(null);
  const [active, set_active] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

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
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
      
      // Trigger confetti for GENESIS 2026
      if (active.title === "GENESIS 2026") {
        triggerConfetti();
      }
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", on_key_down);
    return () => window.removeEventListener("keydown", on_key_down);
  }, [active]);

  return (
    <div id="events">
      {featured && (
        <TypewriterEffect words={words} className="pt-5 md:pt-10 pb-16" />
      )}

      <>
        <AnimatePresence>
          {active && typeof active === "object" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 h-full w-full z-10"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active && typeof active === "object" ? (
            <div className="fixed inset-0  grid place-items-center z-[11000]">
              <motion.button
                key={`button-${active.title}-${id}`}
                layout
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.05,
                  },
                }}
                className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                onClick={() => set_active(null)}
              >
                <CloseIcon />
              </motion.button>

              <motion.div
                ref={ref}
                layoutId={`event-${active.title}-${id}`}
                className={cn(
                  "w-full max-w-[500px] h-full md:h-fit md:max-h-[100%] flex flex-col bg-neutral-900 sm:rounded-3xl overflow-hidden relative",
                  active.title === "GENESIS 2026" && "bg-cyan-600 shadow-[0_0_40px_rgba(6,182,212,0.6)]"
                )}
              >
                <motion.div>
                  <Image
                    priority
                    unoptimized
                    width={200}
                    height={200}
                    src={active.image}
                    alt={active.title}
                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                  />
                </motion.div>

                <div>
                  <div className="flex flex-col justify-between items-start p-4 gap-1">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className={cn(
                        "font-medium text-neutral-200 text-xl",
                        active.title === "GENESIS 2026" && "text-white"
                      )}
                    >
                      {active.title}
                    </motion.h3>

                    <div className="flex items-center gap-4 w-full">
                      <motion.p
                        className={cn(
                          "text-neutral-400 text-center md:text-left text-base flex gap-2 items-center",
                          active.title === "GENESIS 2026" && "text-white/90"
                        )}
                      >
                        <CalendarRange size={20} className={cn(active.title === "GENESIS 2026" && "text-white")} /> {active.date}
                      </motion.p>

                      {active.website && (
                        <Link
                          href={active.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-base",
                            active.title === "GENESIS 2026" && "text-white hover:text-white/80 underline decoration-white/30"
                          )}
                        >
                          <ExternalLink size={16} />
                          <span>Genesis Website</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 md:pt-2 relative px-4">
                    <motion.div
                      layout
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "text-base flex-1 h-full max-h-[50vh] md:max-h-[60vh] pb-5 text-ellipsis flex flex-col items-start gap-4 overflow-y-auto text-neutral-400",
                        active.title === "GENESIS 2026" && "text-white/90"
                      )}
                    >
                      {active.description}

                      {active.speakers && active.speakers.length > 0 && (
                        <>
                          <motion.h3
                            className={cn(
                              "font-medium text-neutral-200 text-xl mt-4",
                              active.title === "GENESIS 2026" && "text-white"
                            )}
                          >
                            Speakers
                          </motion.h3>

                          <div className="pt-4 flex flex-row items-center gap-2 w-full">
                            <div className="flex flex-row -space-x-3">
                              <AnimatedTooltip items={active.speakers} />
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>

        <ul className="w-full max-w-none px-4 md:px-10 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-4">
          {events
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((event, index) => {
              if (featured && index < 6) {
                return (
                  <motion.div
                    key={index}
                    onClick={() => set_active(event)}
                    layoutId={`event-${event.title}-${id}`}
                    className={cn(
                      "p-4 flex flex-col hover:bg-neutral-900 rounded-xl cursor-pointer",
                      event.title === "GENESIS 2026" && "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                    )}
                  >
                    <div className="flex gap-4 flex-col w-full">
                      <motion.div>
                        <Image
                          width={100}
                          unoptimized
                          height={100}
                          src={event.image}
                          alt={event.title}
                          className="h-60 w-full rounded-lg object-cover object-top"
                        />
                      </motion.div>

                      <div className="flex justify-center items-center flex-col gap-1">
                        <motion.h3
                          layoutId={`title-${event.title}-${id}`}
                          className={cn(
                            "font-medium text-neutral-200 text-center md:text-left text-xl",
                            event.title === "GENESIS 2026" && "text-white"
                          )}
                        >
                          {event.title}
                        </motion.h3>

                        <motion.p
                          className={cn(
                            "text-neutral-400 text-center md:text-left text-base flex gap-2 items-center",
                            event.title === "GENESIS 2026" && "text-white/90"
                          )}
                        >
                          <CalendarRange size={20} className={cn(event.title === "GENESIS 2026" && "text-white")} /> {event.date}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (!featured) {
                return (
                  <motion.div
                    key={index}
                    onClick={() => set_active(event)}
                    layoutId={`event-${event.title}-${id}`}
                    className={cn(
                      "ml-4 p-4 flex flex-col hover:bg-neutral-900 rounded-xl cursor-pointer",
                      event.title === "GENESIS 2026" && "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                    )}
                  >
                    <div className="flex gap-4 flex-col w-full">
                      <motion.div>
                        <Image
                          width={100}
                          unoptimized
                          height={100}
                          src={event.image}
                          alt={event.title}
                          className="h-60 w-full rounded-lg object-cover object-top"
                        />
                      </motion.div>

                      <div className="flex justify-center items-center flex-col gap-1">
                        <motion.h3
                          layoutId={`title-${event.title}-${id}`}
                          className={cn(
                            "font-medium text-neutral-200 text-center md:text-left text-xl",
                            event.title === "GENESIS 2026" && "text-white"
                          )}
                        >
                          {event.title}
                        </motion.h3>

                        <motion.p
                          className={cn(
                            "text-neutral-400 text-center md:text-left text-base flex gap-2 items-center",
                            event.title === "GENESIS 2026" && "text-white/90"
                          )}
                        >
                          <CalendarRange size={20} className={cn(event.title === "GENESIS 2026" && "text-white")} /> {event.date}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                );
              }
            })}
        </ul>

        {featured && (
          <div className="flex justify-center items-center mt-8 md:mt-12 mb-12 md:mb-16">
            <Link href="/events">
              <Button className="px-8 py-4 text-lg bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition duration-200 shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
                Explore More Events <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </>
    </div>
  );
};

export { Events };