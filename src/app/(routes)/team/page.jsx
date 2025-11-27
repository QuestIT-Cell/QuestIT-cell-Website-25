// App's Internal Imports
import { team as meta_data } from "@/constants/metadata";
import { Team as TeamComponent } from "@/components/team";
import { TracingBeam } from "@/components/ui/tracing-beam";

export const metadata = meta_data;

const Team = () => {
  return (
    <TracingBeam className="px-4 mb-7 max-h-[50%]">
      <TeamComponent />
    </TracingBeam>
  );
};

export default Team;
