"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const LogoSection = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-[280px] h-[110px] md:w-[400px] md:h-[160px] lg:w-[500px] lg:h-[200px]"
      >
        <Image
          src="/images/logo.png"
          alt="Quest-IT Logo"
          fill
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Gallery Text */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mt-4 text-white text-sm md:text-base font-light tracking-[0.3em] uppercase"
      >
        Gallery
      </motion.h1>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5
        }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-gray-400"
      >
        <span className="text-xs md:text-sm tracking-wider">Scroll Down</span>
        <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
      </motion.div>
    </section>
  );
};

export default LogoSection;
