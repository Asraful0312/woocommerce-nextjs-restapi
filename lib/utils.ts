import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "dompurify";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://wpmethods-shop.vercel.app/api"
    : process.env.NEXT_PUBLIC_SITE_URL;
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractPrice = (html: string) => {
  if (typeof window === "undefined") return ""; // Prevents error in SSR

  const div = document.createElement("div");
  div.innerHTML = html;
  const priceElements = div.querySelectorAll(".woocommerce-Price-amount bdi");
  const prices = Array.from(priceElements).map(
    (el) => el.textContent?.trim() || ""
  );

  return prices.length === 2
    ? `<del>${prices[0]}</del> ${prices[1]}`
    : prices[0] || "";
};

export const sanitize = (content: any) => {
  return "undefined" !== typeof window ? DOMPurify.sanitize(content) : content;
};

export const isSSLC = true;
export const isStripe = true;
export const isPaypal = true