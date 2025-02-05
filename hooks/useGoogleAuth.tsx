"use client";

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setLoading(true);
        console.log("Google login response:", response);

        if (!response.access_token) {
          throw new Error("No access token received from Google");
        }

        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        const userInfo = await userInfoResponse.json();
        console.log("Google User Info:", userInfo);

        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: response.access_token,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
          }),
        });

        const data = await res.json();
        console.log("Google Login Response from Backend:", data);
        const type = "google";

        if (data.success) {
          setAuth(
            data.token,
            userInfo.email,
            userInfo.name,
            data.user?.id,
            type
          );
          setRedirect(true);
          router.push("/"); // Redirect to dashboard or another page
        }
      } catch (error) {
        console.error("Login failed:", error);
        setRedirect(false);
      } finally {
        setLoading(false);
        setRedirect(true);
      }
    },
    onError: () => console.log("Login Failed"),
    flow: "implicit",
    scope: "openid email profile",
  });

  return { login, loading, redirect, setRedirect };
};
