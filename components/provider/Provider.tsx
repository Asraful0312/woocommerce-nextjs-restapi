"use client";

const client = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

import { GoogleOAuthProvider } from "@react-oauth/google";
import ThemeProvider from "./ThemeProvider";
import ReactQueryProvider from "../ReactQueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={`${client}`}>
          {children}
        </GoogleOAuthProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
