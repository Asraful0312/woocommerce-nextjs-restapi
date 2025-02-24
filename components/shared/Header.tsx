"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  User,
  Package,
  LogOutIcon,
  Download,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Wrapper from "./Wrapper";
import Link from "next/link";
import { getAuthToken, useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants, EnhancedButton } from "../ui/enhancedButton";
import Logo from "./Logo";
import SearchBar from "../SearchBar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";

type Props = {
  logo: string;
};

const NAV_LINKS = [
  { name: "Home", link: "/" },
  { name: "Shop", link: "/shop" },
  { name: "Orders", link: "/orders" },
  { name: "About", link: "/about" },
  { name: "Contact", link: "/contact" },
];

const Header = ({ logo }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const authToken = getAuthToken();
  const { logout, username, userEmail } = useAuthStore();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white sticky top-0 z-[90] w-full border-b"
    >
      <Wrapper className="flex py-2 flex-col gap-2 relative">
        <div className="flex md:gap-20 items-center justify-between">
          <Logo logo={logo} />
          <div className="hidden md:block w-full">
            <SearchBar />
          </div>
          <div className="flex items-center space-x-2">
            {!authToken && (
              <Link
                href="/login"
                className={buttonVariants({
                  className: "hidden md:inline-flex",
                  variant: "link",
                  effect: "hoverUnderline",
                })}
              >
                Login
              </Link>
            )}
            {authToken && (
              <Menubar className="shadow-none border-none rounded-full">
                <MenubarMenu>
                  <MenubarTrigger className="rounded-full size-8 flex items-center justify-center shrink-0 bg-transparent">
                    <User className="shrink-0 size-5" />
                  </MenubarTrigger>
                  <MenubarContent align="end" className="">
                    <MenubarItem asChild className="">
                      <Link
                        href="/account"
                        className="w-full flex items-start gap-2"
                      >
                        <User2 className="shrink-0 size-4" />
                        <p>
                          <span className="block">{username}</span>
                          <span className="block">{userEmail}</span>
                        </p>
                      </Link>
                    </MenubarItem>
                    <MenubarItem asChild className="">
                      <Link
                        className="w-full flex items-center gap-2"
                        href="/orders"
                      >
                        <Package className="shrink-0 size-4" />
                        <span className="">Orders</span>
                      </Link>
                    </MenubarItem>
                    <MenubarItem className="">
                      <Link
                        className="w-full flex items-center gap-2"
                        href="/downloads"
                      >
                        <Download className="shrink-0 size-4" />
                        <span className="">Downloads</span>
                      </Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    {authToken && (
                      <MenubarItem onClick={logout}>
                        <LogOutIcon className="shrnk-0 size-4" />
                        <span className="ml-2"> Logout</span>
                      </MenubarItem>
                    )}
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? <X className="shrink-0 size-5"/> : <Menu className="shrink-0 size-5" />}
            </Button>
          </div>
        </div>
        <div className="block md:hidden w-full">
          <SearchBar />
        </div>
      </Wrapper>
      {/* Side Menu */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/10 z-[100]  items-end ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? "0%" : "-100%" }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          className=" w-64 h-full bg-white shadow-lg p-5 flex flex-col"
        >
          <button className="self-end" onClick={() => setIsOpen(false)}>
            <X className="size-6" />
          </button>
          <nav className="mt-4 flex flex-col space-y-4">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className="text-lg hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            {!authToken ? (
              <Link
                href="/login"
                className={buttonVariants({ className: "w-full mt-4" })}
              >
                Sign In
              </Link>
            ) : (
              <EnhancedButton
                className="w-full"
                variant="secondary"
                effect="shineHover"
                onClick={logout}
              >
                Logout
              </EnhancedButton>
            )}
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
