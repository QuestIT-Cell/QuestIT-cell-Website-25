// App's Internal Imports
import Home from "@/components/home";
import About from "@/components/about";
import Contact from "@/components/contact";
import { root } from "@/constants/metadata";
import { Events } from "@/components/events";
import Testimonials from "@/components/testimonials";
import { TracingBeam } from "@/components/ui/tracing-beam";

export const metadata = root;

const Root = () => {
  return (
    <TracingBeam className="px-4 mb-7">
      <Home />
      <About />
      <Events featured />
      <Testimonials />
      <Contact />
    </TracingBeam>
  );
};

export default Root;
