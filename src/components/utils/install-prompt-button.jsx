"use client";

// React's Imports
import { useState, useEffect } from "react";

// App's External Imports
import { Download } from "lucide-react";

const InstallPromptButton = () => {
  const [is_installable, set_is_installable] = useState(false);
  const [deferred_prompt, set_deferred_prompt] = useState(null);

  const handle_app_installed = () => {
    set_is_installable(false);
  };

  const handle_install = async () => {
    if (deferred_prompt) {
      deferred_prompt.prompt();

      handle_app_installed();
      set_deferred_prompt(null);
    }
  };

  useEffect(() => {
    const handle_before_install_prompt = (event) => {
      event.preventDefault();
      set_is_installable(true);
      set_deferred_prompt(event);
    };

    if (window.matchMedia("(display-mode: standalone)").matches) {
      handle_app_installed();
    }

    window.addEventListener(
      "beforeinstallprompt",
      handle_before_install_prompt
    );
    window.addEventListener("appinstalled", handle_app_installed);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handle_before_install_prompt
      );
      window.removeEventListener("appinstalled", handle_app_installed);
    };
  }, []);

  return (
    is_installable && (
      <button
        onClick={handle_install}
        className="flex items-center gap-2 px-4 py-2 mr-8 md:-mr-5 lg:mr-10 bg-cyan-600 hover:bg-cyan-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
      >
        <Download className="w-[18px] h-[18px]" /> Install App
      </button>
    )
  );
};

export default InstallPromptButton;
