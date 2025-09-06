"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { cn } from "@/lib/utils"; // assume you have this utility
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

import Link from "next/link";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "./theme-toggle";
import { CornerDownRight, Equal, Search, X } from "lucide-react";
import { sampleSnippetsData, users } from "@/lib/data";
import SnippetCards from "./snippetCards";

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

  const handleDrawerToggle = () => {
    if (drawerOpen) {
      setDrawerOpen(false);
    } else {
      setDrawerOpen(true);
    }
  };

  return (
    <>
      {/* Navbar */}
      <motion.header
        className={cn(
          "sticky mt-4 z-50 flex items-center justify-between px-4 md:px-8 h-16 bg-background/10 w-[85%] mx-auto backdrop-blur-3xl rounded-xl shadow-xl border border-border",
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
        <div className="hidden md:flex items-center gap-4 max-w-lg ml-6">
          <Button
            variant={"outline"}
            className="hidden max-xl:block"
            onClick={handleDrawerToggle}
          >
            {drawerOpen ? "Close" : "Menu"}
          </Button>
          <Dialog>
            <DialogTrigger asChild className="hidden xl:block">
              <Input
                type="search"
                readOnly
                placeholder="Search snippets..."
                className="w-[300px] rounded-md bg-background border border-border placeholder-gray-400 text-primary focus:outline-none font-poppins"
                aria-label="Search snippets"
              />
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-lg   px-3 pb-5 pt-4 rounded-xl border-0 ring-[3px] ring-border shadow-2xl "
              showCloseButton={false}
            >
              <DialogHeader>
                <DialogTitle>
                  <Input
                    type="search"
                    placeholder="Search snippets..."
                    className="rounded-md bg-background border border-border placeholder-gray-400 text-foreground f  font-poppins font-normal focus-within:ring-0 focus:ring-0"
                    aria-label="Search snippets"
                  />
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col justify-start px-2 overflow-hidden">
                <h3 className="text-foreground font-poppins text-xs flex mb-2">
                  snippets <CornerDownRight size={13} className="ml-2 mt-1" />
                </h3>
                <div className="flex flex-col items-stretch gap-3 max-h-[350px] overflow-y-auto no-scrollbar pr-2">
                  {sampleSnippetsData.map((snippet, idx) => (
                    <div
                      key={snippet.title + idx}
                      className="flex flex-col border rounded-lg shadow p-4 bg-background"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar with fallback letter */}
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-foreground">
                          {users[snippet.userId]?.slice(0, 1).toUpperCase() ??
                            "U"}
                        </div>
                        <span className="font-medium text-foreground">
                          {users[snippet.userId] ?? "Unknown"}
                        </span>
                      </div>
                      {/* Title and description with spacing */}
                      <div className="mt-2">
                        <div className="font-semibold text-lg mb-1">
                          {snippet.title}
                        </div>
                        <div className="text-foreground text-sm">
                          {snippet.description.length > 80
                            ? snippet.description.slice(0, 80) + "..."
                            : snippet.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <ModeToggle />
          <Avatar className="bg-primary ring-1 ring-primary ring-offset-4 ring-offset-background hover:scale-105 transition-transform duration-300 cursor-default">
            <AvatarImage src="/avatar-placeholder.png" alt="User avatar" />
            <AvatarFallback className="bg-primary text-white dark:text-black">
              U
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Mobile menu button (visible only on mobile) */}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="left">
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden text-white focus:ring-0 focus:outline-none"
              aria-label="Open and close menu"
              onClick={handleDrawerToggle}
            >
              {drawerOpen ? (
                <X className="text-foreground" />
              ) : (
                <Equal className="text-foreground" />
              )}
            </Button>
          </DrawerTrigger>

          <DrawerPortal>
            <DrawerOverlay className="fixed inset-0 top-24 dark:bg-background/85 bg-background/87 blur-lg z-30" />
            <DrawerContent className="border-none fixed mt-20 bg-transparent overflow-y-auto no-scrollbar p-4 z-50">
              <div>
                <nav>
                  <ul className="relative flex flex-col gap-2 font-bold dark:text-foreground text-[#000000] z-50  text-2xl sm:text-4xl select-none items-start pl-9 sm:pl-20 ">
                    <DialogTitle className="text-xs font-normal tracking-wider font-poppins my-2">
                      Menu
                    </DialogTitle>
                    <li>
                      <Link href="#" className="hover:underline">
                        Snippets
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:underline">
                        Create
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:underline">
                        Category
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:underline">
                        tags
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:underline">
                        Settings
                      </Link>
                    </li>
                    {/* Add other links in order here */}
                  </ul>
                </nav>
              </div>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      </motion.header>
    </>
  );
}
