"use client"
/* eslint-disable prefer-const */
import { fetchColors } from "@/lib/fetchColors";
import { useEffect } from "react";

function hexToHSL(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h: number = 0,
    s: number,
    l: number = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
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
  }

  return `${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {

    async function loadColor() {
      const color = await fetchColors();
      if (color) {
        const hslColor = hexToHSL(color); // Convert HEX to HSL
        document.documentElement.style.setProperty("--primary", hslColor);
        console.log("Converted HSL Color:", hslColor);
      }
    }

    loadColor();
  }, []);

  return <>{children}</>;
}
