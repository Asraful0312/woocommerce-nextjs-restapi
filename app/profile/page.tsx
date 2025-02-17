"use client";

import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/useUser";
import { useAuthStore } from "@/stores/useAuthStore";
import { AtSign, Edit2, Key, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  password?: string;
}

const Profile = () => {
  const { token, userId, userEmail, type, setAuth } = useAuthStore();
  const [editableField, setEditableField] = useState<string | null>(null);
  const { data } = useUser(userId as string, token as string);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: data?.name || "",
      email: userEmail || "",
      password: "",
    },
  });

  // Set default values dynamically when data is available
  useEffect(() => {
    setValue("name", data?.name || "");
    setValue("email", userEmail || "");
  }, [data?.name, userEmail, setValue]);

  const handleEdit = (field: keyof FormData) => {
    setEditableField(field);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`/api/auth/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, userId, ...data }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Profile updated successfully!");
        console.log("result", result);
        const type = "gmail";
        setAuth(
          token as string,
          result?.user?.email,
          result?.user?.name,
          result?.user?.id,
          type
        );
        setEditableField(null); // Disable editing after update
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.log(error);

      toast.error("An error occurred while updating profile");
    }
  };

  return (
    <AuthGuard>
      <div className="px-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-[400px] mx-auto mt-12 space-y-4 border py-3 px-5 rounded-md"
        >
          <h2 className="text-xl text-center font-semibold mt-3">
            Your Profile
          </h2>
          {/* Name Field */}
          <div className="space-y-2">
            <Label>Name</Label>
            <div className="relative flex gap-2">
              <Input
                {...register("name", {
                  required: "Name is required",
                })}
                className="peer ps-9"
                disabled={editableField !== "name"}
                placeholder="Full Name"
              />
              <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                <UserIcon size={16} strokeWidth={2} aria-hidden="true" />
              </div>
              {type !== "google" && (
                <Button
                  type="button"
                  size="icon"
                  variant={editableField === "name" ? "default" : "secondary"}
                  onClick={() => handleEdit("name")}
                >
                  <Edit2 className="size-5" />
                </Button>
              )}
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="relative flex gap-2">
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: "Invalid email format",
                  },
                })}
                className="peer ps-9"
                disabled={editableField !== "email"}
                placeholder="Email"
                type="email"
              />
              <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                <AtSign size={16} strokeWidth={2} aria-hidden="true" />
              </div>
              {type !== "google" && (
                <Button
                  type="button"
                  variant={editableField === "email" ? "default" : "secondary"}
                  size="icon"
                  onClick={() => handleEdit("email")}
                >
                  <Edit2 className="size-5" />
                </Button>
              )}
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative flex gap-2">
              <Input
                {...register("password", {
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="peer ps-9"
                disabled={editableField !== "password"}
                placeholder="New Password"
                type="password"
              />
              <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                <Key size={16} strokeWidth={2} aria-hidden="true" />
              </div>
              {type !== "google" && (
                <Button
                  type="button"
                  size="icon"
                  variant={
                    editableField === "password" ? "default" : "secondary"
                  }
                  onClick={() => handleEdit("password")}
                >
                  <Edit2 className="size-5" />
                </Button>
              )}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </AuthGuard>
  );
};

export default Profile;
