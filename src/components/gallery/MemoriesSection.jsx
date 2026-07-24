"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const MemoriesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const totalCards = 15;

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // Reduced from 0.2 to 0.1 for better mobile detection
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Fallback: Set visible after a short delay to ensure rendering on mobile
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(fallbackTimer);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const getImageExtension = (index) => {
    // Based on actual files (using 15 images):
    // diagonal_1,2,3,5,6,7,8,10: jpeg
    // diagonal_4,11,12: jpg
    // diagonal_9,13,14,15: png
    const jpgIndices = [4, 11, 12];
    const pngIndices = [9, 13, 14, 15];
    if (pngIndices.includes(index)) return 'png';
    return jpgIndices.includes(index) ? 'jpg' : 'jpeg';
  };

  // Pinterest-style masonry layout with varying heights
  // Cards flow top-left to bottom-right with edge bleed
  const masonryLayout = {
    // Desktop: 5 columns with A4 portrait aspect ratio (taller cards)
    desktop: [
      // Column 1
      { col: 0, row: 0, height: 340, offsetX: 0, offsetY: 0 },      // index 0
      { col: 0, row: 1, height: 320, offsetX: 0, offsetY: 360 },    // index 1
      { col: 0, row: 2, height: 300, offsetX: 0, offsetY: 700 },    // index 2
      
      // Column 2
      { col: 1, row: 0, height: 360, offsetX: 0, offsetY: 0 },      // index 3
      { col: 1, row: 1, height: 340, offsetX: 0, offsetY: 380 },    // index 4
      { col: 1, row: 2, height: 280, offsetX: 0, offsetY: 740 },    // index 5
      
      // Column 3
      { col: 2, row: 0, height: 320, offsetX: 0, offsetY: 0 },      // index 6
      { col: 2, row: 1, height: 360, offsetX: 0, offsetY: 340 },    // index 7
      { col: 2, row: 2, height: 320, offsetX: 0, offsetY: 720 },    // index 8
      
      // Column 4
      { col: 3, row: 0, height: 350, offsetX: 0, offsetY: 0 },      // index 9
      { col: 3, row: 1, height: 330, offsetX: 0, offsetY: 370 },    // index 10
      { col: 3, row: 2, height: 300, offsetX: 0, offsetY: 720 },    // index 11
      
      // Column 5 (NEW)
      { col: 4, row: 0, height: 340, offsetX: 0, offsetY: 0 },      // index 12
      { col: 4, row: 1, height: 320, offsetX: 0, offsetY: 360 },    // index 13
      { col: 4, row: 2, height: 320, offsetX: 0, offsetY: 700 },    // index 14
    ],
    // Mobile: 2 columns with A4 portrait aspect ratio
    mobile: [
      { col: 0, row: 0, height: 300, offsetX: 0, offsetY: 0 },      // index 0
      { col: 1, row: 0, height: 300, offsetX: 0, offsetY: 0 },      // index 1
      { col: 0, row: 1, height: 320, offsetX: 0, offsetY: 316 },    // index 2
      { col: 1, row: 1, height: 320, offsetX: 0, offsetY: 316 },    // index 3
      { col: 0, row: 2, height: 340, offsetX: 0, offsetY: 652 },    // index 4
      { col: 1, row: 2, height: 340, offsetX: 0, offsetY: 652 },    // index 5
      { col: 0, row: 3, height: 300, offsetX: 0, offsetY: 1008 },   // index 6
      { col: 1, row: 3, height: 300, offsetX: 0, offsetY: 1008 },   // index 7
      { col: 0, row: 4, height: 320, offsetX: 0, offsetY: 1324 },   // index 8
      { col: 1, row: 4, height: 320, offsetX: 0, offsetY: 1324 },   // index 9
      { col: 0, row: 5, height: 340, offsetX: 0, offsetY: 1660 },   // index 10
      { col: 1, row: 5, height: 340, offsetX: 0, offsetY: 1660 },   // index 11
      { col: 0, row: 6, height: 300, offsetX: 0, offsetY: 2016 },   // index 12
      { col: 1, row: 6, height: 300, offsetX: 0, offsetY: 2016 },   // index 13
      { col: 0, row: 7, height: 320, offsetX: 0, offsetY: 2332 },   // index 14
    ]
  };

  const getCardLayout = (index) => {
    const layout = isMobile ? masonryLayout.mobile[index] : masonryLayout.desktop[index];
    const columnWidth = isMobile ? 180 : 220; // Smaller width for 4 columns
    const gutterSize = isMobile ? 16 : 20; // consistent gutter spacing
    
    return {
      x: layout.col * (columnWidth + gutterSize) + layout.offsetX,
      y: layout.offsetY, // Use pre-calculated offsetY for uniform spacing
      height: layout.height,
      width: columnWidth,
    };
  };

  // Get slight rotation for natural scrapbook/polaroid tilt - ALL LEFT -4°
  const getCardRotation = (index) => {
    // All cards tilted left at -4 degrees
    return -4;
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-start justify-start bg-black py-12 md:py-20 px-4 md:px-8 lg:px-16 overflow-hidden"
    >
      {/* Title - Top Left Anchored */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 0.6 }}
        className="mb-12 md:mb-16 z-20 ml-0 md:ml-8"
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
          QUEST-IT <span className="text-cyan-400">Memories</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base tracking-wide">
          A Journey of Moments
        </p>
      </motion.div>

      {/* Pinterest-Style Masonry Grid - Top-Left Anchored */}
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="relative w-full" style={{ 
          minHeight: isMobile ? '2700px' : '1060px',
          marginLeft: isMobile ? '0' : '2rem',
          maxWidth: isMobile ? '100%' : 'auto'
        }}>
          {/* Memory Cards in Masonry Layout */}
          {Array.from({ length: totalCards }).map((_, index) => {
            const layout = getCardLayout(index);
            const rotation = getCardRotation(index);

            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 50,
                  scale: 0.9,
                  rotate: rotation,
                }}
                animate={
                  isVisible
                    ? {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotate: rotation,
                      }
                    : {
                        opacity: 0,
                        y: 50,
                        scale: 0.9,
                        rotate: rotation,
                      }
                }
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: rotation + 2,
                  zIndex: 50,
                  boxShadow: "0 25px 60px rgba(6, 182, 212, 0.3)",
                  transition: { duration: 0.2 }
                }}
                className="absolute cursor-pointer"
                style={{
                  left: `${layout.x}px`,
                  top: `${layout.y}px`,
                  width: `${layout.width}px`,
                  height: `${layout.height}px`,
                  zIndex: 10,
                }}
              >
                {/* Card without polaroid frame - just portrait image with shadow */}
                <div className="relative w-full h-full shadow-xl rounded-sm overflow-hidden">
                  {/* Image container - full size */}
                  <Image
                    src={`/images/gallery-images/diagonal_images/diagonal_${index + 1}.${getImageExtension(index + 1)}`}
                    alt={`Quest-IT Memory ${index + 1}`}
                    fill
                    className="object-cover gallery-image-mobile"
                    sizes="(max-width: 768px) 180px, 220px"
                    quality={90}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MemoriesSection;
