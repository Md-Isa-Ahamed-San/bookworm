// src/app/api/genres/[id]/route.ts

import type { NextRequest } from "next/server";
import { getSession } from "../../../../server/better-auth/server";
import z from "zod";
import { db } from "../../../../server/db";

const createGenreSchema = z.object({
  name: z.string().min(1, "Genre name is required"),
});
// GET /api/genres/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const genre = await db.genre.findUnique({
      where: { id },
      include: {
        _count: { select: { books: true } },
      },
    });

    if (!genre) {
      return Response.json({ error: "Genre not found" }, { status: 404 });
    }

    return Response.json(genre);
  } catch (error) {
    console.error("GET /api/genres/[id] error:", error);
    return Response.json({ error: "Failed to fetch genre" }, { status: 500 });
  }
}

// PUT /api/genres/[id]
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
    const validated = createGenreSchema.parse(body);

    const genre = await db.genre.update({
      where: { id },
      data: validated,
    });

    return Response.json(genre);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    console.error("PUT /api/genres/[id] error:", error);
    return Response.json({ error: "Failed to update genre" }, { status: 500 });
  }
}

// DELETE /api/genres/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Check if genre has books
    const booksCount = await db.book.count({ where: { genreId: id } });
    if (booksCount > 0) {
      return Response.json(
        { error: "Cannot delete genre with associated books" },
        { status: 400 },
      );
    }

    await db.genre.delete({ where: { id } });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/genres/[id] error:", error);
    return Response.json({ error: "Failed to delete genre" }, { status: 500 });
  }
}
