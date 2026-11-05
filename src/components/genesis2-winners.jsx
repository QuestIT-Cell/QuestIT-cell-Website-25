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

// "TRACKS" title between two bracket lines, like on the Genesis 2.0 poster
const TracksHeading = () => (
  <div className="mb-5 flex items-center gap-3 text-orange-400/70">
    <span className="h-px flex-1 bg-current" />
    <span className="h-3 w-px bg-current" />
    <h2 className="px-2 font-[family-name:var(--font-tech)] text-xl sm:text-2xl font-semibold tracking-[0.25em] text-orange-300">
      TRACKS
    </h2>
    <span className="h-3 w-px bg-current" />
    <span className="h-px flex-1 bg-current" />
  </div>
);

// Faint crosshair rings drawn behind the character, in the track's colour
const TargetLines = ({ color }) => (
  <svg viewBox="0 0 200 200" className="absolute inset-0 m-auto size-[115%] -translate-y-6 opacity-25" aria-hidden="true">
    <g fill="none" stroke={color} strokeWidth="0.6">
      <circle cx="100" cy="100" r="88" />
      <circle cx="100" cy="100" r="62" strokeDasharray="3 4" />
      <circle cx="100" cy="100" r="34" />
      <path d="M100 0v200M0 100h200M30 30l140 140M170 30 30 170" strokeWidth="0.3" />
    </g>
  </svg>
);

// Track card in the style of the Genesis 2.0 poster: EVA number, character, and the track name in a label box
const TrackCard = ({ track }) => (
  <Link
    href={`/genesis-2-winners/${track.slug}`}
    style={{ "--track": track.color }}
    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[var(--track)]/60 bg-neutral-950 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--track)] hover:shadow-[0_0_40px_-8px_var(--track)]"
  >
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[var(--track)]/40"
      style={{ background: `radial-gradient(circle at 60% 40%, ${track.color}33, transparent 70%)` }}
    >
      <TargetLines color={track.color} />

      <div className="absolute top-3 left-4 z-10 font-[family-name:var(--font-tech)] font-semibold leading-none text-[var(--track)] [font-variant-numeric:slashed-zero]">
        <span className="block text-base tracking-wider">EVA</span>
        <span className="block text-3xl">{track.eva}</span>
      </div>

      <Image
        src={track.character}
        alt=""
        width={250}
        height={370}
        className="absolute bottom-0 left-1/2 h-[88%] w-auto -translate-x-1/2 object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-105 origin-bottom"
      />

      {/* Small corner triangle from the poster */}
      <span className="absolute bottom-0 left-0 size-0 border-b-[18px] border-r-[18px] border-b-[var(--track)] border-r-transparent" />
    </div>

    <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--track)]/60 px-4 py-3">
      <div>
        <h3 className="whitespace-nowrap font-[family-name:var(--font-tech)] text-xl lg:text-lg font-semibold uppercase tracking-[0.1em] text-[var(--track)]">
          {track.name}
        </h3>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-neutral-400">
          <Trophy size={14} />
          {track.winners.length} winning teams
        </p>
      </div>
      <ArrowRight size={22} className="text-[var(--track)] transition-transform duration-300 group-hover:translate-x-1" />
    </div>
  </Link>
);

// All three tracks, each card leads to that track's winners
export const Genesis2Tracks = () => {
  useEffect(() => {
    const timer = setTimeout(celebrate, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-black pt-32 lg:pt-40 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Kept short so the track cards fit on the first screen without scrolling */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex flex-col items-center text-center"
          >
            <Image
              src="/images/Genesis2.0logo-600.webp"
              alt="Genesis 2.0"
              width={600}
              height={600}
              className="w-28 sm:w-32 h-auto object-contain"
              priority
            />
            <h1 className="-mt-1 font-[family-name:var(--font-poster)] text-3xl sm:text-4xl uppercase tracking-[0.4em] pl-[0.4em] bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              Winners
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-400">Pick a track to meet its winning teams 🎉</p>
          </motion.div>

          <TracksHeading />

          {/* On laptops the row narrows on shorter screens, so the whole cards stay visible without scrolling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14 max-w-[18rem] sm:max-w-2xl lg:max-w-[min(48rem,calc((100svh-31rem)*2.4+2.5rem))] mx-auto">
            {genesis2_tracks.map((track, index) => (
              <motion.div
                key={track.slug}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * (index + 1), duration: 0.6 }}
              >
                <TrackCard track={track} />
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

// Sizes the text so that size_by (the longest team name) spans about half the width,
// which gives every team name the same size
const FitText = ({ text, size_by = text, align_right, className = "" }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const box = el.parentElement;
    const fit = () => {
      // Measure size_by in a hidden copy of the text at 100px
      const probe = el.cloneNode();
      probe.textContent = size_by;
      Object.assign(probe.style, { position: "absolute", visibility: "hidden", fontSize: "100px" });
      box.appendChild(probe);
      const width_at_100 = probe.scrollWidth;
      probe.remove();
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
  }, [size_by]);

  return (
    <span ref={ref} className={`${align_right ? "ml-auto" : ""} block w-max whitespace-nowrap ${className}`}>
      {text}
    </span>
  );
};

const WinnerPoster = ({ winner, track_name, number, on_right, longest_team }) => {
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
          <div className="grid grid-cols-3 items-center text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em]">
            <span>{winner.place}</span>
            <span className="text-center">Genesis 2.0 · {track_name}</span>
            <span className="text-right">{number}</span>
          </div>

          {/* Team name with its members underneath, sliding in together from their corner;
              the right-hand ones leave room for the site's back-to-top button */}
          <motion.div
            style={{ x: reduce_motion ? 0 : name_x }}
            className={`pb-4 sm:pb-6 ${on_right ? "pr-12 sm:pr-14 text-right" : "text-left"}`}
          >
            <h2 className="w-full font-[family-name:var(--font-poster)] uppercase leading-none tracking-[0.06em]">
              <FitText text={winner.team} size_by={longest_team} align_right={on_right} />
            </h2>
            <p className={`mt-2 max-w-xl font-[family-name:var(--font-serif)] text-base sm:text-xl text-white/85 ${on_right ? "ml-auto" : ""}`}>
              {winner.members.join(" · ")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Team names on every track are sized by the longest one overall, so all three tracks match
const LONGEST_TEAM = genesis2_tracks
  .flatMap((t) => t.winners)
  .reduce((a, w) => (w.team.length > a.length ? w.team : a), "");

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
              longest_team={LONGEST_TEAM}
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
