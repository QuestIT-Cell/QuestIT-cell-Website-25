"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

export const AnimatedTooltip = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (event) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((item) => (
        <div
          className="relative group inline-flex flex-col items-center cursor-pointer"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 -translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-lg bg-neutral-950/95 border border-cyan-400/30 z-50 shadow-[0_8px_24px_rgba(0,0,0,0.8)] px-3.5 py-1.5 pointer-events-none"
              >
                <div className="absolute inset-x-8 z-30 -bottom-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent h-px" />
                <div className="font-semibold text-white relative z-30 text-xs sm:text-sm">
                  {item.name}
                </div>
                <div className="text-cyan-300 text-[10px] sm:text-xs">
                  {item.designation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-cyan-400 group-hover:scale-105 transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.6)] bg-neutral-900">
            <Image
              fill
              sizes="64px"
              src={item.image}
              alt={item.name}
              className="object-cover object-center"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
