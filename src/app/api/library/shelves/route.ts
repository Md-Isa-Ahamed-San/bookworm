
// ==========================================
// 📖 LIBRARY/SHELVES API ROUTES
// ==========================================

import type { NextRequest } from "next/server";
import z from "zod";
import { getSession } from "../../../../server/better-auth/server";
import { db } from "../../../../server/db";

// src/app/api/library/shelves/route.ts
const addToShelfSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  shelf: z.enum(["WANT_TO_READ", "CURRENTLY_READING", "READ"]),
  progress: z.number().int().min(0).max(100).optional().default(0),
});

// GET /api/library/shelves
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const shelf = searchParams.get("shelf") as
      | "WANT_TO_READ"
      | "CURRENTLY_READING"
      | "READ"
      | null;

    const where: any = { userId: session.user.id };
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
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const booksWithRatings = userBooks.map((ub) => {
      const avgRating =
        ub.book.reviews.length > 0
          ? ub.book.reviews.reduce((sum, r) => sum + r.rating, 0) /
            ub.book.reviews.length
          : 0;
      return {
        ...ub,
        book: { ...ub.book, avgRating },
      };
    });

    return Response.json(booksWithRatings);
  } catch (error) {
    console.error("GET /api/library/shelves error:", error);
    return Response.json(
      { error: "Failed to fetch shelves" },
      { status: 500 },
    );
  }
}

// POST /api/library/shelves
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = addToShelfSchema.parse(body);

    // Check if already exists
    const existing = await db.userBook.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: validated.bookId,
        },
      },
    });

    if (existing) {
      // Update existing
      const updated = await db.userBook.update({
        where: { id: existing.id },
        data: {
          shelf: validated.shelf,
          progress: validated.progress,
        },
        include: {
          book: { include: { genre: true } },
        },
      });
      return Response.json(updated);
    }

    const userBook = await db.userBook.create({
      data: {
        userId: session.user.id,
        bookId: validated.bookId,
        shelf: validated.shelf,
        progress: validated.progress,
      },
      include: {
        book: { include: { genre: true } },
      },
    });

    return Response.json(userBook, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    console.error("POST /api/library/shelves error:", error);
    return Response.json(
      { error: "Failed to add book to shelf" },
      { status: 500 },
    );
  }
}



