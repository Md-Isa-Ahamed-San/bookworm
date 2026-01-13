/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
"use server";

import { z } from "zod";
import { auth } from "../../server/better-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

/**
 * -----------------------------
 * Cloudinary Configuration
 * -----------------------------
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * -----------------------------
 * Sign Up Schema
 * -----------------------------
 * Validates incoming form data for signing up a new user.
 * - email: must be valid email format
 * - password: minimum 6 characters
 * - name: required
 * Note: Image file presence is validated explicitly in the action.
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
 * Handles server-side registration via BetterAuth and Cloudinary.
 * 1. Extracts and validates incoming FormData.
 * 2. Enforces mandatory profile photo upload.
 * 3. Processes the profile photo and uploads it to Cloudinary.
 * 4. Calls BetterAuth API to create the user with the Cloudinary URL.
 * 5. Redirects to the traffic controller (/) on success.
 */
export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const imageFile = formData.get("image") as File | null;

  // 1. Validate text fields using Zod
  const parsed = signUpSchema.safeParse({ email, password, name });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  // 2. MANDATORY: Validate image file presence (Requirement: Photo Upload is required)
  if (!imageFile || imageFile.size === 0 || imageFile.name === "undefined") {
    throw new Error("Profile photo is required");
  }

  let imageUrl = "";

  // 3. Handle Cloudinary Upload
  try {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "bookworm/profiles",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    })) as any;

    imageUrl = uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload profile photo");
  }

  // 4. Call BetterAuth signup API
  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      image: imageUrl,
    },
  });

  // 5. Redirect to Traffic Controller to handle role-based routing
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
