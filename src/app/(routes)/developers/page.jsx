// Next's Imports
import Link from "next/link";
import Image from "next/image";

// App's Internal Imports
import developers from "@/constants/developers";
import { FlipWords } from "@/components/ui/flip-words";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { LinkPreview } from "@/components/ui/link-preview";
import { developers as meta_data } from "@/constants/metadata";

// App's External Imports
import { Mail, Github, Linkedin } from "lucide-react";

export const metadata = meta_data;

const Developers = () => {
  const words = ["Neat", "Smart", "Driven", "Skilled"];

  return (
    <TracingBeam className="w-full max-w-none px-4 mb-7">
      <div className="w-full max-w-none px-4 py-10 sm:px-6 lg:px-8 mx-auto">
        <div className="mx-auto text-center mb-10 lg:mb-14 pt-40">
          <div className="text-2xl md:text-3xl mx-auto font-normal text-neutral-400">
            Build&nbsp;
            <FlipWords words={words} />
            Solutions With QuestIT Developers
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {developers.map(
            (
              { name, role, email, image, github, linkedin, description },
              index
            ) => (
              <div
                key={index}
                className="flex flex-col rounded-xl p-4 md:p-6 bg-neutral-900 border border-neutral-700"
              >
                <div className="flex items-center gap-x-4">
                  <Image
                    src={image}
                    width={100}
                    height={100}
                    alt="Developer Image"
                    className="size-20 rounded-full"
                  />

                  <div className="grow">
                    <h3 className="font-medium text-neutral-200">{name}</h3>
                    <p className="text-xs uppercase text-neutral-500">{role}</p>
                  </div>
                </div>

                <p className="mt-3 text-[#C7C7C7]">{description}</p>

                <div className="mt-4 flex gap-2">
                  <Link
                    aria-label="Email"
                    href={`mailto:${email}`}
                    className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-neutral-700 text-neutral-400 hover:bg-neutral-700 focus:outline-none focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Mail className="h-4 w-4 transition text-white" />
                  </Link>

                  <LinkPreview
                    url={github}
                    aria-label="GitHub"
                    className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-neutral-700 text-neutral-400 hover:bg-neutral-700 focus:outline-none focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Github className="h-4 w-4 transition text-white" />
                  </LinkPreview>

                  <LinkPreview
                    url={linkedin}
                    aria-label="LinkedIn"
                    className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-neutral-700 text-neutral-400 hover:bg-neutral-700 focus:outline-none focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Linkedin className="h-4 w-4 transition text-white" />
                  </LinkPreview>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </TracingBeam>
  );
};

export default Developers;
