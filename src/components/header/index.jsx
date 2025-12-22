"use client";

// React's Hook Imports
import { useState, useEffect } from "react";

// App's Internal Imports
import menu from "@/constants/menu";
import { InstallPromptButton } from "../utils";

// App's External Imports
// App's External Imports
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

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
        className={`flex left-0 top-0 w-full items-center z-[10000] ${is_sticky
          ? "fixed w-full border-b py-2 backdrop-blur-[5px] transition bg-transparent"
          : "absolute bg-black py-4"
          }`}
      >
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="relative w-full flex items-center justify-between">
            <div className="w-[140px] md:w-[180px] lg:w-[220px] max-w-full z-10 flex-shrink-0">
              <Link href="/" className="block w-full">
                <Image
                  priority
                  width={220}
                  height={80}
                  unoptimized
                  alt="Header Icon"
                  className="w-full h-auto"
                  src="/images/logo.png"
                />
              </Link>
            </div>

            <div className="flex items-center justify-end flex-1 pr-4 lg:pr-0">
              <nav className="invisible absolute right-5 top-[120%] z-30 rounded border-[0.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:p-0 lg:opacity-100 lg:bg-transparent">
                <ul className="block lg:flex lg:gap-x-4 xl:gap-x-8 items-center">
                  {menu.map((item, index) => (
                    <li key={index} className="relative group">
                      {item.dropdown ? (
                        <>
                          <button className="relative overflow-hidden group/btn flex items-center py-2 text-base lg:text-base font-medium hover:text-cyan-300 lg:inline-flex lg:px-2 lg:py-6 text-white border-b-0 cursor-pointer">
                            <span className="absolute inset-0 bg-cyan-500/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out"></span>
                            <span className="relative z-10 flex items-center gap-1">
                              {item.name}
                              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                            </span>
                          </button>
                          <ul className="absolute left-0 top-full pt-2 w-48 hidden group-hover:block transition-all duration-300 ease-in-out z-50">
                            <div className="bg-black border border-neutral-800 rounded-md overflow-hidden shadow-xl">
                              {item.dropdown.map((subItem, subIndex) => (
                                <li key={subIndex} className="border-b border-neutral-800 last:border-none">
                                  <Link
                                    href={subItem.path}
                                    className="block px-4 py-3 text-sm text-gray-300 hover:text-cyan-300 hover:bg-neutral-900 transition-colors relative overflow-hidden group/link"
                                  >
                                    <span className="absolute inset-0 bg-cyan-500/10 -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-in-out"></span>
                                    <span className="relative z-10">{subItem.name}</span>
                                  </Link>
                                </li>
                              ))}
                            </div>
                          </ul>
                        </>
                      ) : item.special ? (
                        <Link
                          href={item.path}
                          className="relative overflow-hidden group/link flex py-2 text-base lg:text-sm font-medium lg:inline-flex lg:px-3 lg:py-1.5 text-white bg-neutral-800 rounded-[1.5rem] border border-neutral-700 hover:border-cyan-500/50 hover:bg-neutral-800/80 transition-all duration-300 ml-1"
                        >
                          <span className="relative z-10 flex items-center gap-1.5">
                            <span className="text-cyan-500 group-hover/link:text-cyan-400 transition-colors">
                              {item.icon}
                            </span>
                            <span className="group-hover/link:text-cyan-300 transition-colors">
                              {item.name}
                            </span>
                          </span>
                        </Link>
                      ) : (
                        <Link
                          href={item.path}
                          className="relative overflow-hidden group/link flex py-2 text-base lg:text-base font-medium hover:text-cyan-300 lg:inline-flex lg:px-1.5 lg:py-6 text-white border-b-0"
                        >
                          <span className="absolute inset-0 bg-cyan-500/20 -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-in-out"></span>
                          <span className="relative z-10">{item.name}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
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
