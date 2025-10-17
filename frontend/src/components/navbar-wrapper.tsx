"use client";
import React from "react";
import Navbar from "./nav-bar";
import { usePathname } from "next/navigation";

const NavBarWrapper = () => {
  const path = usePathname();

  console.log(path.split("/")[1] === "sign-in");

  if (path !== "/" && /^\/(\d+)?$/.test(path)) {
    return <></>;
  }
  if (path.split("/")[1] === "sign-in" || path.split("/")[1] === "sign-up") {
    return <></>;
  }

  return <Navbar />;
};

export default NavBarWrapper;
