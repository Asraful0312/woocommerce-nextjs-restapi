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
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { setAuth } = useAuthStore();

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
    onSuccess: ({data}) => {
      console.log(data)
      setAuth(data.token, data.user_email, data.user_display_name);
      router.push("/");
    },
    onError: (error: any) => {
      setError("email", {
        type: "manual",
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      });
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    mutation.mutate(data);
  };

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="flex justify-center">
      <Card className="w-[350px] mt-20">
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
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
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
  );
}
