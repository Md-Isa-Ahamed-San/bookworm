/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
"use server";

import { z } from "zod";
import { auth } from "../../server/better-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { uploadImage } from "../../server/lib/cloudinary";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

/**
 * -----------------------------
 * Sign Up Action
 * -----------------------------
 * Handles server-side registration via BetterAuth.
 * 1. Validates text fields.
 * 2. Enforces mandatory photo upload via Cloudinary utility.
 * 3. Creates user in database via BetterAuth.
 */
export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const imageFile = formData.get("image") as File | null;

  // 1. Validate text fields
  const parsed = signUpSchema.safeParse({ email, password, name });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  // 2. Validate image presence
  if (!imageFile || imageFile.size === 0) {
    throw new Error("Profile photo is required");
  }

  // 3. Upload using extracted utility
  const imageUrl = await uploadImage(imageFile, "bookworm/profiles");

  // 4. Call BetterAuth signup API
  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      image: imageUrl,
    },
  });

  // 5. Redirect to Traffic Controller
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
 * 3. Redirects to the traffic controller (/) on success.
 */
export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate data using Zod
  const parsed = signInSchema.safeParse({ email, password });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  // Call BetterAuth signin API
  await auth.api.signInEmail({
    body: { email, password },
  });

  // Redirect to Traffic Controller to handle role-based routing
  redirect("/");
}

/**
 * -----------------------------
 * Sign Out Action
 * -----------------------------
 * Handles server-side sign-out via BetterAuth.
 * 1. Clears the active session using request headers.
 * 2. Redirects user to the login page.
 */
export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/login");
}
