"use server";

import { revalidatePath } from "next/cache";
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