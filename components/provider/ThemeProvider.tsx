/* eslint-disable prefer-const */
"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

function hexToHSL(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h: number = 0,
    s: number,
    l: number = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  } else {
    s = 0; // achromatic
  }

  return `${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}

async function fetchColors() {
  const response = await fetch("/api/colors");
  if (!response.ok) {
    throw new Error("Failed to fetch colors");
  }
  return response.json();
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["colors"],
    queryFn: fetchColors,
  });

  React.useEffect(() => {
    if (data?.primary_color && !isLoading && !isError) {
      const hslColor = hexToHSL(data.primary_color);
      document.documentElement.style.setProperty("--primary", hslColor);
    }
  }, [data, isError, isLoading]);

  return (
    <>
      {isLoading && (
        <div className="flex fixed inset-0 h-full items-center bg-white z-[999] justify-center">
          <div className="loader">
          </div>
        </div>
      )}
      {children}
    </>
  );
}
