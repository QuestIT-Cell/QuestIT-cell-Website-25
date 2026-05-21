"use client";

import { useEffect, useState } from "react";
import SpiralAnimation from "./SpiralAnimation";
import LogoSection from "./LogoSection";
import HorizontalCarousel from "./HorizontalCarousel";
import QuotationSection from "./QuotationSection";
import MemoriesSection from "./MemoriesSection";
import "@/styles/gallery-animations.css";

const GalleryPage = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [spiralComplete, setSpiralComplete] = useState(false);

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const handleSpiralComplete = () => {
    setSpiralComplete(true);
    setCurrentPhase(2);
  };

  return (
    <div className="w-full min-h-screen bg-black overflow-x-hidden">
      {/* Phase 1: Spiral Animation */}
      {!spiralComplete && (
        <SpiralAnimation onComplete={handleSpiralComplete} />
      )}

      {/* Phase 2-5: Scrollable Content */}
      {spiralComplete && (
        <>
          {/* Phase 2: Logo Section */}
          <LogoSection />

          {/* Phase 3: Horizontal Carousel */}
          <HorizontalCarousel />

          {/* Phase 4: Quotation Section */}
          <QuotationSection />

          {/* Phase 5: Memories Section */}
          <MemoriesSection />
        </>
      )}
    </div>
  );
};

export default GalleryPage;
