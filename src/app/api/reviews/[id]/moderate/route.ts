import type { NextRequest } from "next/server";
import z from "zod";
import { getSession } from "../../../../../server/better-auth/server";
import { db } from "../../../../../server/db";

// src/app/api/reviews/[id]/moderate/route.ts
const moderateReviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

// PUT /api/reviews/[id]/moderate
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = moderateReviewSchema.parse(body);

    const review = await db.review.update({
      where: { id },
      data: { status: validated.status },
      include: {
        user: { select: { name: true, image: true } },
        book: { select: { title: true } },
      },
    });

    return Response.json(review);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    //console..error("PUT /api/reviews/[id]/moderate error:", error);
    return Response.json(
      { error: "Failed to moderate review" },
      { status: 500 },
    );
  }
}
