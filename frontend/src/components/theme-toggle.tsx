"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // Determine next theme on click
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          theme === "light"
            ? "scale-0 -rotate-90 absolute"
            : "scale-100 rotate-0"
        }`}
      />
      <Moon
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          theme === "light"
            ? "scale-100 rotate-0"
            : "scale-0 rotate-90 absolute"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
