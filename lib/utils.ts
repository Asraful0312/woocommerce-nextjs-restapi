import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://your-production-api.com";

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

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (amount: string, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(Number.parseFloat(amount));
};
