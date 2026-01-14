"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "../server/better-auth";
import { uploadImage } from "../server/lib/cloudinary";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signUpAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File | null;

    // 1. Validate text fields
    const parsed = signUpSchema.safeParse({ email, password, name });
    if (!parsed.success) {
      // Return the first error message found by Zod
      return { success: false, error: parsed.error.errors[0]?.message };
    }

    // 2. Validate image presence
    if (!imageFile || imageFile.size === 0) {
      return { success: false, error: "Profile photo is required" };
    }

    // 3. Upload image
    const imageUrl = await uploadImage(imageFile, "bookworm/profiles");

    // 4. Call BetterAuth signup API
    await auth.api.signUpEmail({
      body: { email, password, name, image: imageUrl },
    });

    return { success: true };
  } catch (error: any) {
    // Catch Better Auth or Cloudinary errors
    return {
      success: false,
      error: error.message || "An error occurred during sign up",
    };
  }
}

export async function signInAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // 1. Validate data using Zod
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message };
    }

    // 2. Call BetterAuth signin API
    // IMPORTANT: Pass headers() so the session cookie is set!
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    return { success: true };
  } catch (error: any) {
    // Better Auth errors on the server have a 'body' property
    // We extract the "Invalid email or password" message here
    const errorMessage =
      error.body?.message || error.message || "Invalid credentials";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    // Sign out rarely fails, but we catch it just in case
  }
  redirect("/login");
}
