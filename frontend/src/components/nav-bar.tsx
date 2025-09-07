"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import Link from "next/link";

import TabletDrawer from "./tablet-drawer";
import { ModeToggle } from "./theme-toggle";
import SearchDialog from "./search-dialog";

const navLinks = [
  { label: "Snippets", href: "/snippets" },
  { label: "Create", href: "/create" },
  { label: "Settings", href: "/settings" },
  { label: "Category", href: "/category" },
  { label: "Tags", href: "/tags" },
];

export default function Navbar() {
  const [active, setActive] = useState("Snippets");

  const { scrollY, scrollYProgress } = useScroll();
  const [scrollDirection, setScrollDirection] = useState("down");

  useMotionValueEvent(scrollY, "change", (current) => {
    const diff = current - scrollY.getPrevious()!;
    setScrollDirection(diff > 0 ? "down" : "up");
  });

  useEffect(() => {
    console.log(
      `Scroll direction: ${scrollDirection},\n Scroll Y Progress: ${scrollYProgress.get()}`
    );
  }, [scrollDirection, scrollYProgress]);

  return (
    <>
      {/* Navbar */}
      <motion.header
        className={cn(
          "sticky mt-4 z-50 flex items-center justify-between px-4 md:px-8 h-16 bg-background/10 w-[85%] mx-auto backdrop-blur-lg rounded-xl shadow-xl border border-border",
          scrollDirection === "up" &&
            "top-4 left-0 right-0 transition-all duration-300",
          scrollDirection === "down" && "-top-16 transition-all duration-300"
        )}
      >
        {/* Left: Animated Logo Text */}

        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-code-icon lucide-code"
          >
            <path d="m16 18 6-6-6-6" />
            <path d="m8 6-6 6 6 6" />
          </svg>
          <motion.h1
            initial={{ x: -50, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
            }}
            className="text-lg font-extrabold select-none cursor-default font-poppins leading-5 ml-2 text-foreground"
            aria-label="Quick Snippets"
          >
            {" "}
            Quick
            <br />
            Snippets
          </motion.h1>
        </div>

        {/* Middle: Nav Links (hidden on mobile) */}
        <nav className="hidden xl:flex gap-3 justify-end ">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-3 py-1 font-semibold cursor-pointer rounded-md transition-colors hover:bg-white/20"
              )}
              onClick={(e) => {
                e.preventDefault();
                setActive(link.label);
              }}
            >
              {/* Animate underline */}
              <span className="relative z-10">{link.label}</span>
              {active === link.label && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 -bottom-2 w-full h-1 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side - Search and Avatar (hidden on mobile) */}
        <div className="flex items-center gap-4  ml-6">
          <TabletDrawer />
          <span className="max-[1000px]:hidden">
            <SearchDialog />
          </span>
          <span className="md:block hidden">
            <ModeToggle />
          </span>

          <Avatar className="bg-primary ring-1 ring-primary ring-offset-4 ring-offset-background hover:scale-105 transition-transform duration-300 cursor-default md:block hidden">
            <AvatarImage src="/avatar-placeholder.png" alt="User avatar" />
            <AvatarFallback className="bg-primary text-white dark:text-black">
              U
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Mobile menu button (visible only on mobile) */}
      </motion.header>
    </>
  );
}
