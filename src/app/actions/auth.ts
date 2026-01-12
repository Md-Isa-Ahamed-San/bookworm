"use server";

import { z } from "zod";
import { auth } from "../../server/better-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

/**
 * -----------------------------
 * Sign Up Schema
 * -----------------------------
 * Validates incoming form data for signing up a new user.
 * - email: must be valid email format
 * - password: minimum 6 characters
 * - name: required
 */
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

/**
 * -----------------------------
 * Sign Up Action
 * -----------------------------
 * Handles server-side signup via BetterAuth.
 * 1. Validates the incoming FormData.
 * 2. Calls BetterAuth API to register the user.
 * 3. Redirects to home page on success.
 */
export async function signUpAction(formData: FormData) {
  // Extract form data
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
  };

  // Validate data using Zod
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) {
    // Throw error if validation fails
    throw new Error(parsed.error.message);
  }

  const { email, password, name } = parsed.data;

  // Call BetterAuth signup API
  await auth.api.signUpEmail({
    body: { email, password, name },
  });

  // Redirect after successful signup
  redirect("/");
}

/**
 * -----------------------------
 * Sign In Schema
 * -----------------------------
 * Validates incoming form data for signing in a user.
 * - email: must be valid email
 * - password: minimum 6 characters
 */
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * -----------------------------
 * Sign In Action
 * -----------------------------
 * Handles server-side login via BetterAuth.
 * 1. Validates incoming FormData.
 * 2. Calls BetterAuth API to sign in.
 * 3. Redirects to dashboard on success.
 */
export async function signInAction(formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signInSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const { email, password } = parsed.data;

  await auth.api.signInEmail({
    body: { email, password },
  });

  redirect("/dashboard");
}

/**
 * -----------------------------
 * Sign Out Action
 * -----------------------------
 * Handles server-side sign-out via BetterAuth.
 * Clears the session and redirects user to home page.
 */
export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/");
}
