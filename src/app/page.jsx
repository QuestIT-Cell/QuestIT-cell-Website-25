// App's Internal Imports
import Home from "@/components/home";
import About from "@/components/about";
import Contact from "@/components/contact";
import { root } from "@/constants/metadata";
import { Events } from "@/components/events";
import Testimonials from "@/components/testimonials";
import { TracingBeam } from "@/components/ui/tracing-beam";

import GenesisPromo from "@/components/genesis-promo";

export const metadata = root;

const Root = () => {
  return (
    <TracingBeam className="w-full max-w-none px-4 md:px-10 mb-7">
      <Home />
      <GenesisPromo />
      <About />
      <Events featured />
      {/* <Testimonials /> */}
      <Contact />
    </TracingBeam>
  );
};

export default Root;
