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
    <div className="flex justify-center items-center gap-2.5 sm:gap-4 mb-6 sm:mb-8 px-2">
      <Trophy className="w-7 h-7 sm:w-14 sm:h-14 text-orange-400 shrink-0" />
      <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600 bg-clip-text text-transparent text-center">
        {heading}
      </h1>
      <Trophy className="w-7 h-7 sm:w-14 sm:h-14 text-orange-400 shrink-0" />
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

    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[var(--track)]/60 px-4 py-3">
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-[family-name:var(--font-tech)] text-lg sm:text-xl font-semibold uppercase tracking-[0.08em] text-[var(--track)]">
          {track.name}
        </h3>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400">
          <Trophy size={14} className="shrink-0 text-amber-400" />
          <span className="truncate">{track.winners.length} winning teams</span>
        </p>
      </div>
      <ArrowRight size={20} className="shrink-0 text-[var(--track)] transition-transform duration-300 group-hover:translate-x-1" />
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

          {/* Responsive grid with comfortable card widths so all text fits without overflow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-14 max-w-sm sm:max-w-2xl lg:max-w-5xl mx-auto">
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

// Sizes the text so team names stay balanced and strictly within the card frame without overflowing
const FitText = ({ text, size_by = text, className = "" }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const box = el.parentElement;
    if (!box) return;

    const fit = () => {
      if (!box.clientWidth) return;

      // Measure text in a hidden clone with exact CSS typography properties
      const probe = document.createElement("span");
      probe.textContent = text;
      Object.assign(probe.style, {
        position: "absolute",
        visibility: "hidden",
        whiteSpace: "nowrap",
        fontSize: "100px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontFamily: "var(--font-poster), 'Cormorant Garamond', Georgia, serif",
      });
      document.body.appendChild(probe);
      const text_width_at_100 = probe.scrollWidth || 1;
      probe.remove();

      // Measure reference size_by for visual balance across cards
      let ref_width_at_100 = text_width_at_100;
      if (size_by && size_by !== text) {
        const refProbe = document.createElement("span");
        refProbe.textContent = size_by;
        Object.assign(refProbe.style, {
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          fontSize: "100px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontFamily: "var(--font-poster), 'Cormorant Garamond', Georgia, serif",
        });
        document.body.appendChild(refProbe);
        ref_width_at_100 = refProbe.scrollWidth || text_width_at_100;
        refProbe.remove();
      }

      const is_mobile = box.clientWidth < 640;
      // Target share: 90% of card width on mobile, 68% on desktop
      const target_share = is_mobile ? 0.90 : 0.68;
      const size_from_ref = (100 * box.clientWidth * target_share) / ref_width_at_100;

      // Hard cap: this specific text must never exceed 92% of container width
      const max_size_for_text = (100 * box.clientWidth * 0.92) / text_width_at_100;
      const ideal_size = Math.min(size_from_ref, max_size_for_text);

      // Bound between readable minimum and aesthetic maximum based on viewport
      const min_size = is_mobile ? 24 : 34;
      const max_size = is_mobile ? Math.min(window.innerHeight * 0.1, 52) : Math.min(window.innerHeight * 0.14, 82);
      const final_size = Math.max(min_size, Math.min(ideal_size, max_size));

      el.style.fontSize = `${final_size}px`;
    };

    fit();
    document.fonts?.ready.then(fit);

    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [text, size_by]);

  return (
    <span
      ref={ref}
      className={`block w-fit max-w-full truncate whitespace-nowrap ${className}`}
    >
      {text}
    </span>
  );
};

const LABEL_PILL = "whitespace-nowrap rounded-full bg-black/60 px-3 py-1 sm:py-1.5 ring-1 ring-white/15 backdrop-blur-sm";

const WinnerPoster = ({ winner, track_name, number, longest_team }) => {
  const ref = useRef(null);
  const reduce_motion = useReducedMotion();
  // While the photo slides into view, the team name glides subtly into position
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 45%"] });
  const name_x = useTransform(scrollYProgress, [0, 1], [reduce_motion ? 0 : -25, 0]);
  const name_opacity = useTransform(scrollYProgress, [0, 0.7, 1], [reduce_motion ? 1 : 0.2, 0.8, 1]);

  return (
    <section ref={ref} className="sticky top-0 flex h-svh w-full items-center justify-center px-3 sm:px-8 pt-20 lg:pt-[8.5rem] pb-5 sm:pb-6">
      {/* The photo sits in a rounded frame; the next frame slides up over this one like a stack of prints */}
      <div className="relative h-full w-full max-w-6xl overflow-hidden rounded-2xl border border-orange-500/30 bg-neutral-950 shadow-2xl shadow-black/70">
        
        {/* LAPTOP / DESKTOP VIEW (sm and up): Unchanged full-bleed object-cover photo */}
        <div className="hidden sm:block absolute inset-0">
          <Image
            src={winner.photo}
            alt={`${winner.team} - ${winner.place}, ${track_name}`}
            fill
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
            priority={number.startsWith("01")}
          />
          {/* Soft shade at top and bottom so text stays readable on bright photos */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85" />
        </div>

        {/* PHONE VIEW (mobile < sm): Ambient blurred background fill */}
        <div className="sm:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src={winner.photo}
            alt=""
            fill
            aria-hidden="true"
            className="object-cover blur-2xl opacity-25 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        </div>

        {/* Card Content Overlay */}
        <div className="relative flex h-full flex-col justify-between p-4 sm:p-6 text-white z-10">
          
          {/* Top Metadata Bar: place, track name and index pills fitting cleanly on any screen */}
          <div className="shrink-0 flex items-center justify-between gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-[0.12em] w-full">
            <span className={`${LABEL_PILL} max-w-[65%] sm:max-w-none truncate text-amber-300 ring-amber-400/30`}>
              {winner.place}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`${LABEL_PILL} hidden sm:inline-flex text-neutral-300`}>
                Genesis 2.0 · {track_name}
              </span>
              <span className={`${LABEL_PILL} font-mono text-neutral-200`}>
                {number}
              </span>
            </div>
          </div>

          {/* PHONE VIEW ONLY: Full uncropped winner photo framed in center */}
          <div className="sm:hidden relative flex-1 min-h-0 w-full my-3 flex items-center justify-center">
            <div className="relative w-full h-full max-h-[50vh] flex items-center justify-center">
              <Image
                src={winner.photo}
                alt={`${winner.team} - ${winner.place}, ${track_name}`}
                fill
                sizes="100vw"
                className="object-contain rounded-xl drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)]"
                priority={number.startsWith("01")}
              />
            </div>
          </div>

          {/* Team name with its members underneath: clean left alignment across all cards */}
          <motion.div
            style={{ x: name_x, opacity: name_opacity }}
            className="shrink-0 pb-2 sm:pb-5 text-left max-w-full"
          >
            <h2 className="w-full font-[family-name:var(--font-poster)] uppercase leading-none tracking-[0.06em]">
              <FitText text={winner.team} size_by={longest_team} />
            </h2>
            <p className="mt-1.5 sm:mt-2.5 max-w-2xl font-[family-name:var(--font-serif)] text-xs sm:text-lg md:text-xl text-white/90 leading-snug sm:leading-normal">
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
