"use client";
import React, { useState } from "react";
import Wrapper from "./Wrapper";
import Logo from "./Logo";
import Link from "next/link";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ArrowRight, Search, User, X } from "lucide-react";
import { buttonVariants } from "../ui/enhancedButton";
import NavBar from "./NavBar";
import { useClickOutside } from "@mantine/hooks";
import { Input } from "../ui/input";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));
  return (
    <header className="">
      <Wrapper className="py-3 border-b flex items-center justify-between">
        <Logo />
        <NavBar />

        <div className="flex items-center gap-1">
          <Link
            className={buttonVariants({
              variant: "link",
              effect: "underline",
            })}
            href="/login"
          >
            Login
          </Link>

          {/* search bar */}
          <div className="relative">
            <button className="mt-2" onClick={() => setIsOpen((prev) => !prev)}>
              {isOpen ? (
                <X className="size-5 shrink-0" />
              ) : (
                <Search className="size-5 shrink-0" />
              )}
            </button>
            <div
              ref={ref}
              className={`absolute right-0 border p-3 w-[300px] md:w-[400px] z-50 top-8 bg-white rounded transition-all duration-300 ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              <div className="relative mb-3">
                <Input
                  className="peer pe-9 ps-9 shadow-none"
                  placeholder="Search..."
                  type="search"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <Search size={16} strokeWidth={2} />
                </div>
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Submit search"
                  type="submit"
                >
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>

              <p className="text-muted-foreground text-center">
                No products found!
              </p>
            </div>
          </div>

          {/* user options */}
          <Menubar className="shadow-none border-none rounded-full">
            <MenubarMenu>
              <MenubarTrigger className="rounded-full size-8 flex items-center justify-center shrink-0">
                <User className="shrink-0 size-5" />
              </MenubarTrigger>
              <MenubarContent className="">
                <MenubarItem>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>New Window</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Share</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Print</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </Wrapper>
    </header>
  );
};

export default Header;
