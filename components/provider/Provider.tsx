"use client";

const client = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

import { GoogleOAuthProvider } from "@react-oauth/google";
import ThemeProvider from "./ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={`${client}`}>
        {children}
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}
