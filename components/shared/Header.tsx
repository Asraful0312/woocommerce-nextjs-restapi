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
  Search,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Wrapper from "./Wrapper";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants, EnhancedButton } from "../ui/enhancedButton";
import Logo from "./Logo";
import { useClickOutside } from "@mantine/hooks";
import SearchBar from "../SearchBar";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchBar, setIsSearchBar] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));
  const { token, logout, username, userEmail } = useAuthStore();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b"
    >
      <Wrapper className="flex h-16 items-center justify-between relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold"
        >
          <Logo />
        </motion.div>
        <nav className="hidden md:flex space-x-4">
          {[
            { name: "Home", link: "/" },
            { name: "Shop", link: "/shop" },
            { name: "Orders", link: "/orders" },
            { name: "About", link: "/about" },
            { name: "Contact", link: "/contact" },
          ].map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-foreground/60 hover:text-foreground"
            >
              <Link href={item.link}>{item.name}</Link>
            </motion.div>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsSearchBar((prev) => !prev)}>
            {isSearchBar ? (
              <X className="shrink-0 size-5" />
            ) : (
              <Search className="shrink-0 size-5" />
            )}
          </button>
          {!token && (
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
          {token && (
            <Menubar className="shadow-none border-none rounded-full">
              <MenubarMenu>
                <MenubarTrigger className="rounded-full size-8 flex items-center justify-center shrink-0">
                  <User className="shrink-0 size-5" />
                </MenubarTrigger>
                <MenubarContent align="end" className="">
                  <MenubarItem asChild className="">
                    <div className="w-full flex items-start gap-2">
                      <User2 className="shrink-0 size-4" />
                      <p>
                        <span className="block">{username}</span>
                        <span className="block">{userEmail}</span>
                      </p>
                    </div>
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
                  {token && (
                    <MenubarItem onClick={logout}>
                      <LogOutIcon className="shrnk-0 size-4" />
                      <span className="ml-2"> Logout</span>
                    </MenubarItem>
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          )}

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        <SearchBar isSearchBar={isSearchBar} setIsSearchBar={setIsSearchBar} />
      </Wrapper>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden p-4 bg-background border-t"
        >
          {["Home", "Shop", "Orders", "About", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="block py-2 text-foreground/60 hover:text-foreground"
            >
              {item}
            </a>
          ))}
          {!token ? (
            <Link
              href="/login"
              className={buttonVariants({
                className: "w-full mt-4",
              })}
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
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
