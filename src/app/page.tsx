import { redirect } from "next/navigation";
import { getSession } from "../server/better-auth/server";

export default async function HomePage() {
  const session = await getSession();

  // 1. If not logged in -> Redirect to Login
  if (!session) {
    redirect("/login");
  }

  // 2. Role-Based Redirection
  // Admin -> Dashboard
  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  // Regular User -> My Library
  redirect("/user/library");

  // This component never actually renders anything
  return null;
}
