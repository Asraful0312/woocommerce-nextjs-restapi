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

import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import Image from "next/image";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const { login, loading, redirect, setRedirect } = useGoogleAuth();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  // React Query mutation
  const mutation = useMutation({
    mutationFn: async (data: RegisterFormInputs) => {
      const response = await axios.post("/api/auth/register", data);
      return response.data;
    },
    onSuccess: () => {
      setRedirect(true);
      router.push("/login");
    },
    onError: (error: any) => {
      setError("email", {
        type: "manual",
        message: error.response?.data?.message || "Registration failed",
      });
      setRedirect(false);
    },
  });

  const onSubmit = (data: RegisterFormInputs) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center">
      <Card className="w-[400px] mt-20">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                disabled={mutation.isPending || loading}
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                disabled={mutation.isPending || loading}
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
                  className="pe-9"
                  id="password"
                  placeholder="Password"
                  disabled={mutation.isPending || loading}
                  type={isVisible ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80"
                  type="button"
                  onClick={() => setIsVisible((prev) => !prev)}
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

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending || loading || redirect}
            >
              {mutation.isPending ? "Registering..." : "Register"}
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
              {loading ? "Loading..." : "Google Sign Up"}
            </Button>
          </form>

          {/* redirect ui */}
          {redirect && (
            <div className="absolute gap-2 inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin shrink-0" />
              <p className="text-sm text-center">Redirecting please wait</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
