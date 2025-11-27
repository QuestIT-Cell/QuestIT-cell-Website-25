"use client";

// React's Imports
import { useState, useEffect } from "react";

// App's Internal Imports
import { Button } from "@/components/ui/button";

const ScrollToTop = () => {
  const [is_visible, set_is_visible] = useState(false);

  const handle_scroll_to_top = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handle_scroll_to_top_visibility = () => {
    if (window.scrollY > 300) {
      set_is_visible(true);
    } else {
      set_is_visible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handle_scroll_to_top_visibility);

    return () => {
      window.removeEventListener("scroll", handle_scroll_to_top_visibility);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-28 lg:bottom-8 right-8 z-[999] ${
        is_visible ? "visible" : "invisible"
      }`}
    >
      <Button aria-label="Scroll To Top" onClick={handle_scroll_to_top}>
        <span className="mt-[6px] h-3 w-3 rotate-45 border-l-2 border-t-2 border-zinc-900"></span>
      </Button>
    </div>
  );
};

export default ScrollToTop;
