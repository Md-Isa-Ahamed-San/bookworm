"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";

import { z } from "zod";
import { getSession } from "../server/better-auth/server";

const tutorialSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  youtubeUrl: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) =>
        url.includes("youtube.com") ||
        url.includes("youtu.be"),
      "Must be a YouTube URL"
    ),
  description: z.string().optional(),
});

export async function createTutorial(data: {
  title: string;
  youtubeUrl: string;
  description?: string;
}) {
  const session = await getSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Validate
  const validated = tutorialSchema.parse(data);

  // Convert YouTube URL to embed format
  const embedUrl = convertToEmbedUrl(validated.youtubeUrl);

  await db.tutorial.create({
    data: {
      title: validated.title,
      youtubeUrl: embedUrl,
      description: validated.description || null,
      createdByUserId: session.user.id,
    },
  });

  revalidatePath("/admin/tutorials");

  return { success: true };
}

export async function updateTutorial(
  tutorialId: string,
  data: {
    title: string;
    youtubeUrl: string;
    description?: string;
  }
) {
  const session = await getSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Validate
  const validated = tutorialSchema.parse(data);

  // Convert YouTube URL to embed format
  const embedUrl = convertToEmbedUrl(validated.youtubeUrl);

  await db.tutorial.update({
    where: { id: tutorialId },
    data: {
      title: validated.title,
      youtubeUrl: embedUrl,
      description: validated.description || null,
    },
  });

  revalidatePath("/admin/tutorials");

  return { success: true };
}

export async function deleteTutorial(tutorialId: string) {
  const session = await getSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.tutorial.delete({
    where: { id: tutorialId },
  });

  revalidatePath("/admin/tutorials");

  return { success: true };
}

// Helper function to convert YouTube URLs to embed format
function convertToEmbedUrl(url: string): string {
  // Already an embed URL
  if (url.includes("/embed/")) {
    return url;
  }

  // Extract video ID from various YouTube URL formats
  let videoId = "";

  // youtu.be/VIDEO_ID
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  }
  // youtube.com/watch?v=VIDEO_ID
  else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
  }
  // youtube.com/v/VIDEO_ID
  else if (url.includes("/v/")) {
    videoId = url.split("/v/")[1]?.split("?")[0] || "";
  }

  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  return `https://www.youtube.com/embed/${videoId}`;
}