"use client";

const client = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

import { GoogleOAuthProvider } from "@react-oauth/google";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={`${client}`}>{children}</GoogleOAuthProvider>
  );
}
