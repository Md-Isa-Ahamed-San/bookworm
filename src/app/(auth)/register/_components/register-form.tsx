// ==========================================
// 📁 src/app/(auth)/register/_components/register-form.tsx
// ==========================================
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { signUpAction } from "../../../actions/auth";
import { RegisterCard } from "./register-card";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    // Clear previous errors
    setErrors({});

    // Client-side validation
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const imageFile = formData.get("image") as File;

    const validationErrors: Record<string, string> = {};

    if (!name || name.length < 1) {
      validationErrors.name = "Name is required";
    }
    if (!email) {
      validationErrors.email = "Email is required";
    }
    if (!password || password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }
    if (!imageFile || imageFile.size === 0) {
      validationErrors.image = "Profile photo is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    // Start transition
    startTransition(async () => {
      try {
        await signUpAction(formData);
        toast.success("Account created successfully! Redirecting...");
        router.push("/");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";

        // Parse error to specific field
        if (errorMessage.includes("email")) {
          setErrors({ email: errorMessage });
        } else if (errorMessage.includes("password")) {
          setErrors({ password: errorMessage });
        } else if (errorMessage.includes("name")) {
          setErrors({ name: errorMessage });
        } else if (
          errorMessage.includes("photo") ||
          errorMessage.includes("image")
        ) {
          setErrors({ image: errorMessage });
        } else {
          toast.error(errorMessage);
        }
      }
    });
  };

  return (
    <RegisterCard
      handleSubmit={handleSubmit}
      isPending={isPending}
      errors={errors}
      imageUrl={imageUrl}
      setImageUrl={setImageUrl}
    />
  );
}
