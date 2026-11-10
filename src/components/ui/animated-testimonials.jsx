"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export const AnimatedTestimonials = ({
    testimonials,
    autoplay = false
}) => {
    const [active, setActive] = useState(0);

    const handleNext = () => {
        setActive((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const isActive = (index) => {
        return index === active;
    };

    useEffect(() => {
        if (autoplay) {
            const interval = setInterval(handleNext, 5000);
            return () => clearInterval(interval);
        }
    }, [autoplay]);

    const randomRotateY = () => {
        return Math.floor(Math.random() * 21) - 10;
    };

    return (
        <div className="w-full max-w-none mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-16 md:py-20">
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-center">
                <div className="flex justify-center md:justify-start">
                    {/* Frame is square to match 1:1 portrait photos and prevent cutting top/bottom of faces */}
                    <div className="relative aspect-square w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[480px]">
                        <AnimatePresence>
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.src}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: -100,
                                        rotate: randomRotateY(),
                                    }}
                                    animate={{
                                        opacity: isActive(index) ? 1 : 0.7,
                                        scale: isActive(index) ? 1 : 0.95,
                                        z: isActive(index) ? 0 : -100,
                                        rotate: isActive(index) ? 0 : randomRotateY(),
                                        zIndex: isActive(index)
                                            ? 999
                                            : testimonials.length + 2 - index,
                                        y: isActive(index) ? [0, -80, 0] : 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: 100,
                                        rotate: randomRotateY(),
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 origin-bottom rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-neutral-950">
                                    <Image
                                        src={testimonial.src}
                                        alt={testimonial.name}
                                        fill
                                        sizes="(max-width: 768px) 400px, 480px"
                                        draggable={false}
                                        priority={index === 0}
                                        className="object-cover object-[center_20%]" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex justify-between flex-col py-4">
                    <motion.div
                        key={active}
                        initial={{
                            y: 20,
                            opacity: 0,
                        }}
                        animate={{
                            y: 0,
                            opacity: 1,
                        }}
                        exit={{
                            y: -20,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut",
                        }}>
                        <h3 className="text-2xl font-bold dark:text-white text-black">
                            {testimonials[active].name}
                        </h3>
                        <p className="text-sm text-cyan-400 font-medium mt-1">
                            {testimonials[active].designation}
                        </p>
                        <motion.p className="text-base sm:text-lg text-gray-400 mt-6 md:mt-8 dark:text-neutral-300 leading-relaxed">
                            {testimonials[active].quote.split(" ").map((word, index) => (
                                <motion.span
                                    key={index}
                                    initial={{
                                        filter: "blur(10px)",
                                        opacity: 0,
                                        y: 5,
                                    }}
                                    animate={{
                                        filter: "blur(0px)",
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeInOut",
                                        delay: 0.02 * index,
                                    }}
                                    className="inline-block">
                                    {word}&nbsp;
                                </motion.span>
                            ))}
                        </motion.p>
                    </motion.div>
                    <div className="flex gap-4 pt-10 md:pt-12">
                        <button
                            onClick={handlePrev}
                            aria-label="Previous testimonial"
                            className="h-9 w-9 rounded-full bg-neutral-900 border border-white/10 hover:border-cyan-400/50 flex items-center justify-center group/button transition-colors">
                            <ChevronLeft
                                className="h-5 w-5 text-neutral-300 group-hover/button:text-cyan-400 group-hover/button:-translate-x-0.5 transition-all duration-200" />
                        </button>
                        <button
                            onClick={handleNext}
                            aria-label="Next testimonial"
                            className="h-9 w-9 rounded-full bg-neutral-900 border border-white/10 hover:border-cyan-400/50 flex items-center justify-center group/button transition-colors">
                            <ChevronRight
                                className="h-5 w-5 text-neutral-300 group-hover/button:text-cyan-400 group-hover/button:translate-x-0.5 transition-all duration-200" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
