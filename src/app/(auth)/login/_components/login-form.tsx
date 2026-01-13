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
      try {
        // Create FormData for server action
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);

        await signInAction(formData);
        toast.success("Login successful! Redirecting...");
        router.push("/");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        toast.error(errorMessage);
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
