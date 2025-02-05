"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const {token} = useAuthStore()

  useEffect(() => {
    if (!token) {
      router.push("/login"); // Redirect to login if no token
    } else {
      setLoading(false); // Allow access
    }
  }, [router, token]);

  if (loading) return <div className="flex items-center justify-center my-10">Loading...</div>;

  return <>{children}</>;
}
