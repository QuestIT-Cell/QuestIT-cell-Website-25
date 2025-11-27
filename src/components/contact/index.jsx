// Next's Imports
import Link from "next/link";

// App's Internal Imports
import { Vortex } from "@/components/ui/vortex";

const Contact = () => {
  return (
    <div
      id="contact"
      className="w-[90%] mx-auto rounded-md h-[27.5rem] overflow-hidden -mt-20 md:-mt-10"
    >
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-5xl font-bold text-center">
          Connect with Quest IT
        </h2>

        <p className="text-white text-sm md:text-xl max-w-xl mt-6 text-center">
          Reach out or meet our team.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link
            href="mailto:questit@ves.ac.in"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
          >
            Contact Us
          </Link>

          <Link href="/team" className="px-4 py-2 text-white">
            Meet the Team
          </Link>
        </div>
      </Vortex>
    </div>
  );
};

export default Contact;
