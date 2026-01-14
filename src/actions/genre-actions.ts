"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { getSession } from "../server/better-auth/server";

export async function createGenre(name: string) {
  try {
    const session = await getSession();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Check if genre already exists
    const existing = await db.genre.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existing) {
      return { success: false, error: "Genre already exists" };
    }

    const genre = await db.genre.create({
      data: { name: name.trim() },
    });

    revalidatePath("/admin/genres");
    return { success: true, data: genre };
  } catch (error) {
    // //console..error("Error creating genre:", error)
    return { success: false, error: "Failed to create genre" };
  }
}

export async function updateGenre(id: string, name: string) {
  try {
    const session = await getSession();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Check if another genre has this name
    const existing = await db.genre.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        NOT: { id },
      },
    });

    if (existing) {
      return { success: false, error: "Genre name already exists" };
    }

    const genre = await db.genre.update({
      where: { id },
      data: { name: name.trim() },
    });

    revalidatePath("/admin/genres");
    return { success: true, data: genre };
  } catch (error) {
    // //console..error("Error updating genre:", error)
    return { success: false, error: "Failed to update genre" };
  }
}

export async function deleteGenre(id: string) {
  try {
    const session = await getSession();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Check if genre has books
    const genre = await db.genre.findUnique({
      where: { id },
      include: { _count: { select: { books: true } } },
    });

    if (!genre) {
      return { success: false, error: "Genre not found" };
    }

    if (genre._count.books > 0) {
      return {
        success: false,
        error: `Cannot delete genre with ${genre._count.books} book(s). Remove books first.`,
      };
    }

    await db.genre.delete({ where: { id } });

    revalidatePath("/admin/genres");
    return { success: true };
  } catch (error) {
    // //console..error("Error deleting genre:", error)
    return { success: false, error: "Failed to delete genre" };
  }
}
