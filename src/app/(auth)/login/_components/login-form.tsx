// ==========================================
// 📁 src/app/(auth)/login/_components/login-form.tsx
// ==========================================
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { signInAction } from "../../../actions/auth";
import { LoginCard } from "./login-card";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (formData: FormData) => {
    // Clear previous errors
    setErrors({});

    // Client-side validation
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Start transition for better UX
    startTransition(async () => {
      try {
        await signInAction(formData);
        toast.success("Login successful! Redirecting...");
        router.push("/");
      } catch (error) {
        // Handle specific error types
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";

        if (errorMessage.includes("email")) {
          setErrors({ email: errorMessage });
        } else if (errorMessage.includes("password")) {
          setErrors({ password: errorMessage });
        } else {
          toast.error(errorMessage);
        }
      }
    });
  };

  return (
    <LoginCard
      handleSubmit={handleSubmit}
      isPending={isPending}
      errors={errors}
    />
  );
}
