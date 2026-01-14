"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signInAction } from "../../../../actions/auth";
import { loginSchema, type LoginFormData } from "../../../../lib/zod_schema";
import { LoginCard } from "./login-card";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    startTransition(async () => {
      // 1. Create FormData
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      // 2. Capture the RESULT of the action
      const result = await signInAction(formData);

      // 3. Check the result
      if (result?.success) {
        toast.success("Login successful! Redirecting...");
        router.push("/");
        router.refresh(); // Refresh to update the session in the layout
      } else {
        // ✅ This is where the error toast finally triggers
        toast.error(result?.error || "Invalid email or password");
      }
    });
  };

  return (
    <LoginCard
      handleSubmit={handleSubmit(onSubmit)}
      isPending={isPending}
      register={register}
      errors={errors}
    />
  );
}
