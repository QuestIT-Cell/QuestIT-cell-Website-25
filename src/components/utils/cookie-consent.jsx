"use client";

// React's Imports
import { useState, useEffect } from "react";

// App's Internal Imports
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// App's External Imports
import { CookieIcon } from "lucide-react";
import { setCookie } from "cookies-next/client";

const CookieConsent = () => {
  const [is_modal_open, set_is_modal_open] = useState(false);

  const set_cookie_consent = (consent_value) => {
    setCookie("cookie_consent", consent_value, {
      path: "/",
      sameSite: "Strict",
      maxAge: 365 * 24 * 60 * 60,
    });

    set_is_modal_open(false);
  };

  useEffect(() => {
    set_is_modal_open(true);

    return () => {
      set_is_modal_open(false);
    };
  }, []);

  return (
    <div
      className={cn(
        !is_modal_open
          ? "transition-[opacity,transform] translate-y-8 opacity-0 -z-50"
          : "transition-[opacity,transform] translate-y-0 opacity-100 z-[1000]",
        "fixed bottom-24 left-0 right-0 lg:left-4 lg:bottom-4 w-full sm:max-w-md duration-700"
      )}
    >
      <div className="bg-card rounded-md m-3 border border-border shadow-lg">
        <div className="grid gap-2">
          <div className="border-b border-border h-14 flex items-center justify-between p-4">
            <h1 className="text-lg font-medium">We use cookies</h1>
            <CookieIcon className="h-[1.2rem] w-[1.2rem]" />
          </div>

          <div className="p-4">
            <p className="text-sm font-normal text-start">
              We use cookies to enhance your experience, track website usage
              with Google Analytics, and monitor errors with Sentry for improved
              performance.
              <br />
              <br />
              <span className="text-xs">
                By clicking "
                <span className="font-medium opacity-80">Accept</span>", you
                agree to our use of cookies.
              </span>
            </p>
          </div>

          <div className="flex gap-2 p-4 py-5 border-t border-border bg-background/20">
            <Button
              className="w-full"
              onClick={() => {
                set_cookie_consent(true);
              }}
            >
              Accept
            </Button>

            <Button
              className="w-full"
              variant="secondary"
              onClick={() => {
                set_cookie_consent(false);
              }}
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
