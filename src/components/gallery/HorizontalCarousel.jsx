"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const HorizontalCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 12;
  const autoPlayDelay = 4000; // 4 seconds per slide
  const timerRef = useRef(null);

  // Auto-advance carousel
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, autoPlayDelay);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const getImageExtension = (index) => {
    const jpgIndices = [1, 2, 4, 5, 9, 11];
    const jpegIndices = [3, 8, 10, 12];
    const JPGIndices = [6, 7];
    
    if (jpgIndices.includes(index)) return 'jpg';
    if (jpegIndices.includes(index)) return 'jpeg';
    if (JPGIndices.includes(index)) return 'JPG';
    return 'jpg';
  };

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      {/* Full-width landscape image carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={`/images/gallery-images/sliding_images/sliding_${currentIndex + 1}.${getImageExtension(currentIndex + 1)}`}
            alt={`Gallery slide ${currentIndex + 1}`}
            fill
            className="object-cover gallery-image-mobile"
            sizes="100vw"
            quality={90}
            priority={currentIndex === 0}
          />
          {/* Subtle gradient overlay for better text visibility if needed */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <motion.div
          key={`progress-${currentIndex}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: autoPlayDelay / 1000,
            ease: "linear",
          }}
          className="h-full bg-cyan-400"
        />
      </div>

      {/* Slide counter */}
      <div className="absolute top-8 right-8 z-20 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20">
        {currentIndex + 1} / {totalSlides}
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-2 bg-cyan-400"
                : "w-2 h-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HorizontalCarousel;
