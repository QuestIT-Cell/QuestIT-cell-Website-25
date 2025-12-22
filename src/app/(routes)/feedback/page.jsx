// App's Internal Imports
import { feedback as meta_data } from "@/constants/metadata";
import Feedback from "@/components/feedback";
import { TracingBeam } from "@/components/ui/tracing-beam";

export const metadata = meta_data;

const FeedbackPage = () => {
  return (
    <TracingBeam className="w-full max-w-none px-4 mb-7">
      <Feedback />
    </TracingBeam>
  );
};

export default FeedbackPage;