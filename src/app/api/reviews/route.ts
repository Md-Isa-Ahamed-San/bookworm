// ==========================================
// ⭐ REVIEWS API ROUTES
// ==========================================

import { NextResponse, type NextRequest } from "next/server";
import z from "zod";
import { getSession } from "../../../server/better-auth/server";
import { db } from "../../../server/db";

// src/app/api/reviews/route.ts
const createReviewSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  text: z.string().min(1, "Review text is required"),
});

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createReviewSchema.parse(body);

    // Check if user already reviewed this book
    const existing = await db.review.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: validated.bookId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this book" },
        { status: 400 },
      );
    }

    const review = await db.review.create({
      data: {
        ...validated,
        userId: session.user.id,
      },
      include: {
        user: { select: { name: true, image: true } },
        book: { select: { title: true } },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    //console..error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}
