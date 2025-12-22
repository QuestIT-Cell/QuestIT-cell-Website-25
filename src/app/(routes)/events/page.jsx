// App's Internal Imports
import { FlipWords } from "@/components/ui/flip-words";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { events as meta_data } from "@/constants/metadata";
import { Events as EventsComponent } from "@/components/events";

export const metadata = meta_data;

const Events = () => {
  const words = ["Dynamic", "Exciting", "Engaging", "Memorable"];

  return (
    <TracingBeam className="w-full max-w-none px-4 mb-7">
      <div className="w-full max-w-none px-4 py-10 sm:px-6 lg:px-8 mx-auto">
        <div className="mx-auto text-center mb-10 lg:mb-14 pt-40">
          <div className="text-2xl md:text-3xl mx-auto font-normal text-neutral-400">
            Discover&nbsp;
            <FlipWords words={words} />
            Events With QuestIT
          </div>
        </div>

        <EventsComponent />
      </div>
    </TracingBeam>
  );
};

export default Events;
