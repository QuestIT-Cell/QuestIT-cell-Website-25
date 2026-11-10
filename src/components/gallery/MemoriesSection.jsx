"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  animate,
  useInView,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PhotoLightboxModal from "./PhotoLightboxModal";

/* ─── Orbital Memories Exhibition Images ───────────────────────────────────── */
const ORBITAL_IMAGES = [
  "/images/gallery-images/Orbital/Tech-Team.webp",
  "/images/gallery-images/Orbital/diagonal_9.webp",
  "/images/gallery-images/Orbital/diagonal_12.webp",
  "/images/gallery-images/Orbital/Council_photos_genesis.webp",
  "/images/gallery-images/Orbital/download_1920x1080.webp",
  "/images/gallery-images/Orbital/firstmeet_1920x1080.webp",
  "/images/gallery-images/Orbital/IMG_2522_1920x1080.webp",
  "/images/gallery-images/Orbital/IMG_2829_1920x1080.webp",
  "/images/gallery-images/Orbital/IMG_3955_1920x1080.webp",
  "/images/gallery-images/Orbital/rshb-vwq_1920x1080.webp",
  "/images/gallery-images/Orbital/shivam-bw1_1920x1080.webp",
  "/images/gallery-images/Orbital/table-2_1920x1080.webp",
];

const INITIAL_OFFSET_INDEX = 2;
const TOTAL_CARDS = ORBITAL_IMAGES.length;
const PAUSE_MS = 5500;
const ROTATION_DURATION = 2.6;
const INITIAL_ARRIVAL_PAUSE_MS = 3500;
// Cinematic ease: fast start, effortless float, whisper-soft landing
const ORBIT_EASE = [0.12, 0.95, 0.25, 1];

// Spring config for the card flip — physical momentum, no abrupt snapping
const FLIP_SPRING = { stiffness: 55, damping: 18, mass: 1.2 };
// Spring config for lift elevation
const LIFT_SPRING = { stiffness: 60, damping: 22, mass: 1 };

const mod = (n, m) => ((n % m) + m) % m;

