"use client";

// React's Imports
import { useEffect, useLayoutEffect, useRef } from "react";

// Next's Imports
import Image from "next/image";
import Link from "next/link";

// App's Internal Imports
import { Button } from "@/components/ui/button";
import genesis2_tracks from "@/constants/genesis2-winners";

// App's External Imports
import { motion, MotionConfig, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

const GENESIS_ORANGE = ["#f97316", "#fb923c", "#fbbf24", "#ffffff"];

const celebrate = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const defaults = { startVelocity: 30, spread: 360, ticks: 70, zIndex: 12000, colors: GENESIS_ORANGE };
  confetti({ ...defaults, particleCount: 80, origin: { x: 0.2, y: 0.3 } });
  confetti({ ...defaults, particleCount: 80, origin: { x: 0.8, y: 0.3 } });
};

const GenesisHeader = ({ heading, text }) => (
  <motion.div
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-center mb-14 mt-20"
  >
    <div className="flex justify-center items-center gap-3 sm:gap-4 mb-8">
      <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-orange-400" />
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600 bg-clip-text text-transparent">
        {heading}
      </h1>
      <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-orange-400" />
    </div>

    <div className="flex justify-center mb-8">
      <Image
        src="/images/Genesis2.0logo-600.webp"
        alt="Genesis 2.0 Logo"
        width={600}
        height={600}
        className="w-32 sm:w-40 h-auto object-contain"
        priority
      />
    </div>

    <p className="text-base md:text-xl text-neutral-300 max-w-3xl mx-auto">{text}</p>
  </motion.div>
);

// All three tracks, each card leads to that track's winners
export const Genesis2Tracks = () => {
  useEffect(() => {
    const timer = setTimeout(celebrate, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-black pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <GenesisHeader
            heading="Genesis 2.0 Winners"
            text="Three tracks, one 24-hour hackathon. Pick a track to meet the teams that built the best solutions. 🎉"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {genesis2_tracks.map((track, index) => (
              <motion.div
                key={track.slug}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * (index + 1), duration: 0.6 }}
              >
                <Link
                  href={`/genesis-2-winners/${track.slug}`}
                  className="group relative flex h-full flex-col rounded-2xl border-2 border-orange-500/40 bg-neutral-900 p-6 lg:p-8 shadow-lg shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/30"
                >
                  <span className="text-sm font-semibold tracking-[0.3em] text-orange-400">
                    TRACK {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-white">{track.name}</h2>
                  <p className="mt-3 flex-1 text-neutral-400">{track.tagline}</p>

                  <div className="mt-8 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-neutral-300">
                      <Trophy size={18} className="text-orange-400" />
                      {track.winners.length} winning teams
                    </span>
                    <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight size={20} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/events">
              <Button className="px-8 py-4 text-lg bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition duration-200 shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
};

const WIDTH_SHARE = 0.55;
// Lower = the team name slides in more slowly
const NAME_STIFFNESS = 40;

// Shrinks or grows the text so it spans about half the width of its box in one line
const FitText = ({ text, align_right, className = "" }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const box = el.parentElement;
    const fit = () => {
      el.style.fontSize = "100px";
      const width_at_100 = el.scrollWidth;
      if (!width_at_100 || !box.clientWidth) return;
      // Take up about half the width, and cap short names so they don't get taller than a fifth of the screen
      const size = Math.min((100 * box.clientWidth * WIDTH_SHARE) / width_at_100, window.innerHeight * 0.2);
      el.style.fontSize = `${size}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [text]);

  return (
    <span ref={ref} className={`${align_right ? "ml-auto" : ""} block w-max whitespace-nowrap ${className}`}>
      {text}
    </span>
  );
};

const WinnerPoster = ({ winner, track_name, number, on_right }) => {
  const ref = useRef(null);
  const reduce_motion = useReducedMotion();
  // While the photo slides up into view, the team name slides in from its own corner
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  // The spring makes the name trail behind the scroll, so it glides in slowly instead of racing the page
  const slow_progress = useSpring(scrollYProgress, { stiffness: NAME_STIFFNESS, damping: 20, restDelta: 0.001 });
  const name_x = useTransform(slow_progress, [0, 1], [on_right ? "100%" : "-100%", "0%"]);

  return (
    <section ref={ref} className="sticky top-0 flex h-svh w-full items-center justify-center px-4 sm:px-8 pt-20 pb-6">
      {/* The photo sits in a rounded frame; the next frame slides up over this one like a stack of prints */}
      <div className="relative h-full w-full max-w-6xl overflow-hidden rounded-2xl border border-orange-500/30 bg-neutral-900 shadow-2xl shadow-black/70">
        <div className="absolute inset-0">
          <Image
            src={winner.photo}
            alt={`${winner.team} - ${winner.place}, ${track_name}`}
            fill
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
        {/* Soft shade at the top and bottom so the white text stays readable on bright photos */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/45" />

        <div className="relative flex h-full flex-col justify-between px-4 sm:px-6 pt-5 pb-1 sm:pb-3 text-white">
          <div>
            <div className="grid grid-cols-3 items-center text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em]">
              <span>{winner.place}</span>
              <span className="text-center">Genesis 2.0 · {track_name}</span>
              <span className="text-right">{number}</span>
            </div>

            <p className="mx-auto mt-5 max-w-3xl text-center font-[family-name:var(--font-serif)] text-lg sm:text-2xl lg:text-4xl leading-tight">
              {winner.project}, built by {winner.members.join(", ")}.
            </p>
          </div>

          <motion.h2
            style={{ x: reduce_motion ? 0 : name_x }}
            className="w-full pb-4 sm:pb-6 font-[family-name:var(--font-poster)] uppercase leading-none tracking-[0.06em]"
          >
            <FitText text={winner.team} align_right={on_right} />
          </motion.h2>
        </div>
      </div>
    </section>
  );
};

// One track's winning teams, each shown with its team photo
export const Genesis2TrackWinners = ({ slug }) => {
  const track = genesis2_tracks.find((t) => t.slug === slug);

  useEffect(() => {
    const timer = setTimeout(celebrate, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-black pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <GenesisHeader
            heading={track.name}
            text={`Congratulations to the winners of the ${track.name} track at Genesis 2.0! 🎉`}
          />

        </div>

        {/* Poster-style winner photos: each sits in a frame and the next one slides up over it */}
        <div className="genesis-winner-posters -mx-4 sm:-mx-6 lg:-mx-8 mb-16">
          {track.winners.map((winner, index) => (
            <WinnerPoster
              key={winner.place}
              winner={winner}
              track_name={track.name}
              on_right={index % 2 === 1}
              number={`${String(index + 1).padStart(2, "0")} / ${String(track.winners.length).padStart(2, "0")}`}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-center">
            <Link href="/genesis-2-winners">
              <Button className="w-full sm:w-auto px-8 py-4 text-lg bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition duration-200 shadow-[0px_2px_0px_0px_#FFFFFF40_inset] flex items-center justify-center gap-2">
                <ArrowLeft size={20} />
                All Tracks
              </Button>
            </Link>
            <Link href="/events">
              <Button className="w-full sm:w-auto px-8 py-4 text-lg bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition duration-200">
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
};
