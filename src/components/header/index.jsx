"use client";

// React's Hook Imports
import { useState, useEffect } from "react";

// App's Internal Imports
import menu from "@/constants/menu";
import { InstallPromptButton } from "../utils";

// App's External Imports
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [is_sticky, set_is_sticky] = useState(false);

  const handle_menu_sticky = () => {
    if (window.scrollY >= 80) {
      set_is_sticky(true);
    } else {
      set_is_sticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handle_menu_sticky);

    return () => {
      window.removeEventListener("scroll", handle_menu_sticky);
    };
  }, []);

  return (
    <>
      <header
        className={`flex left-0 top-0 w-full items-center z-[10000] ${
          is_sticky
            ? "fixed w-full border-b py-2 backdrop-blur-[5px] transition bg-transparent"
            : "absolute bg-black py-4"
        }`}
      >
        <div className="container">
          <div className="relative w-full flex items-center justify-between lg:justify-center">
            <div className="w-[45%] md:w-[30%] lg:w-[12.5%] max-w-full px-4 z-10 -mr-[2rem]">
              <Link href="/" className="block w-full">
                <Image
                  priority
                  width={0}
                  height={0}
                  unoptimized
                  alt="Header Icon"
                  className="w-full"
                  src="/images/logo.png"
                />
              </Link>
            </div>

            <div className="flex items-center justify-between pr-14">
              <nav className="invisible absolute right-5 top-[120%] z-30 rounded border-[0.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:p-0 lg:opacity-100 lg:bg-transparent">
                <ul className="block lg:ml-8 lg:flex lg:gap-x-8 xl:ml-14 xl:gap-x-12">
                  {menu.map(({ name, path }, index) => (
                    <li key={index} className="relative">
                      <Link
                        href={path}
                        className="flex py-2 text-base hover:text-cyan-300 lg:inline-flex lg:px-0 lg:py-6 text-white border-b-0"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <InstallPromptButton />
          </div>
        </div>
      </header>

      <div className="fixed lg:hidden bottom-0 left-0 z-[10000] w-full h-24 border-t-[1.5px] bg-black border-neutral-700">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          {menu
            .filter(({ mobile_nav }) => {
              return mobile_nav;
            })
            .map(({ name, path, icon }, index) => (
              <Link
                key={index}
                href={path}
                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-800 group"
              >
                <span className="w-5 h-5 mb-2 text-gray-400 group-hover:text-cyan-500">
                  {icon}
                </span>

                <span className="text-sm text-gray-400 group-hover:text-cyan-500">
                  {name}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Header;
