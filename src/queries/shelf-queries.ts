"use server";

import { db } from "~/server/db";
import type { ShelfType } from "../../generated/prisma";
import { getSession } from "../server/better-auth/server";

export async function getUserBooks(shelf?: ShelfType) {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const where: any = {
      userId: session.user.id,
    };

    if (shelf) {
      where.shelf = shelf;
    }

    const userBooks = await db.userBook.findMany({
      where,
      include: {
        book: {
          include: {
            genre: true,
            reviews: {
              where: { status: "APPROVED" },
              select: { rating: true },
            },
            _count: {
              select: { reviews: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Calculate average rating for each book
    const booksWithRating = userBooks.map((userBook) => {
      const avgRating =
        userBook.book.reviews.length > 0
          ? userBook.book.reviews.reduce((sum, r) => sum + r.rating, 0) /
            userBook.book.reviews.length
          : 0;

      return {
        ...userBook,
        book: {
          ...userBook.book,
          avgRating,
        },
      };
    });

    return booksWithRating;
  } catch (error) {
    //console..error("Error fetching user books:", error)
    throw new Error("Failed to fetch library");
  }
}

export async function getUserBookByBookId(bookId: string) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return null;
    }

    const userBook = await db.userBook.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId,
        },
      },
      include: {
        book: true,
      },
    });

    return userBook;
  } catch (error) {
    //console..error("Error fetching user book:", error)
    return null;
  }
}
