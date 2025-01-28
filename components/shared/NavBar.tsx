import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <nav>
      <ul className="flex items-center gap-6">
        <li>
          <Link
            className="hover:text-primary transition-all duration-300"
            href="/"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className="hover:text-primary transition-all duration-300"
            href="/"
          >
            Shop
          </Link>
        </li>
        <li>
          <Link
            className="hover:text-primary transition-all duration-300"
            href="/"
          >
            Offers
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
