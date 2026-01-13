// ==========================================
// 📁 src/app/(auth)/register/page.tsx
// ==========================================
import { redirect } from "next/navigation";

import type { Metadata } from "next";
import { getSession } from "../../../server/better-auth/server";
import { RegisterForm } from "./_components/register-form";

export const metadata: Metadata = {
  title: "Register - BookWorm",
  description: "Create your BookWorm account",
};

export default async function RegisterPage() {
  const session = await getSession();

  // Redirect if already logged in
  if (session) {
    redirect(
      session.user.role === "ADMIN" ? "/admin/dashboard" : "/user/library",
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Branding Header */}
        <div className="mb-8 text-center">
          <h1 className="font-poppins text-foreground mb-2 text-4xl font-bold">
            📚 BookWorm
          </h1>
          <p className="text-muted-foreground">
            Create your account and start your reading adventure!
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm />
      </div>
    </div>
  );
}
