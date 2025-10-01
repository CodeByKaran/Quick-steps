"use client";
import React from "react";
import Navbar from "./nav-bar";
import { usePathname } from "next/navigation";

const NavBarWrapper = () => {
  const path = usePathname();

  if (path !== "/" && /^\/(\d+)?$/.test(path)) {
    return <></>;
  }

  return <Navbar />;
};

export default NavBarWrapper;
