"use server";

import { z } from "zod";
import { db } from "~/server/db";

import { revalidatePath } from "next/cache";
import { ShelfType } from "../../generated/prisma";
import { getSession } from "../server/better-auth/server";

const shelfSchema = z.object({
  bookId: z.string(),
  shelf: z.nativeEnum(ShelfType),
});

export async function updateBookShelf(input: z.infer<typeof shelfSchema>) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const { bookId, shelf } = shelfSchema.parse(input);

  try {
    // Upsert: Create if doesn't exist, Update if it does
    await db.userBook.upsert({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId,
        },
      },
      update: { shelf },
      create: {
        userId: session.user.id,
        bookId,
        shelf,
      },
    });

    revalidatePath(`/books/${bookId}`);
    revalidatePath("/library");
    return { success: true };
  } catch (error) {
    // //console..error("Shelf update error:", error)
    return { success: false, error: "Failed to update shelf" };
  }
}

export async function addBookToShelf(bookId: string, shelf: ShelfType) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userBook = await db.userBook.upsert({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId,
        },
      },
      create: {
        userId: session.user.id,
        bookId,
        shelf,
        progress: 0,
      },
      update: {
        shelf,
      },
    });

    revalidatePath("/user/library");
    revalidatePath(`/user/books/${bookId}`);
    return { success: true, data: userBook };
  } catch (error) {
    // //console..error("Error adding book to shelf:", error)
    return { success: false, error: "Failed to add book to shelf" };
  }
}

export async function moveToShelf(userBookId: string, shelf: ShelfType) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const existing = await db.userBook.findUnique({
      where: { id: userBookId },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userBook = await db.userBook.update({
      where: { id: userBookId },
      data: {
        shelf,
        // Reset progress when moving to WANT_TO_READ or READ
        progress: shelf === "CURRENTLY_READING" ? existing.progress : 0,
      },
    });

    revalidatePath("/user/library");
    return { success: true, data: userBook };
  } catch (error) {
    //console..error("Error moving book to shelf:", error)
    return { success: false, error: "Failed to move book" };
  }
}

export async function updateProgress(userBookId: string, progress: number) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate progress (pages read must be non-negative)
    if (progress < 0) {
      return { success: false, error: "Pages read cannot be negative" };
    }

    // Verify ownership and get book details
    const existing = await db.userBook.findUnique({
      where: { id: userBookId },
      include: {
        book: {
          select: {
            totalPages: true,
          },
        },
      },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate against totalPages if available
    if (existing.book.totalPages && progress > existing.book.totalPages) {
      return {
        success: false,
        error: `Pages read cannot exceed ${existing.book.totalPages}`,
      };
    }

    // Update progress (storing pages read)
    const userBook = await db.userBook.update({
      where: { id: userBookId },
      data: { progress },
    });

    const isFinished = existing.book.totalPages
      ? progress >= existing.book.totalPages
      : progress >= 100;

    if (isFinished && existing.shelf === "CURRENTLY_READING") {
      await db.userBook.update({
        where: { id: userBookId },
        data: {
          shelf: "READ",
          progress: existing.book.totalPages || 100, // Set to max
        },
      });
    }

    revalidatePath("/user/library");
    return { success: true, data: userBook };
  } catch (error) {
    //console..error("Error updating progress:", error)
    return { success: false, error: "Failed to update progress" };
  }
}
export async function removeFromShelf(userBookId: string) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const existing = await db.userBook.findUnique({
      where: { id: userBookId },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    await db.userBook.delete({
      where: { id: userBookId },
    });

    revalidatePath("/user/library");
    return { success: true };
  } catch (error) {
    //console..error("Error removing book from shelf:", error)
    return { success: false, error: "Failed to remove book" };
  }
}
