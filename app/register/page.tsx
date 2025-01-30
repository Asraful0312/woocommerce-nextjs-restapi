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
import RedirectIfAuthenticated from "@/components/RedirectIfAuthenticated";

type RegisterFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

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
      router.push("/login");
    },
    onError: (error: any) => {
      setError("email", {
        type: "manual",
        message: error.response?.data?.message || "Registration failed",
      });
    },
  });

  const onSubmit = (data: RegisterFormInputs) => {
    mutation.mutate(data);
  };

  return (
    <RedirectIfAuthenticated>
      <div className="flex justify-center">
        <Card className="w-[350px] mt-20">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
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
                    className="pe-9"
                    id="password"
                    placeholder="Password"
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
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Registering..." : "Register"}
              </Button>
            </form>
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
    </RedirectIfAuthenticated>
  );
}
