// src/app/api/reviews/pending/route.ts

import type { NextRequest } from "next/server";
import { getSession } from "../../../../server/better-auth/server";
import { db } from "../../../../server/db";

// GET /api/reviews/pending
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const reviews = await db.review.findMany({
      where: { status: "PENDING" },
      include: {
        user: { select: { name: true, image: true } },
        book: { select: { title: true, coverUrl: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return Response.json(reviews);
  } catch (error) {
    console.error("GET /api/reviews/pending error:", error);
    return Response.json(
      { error: "Failed to fetch pending reviews" },
      { status: 500 },
    );
  }
}