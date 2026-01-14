"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { getSession } from "../server/better-auth/server";


export async function updateUserRole(userId: string, role: "USER" | "ADMIN") {
  const session = await getSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Prevent changing own role
  if (session.user.id === userId) {
    throw new Error("You cannot change your own role");
  }

  await db.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");

  return { success: true };
}