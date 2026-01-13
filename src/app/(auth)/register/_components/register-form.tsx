"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signUpAction } from "../../../../actions/auth";
import {
  registerSchema,
  type RegisterFormData,
} from "../../../../lib/zod_schema";
import { RegisterCard } from "./register-card";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    startTransition(async () => {
      try {
        // Create FormData for server action
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("image", data.image);

        await signUpAction(formData);
        toast.success("Account created successfully! Redirecting...");
        router.push("/");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <RegisterCard
      handleSubmit={handleSubmit(onSubmit)}
      isPending={isPending}
      register={register}
      errors={errors}
      imageUrl={imageUrl}
      setImageUrl={setImageUrl}
      setValue={setValue}
    />
  );
}
