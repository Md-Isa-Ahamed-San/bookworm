// ==========================================
// 📁 src/app/(auth)/layout.tsx
// ==========================================
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - BookWorm",
  description: "Sign in or create an account to start your reading journey",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-background min-h-screen">{children}</div>
      
    </>
  );
}
