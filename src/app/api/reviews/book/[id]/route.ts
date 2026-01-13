// src/app/api/reviews/book/[bookId]/route.ts

import type { NextRequest } from "next/server";
import { getSession } from "../../../../../server/better-auth/server";
import { db } from "../../../../../server/db";

// GET /api/reviews/book/[bookId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await params;

    const reviews = await db.review.findMany({
      where: {
        bookId,
        status: "APPROVED",
      },
      include: {
        user: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(reviews);
  } catch (error) {
    console.error("GET /api/reviews/book/[bookId] error:", error);
    return Response.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}