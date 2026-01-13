// ==========================================
// 📁 src/app/(auth)/login/page.tsx
// ==========================================
import { redirect } from "next/navigation";

import type { Metadata } from "next";
import { getSession } from "../../../server/better-auth/server";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Login - BookWorm",
  description: "Sign in to your BookWorm account",
};

export default async function LoginPage() {
  const session = await getSession();

  // Redirect if already logged in
  if (session) {
    redirect(session.user.role === "ADMIN" ? "/admin/dashboard" : "/user/library");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-poppins text-4xl font-bold text-foreground">
            📚 BookWorm
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Sign in to continue your reading journey.
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}
