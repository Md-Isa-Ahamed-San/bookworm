// src/app/api/reviews/user/route.ts

import type { NextRequest } from "next/server";
import { getSession } from "../../../../server/better-auth/server";
import { db } from "../../../../server/db";

// GET /api/reviews/user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviews = await db.review.findMany({
      where: { userId: session.user.id },
      include: {
        book: { select: { title: true, coverUrl: true, author: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(reviews);
  } catch (error) {
    console.error("GET /api/reviews/user error:", error);
    return Response.json(
      { error: "Failed to fetch user reviews" },
      { status: 500 },
    );
  }
}