// ─── MemoryCard: each card manages its own spring-driven flip & lift ─────────
const MemoryCard = ({
  card,
  cardWidth,
  cardHeight,
  isFocal,
  liftY,
  animDuration,
  onCardClick,
  onActivePhotoClick,
}) => {
  // Spring-driven flip: rotates smoothly with physical momentum into focal state
  const flipY = useSpring(0, FLIP_SPRING);
  const liftMV = useSpring(0, LIFT_SPRING);

  useEffect(() => {
    flipY.set(isFocal ? 180 : 0);
    liftMV.set(isFocal ? liftY : 0);
  }, [isFocal, liftY, flipY, liftMV]);

  return (
    <div
      onClick={() => {
        if (!isFocal && onCardClick) {
          onCardClick(card.index);
        } else if (isFocal && onActivePhotoClick) {
          onActivePhotoClick(card.src, card.index);
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!isFocal && onCardClick) {
            onCardClick(card.index);
          } else if (isFocal && onActivePhotoClick) {
            onActivePhotoClick(card.src, card.index);
          }
        }
      }}
      aria-label={
        isFocal
          ? `Active Quest-IT Memory ${card.index + 1} - Click to maximize`
          : `Select Quest-IT Memory ${card.index + 1}`
      }
      title={
        isFocal
          ? "Click to maximize photo in full window"
          : `View Memory ${card.index + 1}`
      }
      className={`group outline-none focus:outline-none focus:ring-0 focus-visible:outline-none active:outline-none select-none ${
        isFocal ? "cursor-zoom-in" : "cursor-pointer"
      }`}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        marginLeft: `-${cardWidth / 2}px`,
        marginTop: `-${cardHeight / 2}px`,
        transform: `translate3d(${card.x}px, ${card.y}px, ${card.z}px) rotateX(${card.rotateX}deg) rotateY(${card.rotateY}deg) rotateZ(${card.rotateZ}deg) scale(${card.baseScale})`,
        zIndex: isFocal ? 150 : card.zIndex,
        opacity: card.opacity,
        filter: isFocal ? "none" : `brightness(${card.brightness})`,
        willChange: "transform",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        pointerEvents: card.isVisible ? "auto" : "none",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Spring-driven flip wrapper — rotates the card face with natural momentum */}
      <motion.div
        style={{
          rotateY: flipY,
          y: liftMV,
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
          position: "relative",
          outline: "none",
        }}
        className="outline-none"
      >
        {/* FRONT FACE: Mirrored photograph (visible when inactive at rotateY ~0) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-950 outline-none ${
            !isFocal
              ? "group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              : ""
          }`}
          style={{
            transform: "rotateY(0deg) translateZ(1px)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            border: isFocal
              ? "2px solid rgba(0, 212, 255, 0.95)"
              : "1px solid rgba(0, 212, 255, 0.18)",
            boxShadow: isFocal
              ? "0 0 40px rgba(0, 212, 255, 0.6), 0 20px 48px rgba(0, 0, 0, 0.9)"
              : "0 8px 24px rgba(0, 0, 0, 0.7)",
            outline: "none",
            transition: "border-color 0.8s ease, box-shadow 0.8s ease",
          }}
        >
          <div
            className="relative w-full h-full"
            style={{ transform: "scaleX(-1)" }}
          >
            <Image
              src={card.src}
              alt={`Quest-IT Memory ${card.index + 1} (Mirrored)`}
              fill
              quality={100}
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
              className="object-cover select-none pointer-events-none"
              priority={card.index < 6}
            />
          </div>
          {/* Subtle bottom vignette that dissolves when card is focal */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, rgba(0,0,0,${isFocal ? 0 : 0.28}), transparent 55%)`,
              transition: "background 0.9s ease",
            }}
          />
        </div>

        {/* BACK FACE: Original photograph (visible when active at rotateY ~180) */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-950 outline-none"
          style={{
            transform: "rotateY(180deg) translateZ(1px)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            border: isFocal
              ? "2px solid rgba(0, 212, 255, 0.95)"
              : "1px solid rgba(0, 212, 255, 0.18)",
            boxShadow: isFocal
              ? "0 0 50px rgba(0, 212, 255, 0.65), 0 28px 56px rgba(0, 0, 0, 0.95)"
              : "0 8px 24px rgba(0, 0, 0, 0.7)",
            outline: "none",
            transition: "border-color 0.8s ease, box-shadow 0.8s ease",
          }}
        >
          <Image
            src={card.src}
            alt={`Quest-IT Memory ${card.index + 1}`}
            fill
            quality={100}
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
            className="object-cover select-none pointer-events-none"
            priority={card.index < 6}
          />
        </div>
      </motion.div>
    </div>
  );
};

// ─── MemoriesSection ─────────────────────────────────────────────────────────
const MemoriesSection = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const orbitCanvasRef = useRef(null);

  // Detect when Memories section is in view — only then start rotation
  const isInView = useInView(sectionRef, {
    amount: 0.35,
    margin: "-80px 0px -80px 0px",
  });

  // Dynamic responsive dimensions derived from container measurements
  const [stageDimensions, setStageDimensions] = useState({
    width: 1200,
    height: 700,
  });

  // Step counter for carousel position
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  // focalStep: starts at 0 so initial card rests in spotlight immediately
  const [focalStep, setFocalStep] = useState(0);
  const focalStepRef = useRef(0);

  // progressMV drives ALL card orbital positions — only this value animates
  const progressMV = useMotionValue(0);
  const [currentProgress, setCurrentProgress] = useState(0);

  // animDuration tracks the in-flight duration for aria/debugging only
  const [animDuration, setAnimDuration] = useState(ROTATION_DURATION);

  // Active photo pop-up modal state
  const [modalPhoto, setModalPhoto] = useState(null);

  const timeoutRef = useRef(null);
  const animControlsRef = useRef(null);
  const isCancelledRef = useRef(false);
  const scheduleNextRotationRef = useRef(null);

  // Subscribe to progressMV without causing React re-renders inside RAF
  useEffect(() => {
    const unsub = progressMV.on("change", (v) => setCurrentProgress(v));
    return unsub;
  }, [progressMV]);

  // Clicking the focal card opens lightbox and pauses rotation
  const handleActivePhotoClick = useCallback((src, index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animControlsRef.current) {
      animControlsRef.current.stop();
    }
    setModalPhoto({ src, title: `QUEST-IT Memory ${index + 1}` });
  }, []);

  // Closing modal resumes rotation if section is in view
  const handleCloseModal = useCallback(() => {
    setModalPhoto(null);
    if (scheduleNextRotationRef.current) {
      scheduleNextRotationRef.current();
    }
  }, []);

  // ─── Core orbital animator ─────────────────────────────────────────────────
  // Drives progressMV using Framer Motion's native animate (bypasses React render)
  const rotateToStep = useCallback((targetStep, customDuration = ROTATION_DURATION) => {
    if (isCancelledRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animControlsRef.current) {
      animControlsRef.current.stop();
    }

    stepRef.current = targetStep;
    focalStepRef.current = targetStep;
    setStep(targetStep);
    setFocalStep(targetStep);
    setAnimDuration(customDuration);

    animControlsRef.current = animate(progressMV, targetStep, {
      duration: customDuration,
      ease: ORBIT_EASE,
      onComplete: () => {
        if (isCancelledRef.current) return;
        setAnimDuration(ROTATION_DURATION);
        if (scheduleNextRotationRef.current) {
          scheduleNextRotationRef.current();
        }
      },
    });
  }, [progressMV]);

  // Schedule the next auto-rotation after PAUSE_MS
  scheduleNextRotationRef.current = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isCancelledRef.current) return;
      rotateToStep(stepRef.current + 1, ROTATION_DURATION);
    }, PAUSE_MS);
  };

  // Click on non-active card: orbit it into the spotlight with the same silky motion
  const handleCardClick = useCallback((targetIndex) => {
    const currentActiveIndex =
      focalStepRef.current !== null
        ? mod(INITIAL_OFFSET_INDEX + focalStepRef.current, TOTAL_CARDS)
        : INITIAL_OFFSET_INDEX;

    if (targetIndex === currentActiveIndex) return;

    const currentVal = progressMV.get();
    const baseK = Math.round(
      (currentVal - (targetIndex - INITIAL_OFFSET_INDEX)) / TOTAL_CARDS
    );
    const targetStep = targetIndex - INITIAL_OFFSET_INDEX + baseK * TOTAL_CARDS;

    if (targetStep === focalStepRef.current) return;

    // Duration scales with distance but always uses same ease — same feel as auto-rotation
    const dist = Math.abs(targetStep - currentVal);
    const customDuration = dist <= 1
      ? ROTATION_DURATION
      : ROTATION_DURATION * Math.min(1 + (dist - 1) * 0.3, 1.7);

    rotateToStep(targetStep, customDuration);
  }, [progressMV, rotateToStep]);

  // Touch swipe support for mobile
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      rotateToStep(deltaX < 0 ? stepRef.current + 1 : stepRef.current - 1);
    }
  };

  // ─── Viewport lifecycle: start only when user arrives, stop when they leave ─
  useEffect(() => {
    if (!isInView) {
      isCancelledRef.current = true;
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
      if (animControlsRef.current) animControlsRef.current.stop();
      return;
    }

    isCancelledRef.current = false;

    // Calm arrival: show the first card for INITIAL_ARRIVAL_PAUSE_MS before moving
    timeoutRef.current = setTimeout(() => {
      if (!isCancelledRef.current) {
        rotateToStep(stepRef.current + 1, ROTATION_DURATION);
      }
    }, INITIAL_ARRIVAL_PAUSE_MS);

    return () => {
      isCancelledRef.current = true;
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
      if (animControlsRef.current) animControlsRef.current.stop();
    };
  }, [isInView, rotateToStep]);

  // Measure container dimensions via ResizeObserver
  useEffect(() => {
    if (!stageRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry?.contentRect) {
        setStageDimensions({
          width: entry.contentRect.width || window.innerWidth,
          height: entry.contentRect.height || window.innerHeight,
        });
      }
    });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  // ─── Responsive geometry ───────────────────────────────────────────────────
  const {
    isMobile,
    Rx, Ry, Rz,
    cardWidth, cardHeight,
    angularSpacing, maxDiff, fadeZone,
    liftY, activeScale,
  } = useMemo(() => {
    const W = stageDimensions.width;
    const H = stageDimensions.height;
    const mobile = W < 768;

    if (mobile) {
      const cw = Math.min(Math.max(Math.round(W * 0.44), 155), 195);
      const ch = Math.round(cw * 0.68);
      const rx = Math.max(Math.round(W * 0.38), 125);
      const ry = Math.round(rx * 0.18);
      const rz = Math.round(rx * 0.44);
      return {
        isMobile: true,
        Rx: rx, Ry: ry, Rz: rz,
        cardWidth: cw, cardHeight: ch,
        visibleSlots: 3, angularSpacing: 0.82,
        maxDiff: 1.35, fadeZone: 0.35,
        liftY: -12, activeScale: 1.0,
      };
    } else {
      const tablet = W < 1024;
      const slots = tablet ? 6 : 8;
      const rawCw = tablet
        ? Math.min(W * 0.28, H * 0.30)
        : Math.min(W * 0.22, H * 0.35);
      const cw = tablet
        ? Math.min(Math.max(Math.round(rawCw), 230), 290)
        : Math.min(Math.max(Math.round(rawCw), 280), 360);
      const ch = Math.round(cw * 0.72);
      const rawRx = (W * 0.86 - cw * 0.45) / 2;
      const rx = Math.max(Math.round(rawRx), 100);
      const ry = Math.round(rx * 0.32);
      const rz = Math.round(rx * 0.44);
      return {
        isMobile: false,
        Rx: rx, Ry: ry, Rz: rz,
        cardWidth: cw, cardHeight: ch,
        visibleSlots: slots,
        angularSpacing: (2 * Math.PI) / slots,
        maxDiff: slots / 2, fadeZone: 0.75,
        liftY: tablet ? -85 : -110, activeScale: 1.0,
      };
    }
  }, [stageDimensions]);

  // ─── Per-frame card geometry ───────────────────────────────────────────────
  // Computed from currentProgress (driven by progressMV subscribe above)
  const cards = useMemo(() => {
    const currentCenter = INITIAL_OFFSET_INDEX + currentProgress;
    const activeFocalIndex =
      focalStep !== null
        ? mod(INITIAL_OFFSET_INDEX + focalStep, TOTAL_CARDS)
        : -1;

    return Array.from({ length: TOTAL_CARDS }).map((_, i) => {
      const isFocal = i === activeFocalIndex;

      let diff = (i - currentCenter) % TOTAL_CARDS;
      while (diff > TOTAL_CARDS / 2) diff -= TOTAL_CARDS;
      while (diff < -TOTAL_CARDS / 2) diff += TOTAL_CARDS;

      const absDiff = Math.abs(diff);

      // Fade window: smooth cosine blend so edges dissolve softly
      let fade = 0;
      if (absDiff < maxDiff) {
        fade = absDiff > maxDiff - fadeZone
          ? (maxDiff - absDiff) / fadeZone
          : 1.0;
      }

      const theta = diff * angularSpacing;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const depthFactor = (cosT + 1) / 2;

      let x, y, z, rotateX, rotateY, rotateZ, baseScale, brightness;

      if (isMobile) {
        x = Rx * sinT;
        y = Ry * cosT;
        z = Rz * cosT;
        // Continuous scale: flows organically from 0.65 (rear) to 1.0 (front)
        baseScale = 0.65 + depthFactor * 0.35;
        brightness = 0.88 + depthFactor * 0.12;
        // Banking: smoothly untilts as card drifts to center
        rotateX = (1 - Math.max(0, cosT)) * 5;
        rotateY = -sinT * 32;
        rotateZ = sinT * 2.5;
      } else {
        x = Rx * sinT;
        y = Ry * cosT;
        z = Rz * cosT;
        baseScale = 0.60 + depthFactor * 0.40;
        brightness = 0.85 + depthFactor * 0.15;
        // Banking: smoothly untilts as card drifts to center
        rotateX = (1 - Math.max(0, cosT)) * 7;
        rotateY = -sinT * 40;
        rotateZ = sinT * 3;
      }

      const minOpacity = isMobile ? 0.72 : 0.65;
      const finalOpacity = (minOpacity + depthFactor * (1 - minOpacity)) * fade;
      const zIndex = isFocal ? 150 : Math.round(depthFactor * 100) + 1;

      return {
        index: i,
        src: ORBITAL_IMAGES[i % TOTAL_CARDS],
        x, y, z,
        rotateX, rotateY, rotateZ,
        baseScale,
        brightness,
        opacity: finalOpacity,
        zIndex,
        isFocal,
        isVisible: fade > 0.01,
      };
    });
  }, [
    isMobile, Rx, Ry, Rz,
    currentProgress, focalStep,
    angularSpacing, maxDiff, fadeZone,
  ]);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full bg-black overflow-hidden flex flex-col items-center justify-center select-none ${
        isMobile ? "py-4 min-h-0" : "py-6 md:py-8 min-h-[80vh] justify-between"
      }`}
      style={
        isMobile
          ? undefined
          : { height: "min(95dvh, 800px)", minHeight: "560px" }
      }
    >
      {/* Viewport Container */}
      <div
        ref={stageRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full flex flex-col overflow-visible bg-black select-none ${
          isMobile
            ? "items-center justify-center gap-1 sm:gap-2 h-auto"
            : "h-full justify-between"
        }`}
        style={{
          perspective: isMobile ? "900px" : "1400px",
          perspectiveOrigin: "50% 50%",
          paddingInline: isMobile ? "0" : "clamp(2rem, 4vw, 4rem)",
        }}
      >
        {/* Header */}
        <div className="pt-2 sm:pt-4 md:pt-8 px-4 sm:px-6 md:px-12 lg:px-16 z-30 pointer-events-none text-center md:text-left w-full">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-2 tracking-tight">
            QUEST-IT <span className="text-cyan-400">Memories</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base tracking-wide">
            A Journey of Moments
          </p>
        </div>

        {/* 3D Orbital Canvas */}
        <div
          ref={orbitCanvasRef}
          className={`relative w-full flex items-center justify-center overflow-visible ${
            isMobile
              ? "h-[190px] sm:h-[220px] my-2"
              : "flex-1 -translate-y-4 md:-translate-y-8 my-0"
          }`}
          style={{ transformStyle: "preserve-3d", marginInline: "auto" }}
        >
          {/* Ambient Cyan Glow + Quest Logo Watermark */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 pointer-events-none select-none flex items-center justify-center"
            style={{ transform: "translate3d(-50%, -50%, -20px)", zIndex: 0 }}
          >
            <div
              className="absolute w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[480px] md:h-[380px] rounded-full blur-[45px] md:blur-[75px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(0, 212, 255, 0.20) 0%, rgba(34, 211, 238, 0.07) 50%, transparent 75%)",
              }}
            />
            <div className="relative w-[180px] h-[75px] sm:w-[250px] sm:h-[105px] md:w-[400px] md:h-[160px] lg:w-[480px] lg:h-[190px] opacity-25 md:opacity-30">
              <Image
                src="/images/logo.webp"
                alt=""
                fill
                className="object-contain filter drop-shadow-[0_0_25px_rgba(0,212,255,0.45)]"
                priority
              />
            </div>
          </div>

          {/* Orbital Cards */}
          {cards.map((card) => {
            if (!card.isVisible) return null;
            return (
              <MemoryCard
                key={card.index}
                card={card}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                isFocal={card.isFocal}
                liftY={liftY}
                activeScale={activeScale}
                animDuration={animDuration}
                onCardClick={handleCardClick}
                onActivePhotoClick={handleActivePhotoClick}
              />
            );
          })}
        </div>

        {/* Mobile Navigation Controls */}
        {isMobile ? (
          <div className="flex items-center justify-center gap-4 sm:gap-5 z-30 pt-1 pb-1 select-none">
            <button
              type="button"
              onClick={() => rotateToStep(stepRef.current - 1)}
              aria-label="Previous Memory"
              className="p-2 sm:p-2.5 rounded-full border border-cyan-400/30 bg-black/60 backdrop-blur-md text-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.2)] active:scale-90 transition-all hover:bg-cyan-400/15 hover:border-cyan-400"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="font-mono text-xs sm:text-sm tracking-widest text-cyan-400/90 font-medium">
              {String(mod(INITIAL_OFFSET_INDEX + (focalStep !== null ? focalStep : step), TOTAL_CARDS) + 1).padStart(2, "0")}{" "}
              <span className="text-neutral-500">/</span> {String(TOTAL_CARDS).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => rotateToStep(stepRef.current + 1)}
              aria-label="Next Memory"
              className="p-2 sm:p-2.5 rounded-full border border-cyan-400/30 bg-black/60 backdrop-blur-md text-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.2)] active:scale-90 transition-all hover:bg-cyan-400/15 hover:border-cyan-400"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        ) : (
          <div className="pb-4 md:pb-6 px-6 md:px-12 pointer-events-none" />
        )}
      </div>

      {/* Lightbox Modal */}
      <PhotoLightboxModal
        isOpen={Boolean(modalPhoto)}
        onClose={handleCloseModal}
        src={modalPhoto?.src}
        title={modalPhoto?.title}
        alt="Maximized Quest-IT Memory Photo"
      />
    </section>
  );
};

export default MemoriesSection;
