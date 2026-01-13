"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { BookOpen, Loader2, Mail, Lock, User } from "lucide-react";
import { ImageUpload } from "./image-upload";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { RegisterFormData } from "../../../../lib/zod_schema";


interface RegisterCardProps {
  handleSubmit: () => void;
  isPending: boolean;
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  setValue: UseFormSetValue<RegisterFormData>;
}

export function RegisterCard({
  handleSubmit,
  isPending,
  register,
  errors,
  imageUrl,
  setImageUrl,
  setValue,
}: RegisterCardProps) {
  return (
    <Card className="border-border bg-card shadow-lg">
      <CardHeader className="space-y-1">
        {/* Icon */}
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Title */}
        <CardTitle className="text-center font-poppins text-2xl font-bold text-card-foreground">
          Create Account
        </CardTitle>

        {/* Description */}
        <CardDescription className="text-center text-muted-foreground">
          Join BookWorm and discover your next favorite book
        </CardDescription>
      </CardHeader>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="font-poppins font-bold text-card-foreground"
            >
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                disabled={isPending}
                autoComplete="name"
                className="border-border bg-input pl-10 text-base text-foreground focus-visible:ring-ring"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="font-poppins font-bold text-card-foreground"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                disabled={isPending}
                autoComplete="email"
                className="border-border bg-input pl-10 text-base text-foreground focus-visible:ring-ring"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="font-poppins font-bold text-card-foreground"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isPending}
                autoComplete="new-password"
                className="border-border bg-input pl-10 text-base text-foreground focus-visible:ring-ring"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password")}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              At least 6 characters
            </p>
            {errors.password && (
              <p
                id="password-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="font-poppins font-bold text-card-foreground">
              Profile Photo <span className="text-destructive">*</span>
            </Label>
            <ImageUpload
              onUploadComplete={(file) => {
                setValue("image", file);
                // Create preview URL
                const url = URL.createObjectURL(file);
                setImageUrl(url);
              }}
              disabled={isPending}
            />
            {errors.image && (
              <p id="image-error" className="text-sm text-destructive" role="alert">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            disabled={isPending}
            aria-live="polite"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </CardContent>
      </form>

      {/* Footer */}
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary underline-offset-4 hover:text-primary/80 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}