import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com"
    : process.env.NEXT_PUBLIC_SITE_URL;
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractPrice = (html: string) => {
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
