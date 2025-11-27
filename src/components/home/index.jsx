"use client";

// Next's Imports
import Link from "next/link";
import dynamic from "next/dynamic";

// App's Internal Imports
import { Highlight, HeroHighlight } from "@/components/ui/hero-highlight";
const MouseScroll = dynamic(() => import("@/components/loader/mouse-scroll"), {
  ssr: false,
});

// App's External Imports
import { motion } from "framer-motion";

const Home = () => {
  return (
    <HeroHighlight id="home" className="relative">
      <motion.h1
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
      >
        Empowering <span className="hidden md:inline">innovation,</span>
        <span className="md:hidden">&</span> shaping the future.{" "}
        <span className="hidden md:inline">QuestIT</span>
        <span className="md:hidden">We</span> redefines{" "}
        <Highlight className="text-white">
          what&apos;s possible in tech.
        </Highlight>
      </motion.h1>

      <Link href="/#about">
        <div className="flex relative justify-center items-center">
          <MouseScroll className="text-center size-14 md:size-16 absolute top-10" />
        </div>
      </Link>
    </HeroHighlight>
  );
};

export default Home;
