"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import Link from "next/link";

import TabletDrawer from "./tablet-drawer";
import { ModeToggle } from "./theme-toggle";
import SearchDialog from "./search-dialog";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import useLogger from "@/hooks/useLogger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkSession, signoutUser } from "@/functions/userFunctions";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { LogOut } from "lucide-react";

const navLinks = [
  { label: "Snippets", href: "/" },
  { label: "Create", href: "/create" },
];

export default function Navbar() {
  const {
    data: sessionData,
    isLoading: sessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: ["user-session-check"],
    queryFn: async () => checkSession(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    // 5 minutes
  });

  const queryClient = useQueryClient();

  const { mutate: signout, isPending: signoutPending } = useMutation({
    mutationFn: async () => signoutUser(),
    onSuccess: () => {
      // queryClient.removeQueries({ queryKey: ["user-session-check"] });
      // Invalidate or remove the session check query
      queryClient.invalidateQueries({
        queryKey: ["user-session-check"],
        refetchType: "all",
      });

      // OR to completely remove it:
      // queryClient.removeQueries({ queryKey: ["user-session-check"] });
    },
  });
  // const [active, setActive] = useState("/");
  const path = usePathname();
  useLogger("session data in nav bar:" + JSON.stringify(sessionData?.data), [
    sessionData,
  ]);

  useLogger("session error in nav bar:" + JSON.stringify(sessionError), [
    sessionError,
  ]);

  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState("down");

  useMotionValueEvent(scrollY, "change", (current) => {
    const diff = current - scrollY.getPrevious()!;
    setScrollDirection(diff > 0 ? "down" : "up");
  });

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
          <NavigationMenu viewport={false}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative px-3 py-1 font-semibold cursor-pointer rounded-md transition-colors hover:bg-white/20"
                )}
              >
                {/* Animate underline */}
                <span className="relative z-10">{link.label}</span>
                {(link.href !== "/"
                  ? path.startsWith(link.href)
                  : /^\/(\d+)?$/.test(path)) && ( // matches / and /anyNumber
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 -bottom-2 w-full h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                )}
              </Link>
            ))}
            <NavigationMenuItem className="bg-transparent list-none">
              <NavigationMenuTrigger className="bg-transparent">
                <span
                  className={cn(
                    "relative px-2 py-1 font-semibold cursor-pointer z-10"
                  )}
                >
                  Cateagory
                </span>
              </NavigationMenuTrigger>
              <NavigationMenuContent
                className="border-2 border-border p-0 bg-transparent"
                color="none"
              >
                <div className=" overflow-y-auto no-scrollbar w-[260px] h-[250px] max-h-[250px] bg-background gap-2 pl-4 pr-2 py-4"></div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenu>
        </nav>

        {/* Right side - Search and Avatar (hidden on mobile) */}
        <div className="flex items-center gap-4  ml-6">
          <TabletDrawer
            username={sessionData?.user?.username}
            sessionLoading={sessionLoading}
          />
          <span className="max-[1000px]:hidden">
            <SearchDialog />
          </span>
          <span className="md:block hidden">
            <ModeToggle />
          </span>
          {sessionData ? (
            <Popover>
              <PopoverTrigger>
                {" "}
                <Avatar className="bg-primary ring-1 ring-primary ring-offset-4 ring-offset-background hover:scale-105 transition-transform duration-300 cursor-default md:block hidden">
                  <AvatarImage
                    src="/avatar-placeholder.png"
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-primary text-white dark:text-black font-semibold">
                    {sessionData?.user?.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-fit m-2 bg-background/45 backdrop-blur-md border border-border">
                <Button
                  variant="destructive"
                  className="font-poppins w-[150px]"
                  onClick={() => signout()}
                >
                  {signoutPending ? (
                    <span>Signing out...</span>
                  ) : (
                    <>
                      Sign Out
                      <LogOut />
                    </>
                  )}
                </Button>
              </PopoverContent>
            </Popover>
          ) : sessionLoading ? (
            <div className="w-8 h-8 rounded-full bg-primary animate-pulse md:block hidden ring-1 ring-primary ring-offset-4 ring-offset-background"></div>
          ) : (
            <Link href="/sign-in">
              <Button className="px-4 py-1.5 bg-primary rounded-md hover:bg-primary/90 transition-colors text-sm md:block hidden font-poppins">
                Signin
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button (visible only on mobile) */}
      </motion.header>
    </>
  );
}
