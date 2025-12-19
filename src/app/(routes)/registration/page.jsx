// App's Internal Imports
import { registration as meta_data } from "@/constants/metadata";
import Registration from "@/components/registration";
import { TracingBeam } from "@/components/ui/tracing-beam";

export const metadata = meta_data;

const RegistrationPage = () => {
  return (
    <TracingBeam className="px-4 mb-7">
      <Registration />
    </TracingBeam>
  );
};

export default RegistrationPage;