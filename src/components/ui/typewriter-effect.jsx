"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}) => {
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => (
          <div key={`word-${idx}`} className="inline-block">
            {word.text.map((char, index) => (
              <span
                key={`char-${index}`}
                className={cn(`dark:text-white text-black`, word.className)}
              >
                {char}
              </span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center text-center space-x-1 -mb-6 mt-12 md:mb-0",
        className
      )}
    >
      <motion.div
        className="overflow-hidden pb-2 flex items-center"
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "fit-content",
        }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 1,
        }}
      >
        <div
          className="font-bold flex items-center typewriter-mobile-fix"
          style={{
            whiteSpace: "nowrap",
            fontSize: "clamp(1.5rem, 4vw, 3rem)",
          }}
        >
          {renderWords()}{" "}
        </div>
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "block rounded-sm w-[4px] h-8 mb-2 xl:h-12 bg-[#00FAFF]",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
