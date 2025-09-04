"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger,
} from "./ui/drawer";
import { cn } from "@/lib/utils"; // assume you have this utility
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { DialogTitle } from "./ui/dialog";

const navLinks = [
  { label: "Snippets", href: "/snippets" },
  { label: "Create", href: "/create" },
  { label: "Settings", href: "/settings" },
  { label: "Category", href: "/category" },
  { label: "Tags", href: "/tags" },
];

export default function Navbar() {
  const [active, setActive] = useState("Snippets");
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          "sticky z-50 flex items-center justify-between px-4 md:px-8 h-16 bg-background w-full border-b border-border",
          scrollDirection === "up" &&
            "top-0 left-0 right-0 transition-all duration-300",
          scrollDirection === "down" && "-top-16 transition-all duration-300"
        )}
      >
        {/* Left: Animated Logo Text */}
        <motion.h1
          initial={{ x: -50, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 18,
          }}
          className="text-2xl font-extrabold select-none cursor-default font-poppins"
          aria-label="Quick Snippets"
        >
          Quick Snippets
        </motion.h1>

        {/* Middle: Nav Links (hidden on mobile) */}
        <nav className="hidden md:flex gap-6 justify-end ">
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
        <div className="hidden md:flex items-center gap-4  max-w-lg ml-6">
          <Input
            type="search"
            placeholder="Search snippets..."
            className="w-[300px] rounded-md bg-white/20 border border-white/30 placeholder-white/70 text-primary focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search snippets"
          />
          <Avatar className="bg-primary">
            <AvatarImage src="/avatar-placeholder.png" alt="User avatar" />
            <AvatarFallback className="bg-primary text-white dark:text-black">
              U
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Mobile menu button (visible only on mobile) */}
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          direction="right"
        >
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden text-white focus:ring-0 focus:outline-none"
              aria-label="Open menu"
            >
              {/* Hamburger icon */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
          </DrawerTrigger>

          <DrawerPortal>
            <DrawerOverlay className="fixed inset-0 bg-background/50 blur-xl" />
            <DrawerContent
              title="navigation menu"
              className="fixed top-0 right-0 bottom-0 w-72 bg-background border-l border-border shadow-lg p-4 flex flex-col rounded-l-xl"
            >
              <DialogTitle className="mb-7 mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold font-poppins text-foreground">
                    Navigations
                  </span>
                  <Button
                    variant="ghost"
                    className="self-center "
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close menu"
                  >
                    {/* Close icon */}
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </Button>
                </div>
              </DialogTitle>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-4 flex-grow"
              >
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "px-4 py-2 rounded-md text-white font-semibold transition-colors hover:bg-white/20",
                        active === link.label && "bg-primary"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        setActive(link.label);
                        setDrawerOpen(false);
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <Input
                  type="search"
                  placeholder="Search snippets..."
                  className="rounded-md bg-primary border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Search snippets"
                />
                <div className="mt-auto flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src="/avatar-placeholder.png"
                      alt="User avatar"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="text-white font-semibold">Your Account</span>
                </div>
              </motion.div>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      </motion.header>
    </>
  );
}
