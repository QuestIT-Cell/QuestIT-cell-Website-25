"use client";

// React's Imports
import { useState, useEffect } from "react";

// Next's Imports
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// App's Internal Imports
import "./globals.css";
import poppins from "./font";
import Header from "@/components/header";
import Footer from "@/components/footer";
const Loader = dynamic(() => import("@/components/loader"), {
  ssr: false,
});
import { ScrollToTop, CookieConsent } from "@/components/utils";

// App's External Imports
import NextTopLoader from "nextjs-toploader";
import { getCookie, hasCookie } from "cookies-next/client";
import { GoogleTagManager } from "@next/third-parties/google";

const RootLayout = ({ children }) => {
  const [is_mounted, set_is_mounted] = useState(false);
  const [is_cookie_consent_given, set_is_cookie_consent_given] = useState(null);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    set_is_mounted(true);
    const cookie_consent = hasCookie("cookie_consent");

    if (cookie_consent) {
      const consent_value = getCookie("cookie_consent") === "true";
      set_is_cookie_consent_given(consent_value);
    } else {
      set_is_cookie_consent_given(null);
    }

    return () => {
      set_is_mounted(false);
      set_is_cookie_consent_given(null);
    };
  }, []);

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`antialiased ${poppins.className} overflow-x-hidden`}>
        {is_mounted ? (
          <>
            <NextTopLoader zIndex={10500} color="#00FAFF" showSpinner={false} />
            {!isAdminRoute && <Header />}
            {children}
            {is_cookie_consent_given === null && <CookieConsent />}
            {!isAdminRoute && <Footer />}
            <ScrollToTop />
            {process.env.NODE_ENV !== "development" && (
              <GoogleTagManager
                gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}
              />
            )}
          </>
        ) : (
          <Loader className="flex w-full h-screen justify-center items-center" />
        )}
      </body>
    </html>
  );
};

export default RootLayout;
