"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
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
// Exactly 3 seconds active resting window per photo
const PAUSE_MS = 3000;
const INITIAL_ARRIVAL_PAUSE_MS = 3000;
// Swift, fluid 1.6s sweep with smooth in-flight card flipping
const ROTATION_DURATION = 1.6;
// Smooth cinematic bezier curve
const ORBIT_EASE = [0.16, 1, 0.3, 1];

const mod = (n, m) => ((n % m) + m) % m;

// ─── MemoryCard ───────────────────────────────────────────────────────────────
// Derives its 3D orbital trajectory, smooth flip (0 -> 180deg), lift, scale,
// border glow, and shadow continuously from progressMV via useTransform.
// Zero React re-renders during motion.
const MemoryCard = ({
  cardIndex,
  progressMV,
  cardWidth,
  cardHeight,
  liftY,
  isMobile,
  Rx, Ry, Rz,
  angularSpacing,
  maxDiff,
  fadeZone,
  onCardClick,
  onActivePhotoClick,
}) => {
  const src = ORBITAL_IMAGES[cardIndex % TOTAL_CARDS];

  // ─── Continuous Flip Angle & Lift Elevation ────────────────────────────────
  // As card sweeps into center (|diff|: 0.55 -> 0.0), it smoothly flips 0 -> 180deg.
  // When resting at center (|diff| = 0), it is fully flipped at 180deg facing forward.
  // As it drifts away (|diff|: 0.0 -> 0.55), it smoothly flips 180 -> 0deg back into ring.
  const flipAngle = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const absDiff = Math.abs(diff);
    const flipZone = 0.55;
    if (absDiff >= flipZone) return 0;
    const progress = (flipZone - absDiff) / flipZone;
    const smoothT = (1 - Math.cos(progress * Math.PI)) / 2;
    return smoothT * 180;
  });

  const liftVal = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const absDiff = Math.abs(diff);
    const flipZone = 0.55;
    if (absDiff >= flipZone) return 0;
    const progress = (flipZone - absDiff) / flipZone;
    const smoothT = (1 - Math.cos(progress * Math.PI)) / 2;
    return smoothT * liftY;
  });

  // ─── 3D Orbital Trajectory ────────────────────────────────────────────────
  const transformX = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const theta = diff * angularSpacing;
    return Rx * Math.sin(theta);
  });
  const transformY = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const theta = diff * angularSpacing;
    return Ry * Math.cos(theta);
  });
  const transformZ = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const theta = diff * angularSpacing;
    return Rz * Math.cos(theta);
  });
  const rotX = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const theta = diff * angularSpacing;
    const cosT = Math.cos(theta);
    return (1 - Math.max(0, cosT)) * (isMobile ? 5 : 7);
  });
  const rotY = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const theta = diff * angularSpacing;
    return -Math.sin(theta) * (isMobile ? 32 : 40);
  });
  const rotZ = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const theta = diff * angularSpacing;
    return Math.sin(theta) * (isMobile ? 2.5 : 3);
  });

  const scaleVal = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const theta = diff * angularSpacing;
    const cosT = Math.cos(theta);
    const depthFactor = (cosT + 1) / 2;
    return isMobile ? 0.65 + depthFactor * 0.35 : 0.60 + depthFactor * 0.40;
  });
  const opacityVal = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const absDiff = Math.abs(diff);
    if (absDiff >= maxDiff) return 0;
    const fade = absDiff > maxDiff - fadeZone ? (maxDiff - absDiff) / fadeZone : 1.0;
    const theta = diff * angularSpacing;
    const cosT = Math.cos(theta);
    const depthFactor = (cosT + 1) / 2;
    const minOp = isMobile ? 0.72 : 0.65;
    return (minOp + depthFactor * (1 - minOp)) * fade;
  });
  const filterVal = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const absDiff = Math.abs(diff);
    if (absDiff < 0.35) return "none";
    const theta = diff * angularSpacing;
    const cosT = Math.cos(theta);
    const depthFactor = (cosT + 1) / 2;
    const b = isMobile ? 0.88 + depthFactor * 0.12 : 0.85 + depthFactor * 0.15;
    return `brightness(${b})`;
  });
  const zIndexVal = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const absDiff = Math.abs(diff);
    if (absDiff < 0.5) return 150;
    const theta = diff * angularSpacing;
    const cosT = Math.cos(theta);
    const depthFactor = (cosT + 1) / 2;
    return Math.round(depthFactor * 100) + 1;
  });

  // Glowing borders & shadows that smoothly intensify as card centers
  const borderStyle = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const absDiff = Math.abs(diff);
    if (absDiff >= 0.5) return "1px solid rgba(0, 212, 255, 0.18)";
    const t = (0.5 - absDiff) / 0.5;
    const op = 0.18 + t * 0.77;
    return `2px solid rgba(0, 212, 255, ${op})`;
  });

  const shadowVal = useTransform(progressMV, (p) => {
    const diff = getDiff(cardIndex, p);
    const absDiff = Math.abs(diff);
    if (absDiff >= 0.5) return "0 8px 24px rgba(0, 0, 0, 0.7)";
    const t = (0.5 - absDiff) / 0.5;
    const glow = Math.round(t * 50);
    return `0 0 ${glow}px rgba(0, 212, 255, ${t * 0.65}), 0 28px 56px rgba(0, 0, 0, 0.95)`;
  });

  const posTransform = useTransform(
    [transformX, transformY, transformZ, rotX, rotY, rotZ],
    ([x, y, z, rx, ry, rz]) =>
      `translate3d(${x}px,${y}px,${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`
  );
  const scaleTransform = useTransform(
    scaleVal,
    (s) => `scale(${s}) translateZ(0)`
  );

  const handleClick = useCallback(() => {
    const currentVal = progressMV.get();
    const curDiff = Math.abs(getDiff(cardIndex, currentVal));
    if (curDiff < 0.35) {
      if (onActivePhotoClick) onActivePhotoClick(src, cardIndex);
    } else {
      if (onCardClick) onCardClick(cardIndex);
    }
  }, [cardIndex, progressMV, onCardClick, onActivePhotoClick, src]);

  return (
    <motion.div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Quest-IT Memory ${cardIndex + 1}`}
      className="group outline-none focus:outline-none select-none cursor-pointer"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        marginLeft: `-${cardWidth / 2}px`,
        marginTop: `-${cardHeight / 2}px`,
        transform: posTransform,
        zIndex: zIndexVal,
        opacity: opacityVal,
        transformStyle: "preserve-3d",
        pointerEvents: "auto",
        WebkitTapHighlightColor: "transparent",
        outline: "none",
        willChange: "transform, opacity",
      }}
    >
      {/* Scale wrapper — flat GPU layer rasterized at full cardWidth×cardHeight */}
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          transform: scaleTransform,
          filter: filterVal,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {/* Dynamic Flip wrapper — rotates 0 -> 180deg during orbit transition */}
        <motion.div
          style={{
            rotateY: flipAngle,
            y: liftVal,
            transformStyle: "preserve-3d",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {/* FRONT FACE — mirrored photo (visible at rotateY: 0deg when in orbital ring) */}
          <motion.div
            className="absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-950 group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            style={{
              transform: "rotateY(0deg) translateZ(1px)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              border: borderStyle,
              boxShadow: shadowVal,
            }}
          >
            <div className="relative w-full h-full" style={{ transform: "scaleX(-1)" }}>
              <Image
                src={src}
                alt={`Quest-IT Memory ${cardIndex + 1} (Mirrored)`}
                fill
                quality={100}
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
                className="object-cover select-none pointer-events-none"
                priority={cardIndex < 6}
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.28), transparent 55%)",
              }}
            />
          </motion.div>

          {/* BACK FACE — original photograph (visible at rotateY: 180deg in focal spotlight) */}
          <motion.div
            className="absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-950"
            style={{
              transform: "rotateY(180deg) translateZ(1px)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              border: borderStyle,
              boxShadow: shadowVal,
            }}
          >
            <Image
              src={src}
              alt={`Quest-IT Memory ${cardIndex + 1}`}
              fill
              quality={100}
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
              className="object-cover select-none pointer-events-none"
              priority={cardIndex < 6}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Pure helper: compute signed angular difference for card `i` given progress `p`
function getDiff(i, p) {
  const currentCenter = INITIAL_OFFSET_INDEX + p;
  let diff = (i - currentCenter) % TOTAL_CARDS;
  while (diff > TOTAL_CARDS / 2) diff -= TOTAL_CARDS;
  while (diff < -TOTAL_CARDS / 2) diff += TOTAL_CARDS;
  return diff;
}

// ─── MemoriesSection ─────────────────────────────────────────────────────────
const MemoriesSection = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  const isInView = useInView(sectionRef, {
    amount: 0.35,
    margin: "-80px 0px -80px 0px",
  });

  const [stageDimensions, setStageDimensions] = useState({ width: 1200, height: 700 });
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);

  // progressMV drives ALL orbital trajectories & flips continuously
  const progressMV = useMotionValue(0);

  const [modalPhoto, setModalPhoto] = useState(null);

  const timeoutRef = useRef(null);
  const animControlsRef = useRef(null);
  const isCancelledRef = useRef(false);
  const scheduleNextRef = useRef(null);

  const handleActivePhotoClick = useCallback((src, index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animControlsRef.current) animControlsRef.current.stop();
    setModalPhoto({ src, title: `QUEST-IT Memory ${index + 1}` });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalPhoto(null);
    if (scheduleNextRef.current) scheduleNextRef.current();
  }, []);

  // ─── Core Orbital Transition ───────────────────────────────────────────────
  const rotateToStep = useCallback((targetStep, customDuration = ROTATION_DURATION) => {
    if (isCancelledRef.current) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animControlsRef.current) animControlsRef.current.stop();

    stepRef.current = targetStep;
    setStep(targetStep);

    animControlsRef.current = animate(progressMV, targetStep, {
      duration: customDuration,
      ease: ORBIT_EASE,
      onComplete: () => {
        if (isCancelledRef.current) return;
        if (scheduleNextRef.current) scheduleNextRef.current();
      },
    });
  }, [progressMV]);

  // Schedule next auto-rotation: exactly 3 seconds active resting time per card
  scheduleNextRef.current = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isCancelledRef.current) return;
      rotateToStep(stepRef.current + 1, ROTATION_DURATION);
    }, PAUSE_MS);
  };

  const handleCardClick = useCallback((targetIndex) => {
    const currentVal = progressMV.get();
    const baseK = Math.round((currentVal - (targetIndex - INITIAL_OFFSET_INDEX)) / TOTAL_CARDS);
    const targetStep = targetIndex - INITIAL_OFFSET_INDEX + baseK * TOTAL_CARDS;
    if (targetStep === stepRef.current) return;

    const dist = Math.abs(targetStep - currentVal);
    const customDuration = dist <= 1
      ? ROTATION_DURATION
      : ROTATION_DURATION * Math.min(1 + (dist - 1) * 0.3, 1.6);

    rotateToStep(targetStep, customDuration);
  }, [progressMV, rotateToStep]);

  // Mobile Touch Swipe
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      rotateToStep(dx < 0 ? stepRef.current + 1 : stepRef.current - 1);
    }
  };

  // ─── Viewport Lifecycle: Start only when in view, calm 3s arrival ─────────
  useEffect(() => {
    if (!isInView) {
      isCancelledRef.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (animControlsRef.current) animControlsRef.current.stop();
      return;
    }

    isCancelledRef.current = false;
    // Exactly 3 seconds arrival resting window for the initial card
    timeoutRef.current = setTimeout(() => {
      if (!isCancelledRef.current) rotateToStep(stepRef.current + 1, ROTATION_DURATION);
    }, INITIAL_ARRIVAL_PAUSE_MS);

    return () => {
      isCancelledRef.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (animControlsRef.current) animControlsRef.current.stop();
    };
  }, [isInView, rotateToStep]);

  // ResizeObserver for Container Dimensions
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

  // ─── Responsive Geometry ───────────────────────────────────────────────────
  const geo = useMemo(() => {
    const W = stageDimensions.width;
    const H = stageDimensions.height;
    const mobile = W < 768;
    if (mobile) {
      const cw = Math.min(Math.max(Math.round(W * 0.44), 155), 195);
      const ch = Math.round(cw * 0.68);
      const rx = Math.max(Math.round(W * 0.38), 125);
      return {
        isMobile: true,
        Rx: rx, Ry: Math.round(rx * 0.18), Rz: Math.round(rx * 0.44),
        cardWidth: cw, cardHeight: ch,
        angularSpacing: 0.82, maxDiff: 1.35, fadeZone: 0.35,
        liftY: -12,
      };
    }
    const tablet = W < 1024;
    const slots = tablet ? 6 : 8;
    const rawCw = tablet ? Math.min(W * 0.28, H * 0.30) : Math.min(W * 0.22, H * 0.35);
    const cw = tablet
      ? Math.min(Math.max(Math.round(rawCw), 230), 290)
      : Math.min(Math.max(Math.round(rawCw), 280), 360);
    const ch = Math.round(cw * 0.72);
    const rx = Math.max(Math.round((W * 0.86 - cw * 0.45) / 2), 100);
    return {
      isMobile: false,
      Rx: rx, Ry: Math.round(rx * 0.32), Rz: Math.round(rx * 0.44),
      cardWidth: cw, cardHeight: ch,
      angularSpacing: (2 * Math.PI) / slots, maxDiff: slots / 2, fadeZone: 0.75,
      liftY: tablet ? -85 : -110,
    };
  }, [stageDimensions]);

  const { isMobile, Rx, Ry, Rz, cardWidth, cardHeight, angularSpacing, maxDiff, fadeZone, liftY } = geo;

  return (
    <section
      ref={sectionRef}
      className={`relative w-full bg-black overflow-hidden flex flex-col items-center justify-center select-none ${
        isMobile ? "py-4 min-h-0" : "py-6 md:py-8 min-h-[80vh] justify-between"
      }`}
      style={isMobile ? undefined : { height: "min(95dvh, 800px)", minHeight: "560px" }}
    >
      {/* 3D Stage */}
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
                background: "radial-gradient(circle, rgba(0,212,255,0.20) 0%, rgba(34,211,238,0.07) 50%, transparent 75%)",
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
          {ORBITAL_IMAGES.map((_, i) => (
            <MemoryCard
              key={i}
              cardIndex={i}
              progressMV={progressMV}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              liftY={liftY}
              isMobile={isMobile}
              Rx={Rx} Ry={Ry} Rz={Rz}
              angularSpacing={angularSpacing}
              maxDiff={maxDiff}
              fadeZone={fadeZone}
              onCardClick={handleCardClick}
              onActivePhotoClick={handleActivePhotoClick}
            />
          ))}
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
              {String(mod(INITIAL_OFFSET_INDEX + step, TOTAL_CARDS) + 1).padStart(2, "0")}{" "}
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
