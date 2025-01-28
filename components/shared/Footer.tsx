import Link from "next/link";
import { Input } from "@/components/ui/input";

import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  SendHorizonal,
} from "lucide-react";
import Wrapper from "./Wrapper";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-12 mt-20">
      <Wrapper className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gray-900">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-gray-900">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/sale" className="hover:text-gray-900">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gray-900">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-gray-900">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-gray-900">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-gray-900">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-gray-900">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-gray-900">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p>
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Input className="pe-9" placeholder="Email" type="email" />
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Subscribe"
                >
                  <SendHorizonal size={16} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="text-primary">Wp Methods Store</span>. All rights
            reserved.
          </p>
        </div>
      </Wrapper>
    </footer>
  );
}
