// Next's Imports
import dynamic from "next/dynamic";

// App's Internal Imports
import "./globals.css";
import "@/styles/mobile-responsive.css";
import poppins from "./font";
import { root } from "@/constants/metadata";
const ClientLayout = dynamic(() => import("@/components/client-layout"));

// App's External Imports
import { GoogleTagManager } from "@next/third-parties/google";

// Export metadata for SEO
export const metadata = root;

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`antialiased ${poppins.className} overflow-x-hidden`}>
        <ClientLayout>{children}</ClientLayout>
        {process.env.NODE_ENV !== "development" && (
          <GoogleTagManager
            gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}
          />
        )}
      </body>
    </html>
  );
};

export default RootLayout;
