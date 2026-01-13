import type { NextRequest } from "next/server";
import { getSession } from "../../../../../server/better-auth/server";
import z from "zod";
import { db } from "../../../../../server/db";

// src/app/api/library/shelves/[id]/route.ts
const updateShelfSchema = z.object({
  shelf: z.enum(["WANT_TO_READ", "CURRENTLY_READING", "READ"]).optional(),
  progress: z.number().int().min(0).max(100).optional(),
});

// PUT /api/library/shelves/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = updateShelfSchema.parse(body);

    const userBook = await db.userBook.findUnique({ where: { id } });
    if (!userBook || userBook.userId !== session.user.id) {
      return Response.json(
        { error: "Not found or forbidden" },
        { status: 404 },
      );
    }

    const updated = await db.userBook.update({
      where: { id },
      data: validated,
      include: {
        book: { include: { genre: true } },
      },
    });

    return Response.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    console.error("PUT /api/library/shelves/[id] error:", error);
    return Response.json({ error: "Failed to update shelf" }, { status: 500 });
  }
}
// DELETE /api/library/shelves/[id]
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

    const userBook = await db.userBook.findUnique({ where: { id } });
    if (!userBook || userBook.userId !== session.user.id) {
      return Response.json(
        { error: "Not found or forbidden" },
        { status: 404 },
      );
    }

    await db.userBook.delete({ where: { id } });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/library/shelves/[id] error:", error);
    return Response.json(
      { error: "Failed to remove from shelf" },
      { status: 500 },
    );
  }
}