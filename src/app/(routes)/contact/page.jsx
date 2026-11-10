// App's Internal Imports
import Contact from "@/components/contact";
import { TracingBeam } from "@/components/ui/tracing-beam";

export const metadata = {
  title: "Contact Us | QuestIT VESIT",
  description:
    "Get in touch with the QuestIT team and secretaries at VES Institute of Technology Mumbai.",
};

const ContactPage = () => {
  return (
    <TracingBeam className="w-full max-w-none px-4 md:px-10 mb-7 pt-24 md:pt-32">
      <Contact />
    </TracingBeam>
  );
};

export default ContactPage;
