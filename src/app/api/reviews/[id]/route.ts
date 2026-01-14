// src/app/api/reviews/[id]/route.ts

import type { NextRequest } from "next/server";
import { getSession } from "../../../../server/better-auth/server";
import { db } from "../../../../server/db";

// DELETE /api/reviews/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const review = await db.review.findUnique({ where: { id } });
    if (!review) {
      return Response.json({ error: "Review not found" }, { status: 404 });
    }

    // Only admin or review owner can delete
    if (session.user.role !== "ADMIN" && review.userId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.review.delete({ where: { id } });

    return Response.json({ success: true });
  } catch (error) {
    //console..error("DELETE /api/reviews/[id] error:", error);
    return Response.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
