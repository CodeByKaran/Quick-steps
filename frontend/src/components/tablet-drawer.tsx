"use client";

import { Drawer } from "vaul";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SearchDialog from "./search-dialog";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function TabletDrawer() {
  const router = useRouter();

  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[&gt;svg]:px-3 max-xl:block min-xl:hidden"
        aria-label="Open tablet menu"
      >
        Menu
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-background/40" />
        <Drawer.Content
          className="right-2 top-2 bottom-2 fixed  outline-none w-[310px] flex z-50"
          // The gap between the edge of the screen and the drawer is 8px in this case.
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
          aria-describedby="navigation links and dark mode and user profile and search buttons"
        >
          <div className="bg-background h-full w-full grow p-5 flex flex-col rounded-[16px] border border-border">
            <div className="w-full h-[90%] mx-auto font-poppins">
              <Drawer.Title className="font-medium mb-2 text-foreground text-3xl ">
                Navigation
              </Drawer.Title>
              {/* divider */}
              <div className="w-full h-[1px] bg-border" />
              {/* layout div */}
              <div className="flex flex-col justify-between h-full">
                {/* navigation div */}
                <div className="my-6">
                  <nav className="pl-1">
                    <NavigationMenu viewport={false} className="p-0">
                      <ul className="flex flex-col gap-2 font-bold text-foreground text-2xl select-none">
                        <Drawer.Close className="text-start" asChild>
                          <li>
                            <button
                              className="hover:underline"
                              onClick={() => router.push("/")}
                            >
                              Snippets
                            </button>
                          </li>
                        </Drawer.Close>
                        <Drawer.Close className="text-start" asChild>
                          <li className="hover:underline">
                            <button
                              className="hover:underline"
                              onClick={() => router.push("/create")}
                            >
                              Create
                            </button>
                          </li>
                        </Drawer.Close>

                        <NavigationMenuItem className="bg-transparent w-full px-0">
                          <NavigationMenuTrigger className="px-0">
                            <span
                              className={cn(
                                " cursor-pointer font-bold text-foreground text-2xl select-none z-10"
                              )}
                            >
                              Cateagory
                            </span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent
                            className="border-2 border-border p-0 bg-transparent"
                            color="none"
                          >
                            <div className="grid grid-cols-1 overflow-y-auto no-scrollbar w-[260px] h-[250px] max-h-[250px] bg-background gap-4 p-4 text-base"></div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </ul>
                    </NavigationMenu>
                  </nav>
                </div>
                {/* footer div */}
                <div className="w-full flex flex-col gap-y-3">
                  <div className="flex items-center justify-end px-2 gap-x-3">
                    <span className="min-[768px]:hidden">
                      <ModeToggle />
                    </span>

                    <div>
                      <Avatar className="bg-primary ring-1 ring-primary ring-offset-4 ring-offset-background hover:scale-105 transition-transform duration-300 cursor-default  min-[768px]:hidden">
                        <AvatarImage
                          src="/avatar-placeholder.png"
                          alt="User avatar"
                        />
                        <AvatarFallback className="bg-primary text-white dark:text-black">
                          U
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div>
                    <span className="min-[1000px]:hidden w-full mt-9">
                      <SearchDialog />
                    </span>
                  </div>
                </div>
              </div>
              {/* end of main div */}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
