"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "~/server/db";
import { getSession } from "../server/better-auth/server";

export async function approveReview(reviewId: string) {
  const session = await getSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.review.update({
    where: { id: reviewId },
    data: { status: "APPROVED" },
  });

  revalidatePath("/admin/reviews");

  return { success: true };
}

export async function rejectReview(reviewId: string) {
  const session = await getSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.review.update({
    where: { id: reviewId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin/reviews");

  return { success: true };
}

export async function deleteReview(reviewId: string) {
  const session = await getSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.review.delete({
    where: { id: reviewId },
  });

  revalidatePath("/admin/reviews");

  return { success: true };
}

const reviewSchema = z.object({
  bookId: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string().min(10, "Review must be at least 10 characters"),
});

export async function submitReview(input: z.infer<typeof reviewSchema>) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  try {
    // Check if already reviewed
    const existing = await db.review.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: parsed.data.bookId,
        },
      },
    });

    if (existing) {
      return { success: false, error: "You have already reviewed this book" };
    }

    await db.review.create({
      data: {
        userId: session.user.id,
        bookId: parsed.data.bookId,
        rating: parsed.data.rating,
        text: parsed.data.text,
        status: "PENDING", // Reviews require moderation
      },
    });

    revalidatePath(`/books/${parsed.data.bookId}`);
    return { success: true };
  } catch (error) {
    // //console..error("Review submit error:", error)
    return { success: false, error: "Failed to submit review" };
  }
}
