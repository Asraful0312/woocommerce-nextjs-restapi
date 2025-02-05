"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import RedirectIfAuthenticated from "@/components/RedirectIfAuthenticated";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import Image from "next/image";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { setAuth } = useAuthStore();
  const { login, loading, redirect, setRedirect } = useGoogleAuth();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>();

  // React Query mutation for login
  const mutation = useMutation({
    mutationFn: async (data: LoginFormInputs) => {
      const response = await axios.post("/api/auth/login", data);
      return response.data;
    },
    onSuccess: ({ data }) => {
      const type = "email";
      setAuth(
        data.token,
        data.user_email,
        data.user_display_name,
        data?.id,
        type
      );
      console.log("login data", data);
      setRedirect(true);
      router.replace("/");
    },
    onError: (error: any) => {
      setError("email", {
        type: "manual",
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      });
      setRedirect(false);
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    mutation.mutate(data);
  };

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <RedirectIfAuthenticated>
      <div className="flex justify-center">
        <Card className="w-[400px] mt-20 relative">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="Password"
                    type={isVisible ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="pe-9"
                  />
                  <button
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                  >
                    {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {mutation.isError && (
                <p className="text-red-500 text-sm">
                  Failed to login. Please check your credentials.
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending || loading || redirect}
              >
                {mutation.isPending ? "Logging in..." : "Login"}
              </Button>

              <p className="text-center text-sm text-muted-foreground relative z-10">
                <span className="bg-white p-1 rounded-full">OR</span>
                <p className="w-full bg-gray-300 top-1/2 absolute inset-x-0 h-[1px] -z-10" />
              </p>

              <Button
                className="w-full flex items-center justify-center gap-2"
                disabled={mutation.isPending || loading || redirect}
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  login();
                }}
              >
                <Image
                  className="shrink-0"
                  src="/google.png"
                  alt="google image"
                  width={16}
                  height={16}
                />
                {loading ? "Loading..." : "Google Login"}
              </Button>
            </form>

            {/* redirect ui */}
            {redirect && (
              <div className="absolute gap-2 inset-0 bg-white/80 flex items-center justify-center">
                <Loader2 className="size-4 animate-spin shrink-0" />
                <p className="text-sm text-center">Redirecting to home page</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full">
              Don’t have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </RedirectIfAuthenticated>
  );
}
