// App's Internal Imports
import testimonials from "@/constants/testimonials";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const Testimonials = () => {
  const words = [
    {
      text: "What",
    },
    {
      text: "They",
    },
    {
      text: "Say",
    },
    {
      text: "About",
    },
    {
      text: "Us",
      className: "!text-cyan-300",
    },
  ];

  return (
    <>
      <TypewriterEffect words={words} className="pt-5 md:pt-10" />
      <AnimatedTestimonials testimonials={testimonials} />
    </>
  );
};

export default Testimonials;
